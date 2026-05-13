import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/auth-middleware'
import { rateLimit } from '@/lib/rate-limit'
import { callAI } from '@/lib/ai'

interface VisionInsight {
  title: string
  description: string
}

async function generateVisionInsights(answers: Record<string, string>): Promise<VisionInsight[]> {
  try {
    const text = await callAI(
      [{
        role: 'user',
        content: `Analyse ces réponses d'un porteur de projet et génère 3 insights stratégiques en français. Réponds en JSON: { insights: [{title, description}] }. Réponses: ${JSON.stringify(answers)}`,
      }],
      { maxTokens: 2048 }
    )

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.insights && Array.isArray(parsed.insights)) {
        return parsed.insights
      }
    }

    return []
  } catch (error) {
    console.error('AI vision analysis error:', error)
    return []
  }
}

export async function POST(request: NextRequest) {
  const { authenticated, payload, error } = authenticateRequest(request)
  if (!authenticated) return error!

  const userId = payload!.userId

  // Rate limit: 10 per hour
  const limiter = rateLimit(`vision:${userId}`, { maxRequests: 10, windowMs: 3600000 })
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((limiter.resetTime - Date.now()) / 1000)) },
      }
    )
  }

  try {
    const body = await request.json()
    const { answers } = body as {
      answers?: {
        project?: string
        location?: string
        uniqueness?: string
        positioning?: string
        timeline?: string
      }
    }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Réponses manquantes' }, { status: 400 })
    }

    // Ensure session exists
    let session = await db.creatorSession.findUnique({
      where: { userId },
    })

    if (!session) {
      session = await db.creatorSession.create({
        data: {
          userId,
          currentStep: 2,
          visionAnswers: {},
          swipeProgress: {},
          kiviatAcquis: [],
          kiviatAspirations: [],
          status: 'IN_PROGRESS',
        },
      })
    }

    // Merge answers with existing
    const existingAnswers = (session.visionAnswers as Record<string, string>) || {}
    const mergedAnswers = { ...existingAnswers, ...answers }

    // Generate AI insights
    const insights = await generateVisionInsights(mergedAnswers)

    // Update session with answers and move to step 3
    const updatedSession = await db.creatorSession.update({
      where: { userId },
      data: {
        visionAnswers: mergedAnswers,
        currentStep: Math.max(session.currentStep, 3),
      },
    })

    return NextResponse.json({
      saved: true,
      insights,
      session: updatedSession,
    })
  } catch (err) {
    console.error('Vision analysis error:', err)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
