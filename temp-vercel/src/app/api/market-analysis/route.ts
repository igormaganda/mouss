import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/auth-middleware'

// GET — fetch latest market analysis for the authenticated user.
// Returns the full analysis record so the frontend can restore its state.
export async function GET(request: NextRequest) {
  const { authenticated, payload, error } = authenticateRequest(request)
  if (!authenticated) return error!

  try {
    const analysis = await db.marketAnalysis.findFirst({
      where: { userId: payload!.userId },
      orderBy: { createdAt: 'desc' },
    })

    if (!analysis) {
      return NextResponse.json({ analysis: null })
    }

    // Reconstruct the analysisData shape the frontend expects from the stored columns
    const analysisData = {
      sector: analysis.sector,
      region: analysis.region,
      projectDesc: analysis.projectDesc,
      marketSize: analysis.marketSize,
      targetCustomers: analysis.targetCustomers,
      competitors: analysis.competitors,
      trends: analysis.trends,
      opportunities: analysis.opportunities,
      threats: analysis.threats,
      swot: analysis.swot,
      recommendations: analysis.recommendations,
      confidenceScore: analysis.confidenceScore,
      synthesis: analysis.synthesis,
    }

    return NextResponse.json({ analysis: analysisData })
  } catch (err) {
    console.error('Get market analysis error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// POST — save (upsert) a market analysis to the database.
// Frontend sends: { sector, region?, description?, analysisData, confidenceScore }
// analysisData contains: marketOverview, targetCustomers, competitors, trends, swot,
//   keyIndicators, recommendations, confidenceScore, synthesis, etc.
export async function POST(request: NextRequest) {
  const { authenticated, payload, error } = authenticateRequest(request)
  if (!authenticated) return error!

  try {
    const body = await request.json()
    const {
      sector,
      region,
      description,
      analysisData,
      confidenceScore,
    } = body

    if (!sector) {
      return NextResponse.json({ error: 'Le secteur est requis' }, { status: 400 })
    }

    const data = analysisData ?? {}

    // Map the frontend's analysisData shape to Prisma model columns.
    const marketSize = data.marketOverview ?? data.marketSize ?? {}
    const targetCustomers = data.targetCustomers ?? []
    const competitors = data.competitors ?? []
    const trends = data.trends ?? []
    const opportunities = data.opportunities ?? (data.swot?.opportunities ?? [])
    const threats = data.threats ?? (data.swot?.threats ?? [])
    const swot = data.swot ?? {}
    const recommendations = data.recommendations ?? []
    const synthesis = data.synthesis ?? null
    const score = typeof confidenceScore === 'number' ? confidenceScore
      : typeof data.confidenceScore === 'number' ? data.confidenceScore
      : 0

    // findFirst + create/update (no unique constraint on userId alone)
    const existing = await db.marketAnalysis.findFirst({
      where: { userId: payload!.userId, sector },
      orderBy: { createdAt: 'desc' },
    })

    let analysis
    if (existing) {
      analysis = await db.marketAnalysis.update({
        where: { id: existing.id },
        data: {
          region: region || null,
          projectDesc: description || null,
          marketSize: marketSize as Record<string, unknown>,
          targetCustomers: targetCustomers as unknown[],
          competitors: competitors as unknown[],
          trends: trends as unknown[],
          opportunities: opportunities as unknown[],
          threats: threats as unknown[],
          swot: swot as Record<string, unknown>,
          recommendations: recommendations as unknown[],
          confidenceScore: score,
          synthesis,
        },
      })
    } else {
      analysis = await db.marketAnalysis.create({
        data: {
          userId: payload!.userId,
          sector,
          region: region || null,
          projectDesc: description || null,
          marketSize: marketSize as Record<string, unknown>,
          targetCustomers: targetCustomers as unknown[],
          competitors: competitors as unknown[],
          trends: trends as unknown[],
          opportunities: opportunities as unknown[],
          threats: threats as unknown[],
          swot: swot as Record<string, unknown>,
          recommendations: recommendations as unknown[],
          confidenceScore: score,
          synthesis,
        },
      })
    }

    return NextResponse.json({
      analysis: {
        id: analysis.id,
        sector: analysis.sector,
        region: analysis.region,
        projectDesc: analysis.projectDesc,
        marketSize: analysis.marketSize,
        targetCustomers: analysis.targetCustomers,
        competitors: analysis.competitors,
        trends: analysis.trends,
        opportunities: analysis.opportunities,
        threats: analysis.threats,
        swot: analysis.swot,
        recommendations: analysis.recommendations,
        confidenceScore: analysis.confidenceScore,
        synthesis: analysis.synthesis,
      },
    }, { status: 201 })
  } catch (err) {
    console.error('Save market analysis error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
