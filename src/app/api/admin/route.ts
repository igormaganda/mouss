import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// GET /api/admin - Full admin dashboard data
export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const [
      userCount,
      activeUserCount,
      totalAds,
      paidAds,
      totalRevenue,
      totalContacts,
      activeContacts,
      wedges,
      newsletters,
      payments,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true, role: 'CLIENT' } }),
      db.ad.count(),
      db.ad.count({ where: { status: 'PAID' } }),
      db.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      db.contact.count(),
      db.contact.count({ where: { status: 'ACTIVE' } }),
      db.wedge.findMany({ orderBy: { createdAt: 'desc' } }),
      db.newsletter.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      db.payment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, company: true } },
          ad: { select: { id: true, title: true } },
        },
      }),
    ])

    // Recent ads pending validation
    const pendingAds = await db.ad.findMany({
      where: { status: 'PENDING_VALIDATION' },
      include: {
        client: { select: { id: true, firstName: true, lastName: true, email: true, company: true } },
        wedge: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    // Monthly revenue for chart
    const monthlyRevenue = await db.$queryRaw<Array<{ month: string; revenue: bigint }>>`
      SELECT
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        COALESCE(SUM(amount), 0) as revenue
      FROM "Payment"
      WHERE status = 'COMPLETED' AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `

    return NextResponse.json({
      stats: {
        userCount,
        activeUserCount,
        totalAds,
        paidAds,
        totalRevenue: totalRevenue._sum.amount ?? 0,
        totalContacts,
        activeContacts,
        wedgeCount: wedges.length,
        newsletterCount: newsletters.length,
      },
      pendingAds,
      recentPayments: payments,
      monthlyRevenue: monthlyRevenue.map((r) => ({
        month: r.month,
        revenue: Number(r.revenue),
      })),
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
