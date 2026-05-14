import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// GET /api/analytics?type=global|wedge|ad&id=xxx
export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = req.nextUrl
    const type = searchParams.get('type') || 'global'
    const id = searchParams.get('id')

    if (type === 'global' && auth.role === 'ADMIN') {
      // Global KPIs
      const [
        totalWedges,
        totalContacts,
        totalAds,
        totalNewsletters,
        activeSubscriptions,
        monthlyRevenue,
      ] = await Promise.all([
        db.wedge.count({ where: { status: 'ACTIVE' } }),
        db.contact.count({ where: { status: 'ACTIVE' } }),
        db.ad.count(),
        db.newsletter.count({ where: { status: 'SENT' } }),
        db.subscription.count({ where: { status: 'ACTIVE' } }),
        db.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      ])

      const adsByStatus = await db.ad.groupBy({
        by: ['status'],
        _count: true,
      })

      const recentPayments = await db.payment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, company: true } },
        },
      })

      return NextResponse.json({
        totalWedges,
        totalContacts,
        totalAds,
        totalNewsletters,
        activeSubscriptions,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        adsByStatus,
        recentPayments,
      })
    }

    if (type === 'wedge' && id) {
      const wedge = await db.wedge.findUnique({
        where: { id },
        include: {
          _count: { select: { contacts: true, ads: true, newsletters: true } },
          newsletters: {
            where: { status: 'SENT' },
            orderBy: { sentAt: 'desc' },
            take: 10,
          },
        },
      })

      if (!wedge) {
        return NextResponse.json({ error: 'Wedge non trouvé' }, { status: 404 })
      }

      return NextResponse.json(wedge)
    }

    if (type === 'ad' && id) {
      const ad = await db.ad.findUnique({
        where: { id },
        include: {
          analytics: true,
          wedge: { select: { name: true, sector: true, region: true } },
        },
      })

      if (!ad) {
        return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 })
      }

      // If client, check ownership
      if (auth.role === 'CLIENT' && ad.clientId !== auth.userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }

      const events = await db.analyticsEvent.groupBy({
        by: ['type'],
        where: { adId: id },
        _count: true,
      })

      return NextResponse.json({ ad, events })
    }

    if (type === 'client' && (id || auth.role === 'CLIENT')) {
      const clientId = id || auth.userId

      const user = await db.user.findUnique({
        where: { id: clientId },
        include: {
          ads: {
            orderBy: { createdAt: 'desc' },
            include: {
              wedge: { select: { name: true } },
            },
          },
          payments: { orderBy: { createdAt: 'desc' } },
          subscriptions: { orderBy: { createdAt: 'desc' } },
        },
      })

      if (!user) {
        return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
      }

      return NextResponse.json(user)
    }

    return NextResponse.json({ error: 'Type d\'analytics invalide' }, { status: 400 })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
