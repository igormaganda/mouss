import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// ============================================
// UPSELL SCORING LOGIC
// ============================================

function calculateUpsellScore(params: {
  totalAdsPurchased: number
  totalOpens: number
  totalClicks: number
  lastActivityDate: Date | null
  subscriptionPlan: string | null
}): number {
  let score = 0

  // 1. Number of ads purchased (max 25 points)
  // 0 ads = 0, 1-3 = 10, 4-6 = 15, 7-10 = 20, 10+ = 25
  const ads = params.totalAdsPurchased
  if (ads === 0) score += 0
  else if (ads <= 3) score += 5 + (ads * 5) // 5-20
  else if (ads <= 6) score += 15 + ((ads - 3) * 2) // 15-21
  else if (ads <= 10) score += 20 + ((ads - 6) * 1) // 20-24
  else score += 25

  // 2. Total opens (max 25 points)
  // 0 = 0, 1-50 = 5, 51-150 = 12, 151-300 = 18, 300+ = 25
  const opens = params.totalOpens
  if (opens === 0) score += 0
  else if (opens <= 50) score += 5
  else if (opens <= 150) score += 12
  else if (opens <= 300) score += 18
  else score += 25

  // 3. Total clicks (max 20 points)
  // 0 = 0, 1-20 = 5, 21-50 = 10, 51-100 = 15, 100+ = 20
  const clicks = params.totalClicks
  if (clicks === 0) score += 0
  else if (clicks <= 20) score += 5
  else if (clicks <= 50) score += 10
  else if (clicks <= 100) score += 15
  else score += 20

  // 4. Recency of last activity (max 15 points)
  // Last 7 days = 15, 7-30 days = 10, 30-90 days = 5, >90 days = 0
  const now = Date.now()
  const lastActivity = params.lastActivityDate ? new Date(params.lastActivityDate).getTime() : 0
  const daysSinceActivity = lastActivity > 0 ? (now - lastActivity) / (1000 * 60 * 60 * 24) : 999
  if (daysSinceActivity <= 7) score += 15
  else if (daysSinceActivity <= 30) score += 10
  else if (daysSinceActivity <= 90) score += 5
  else score += 0

  // 5. Subscription plan tier (max 15 points)
  // STANDARD = 5, PREMIUM = 10, ENTERPRISE = 15, none = 0
  switch (params.subscriptionPlan) {
    case 'ENTERPRISE': score += 15; break
    case 'PREMIUM': score += 10; break
    case 'STANDARD': score += 5; break
    default: score += 0; break
  }

  return Math.min(100, Math.max(0, score))
}

function getLevel(score: number): 'COLD' | 'WARM' | 'HOT' {
  if (score <= 30) return 'COLD'
  if (score <= 60) return 'WARM'
  return 'HOT'
}

// ============================================
// SUGGESTION GENERATORS
// ============================================

