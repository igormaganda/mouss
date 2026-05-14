import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email') || 'admin@creapulse.fr'
    const password = searchParams.get('password') || 'password123'

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found', email })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    return NextResponse.json({
      email,
      isActive: user.isActive,
      passwordHash: user.passwordHash.substring(0, 30) + '...',
      passwordTest: password,
      isPasswordValid,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
