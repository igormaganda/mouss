import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: get all phases for a user
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ phases: [] })

  try {
    const phases = await prisma.swipeGamePhase.findMany({
      where: { userId },
      orderBy: { phase: 'asc' },
    })
    return NextResponse.json({ phases })
  } catch (err) {
    console.error('GET swipe-phase error:', err)
    return NextResponse.json({ phases: [] })
  }
}

// POST: save/update a phase result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, phase, currentCard, results, completed } = body
    if (!userId || !phase) return NextResponse.json({ error: 'userId et phase requis' }, { status: 400 })

    const saved = await prisma.swipeGamePhase.upsert({
      where: { userId_phase: { userId, phase } },
      update: {
        currentCard: currentCard ?? 0,
        results: results ?? {},
        completed: completed ?? false,
      },
      create: {
        userId,
        phase,
        currentCard: currentCard ?? 0,
        results: results ?? {},
        completed: completed ?? false,
      },
    })

    return NextResponse.json({ phase: saved })
  } catch (err) {
    console.error('POST swipe-phase error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// DELETE: reset all phases for a user
export async function DELETE(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 })
  try {
    await prisma.swipeGamePhase.deleteMany({ where: { userId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE swipe-phase error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
