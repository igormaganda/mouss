import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// GET /api/contacts?wedgeId=xxx&status=xxx&search=xxx
export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const { searchParams } = req.nextUrl
    const wedgeId = searchParams.get('wedgeId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (wedgeId) where.wedgeId = wedgeId
    if (status) where.status = status
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { company: { contains: search } },
      ]
    }

    const [contacts, total] = await Promise.all([
      db.contact.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.contact.count({ where }),
    ])

    return NextResponse.json({
      contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/contacts - Create a contact (admin only)
export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const data = await req.json()
    const { email, firstName, lastName, company, sector, postalCode, department, region, wedgeId, jobTitle, companySize } = data

    if (!email || !firstName || !lastName || !company || !sector || !postalCode || !department || !region) {
      return NextResponse.json({ error: 'Tous les champs obligatoires doivent être remplis' }, { status: 400 })
    }

    const existing = await db.contact.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Ce contact existe déjà' }, { status: 409 })
    }

    const contact = await db.contact.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName,
        company,
        sector,
        postalCode,
        department,
        region,
        jobTitle: jobTitle || null,
        companySize: companySize || null,
        wedgeId: wedgeId || null,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Create contact error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/contacts?id=xxx
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

    await db.contact.delete({ where: { id } })
    return NextResponse.json({ message: 'Contact supprimé' })
  } catch (error) {
    console.error('Delete contact error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
