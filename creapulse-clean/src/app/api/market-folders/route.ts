import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: list all folders for a user
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ folders: [] })

  try {
    const folders = await prisma.marketFolder.findMany({
      where: { userId },
      include: {
        _count: { select: { documents: true, segments: true } },
        segments: true,
      },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ folders })
  } catch (err) {
    console.error('GET market-folders error:', err)
    return NextResponse.json({ folders: [] })
  }
}

// POST: create a new folder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, color, icon } = body

    if (!userId || !name?.trim()) {
      return NextResponse.json({ error: 'userId et name sont requis' }, { status: 400 })
    }

    // Count existing folders for sortOrder
    const count = await prisma.marketFolder.count({ where: { userId } })

    const folder = await prisma.marketFolder.create({
      data: {
        userId,
        name: name.trim(),
        color: color || '#6366f1',
        icon: icon || 'folder',
        sortOrder: count,
      },
    })

    return NextResponse.json({ folder }, { status: 201 })
  } catch (err) {
    console.error('POST market-folders error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// PUT: update folder name/color
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, color, icon } = body

    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

    const folder = await prisma.marketFolder.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(color && { color }),
        ...(icon && { icon }),
      },
    })

    return NextResponse.json({ folder })
  } catch (err) {
    console.error('PUT market-folders error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// DELETE: remove a folder (cascade deletes documents and segments)
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  try {
    await prisma.marketFolder.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE market-folders error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
