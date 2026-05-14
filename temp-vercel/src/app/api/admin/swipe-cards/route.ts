import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: All cards (admin view, includes inactive)
export async function GET() {
  try {
    const cards = await db.swipeCard.findMany({
      orderBy: [{ phase: 'asc' }, { sortOrder: 'asc' }],
    })
    return NextResponse.json({ cards })
  } catch (err) {
    console.error('GET admin swipe-cards error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// POST: Create a new card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phase, title, description, helpText, emoji, gradient, tags, isActive, isEssential, sortOrder } = body

    if (!phase || !title || !description) {
      return NextResponse.json({ error: 'phase, title et description requis' }, { status: 400 })
    }

    const card = await db.swipeCard.create({
      data: {
        phase,
        title,
        description,
        helpText: helpText || '',
        emoji: emoji || '',
        gradient: gradient || 'from-emerald-400 to-teal-500',
        tags: tags || [],
        isActive: isActive !== false,
        isEssential: isEssential || false,
        sortOrder: sortOrder || 0,
      },
    })

    return NextResponse.json({ card }, { status: 201 })
  } catch (err) {
    console.error('POST admin swipe-cards error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// PUT: Update a card
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'id requis' }, { status: 400 })
    }

    const existing = await db.swipeCard.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Carte non trouvée' }, { status: 404 })
    }

    const card = await db.swipeCard.update({
      where: { id },
      data: {
        ...(data.phase !== undefined && { phase: data.phase }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.helpText !== undefined && { helpText: data.helpText }),
        ...(data.emoji !== undefined && { emoji: data.emoji }),
        ...(data.gradient !== undefined && { gradient: data.gradient }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isEssential !== undefined && { isEssential: data.isEssential }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    })

    return NextResponse.json({ card })
  } catch (err) {
    console.error('PUT admin swipe-cards error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// DELETE: Deactivate a card (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id requis' }, { status: 400 })
    }

    await db.swipeCard.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE admin swipe-cards error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
