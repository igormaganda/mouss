import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import ZAI from 'z-ai-web-dev-sdk'

const prisma = new PrismaClient()

// POST: AI assistant chat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, message, context } = body
    if (!userId || !message?.trim()) {
      return NextResponse.json({ error: 'userId et message requis' }, { status: 400 })
    }

    // Save user message
    await prisma.aiChatHistory.create({
      data: { userId, role: 'user', content: message.trim(), context: context || null },
    })

    // Get recent history for context
    const history = await prisma.aiChatHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    const recentHistory = history.reverse()

    // Build messages for AI
    const aiMessages = [
      {
        role: 'system' as const,
        content: `Tu es l'assistant IA CréaPulse, un coach entrepreneurial bienveillant et expert.
Tu accompagnes les porteurs de projet dans leur parcours de création d'entreprise.
Tu connais bien les dispositifs France Travail, les aides à la création, le statut d'auto-entrepreneur, SARL, SAS, etc.
Tu poses des questions pertinentes pour aider à affiner le projet.
Tu es concis, encourageant et pratique. Tu réponds en français.
Contexte actuel de l'utilisateur : ${context || 'Nouvel utilisateur, début de parcours'}`,
      },
    ]

    // Add last 10 messages for context
    const lastMessages = recentHistory.slice(-10)
    for (const msg of lastMessages) {
      aiMessages.push({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
      })
    }

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: aiMessages,
      temperature: 0.7,
    })

    const reply = completion.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.'

    // Save assistant message
    await prisma.aiChatHistory.create({
      data: { userId, role: 'assistant', content: reply, context: context || null },
    })

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('AI assistant error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// GET: load chat history
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ messages: [] })

  try {
    const messages = await prisma.aiChatHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 50,
    })
    return NextResponse.json({ messages })
  } catch (err) {
    console.error('GET ai-assistant error:', err)
    return NextResponse.json({ messages: [] })
  }
}

// DELETE: clear chat history
export async function DELETE(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 })
  try {
    await prisma.aiChatHistory.deleteMany({ where: { userId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE ai-assistant error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
