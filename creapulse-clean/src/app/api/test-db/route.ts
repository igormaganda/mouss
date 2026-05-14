import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    const userCount = await db.user.count()
    const admin = await db.user.findUnique({
      where: { email: 'admin@creapulse.fr' },
      select: { email: true, isActive: true }
    })

    return NextResponse.json({
      status: 'connected',
      userCount,
      admin: admin ? { email: admin.email, active: admin.isActive } : null,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
