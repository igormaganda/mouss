import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const counselorId = searchParams.get('counselorId')

    if (!counselorId) {
      return NextResponse.json(
        { error: 'counselorId requis' },
        { status: 400 }
      )
    }

    // Find counselor profile
    const counselor = await db.counselor.findUnique({
      where: { userId: counselorId },
    })

    if (!counselor) {
      return NextResponse.json(
        { error: 'Profil conseiller non trouvé' },
        { status: 404 }
      )
    }

    // Fetch all assignments with rich data
    const assignments = await db.counselorAssignment.findMany({
      where: { counselorId: counselor.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    })

    // For each assignment, gather enriched data in parallel
    const porteurs = await Promise.all(
      assignments.map(async (assignment) => {
        const user = assignment.user
        const userId = user.id

        // Business Plan
        const businessPlan = await db.businessPlan.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
        })

        // Go/No-Go evaluation
        const goNoGo = await db.goNoGoEvaluation.findFirst({
          where: { userId },
          orderBy: { evaluatedAt: 'desc' },
        })

        // RIASEC dominant
        const riasecDominant = await db.riasecResult.findFirst({
          where: { userId, isDominant: true },
          orderBy: { score: 'desc' },
        })

        // Interview count
        const interviewCount = await db.interviewSession.count({
          where: { userId, counselorId: counselor.id },
        })

        // Kiviat dimensions (latest)
        const kiviatResults = await db.kiviatResult.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
        })

        // Last activity: check latest among several tables
        const latestBP = businessPlan?.updatedAt?.getTime() || 0
        const latestGoNoGo = goNoGo?.evaluatedAt?.getTime() || 0
        const latestInterview = await db.interviewSession.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          select: { updatedAt: true },
        })
        const latestInterviewDate = latestInterview?.updatedAt?.getTime() || 0

        const lastActivity = new Date(
          Math.max(latestBP, latestGoNoGo, latestInterviewDate, assignment.assignedAt.getTime())
        ).toISOString()

        // Module results count (for progress)
        const latestSession = await db.diagnosisSession.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
        })
        const modulesTotal = latestSession
          ? await db.moduleResult.count({
              where: { sessionId: latestSession.id },
            })
          : 0
        const modulesCompleted = latestSession
          ? await db.moduleResult.count({
              where: { sessionId: latestSession.id, score: { not: null } },
            })
          : 0

        // Top pepites from SwipeGameResult (kept cards in phase 1)
        const topPepites = await db.swipeGameResult.findMany({
          where: { userId, kept: true },
          orderBy: { swipedAt: 'desc' },
          take: 3,
          select: { skillName: true },
        })

        // Last counselor note
        const lastNote = await db.counselorNote.findFirst({
          where: { counselorId: counselor.id, userId },
          orderBy: { createdAt: 'desc' },
        })

        return {
          id: userId,
          name:
            user.name ||
            [user.firstName, user.lastName].filter(Boolean).join(' ') ||
            user.email,
          email: user.email,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          avatarUrl: user.avatarUrl || undefined,
          assignmentStatus: assignment.status,
          assignedAt: assignment.assignedAt.toISOString(),
          lastActivity: lastActivity || assignment.assignedAt.toISOString(),
          bpStatus: businessPlan?.status || undefined,
          bpSector: businessPlan?.sector || undefined,
          bpProjectName: businessPlan?.projectName || undefined,
          bpProgress:
            businessPlan && businessPlan.totalSteps > 0
              ? Math.round(
                  (businessPlan.completedSteps / businessPlan.totalSteps) * 100
                )
              : 0,
          goNoGoDecision:
            goNoGo?.decision as 'GO' | 'NO_GO' | 'PENDING' | undefined,
          goNoGoScore: goNoGo?.weightedScore
            ? Math.round(goNoGo.weightedScore)
            : undefined,
          riasecDominant: riasecDominant?.profileType || undefined,
          interviewCount,
          kiviatDimensions: kiviatResults.map((k) => ({
            dimension: k.dimension,
            value: k.value,
            maxValue: k.maxValue,
          })),
          topPepites: topPepites
            .map((p) => p.skillName)
            .filter(Boolean),
          lastCounselorNote: lastNote?.content || undefined,
          lastCounselorNoteAt: lastNote?.updatedAt.toISOString() || undefined,
          modulesCompleted,
          modulesTotal,
        }
      })
    )

    return NextResponse.json({ porteurs })
  } catch (error) {
    console.error('Counselor portfolio error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
