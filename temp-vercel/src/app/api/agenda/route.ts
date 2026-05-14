import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: get agenda events for a user
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ events: [] })

  try {
    const events = await prisma.agendaEvent.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    })
    return NextResponse.json({ events })
  } catch (err) {
    console.error('GET agenda error:', err)
    return NextResponse.json({ events: [] })
  }
}

// POST: create an event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, type, status, date, endDate, location, counselorId } = body
    if (!userId || !title?.trim() || !date) {
      return NextResponse.json({ error: 'userId, title et date requis' }, { status: 400 })
    }

    const event = await prisma.agendaEvent.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || null,
        type: type || 'milestone',
        status: status || 'planned',
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        location: location?.trim() || null,
        counselorId: counselorId || null,
      },
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (err) {
    console.error('POST agenda error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// PUT: update event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

    const event = await prisma.agendaEvent.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.description !== undefined && { description: data.description?.trim() || null }),
        ...(data.type && { type: data.type }),
        ...(data.status && { status: data.status }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        ...(data.location !== undefined && { location: data.location?.trim() || null }),
      },
    })
    return NextResponse.json({ event })
  } catch (err) {
    console.error('PUT agenda error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// DELETE: remove event
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })
  try {
    await prisma.agendaEvent.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE agenda error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
