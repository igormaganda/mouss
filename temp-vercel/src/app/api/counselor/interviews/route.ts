import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Fetch interviews for a counselor
export async function GET(request: NextRequest) {
  try {
    const counselorId = request.nextUrl.searchParams.get('counselorId')
    if (!counselorId) {
      return NextResponse.json(
        { error: 'Le paramètre counselorId est requis' },
        { status: 400 }
      )
    }

    const userId = request.nextUrl.searchParams.get('userId')

    // Build where clause
    const where: Record<string, unknown> = { counselorId }
    if (userId) {
      where.userId = userId
    }

    const interviews = await db.interviewSession.findMany({
      where,
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
        interviewNotes: {
          select: {
            id: true,
            category: true,
            phase: true,
            isAction: true,
            isDone: true,
            isPinned: true,
            createdAt: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    })

    // Enrich with notes stats
    const enrichedInterviews = interviews.map((session) => {
      const notesCount = session.interviewNotes.length
      const actionNotesCount = session.interviewNotes.filter((n) => n.isAction).length
      const pendingActions = session.interviewNotes.filter((n) => n.isAction && !n.isDone).length
      const pinnedNotes = session.interviewNotes.filter((n) => n.isPinned)

      const userName = session.user.name
        || `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim()
        || session.user.email

      return {
        id: session.id,
        type: session.type,
        status: session.status,
        scheduledAt: session.scheduledAt,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        duration: session.duration,
        summary: session.summary,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        notesCount,
        actionNotesCount,
        pendingActions,
        user: {
          id: session.user.id,
          name: userName,
          avatar: session.user.avatarUrl,
          email: session.user.email,
        },
        pinnedNotes: pinnedNotes.map((n) => ({
          id: n.id,
          category: n.category,
          phase: n.phase,
          content: null, // Preview only; full content fetched from detail route
          isAction: n.isAction,
          isDone: n.isDone,
          createdAt: n.createdAt,
        })),
      }
    })

    // Stats
    const stats = {
      total: enrichedInterviews.length,
      planned: enrichedInterviews.filter((i) => i.status === 'PLANNED').length,
      inProgress: enrichedInterviews.filter((i) => i.status === 'IN_PROGRESS').length,
      completed: enrichedInterviews.filter((i) => i.status === 'COMPLETED').length,
      cancelled: enrichedInterviews.filter((i) => i.status === 'CANCELLED').length,
    }

    return NextResponse.json({ interviews: enrichedInterviews, stats })
  } catch (error) {
    console.error('Erreur lors de la récupération des entretiens:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST: Create interview session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { counselorId, userId, type, scheduledAt } = body

    if (!counselorId || !userId || !type) {
      return NextResponse.json(
        { error: 'Les champs counselorId, userId et type sont requis' },
        { status: 400 }
      )
    }

    const validTypes = ['FIRST', 'FOLLOW_UP', 'GROUP', 'BP_REVIEW', 'GO_NO_GO']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Le type doit être l'un de: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Verify user is assigned to this counselor
    const assignment = await db.counselorAssignment.findFirst({
      where: { counselorId, userId, status: 'ACTIVE' },
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Cet utilisateur n\'est pas assigné à ce conseiller' },
        { status: 403 }
      )
    }

    // Create interview session
    const session = await db.interviewSession.create({
      data: {
        counselorId,
        userId,
        type,
        status: 'PLANNED',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      },
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
    })

    const userName = session.user.name
      || `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim()
      || session.user.email

    return NextResponse.json(
      {
        session: {
          ...session,
          user: {
            id: session.user.id,
            name: userName,
            avatar: session.user.avatarUrl,
            email: session.user.email,
          },
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création de l\'entretien:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
