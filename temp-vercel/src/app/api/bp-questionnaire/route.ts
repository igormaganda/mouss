import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

// GET: Fetch or create a BusinessPlan for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }

    // Find existing plan with QUESTIONNAIRE status
    const existingPlan = await db.businessPlan.findFirst({
      where: { userId, status: 'QUESTIONNAIRE' },
      orderBy: { updatedAt: 'desc' },
    })

    if (existingPlan) {
      return NextResponse.json({ plan: existingPlan })
    }

    // Create a new plan
    const newPlan = await db.businessPlan.create({
      data: {
        userId,
        projectName: 'Mon projet',
        sector: '',
        status: 'QUESTIONNAIRE',
        answers: {},
        marketData: {},
        completedSteps: 0,
        totalSteps: 10,
      },
    })

    return NextResponse.json({ plan: newPlan })
  } catch (err) {
    console.error('GET bp-questionnaire error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// POST: Save questionnaire answers step by step
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, step, answers } = body

    if (!userId || step === undefined || !answers) {
      return NextResponse.json(
        { error: 'userId, step et answers requis' },
        { status: 400 }
      )
    }

    // Find existing plan with QUESTIONNAIRE status
    let plan = await db.businessPlan.findFirst({
      where: { userId, status: 'QUESTIONNAIRE' },
      orderBy: { updatedAt: 'desc' },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Aucun plan en cours de questionnaire' },
        { status: 404 }
      )
    }

    // Merge partial answers into existing answers
    const currentAnswers = (plan.answers as Record<string, any>) || {}
    const mergedAnswers = { ...currentAnswers, ...answers }

    // Determine the new completedSteps value
    const newCompletedSteps = Math.max(plan.completedSteps, step)

    // Update the plan
    plan = await db.businessPlan.update({
      where: { id: plan.id },
      data: {
        answers: mergedAnswers,
        completedSteps: newCompletedSteps,
        // Update sector and project name from answers if provided
        ...(answers.sector ? { sector: answers.sector } : {}),
        ...(answers.projectName ? { projectName: answers.projectName } : {}),
        ...(answers.slogan ? { slogan: answers.slogan } : {}),
      },
    })

    // If step 1 (sector selection), automatically trigger market data fetch
    if (step === 1 && answers.sector) {
      try {
        const marketData = await fetchMarketDataViaAI(
          answers.sector,
          answers.region || '',
          answers.projectDesc || ''
        )

        plan = await db.businessPlan.update({
          where: { id: plan.id },
          data: { marketData },
        })
      } catch (marketErr) {
        console.error('Auto market data fetch failed (non-blocking):', marketErr)
        // Don't fail the whole request — market data fetch is async/background
      }
    }

    return NextResponse.json({ plan })
  } catch (err) {
    console.error('POST bp-questionnaire error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// Helper: Fetch market data via AI
async function fetchMarketDataViaAI(
  sector: string,
  region: string,
  projectDesc: string
): Promise<Record<string, any>> {
  const regionStr = region ? `en ${region}` : 'en France'

  const prompt = `Tu es un expert en études de marché et analyse sectorielle. Réalise une analyse de marché structurée pour un projet entrepreneurial.

Secteur: ${sector}
Région: ${regionStr}
Description du projet: ${projectDesc || 'Non renseignée'}

Fournis une analyse structurée en JSON avec les clés suivantes:
{
  "marketSize": {"value": "X M€", "growth": "X%", "trend": "croissant/décroissant/stable"},
  "topCompetitors": [
    {"name": "Nom", "strengths": ["Force 1"], "weaknesses": ["Faiblesse 1"]}
  ],
  "keyTrends": ["Tendance 1", "Tendance 2", "Tendance 3", "Tendance 4", "Tendance 5"],
  "opportunities": ["Opportunité 1", "Opportunité 2", "Opportunité 3"],
  "threats": ["Menace 1", "Menace 2"],
  "keyIndicators": [
    {"name": "Indicateur", "value": "Valeur", "source": "Source"}
  ],
  "sectorTips": ["Conseil 1", "Conseil 2", "Conseil 3"],
  "synthesis": "Synthèse de 3-4 phrases de l'analyse de marché"
}

Fournis exactement 5 compétiteurs et 5 tendances. Réponds UNIQUEMENT en JSON valide, sans markdown.`

  const zai = await ZAI.create()
  const completion = await zai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'claude-sonnet-4-20250514',
  })

  const text = completion.choices?.[0]?.message?.content || '{}'

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // Fall through to default
  }

  return {
    marketSize: { value: 'N/A', growth: 'N/A', trend: 'stable' },
    topCompetitors: [],
    keyTrends: [],
    opportunities: [],
    threats: [],
    keyIndicators: [],
    sectorTips: [],
    synthesis: text || 'Analyse non disponible',
  }
}
