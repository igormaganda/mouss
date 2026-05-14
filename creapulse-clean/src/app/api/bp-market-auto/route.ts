import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

// POST: Auto-generate market data when sector is selected
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, sector, region, projectDesc } = body

    if (!userId || !sector) {
      return NextResponse.json(
        { error: 'userId et secteur requis' },
        { status: 400 }
      )
    }

    const regionStr = region ? `en ${region}` : 'en France'

    // Build the AI prompt
    const prompt = `Tu es un expert en études de marché et analyse sectorielle pour la création d'entreprise en France. Réalise une analyse de marché approfondie et structurée.

Secteur: ${sector}
Région: ${regionStr}
Description du projet: ${projectDesc || 'Non renseignée'}

Fournis une analyse complète en JSON avec exactement cette structure:
{
  "marketSize": {
    "value": "X M€",
    "growth": "X% par an",
    "trend": "croissant/décroissant/stable"
  },
  "topCompetitors": [
    {"name": "Nom de l'entreprise", "strengths": ["Force 1", "Force 2"], "weaknesses": ["Faiblesse 1", "Faiblesse 2"]}
  ],
  "keyTrends": [
    {"description": "Description de la tendance", "impact": "high/medium/low"}
  ],
  "opportunities": ["Opportunité 1", "Opportunité 2", "Opportunité 3"],
  "threats": ["Menace 1", "Menace 2"],
  "keyIndicators": [
    {"name": "Indicateur clé", "value": "Valeur", "source": "Source"}
  ],
  "sectorTips": ["Conseil spécifique 1", "Conseil spécifique 2", "Conseil spécifique 3"]
}

IMPORTANT: Fournis exactement 5 compétiteurs et 5 tendances clés. Les données doivent être réalistes et spécifiques au secteur ${sector}. Réponds UNIQUEMENT en JSON valide, sans blocs de code markdown ni texte supplémentaire.`

    // Call AI via ZAI SDK
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-sonnet-4-20250514',
    })

    const rawText = completion.choices?.[0]?.message?.content || ''

    // Parse the AI JSON response
    let marketData: Record<string, any>
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        marketData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in AI response')
      }
    } catch (parseErr) {
      console.error('Failed to parse market AI response:', parseErr)
      console.error('Raw response:', rawText)
      marketData = {
        marketSize: { value: 'Non disponible', growth: 'N/A', trend: 'stable' },
        topCompetitors: [],
        keyTrends: [],
        opportunities: [],
        threats: [],
        keyIndicators: [],
        sectorTips: [],
      }
    }

    // Find the active BusinessPlan for this user
    const plan = await db.businessPlan.findFirst({
      where: { userId, status: 'QUESTIONNAIRE' },
      orderBy: { updatedAt: 'desc' },
    })

    // Save to MarketAnalysis table
    const analysis = await db.marketAnalysis.create({
      data: {
        userId,
        planId: plan?.id || null,
        sector,
        region: region || null,
        projectDesc: projectDesc || null,
        marketSize: marketData.marketSize || { value: 'N/A', growth: 'N/A', trend: 'stable' },
        targetCustomers: [],
        competitors: marketData.topCompetitors || [],
        trends: marketData.keyTrends || [],
        opportunities: marketData.opportunities || [],
        threats: marketData.threats || [],
        swot: {},
        recommendations: marketData.sectorTips || [],
        confidenceScore: 75,
        synthesis: `Analyse de marché pour le secteur ${sector} ${regionStr}`,
      },
    })

    // Update the BusinessPlan's marketData field if a plan exists
    if (plan) {
      await db.businessPlan.update({
        where: { id: plan.id },
        data: {
          marketData,
          sector: plan.sector || sector,
        },
      })
    }

    return NextResponse.json({
      success: true,
      analysisId: analysis.id,
      marketData,
    })
  } catch (err) {
    console.error('POST bp-market-auto error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
