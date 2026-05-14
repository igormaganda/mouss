import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// GET /api/subscriptions?userId=xxx
export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = req.nextUrl.searchParams.get('userId') || auth.userId

    if (auth.role === 'CLIENT' && userId !== auth.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const subscriptions = await db.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Get subscriptions error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/subscriptions - Create/update subscription
export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { plan } = await req.json()
    if (!plan || !['STANDARD', 'PREMIUM', 'ENTERPRISE'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    const planConfig = {
      STANDARD: { newsletterQuota: 5, wedgeQuota: 1 },
      PREMIUM: { newsletterQuota: 15, wedgeQuota: 3 },
      ENTERPRISE: { newsletterQuota: 999, wedgeQuota: 99 },
    }

    const config = planConfig[plan as keyof typeof planConfig]

    // Cancel existing active subscriptions
    await db.subscription.updateMany({
      where: { userId: auth.userId, status: 'ACTIVE' },
      data: { status: 'CANCELLED' },
    })

    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const subscription = await db.subscription.create({
      data: {
        userId: auth.userId,
        plan,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        newsletterQuota: config.newsletterQuota,
        wedgeQuota: config.wedgeQuota,
      },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Create subscription error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/subscriptions - Cancel subscription
export async function PUT(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id, status } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const sub = await db.subscription.findUnique({ where: { id } })
    if (!sub || (auth.role === 'CLIENT' && sub.userId !== auth.userId)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const updated = await db.subscription.update({
      where: { id },
      data: { status: status || 'CANCELLED' },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update subscription error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
