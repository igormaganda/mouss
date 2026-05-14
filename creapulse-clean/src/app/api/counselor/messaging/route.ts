import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Fetch all conversations for a counselor
export async function GET(request: NextRequest) {
  try {
    const counselorId = request.nextUrl.searchParams.get('counselorId')
    if (!counselorId) {
      return NextResponse.json(
        { error: 'Le paramètre counselorId est requis' },
        { status: 400 }
      )
    }

    const conversations = await db.conversation.findMany({
      where: { counselorId },
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
                isActive: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    })

    // Enrich with unread count and last message preview
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        // Find counselor's participant record for lastReadAt
        const counselorParticipant = conv.participants.find(
          (p) => p.userId === counselorId
        )
        const lastReadAt = counselorParticipant?.lastReadAt

        // Count unread messages (messages created after lastReadAt, excluding self)
        const unreadWhere: Record<string, unknown> = {
          conversationId: conv.id,
          senderId: { not: counselorId },
          isRead: false,
        }
        if (lastReadAt) {
          unreadWhere.createdAt = { gt: lastReadAt }
        }

        const unreadCount = await db.conversationMessage.count({
          where: unreadWhere,
        })

        const lastMessage = conv.messages.length > 0 ? conv.messages[0] : null

        // Build participant names for display
        const participantNames = conv.participants
          .filter((p) => p.userId !== counselorId)
          .map((p) => {
            const user = p.user
            return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
          })

        const otherParticipants = conv.participants
          .filter((p) => p.userId !== counselorId)
          .map((p) => ({
            id: p.userId,
            name: p.user.name || `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || p.user.email,
            avatar: p.user.avatarUrl,
            isActive: p.user.isActive,
            isMuted: p.isMuted,
          }))

        return {
          id: conv.id,
          type: conv.type,
          title: conv.title,
          lastMessageAt: conv.lastMessageAt,
          createdAt: conv.createdAt,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content.length > 120
                  ? lastMessage.content.substring(0, 120) + '...'
                  : lastMessage.content,
                senderId: lastMessage.senderId,
                hasAttachment: !!lastMessage.attachmentUrl,
                createdAt: lastMessage.createdAt,
              }
            : null,
          unreadCount,
          messageCount: conv._count.messages,
          participantNames: participantNames.join(', '),
          participants: otherParticipants,
        }
      })
    )

    return NextResponse.json({ conversations: enrichedConversations })
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST: Create conversation + send first message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { counselorId, participantIds, type, message, title } = body

    if (!counselorId || !participantIds?.length || !message?.trim()) {
      return NextResponse.json(
        { error: 'Les champs counselorId, participantIds et message sont requis' },
        { status: 400 }
      )
    }

    if (!['INDIVIDUAL', 'GROUP', 'ANNOUNCEMENT'].includes(type)) {
      return NextResponse.json(
        { error: 'Le type de conversation doit être INDIVIDUAL, GROUP ou ANNOUNCEMENT' },
        { status: 400 }
      )
    }

    // Create conversation
    const conversation = await db.conversation.create({
      data: {
        type,
        title: title || undefined,
        counselorId,
        participants: {
          create: [
            // Counselor as participant
            { userId: counselorId },
            // All other participants
            ...participantIds.map((userId: string) => ({ userId })),
          ],
        },
        messages: {
          create: {
            senderId: counselorId,
            content: message.trim(),
          },
        },
      },
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
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            conversation: false,
          },
        },
      },
    })

    return NextResponse.json({ conversation }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
