import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: get conversation between 2 users
export async function GET(request: NextRequest) {
  const senderId = request.nextUrl.searchParams.get('senderId')
  const receiverId = request.nextUrl.searchParams.get('receiverId')
  if (!senderId || !receiverId) return NextResponse.json({ messages: [] })

  try {
    const messages = await prisma.conversationMessage.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
    })

    // Mark as read
    await prisma.conversationMessage.updateMany({
      where: { senderId: receiverId, receiverId: senderId, isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({ messages })
  } catch (err) {
    console.error('GET messages error:', err)
    return NextResponse.json({ messages: [] })
  }
}

// POST: send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { senderId, receiverId, content } = body
    if (!senderId || !receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const message = await prisma.conversationMessage.create({
      data: { senderId, receiverId, content: content.trim() },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (err) {
    console.error('POST messages error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
