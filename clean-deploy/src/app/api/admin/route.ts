import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// GET /api/admin - Simplified admin dashboard data
export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const [userCount, activeUserCount, counselors] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.counselor.count(),
    ])

    return NextResponse.json({
      stats: {
        userCount,
        activeUserCount,
        counselorCount: counselors,
      },
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
