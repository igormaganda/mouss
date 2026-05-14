import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: list segments in a folder
export async function GET(request: NextRequest) {
  const folderId = request.nextUrl.searchParams.get('folderId')
  if (!folderId) return NextResponse.json({ segments: [] })

  try {
    const segments = await prisma.marketSegment.findMany({
      where: { folderId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ segments })
  } catch (err) {
    console.error('GET market-segments error:', err)
    return NextResponse.json({ segments: [] })
  }
}

// POST: create a new segment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, folderId, name, description, customerType, size, growth, region, priority, notes } = body

    if (!userId || !folderId || !name?.trim()) {
      return NextResponse.json({ error: 'userId, folderId et name sont requis' }, { status: 400 })
    }

    // Verify folder belongs to user
    const folder = await prisma.marketFolder.findFirst({ where: { id: folderId, userId } })
    if (!folder) {
      return NextResponse.json({ error: 'Dossier introuvable.' }, { status: 404 })
    }

    const segment = await prisma.marketSegment.create({
      data: {
        userId,
        folderId,
        name: name.trim(),
        description: description?.trim() || null,
        customerType: customerType || 'B2C',
        size: size?.trim() || null,
        growth: growth?.trim() || null,
        region: region?.trim() || null,
        priority: priority || 'medium',
        notes: notes?.trim() || null,
      },
    })

    return NextResponse.json({ segment }, { status: 201 })
  } catch (err) {
    console.error('POST market-segments error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// PUT: update a segment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, customerType, size, growth, region, priority, status, notes } = body

    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

    const segment = await prisma.marketSegment.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(customerType && { customerType }),
        ...(size !== undefined && { size: size?.trim() || null }),
        ...(growth !== undefined && { growth: growth?.trim() || null }),
        ...(region !== undefined && { region: region?.trim() || null }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
      },
    })

    return NextResponse.json({ segment })
  } catch (err) {
    console.error('PUT market-segments error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// DELETE: remove a segment
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  try {
    await prisma.marketSegment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE market-segments error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