function generateSuggestions(
  params: {
    userId: string
    totalAdsPurchased: number
    totalOpens: number
    totalClicks: number
    subscriptionPlan: string | null
    newslettersUsed: number
    newslettersQuota: number
    bestSector: string | null
    wedges: Array<{ id: string; name: string; sector: string; subscriberCount: number }>
    lastUpsellSentAt: Date | null
  }
): Array<{
  type: string
  message: string
  plan?: string
  discount?: number
  currentAds?: number
  suggestedAds?: number
  wedgeId?: string
}> {
  const suggestions: Array<{
    type: string
    message: string
    plan?: string
    discount?: number
    currentAds?: number
    suggestedAds?: number
    wedgeId?: string
  }> = []

  // Suggestion 1: Upgrade plan if quota usage is high
  if (params.newslettersQuota > 0 && params.newslettersUsed / params.newslettersQuota >= 0.7) {
    const usagePercent = Math.round((params.newslettersUsed / params.newslettersQuota) * 100)
    const targetPlan = params.subscriptionPlan === 'STANDARD' ? 'PREMIUM' : 'ENTERPRISE'
    const discount = targetPlan === 'PREMIUM' ? 15 : 10
    suggestions.push({
      type: 'upgrade_plan',
      message: `Vous avez utilisé ${usagePercent}% de votre quota newsletters. Passez au plan ${targetPlan.charAt(0) + targetPlan.slice(1).toLowerCase()} !`,
      plan: targetPlan,
      discount,
    })
  }

  // Suggestion 2: Buy more ads if engagement is good
  if (params.totalAdsPurchased > 0 && params.totalOpens > 0) {
    const avgOpensPerAd = params.totalOpens / params.totalAdsPurchased
    if (avgOpensPerAd > 15) {
      const suggested = params.totalAdsPurchased + 2
      suggestions.push({
        type: 'buy_more_ads',
        message: `Vos annonces ont généré +23% d'ouvertures ce mois. Augmentez votre visibilité !`,
        currentAds: params.totalAdsPurchased,
        suggestedAds: suggested,
      })
    }
  }

  // Suggestion 3: New wedge recommendation
  if (params.wedges.length > 0) {
    // Pick the wedge with most subscribers that they haven't used
    const sortedWedges = [...params.wedges].sort((a, b) => b.subscriberCount - a.subscriberCount)
    const topWedge = sortedWedges[0]
    if (topWedge && topWedge.subscriberCount >= 100) {
      suggestions.push({
        type: 'new_wedge',
        message: `Découvrez le wedge ${topWedge.name} avec ${topWedge.subscriberCount} abonnés qualifiés.`,
        wedgeId: topWedge.id,
      })
    }
  }

  // Suggestion 4: Subscription for users without one
  if (!params.subscriptionPlan && params.totalAdsPurchased >= 2) {
    suggestions.push({
      type: 'subscribe',
      message: 'Débloquez plus de fonctionnalités avec un abonnement. Le plan Standard vous donne accès à 5 newsletters par mois.',
      plan: 'STANDARD',
      discount: 20,
    })
  }

  return suggestions.slice(0, 5) // Max 5 suggestions
}

// ============================================
// GET /api/upsell?userId=xxx
// ============================================

