import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  const { authenticated, payload, error } = authenticateRequest(request)
  if (!authenticated) return error!

  try {
    const userId = payload!.userId

    // Check each module completion in parallel
    const [
      user,
      creatorSession,
      cvUpload,
      swipeResults,
      kiviatResults,
      riasecResults,
      motivationResult,
      skillGapAnalysis,
    ] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, phone: true },
      }),
      db.creatorSession.findUnique({ where: { userId } }),
      db.cvUpload.findUnique({ where: { userId } }),
      db.swipeGameResult.findMany({ where: { userId } }),
      db.kiviatResult.findMany({ where: { userId } }),
      db.riasecResult.findMany({ where: { userId } }),
      db.motivationAssessment.findFirst({ where: { userId } }),
      db.skillGapAnalysis.findFirst({
        where: { userId },
        orderBy: { analyzedAt: 'desc' },
      }),
    ])

    // Determine completion status for each module
    const completedModules: Record<string, boolean> = {
      profil: !!(user?.name && user?.email),
      parcours: creatorSession?.status === 'COMPLETED',
      bilan: !!skillGapAnalysis,
      riasec: riasecResults.length > 0,
      pepites: swipeResults.length > 0,
      motivation: !!motivationResult,
    }

    const totalModules = Object.keys(completedModules).length
    const completedCount = Object.values(completedModules).filter(Boolean).length
    const progressPercent = Math.round((completedCount / totalModules) * 100)

    // Badge system
    const badges: Array<{
      id: string
      name: string
      icon: string
      earned: boolean
      earnedAt?: Date
    }> = [
      {
        id: 'profil',
        name: 'Profil validé',
        icon: 'UserCheck',
        earned: completedModules.profil,
      },
      {
        id: 'parcours',
        name: 'Parcours complété',
        icon: 'Route',
        earned: completedModules.parcours,
        earnedAt: creatorSession?.completedAt ?? undefined,
      },
      {
        id: 'bilan',
        name: 'Diagnostic Expert',
        icon: 'FileCheck',
        earned: completedModules.bilan,
      },
      {
        id: 'riasec',
        name: 'Profil RIASEC',
        icon: 'BarChart3',
        earned: completedModules.riasec,
      },
      {
        id: 'pepites',
        name: 'Soft Skills identifiées',
        icon: 'Sparkles',
        earned: completedModules.pepites,
      },
      {
        id: 'motivation',
        name: 'Motivations explorées',
        icon: 'Heart',
        earned: completedModules.motivation,
      },
    ]

    // Can generate final report?
    const canGenerateReport =
      completedModules.profil && completedModules.parcours && completedModules.riasec

    return NextResponse.json({
      completedModules,
      totalModules,
      completedCount,
      progressPercent,
      badges,
      canGenerateReport,
      details: {
        hasCv: !!cvUpload,
        hasKiviat: kiviatResults.length > 0,
        swipeCount: swipeResults.length,
        riasecCount: riasecResults.length,
      },
    })
  } catch (err) {
    console.error('Progress error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
