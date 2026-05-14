import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest, sanitizeUser } from '@/lib/auth-utils'
import bcrypt from 'bcryptjs'

// GET /api/user/profile
export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: auth.userId },
      include: {
        _count: {
          select: { ads: true, payments: true, subscriptions: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      ...sanitizeUser(user),
      adCount: user._count.ads,
      paymentCount: user._count.payments,
      subscriptionCount: user._count.subscriptions,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/user/profile - Update profile
export async function PUT(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const data = await req.json()
    const { firstName, lastName, company, phone, currentPassword, newPassword } = data

    // Handle password change
    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
          { status: 400 }
        )
      }

      const user = await db.user.findUnique({ where: { id: auth.userId } })
      if (!user) {
        return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
      }

      const valid = await bcrypt.compare(currentPassword, user.password)
      if (!valid) {
        return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await db.user.update({
        where: { id: auth.userId },
        data: { password: hashedPassword },
      })
    }

    // Handle profile update
    const profileData: any = {}
    if (firstName) profileData.firstName = firstName
    if (lastName) profileData.lastName = lastName
    if (company !== undefined) profileData.company = company
    if (phone !== undefined) profileData.phone = phone

    if (Object.keys(profileData).length > 0) {
      const updated = await db.user.update({
        where: { id: auth.userId },
        data: profileData,
      })

      return NextResponse.json(sanitizeUser(updated))
    }

    return NextResponse.json({ message: 'Mot de passe mis à jour' })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
