import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Fetch single conversation with all messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = request.nextUrl.searchParams.get('userId')

    // Fetch conversation with participants and messages
    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                email: true,
                role: true,
                isActive: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation introuvable' },
        { status: 404 }
      )
    }

    // Mark unread messages as read for this user
    if (userId) {
      await db.conversationParticipant.updateMany({
        where: {
          conversationId: id,
          userId,
        },
        data: { lastReadAt: new Date() },
      })

      // Mark messages as read
      await db.conversationMessage.updateMany({
        where: {
          conversationId: id,
          senderId: { not: userId },
          isRead: false,
        },
        data: { isRead: true },
      })
    }

    // Enrich messages with sender info
    const userIds = conversation.messages.map((m) => m.senderId)
    const uniqueUserIds = [...new Set(userIds)]

    const users = await db.user.findMany({
      where: { id: { in: uniqueUserIds } },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: true,
      },
    })

    const userMap = new Map(users.map((u) => [u.id, u]))

    const enrichedMessages = conversation.messages.map((msg) => {
      const sender = userMap.get(msg.senderId)
      return {
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        senderName: sender
          ? sender.name || `${sender.firstName || ''} ${sender.lastName || ''}`.trim()
          : 'Inconnu',
        senderAvatar: sender?.avatarUrl || null,
        senderRole: sender?.role || null,
        attachmentUrl: msg.attachmentUrl,
        attachmentName: msg.attachmentName,
        isRead: msg.isRead,
        isPinned: msg.isPinned,
        createdAt: msg.createdAt,
      }
    })

    // Enrich participants
    const enrichedParticipants = conversation.participants.map((p) => ({
      id: p.userId,
      name: p.user.name || `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || p.user.email,
      avatar: p.user.avatarUrl,
      role: p.user.role,
      isActive: p.user.isActive,
      isMuted: p.isMuted,
      lastReadAt: p.lastReadAt,
    }))

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        type: conversation.type,
        title: conversation.title,
        counselorId: conversation.counselorId,
        lastMessageAt: conversation.lastMessageAt,
        createdAt: conversation.createdAt,
        participants: enrichedParticipants,
      },
      messages: enrichedMessages,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de la conversation:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST: Send message in conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { senderId, content, attachmentUrl, attachmentName } = body

    if (!senderId || !content?.trim()) {
      return NextResponse.json(
        { error: 'Les champs senderId et content sont requis' },
        { status: 400 }
      )
    }

    // Verify conversation exists
    const conversation = await db.conversation.findUnique({
      where: { id },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation introuvable' },
        { status: 404 }
      )
    }

    // Create message
    const message = await db.conversationMessage.create({
      data: {
        conversationId: id,
        senderId,
        content: content.trim(),
        attachmentUrl: attachmentUrl || undefined,
        attachmentName: attachmentName || undefined,
      },
    })

    // Update conversation lastMessageAt
    await db.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date() },
    })

    return NextResponse.json(
      {
        message: {
          id: message.id,
          conversationId: message.conversationId,
          content: message.content,
          senderId: message.senderId,
          attachmentUrl: message.attachmentUrl,
          attachmentName: message.attachmentName,
          isRead: message.isRead,
          isPinned: message.isPinned,
          createdAt: message.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
