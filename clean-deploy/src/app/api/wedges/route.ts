import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// GET /api/wedges - List all wedges
export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const wedges = await db.wedge.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { ads: true, newsletters: true, contacts: true },
        },
      },
    })

    const formatted = wedges.map((w) => ({
      ...w,
      subscriberCount: w._count.contacts,
      totalSent: w._count.newsletters,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Get wedges error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/wedges - Create a wedge (admin only)
export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const data = await req.json()
    const { name, sector, region, department, description, frequency, sendTime, sendDays, maxAdsPerNewsletter } = data

    if (!name || !sector || !region) {
      return NextResponse.json({ error: 'Nom, secteur et région sont requis' }, { status: 400 })
    }

    const wedge = await db.wedge.create({
      data: {
        name,
        sector,
        region,
        department: department || null,
        description: description || null,
        frequency: frequency || 'WEEKLY',
        sendTime: sendTime || '09:00',
        sendDays: sendDays || '1,3,5',
        maxAdsPerNewsletter: maxAdsPerNewsletter || 3,
      },
    })

    return NextResponse.json(wedge, { status: 201 })
  } catch (error) {
    console.error('Create wedge error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/wedges - Update a wedge
export async function PUT(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const { id, ...data } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const wedge = await db.wedge.update({
      where: { id },
      data,
    })

    return NextResponse.json(wedge)
  } catch (error) {
    console.error('Update wedge error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/wedges?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    await db.wedge.delete({ where: { id } })
    return NextResponse.json({ message: 'Wedge supprimé' })
  } catch (error) {
    console.error('Delete wedge error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
