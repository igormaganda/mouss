import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Fetch single interview with all notes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const session = await db.interviewSession.findUnique({
      where: { id },
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
          orderBy: [{ isPinned: 'desc' }, { createdAt: 'asc' }],
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Entretien introuvable' },
        { status: 404 }
      )
    }

    const userName = session.user.name
      || `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim()
      || session.user.email

    // Group notes by category for easier display
    const notesByCategory: Record<string, typeof session.interviewNotes> = {}
    for (const note of session.interviewNotes) {
      const cat = note.category || 'Observation'
      if (!notesByCategory[cat]) notesByCategory[cat] = []
      notesByCategory[cat].push(note)
    }

    // Stats
    const stats = {
      totalNotes: session.interviewNotes.length,
      actionNotes: session.interviewNotes.filter((n) => n.isAction).length,
      completedActions: session.interviewNotes.filter((n) => n.isAction && n.isDone).length,
      pendingActions: session.interviewNotes.filter((n) => n.isAction && !n.isDone).length,
      pinnedNotes: session.interviewNotes.filter((n) => n.isPinned).length,
      categories: Object.keys(notesByCategory),
    }

    return NextResponse.json({
      session: {
        id: session.id,
        counselorId: session.counselorId,
        userId: session.userId,
        type: session.type,
        status: session.status,
        scheduledAt: session.scheduledAt,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        duration: session.duration,
        notes: session.notes,
        summary: session.summary,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        user: {
          id: session.user.id,
          name: userName,
          avatar: session.user.avatarUrl,
          email: session.user.email,
        },
      },
      notes: session.interviewNotes,
      notesByCategory,
      stats,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'entretien:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST: Update interview (start, complete, add notes, summarize)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action, note, category, phase, summary } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Le champ action est requis' },
        { status: 400 }
      )
    }

    const validActions = ['START', 'COMPLETE', 'NOTE', 'SUMMARIZE']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `L'action doit être l'une de: ${validActions.join(', ')}` },
        { status: 400 }
      )
    }

    // Verify session exists
    const existing = await db.interviewSession.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Entretien introuvable' },
        { status: 404 }
      )
    }

    let updatedSession

    switch (action) {
      case 'START': {
        if (existing.status !== 'PLANNED') {
          return NextResponse.json(
            { error: 'Seul un entretien planifié peut être démarré' },
            { status: 400 }
          )
        }
        updatedSession = await db.interviewSession.update({
          where: { id },
          data: {
            status: 'IN_PROGRESS',
            startedAt: new Date(),
          },
        })
        break
      }

      case 'COMPLETE': {
        if (existing.status !== 'IN_PROGRESS') {
          return NextResponse.json(
            { error: 'Seul un entretien en cours peut être terminé' },
            { status: 400 }
          )
        }
        const now = new Date()
        const durationMs = existing.startedAt
          ? now.getTime() - existing.startedAt.getTime()
          : 0
        const durationMin = Math.round(durationMs / 60000)

        updatedSession = await db.interviewSession.update({
          where: { id },
          data: {
            status: 'COMPLETED',
            completedAt: now,
            duration: durationMin,
          },
        })
        break
      }

      case 'NOTE': {
        if (!note?.trim()) {
          return NextResponse.json(
            { error: 'Le contenu de la note est requis pour l\'action NOTE' },
            { status: 400 }
          )
        }
        const interviewNote = await db.interviewNote.create({
          data: {
            sessionId: id,
            category: category || 'Observation',
            phase: phase || 'Diagnostic',
            content: note.trim(),
            isAction: body.isAction || false,
          },
        })
        return NextResponse.json({
          message: 'Note ajoutée avec succès',
          note: interviewNote,
        })
      }

      case 'SUMMARIZE': {
        if (!summary?.trim()) {
          return NextResponse.json(
            { error: 'Le résumé est requis pour l\'action SUMMARIZE' },
            { status: 400 }
          )
        }
        updatedSession = await db.interviewSession.update({
          where: { id },
          data: {
            summary: summary.trim(),
          },
        })
        break
      }

      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        )
    }

    // For actions that update the session, return the updated session
    if (updatedSession) {
      return NextResponse.json({
        message: `Action ${action} effectuée avec succès`,
        session: updatedSession,
      })
    }

    return NextResponse.json({ error: 'Aucune action effectuée' }, { status: 500 })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'entretien:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
