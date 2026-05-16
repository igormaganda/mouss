import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// GET /api/newsletters?wedgeId=xxx&status=xxx
export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = req.nextUrl
    const wedgeId = searchParams.get('wedgeId')
    const status = searchParams.get('status')

    const where: any = {}
    if (wedgeId) where.wedgeId = wedgeId
    if (status) where.status = status

    const newsletters = await db.newsletter.findMany({
      where,
      include: {
        wedge: { select: { id: true, name: true, sector: true, region: true } },
        ads: {
          include: {
            ad: {
              include: {
                client: { select: { id: true, firstName: true, lastName: true, company: true } },
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(newsletters)
  } catch (error) {
    console.error('Get newsletters error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/newsletters - Create/generate a newsletter
export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const data = await req.json()
    const { wedgeId, subject, editorialContent, aiArticle1, aiArticle2, questionOfMonth, adIds, scheduledAt } = data

    if (!wedgeId || !subject) {
      return NextResponse.json({ error: 'Wedge et sujet requis' }, { status: 400 })
    }

    // Get subscriber count for this wedge
    const contactCount = await db.contact.count({
      where: { wedgeId, status: 'ACTIVE' },
    })

    const newsletter = await db.newsletter.create({
      data: {
        wedgeId,
        subject,
        editorialContent: editorialContent || null,
        aiArticle1: aiArticle1 || null,
        aiArticle2: aiArticle2 || null,
        questionOfMonth: questionOfMonth || null,
        recipientCount: contactCount,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: 'DRAFT',
        senderId: auth.userId,
      },
    })

    // Link selected ads
    if (adIds && adIds.length > 0) {
      for (let i = 0; i < adIds.length; i++) {
        await db.newsletterAd.create({
          data: {
            newsletterId: newsletter.id,
            adId: adIds[i],
            orderIndex: i,
          },
        })
      }
    }

    return NextResponse.json(newsletter, { status: 201 })
  } catch (error) {
    console.error('Create newsletter error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/newsletters
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

    const newsletter = await db.newsletter.update({
      where: { id },
      data,
    })

    return NextResponse.json(newsletter)
  } catch (error) {
    console.error('Update newsletter error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/newsletters?id=xxx
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

    await db.newsletter.delete({ where: { id } })
    return NextResponse.json({ message: 'Newsletter supprimée' })
  } catch (error) {
    console.error('Delete newsletter error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