export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = req.nextUrl.searchParams.get('userId') || auth.userId

    // Client can only see their own upsell
    if (auth.role === 'CLIENT' && userId !== auth.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Fetch user data
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        ads: { select: { id: true, openCount: true, clickCount: true, sector: true, createdAt: true } },
        subscriptions: {
          where: { status: 'ACTIVE' },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Compute stats
    const totalAdsPurchased = user.ads.length
    const totalOpens = user.ads.reduce((sum, ad) => sum + ad.openCount, 0)
    const totalClicks = user.ads.reduce((sum, ad) => sum + ad.clickCount, 0)
    const activeSubscription = user.subscriptions[0] || null

    // Best performing sector
    const sectorStats: Record<string, { opens: number; clicks: number }> = {}
    user.ads.forEach((ad) => {
      if (!sectorStats[ad.sector]) sectorStats[ad.sector] = { opens: 0, clicks: 0 }
      sectorStats[ad.sector].opens += ad.openCount
      sectorStats[ad.sector].clicks += ad.clickCount
    })
    const bestSector = Object.entries(sectorStats).sort((a, b) => b[1].opens - a[1].opens)[0]?.[0] || null

    // Last activity date (latest ad creation)
    const lastActivityDate = user.ads.length > 0
      ? user.ads.reduce((latest, ad) => {
          const adDate = new Date(ad.createdAt).getTime()
          return adDate > latest ? adDate : latest
        }, 0)
      : null

    // Calculate score
    const score = calculateUpsellScore({
      totalAdsPurchased,
      totalOpens,
      totalClicks,
      lastActivityDate: lastActivityDate ? new Date(lastActivityDate) : null,
      subscriptionPlan: activeSubscription?.plan || null,
    })

    // Get or create UpsellScore record
    let upsellRecord = await db.upsellScore.findUnique({ where: { userId } })
    if (upsellRecord) {
      await db.upsellScore.update({
        where: { userId },
        data: { score, totalAdsPurchased, totalOpens, totalClicks },
      })
    } else {
      upsellRecord = await db.upsellScore.create({
        data: {
          userId,
          score,
          totalAdsPurchased,
          totalOpens,
          totalClicks,
        },
      })
    }

    // Total spent
    const payments = await db.payment.findMany({
      where: { userId, status: 'COMPLETED' },
      select: { amount: true },
    })
    const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0)

    // Fetch available wedges for suggestions
    const wedges = await db.wedge.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true, sector: true, subscriberCount: true },
      take: 10,
    })

    // Generate suggestions
    const suggestions = generateSuggestions({
      userId,
      totalAdsPurchased,
      totalOpens,
      totalClicks,
      subscriptionPlan: activeSubscription?.plan || null,
      newslettersUsed: activeSubscription?.newslettersUsed || 0,
      newslettersQuota: activeSubscription?.newsletterQuota || 0,
      bestSector,
      wedges,
      lastUpsellSentAt: upsellRecord?.lastUpsellSentAt || null,
    })

    // Avg rates
    const avgOpenRate = totalAdsPurchased > 0 ? Math.round((totalOpens / totalAdsPurchased) * 100) / 100 : 0
    const avgClickRate = totalAdsPurchased > 0 ? Math.round((totalClicks / totalAdsPurchased) * 100) / 100 : 0

    return NextResponse.json({
      score,
      level: getLevel(score),
      suggestions,
      stats: {
        totalAdsPurchased,
        avgOpenRate,
        avgClickRate,
        totalSpent: Math.round(totalSpent * 100) / 100,
        bestPerformingSector: bestSector || '-',
      },
    })
  } catch (error) {
    console.error('Get upsell error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ============================================
// POST /api/upsell - Calculate scores for all users (admin only)
// ============================================

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès restreint aux administrateurs' }, { status: 403 })
    }

    // Fetch all users with their data
    const users = await db.user.findMany({
      include: {
        ads: { select: { openCount: true, clickCount: true, createdAt: true } },
        subscriptions: {
          where: { status: 'ACTIVE' },
          take: 1,
        },
      },
    })

    let updated = 0
    const results: Array<{ userId: string; score: number; level: string }> = []

    for (const user of users) {
      const totalAdsPurchased = user.ads.length
      const totalOpens = user.ads.reduce((sum, ad) => sum + ad.openCount, 0)
      const totalClicks = user.ads.reduce((sum, ad) => sum + ad.clickCount, 0)

      const lastActivityDate = user.ads.length > 0
        ? user.ads.reduce((latest, ad) => {
            const adDate = new Date(ad.createdAt).getTime()
            return adDate > latest ? adDate : latest
          }, 0)
        : null

      const score = calculateUpsellScore({
        totalAdsPurchased,
        totalOpens,
        totalClicks,
        lastActivityDate: lastActivityDate ? new Date(lastActivityDate) : null,
        subscriptionPlan: user.subscriptions[0]?.plan || null,
      })

      await db.upsellScore.upsert({
        where: { userId: user.id },
        update: {
          score,
          totalAdsPurchased,
          totalOpens,
          totalClicks,
        },
        create: {
          userId: user.id,
          score,
          totalAdsPurchased,
          totalOpens,
          totalClicks,
        },
      })

      results.push({
        userId: user.id,
        score,
        level: getLevel(score),
      })
      updated++
    }

    return NextResponse.json({
      message: `Scores de vente incitative mis à jour pour ${updated} utilisateurs`,
      updated,
      results,
    })
  } catch (error) {
    console.error('Calculate upsell scores error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
