import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// GET /api/ads?clientId=xxx&wedgeId=xxx&status=xxx
export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = req.nextUrl
    const clientId = searchParams.get('clientId')
    const wedgeId = searchParams.get('wedgeId')
    const status = searchParams.get('status')

    const where: any = {}
    if (auth.role === 'CLIENT') {
      where.clientId = auth.userId
    } else if (clientId) {
      where.clientId = clientId
    }
    if (wedgeId) where.wedgeId = wedgeId
    if (status) where.status = status

    const ads = await db.ad.findMany({
      where,
      include: {
        client: { select: { id: true, firstName: true, lastName: true, company: true } },
        wedge: { select: { id: true, name: true, sector: true, region: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(ads)
  } catch (error) {
    console.error('Get ads error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/ads - Create an ad
export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const data = await req.json()
    const { title, description, sector, region, wedgeId, cta, destinationUrl, budget } = data

    if (!title || !description || !sector || !region || !wedgeId || !destinationUrl) {
      return NextResponse.json(
        { error: 'Titre, description, secteur, région, wedge et lien destination sont requis' },
        { status: 400 }
      )
    }

    // Auto-validate the ad
    const validationErrors: string[] = []
    if (title.length < 5) validationErrors.push('Le titre doit contenir au moins 5 caractères')
    if (title.length > 100) validationErrors.push('Le titre ne doit pas dépasser 100 caractères')
    if (description.length < 20) validationErrors.push('La description doit contenir au moins 20 caractères')
    if (description.length > 500) validationErrors.push('La description ne doit pas dépasser 500 caractères')
    if (!destinationUrl.startsWith('https://')) validationErrors.push('Le lien destination doit être en HTTPS')

    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Validation échouée', details: validationErrors }, { status: 400 })
    }

    const ad = await db.ad.create({
      data: {
        title,
        description,
        sector,
        region,
        wedgeId,
        cta: cta || 'En savoir plus',
        destinationUrl,
        budget: budget || 49.0,
        clientId: auth.userId,
        status: 'PENDING_VALIDATION',
      },
    })

    return NextResponse.json(ad, { status: 201 })
  } catch (error) {
    console.error('Create ad error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/ads - Update ad status (admin) or ad content (client)
export async function PUT(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id, ...data } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    // Only admin can change status
    if (data.status && auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const ad = await db.ad.update({
      where: { id },
      data,
    })

    return NextResponse.json(ad)
  } catch (error) {
    console.error('Update ad error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/ads?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const ad = await db.ad.findUnique({ where: { id } })
    if (!ad) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 })
    }

    if (auth.role === 'CLIENT' && ad.clientId !== auth.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    await db.ad.delete({ where: { id } })
    return NextResponse.json({ message: 'Annonce supprimée' })
  } catch (error) {
    console.error('Delete ad error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
