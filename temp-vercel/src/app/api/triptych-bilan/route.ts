import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface SwipeResult {
  [cardId: string]: 'yes' | 'no' | 'maybe'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, phaseResults } = body // phaseResults: Array<{ phase: number, phaseKey: string, results: SwipeResult }>

    if (!userId || !phaseResults || !Array.isArray(phaseResults)) {
      return NextResponse.json({ error: 'userId et phaseResults requis' }, { status: 400 })
    }

    // 1. Collect all results and categorize by phase
    const allYes: string[] = []
    const allNo: string[] = []
    const allMaybe: string[] = []
    const phaseSummaries: {
      phase: number
      key: string
      total: number
      yes: number
      no: number
      maybe: number
      keptTitles: string[]
    }[] = []

    // Fetch all cards for reference
    const allCards = await db.swipeCard.findMany({
      where: { isActive: true },
    })
    const cardMap: Record<string, { title: string; phase: number; tags: string[] }> = {}
    allCards.forEach((c) => {
      cardMap[c.id] = { title: c.title, phase: c.phase, tags: c.tags }
    })

    for (const pr of phaseResults) {
      const entries = Object.entries(pr.results || {})
      let yesCount = 0
      let noCount = 0
      let maybeCount = 0
      const keptTitles: string[] = []

      for (const [cardId, value] of entries) {
        if (value === 'yes') {
          allYes.push(cardId)
          yesCount++
          if (cardMap[cardId]) keptTitles.push(cardMap[cardId].title)
        } else if (value === 'no') {
          allNo.push(cardId)
          noCount++
        } else if (value === 'maybe') {
          allMaybe.push(cardId)
          maybeCount++
        }
      }

      phaseSummaries.push({
        phase: pr.phase,
        key: pr.phaseKey,
        total: entries.length,
        yes: yesCount,
        no: noCount,
        maybe: maybeCount,
        keptTitles,
      })
    }

    // 2. Calculate Kiviat dimensions
    const phase1 = phaseSummaries.find((p) => p.phase === 1)
    const phase2 = phaseSummaries.find((p) => p.phase === 2)
    const phase3 = phaseSummaries.find((p) => p.phase === 3)

    const totalAnswered = phaseSummaries.reduce((s, p) => s + p.total, 0)
    const totalYes = phaseSummaries.reduce((s, p) => s + p.yes, 0)
    const totalMaybe = phaseSummaries.reduce((s, p) => s + p.maybe, 0)

    // Kiviat dimensions (6 axes)
    const kvalites = phase1 ? Math.round((phase1.yes / Math.max(phase1.total, 1)) * 100) : 0
    const kappetences = phase1
      ? Math.round(
          (allYes.filter((id) => cardMap[id] && cardMap[id].phase === 1).length /
            Math.max(phase1.total, 1)) *
            100
        )
      : 0
    const kdiversite = phase2 ? Math.round((phase2.yes / Math.max(phase2.total, 1)) * 100) : 0
    const kmetiers = phase3 ? Math.round((phase3.yes / Math.max(phase3.total, 1)) * 100) : 0
    const kengagement = Math.round(((totalYes + totalMaybe * 0.5) / Math.max(totalAnswered, 1)) * 100)
    const kvision = phase1
      ? Math.min(
          100,
          Math.round(
            ((allYes.filter((id) => {
              const tags = cardMap[id]?.tags || []
              return (
                tags.some((t) => ['vision', 'strategie', 'anticipation', 'leadership'].includes(t.toLowerCase()))
              )
            }).length +
              allYes.filter((id) => {
                const tags = cardMap[id]?.tags || []
                return tags.some((t) => ['finance', 'tresorerie', 'organisation', 'negociation'].includes(t.toLowerCase()))
              }).length) /
              2 /
              Math.max(phase1.total * 0.3, 1)) *
              100
          )
        )
      : 0

    // Save Kiviat results
    const kiviatDimensions = [
      { dimension: 'Qualités entrepreneuriales', value: kvalites, maxValue: 100 },
      { dimension: 'Compétences clés', value: kappetences, maxValue: 100 },
      { dimension: 'Diversité des appétences', value: kdiversite, maxValue: 100 },
      { dimension: 'Adéquation métiers', value: kmetiers, maxValue: 100 },
      { dimension: 'Engagement global', value: kengagement, maxValue: 100 },
      { dimension: 'Vision stratégique', value: kvision, maxValue: 100 },
    ]

    // Clear existing Kiviat data for this user and save new
    await db.kiviatResult.deleteMany({ where: { userId } })
    for (const dim of kiviatDimensions) {
      await db.kiviatResult.create({
        data: {
          userId,
          dimension: dim.dimension,
          value: dim.value,
          maxValue: dim.maxValue,
        },
      })
    }

    // 3. Generate AI bilan using z-ai-web-dev-sdk
    let aiBilan = ''
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      const zai = await ZAI.create()

      const prompt = `Tu es un conseiller entrepreneurial expert. Un utilisateur vient de compléter le "Jeu de Pépites" triptyque sur CréaPulse.

RÉSULTATS DÉTAILLÉS :

Phase 1 — Pépites (Qualités entrepreneuriales) :
- ${phase1?.yes || 0} qualités retenues sur ${phase1?.total || 0}
- Qualités gardées : ${phase1?.keptTitles.join(', ') || 'aucune'}

Phase 2 — Appétences (Centres d'intérêt professionnels) :
- ${phase2?.yes || 0} appétences retenues sur ${phase2?.total || 0}
- Appétences gardées : ${phase2?.keptTitles.join(', ') || 'aucune'}

Phase 3 — Métiers (Secteurs cibles) :
- ${phase3?.yes || 0} métiers retenus sur ${phase3?.total || 0}
- Métiers gardés : ${phase3?.keptTitles.join(', ') || 'aucune'}

Indécisions : ${totalMaybe} carte(s) marquée(s) "Je ne sais pas"

Scores Kiviat :
- Qualités entrepreneuriales : ${kvalites}%
- Compétences clés : ${kappetences}%
- Diversité des appétences : ${kdiversite}%
- Adéquation métiers : ${kmetiers}%
- Engagement global : ${kengagement}%
- Vision stratégique : ${kvision}%

Rédige un bilan entrepreneurial personnalisé et motivant en français (3-4 paragraphes) :
1. Synthèse du profil entrepreneurial de l'utilisateur
2. Forces principales identifiées
3. Axes de développement et recommandations concrètes
4. Secteurs et métiers les plus adaptés à son profil

Sois précis, bienveillant et actionnable. Ne dépasse pas 500 mots.`

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'Tu es un conseiller entrepreneurial expert de CréaPulse. Tu analyses les résultats du Jeu de Pépites pour produire un bilan personnalisé, motivant et actionnable. Tu écris en français.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      aiBilan = completion.choices?.[0]?.message?.content || ''
    } catch (aiErr) {
      console.error('AI bilan generation error:', aiErr)
      aiBilan = generateFallbackBilan(phaseSummaries, kiviatDimensions)
    }

    // 4. Save bilan to module results
    await db.moduleResult.upsert({
      where: {
        id: `${userId}-triptych-bilan`,
        sessionId: userId,
        moduleType: 'TRIPTYCH_BILAN',
      },
      update: {
        data: {
          phaseResults: phaseSummaries,
          kiviat: kiviatDimensions,
          aiBilan,
        },
        completedAt: new Date(),
      },
      create: {
        sessionId: userId,
        moduleType: 'TRIPTYCH_BILAN',
        data: {
          phaseResults: phaseSummaries,
          kiviat: kiviatDimensions,
          aiBilan,
        },
        completedAt: new Date(),
      },
    }).catch(() => {
      // If upsert fails, just create
      return db.moduleResult.create({
        data: {
          sessionId: userId,
          moduleType: 'TRIPTYCH_BILAN',
          data: {
            phaseResults: phaseSummaries,
            kiviat: kiviatDimensions,
            aiBilan,
          },
          completedAt: new Date(),
        },
      })
    })

    return NextResponse.json({
      bilan: aiBilan,
      kiviat: kiviatDimensions,
      phaseSummaries,
      totalYes,
      totalAnswered,
    })
  } catch (err) {
    console.error('POST triptych-bilan error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// Fallback bilan when AI is unavailable
function generateFallbackBilan(
  summaries: { phase: number; key: string; total: number; yes: number; no: number; maybe: number; keptTitles: string[] }[],
  kiviat: { dimension: string; value: number; maxValue: number }[]
): string {
  const p1 = summaries.find((s) => s.phase === 1)
  const p2 = summaries.find((s) => s.phase === 2)
  const p3 = summaries.find((s) => s.phase === 3)

  const kEngagement = kiviat.find((k) => k.dimension === 'Engagement global')
  const engagementPct = kEngagement ? kEngagement.value : 0

  let profil = 'profil en exploration'
  if (engagementPct >= 70) profil = 'profil entrepreneur engagé'
  else if (engagementPct >= 50) profil = 'profil prometteur'
  else if (engagementPct >= 30) profil = 'profil en cours de définition'

  return `## Votre bilan entrepreneurial

Vous avez un **${profil}** avec un engagement global de ${engagementPct}%.

**Vos qualités entrepreneuriales** (${p1?.yes || 0} retenues) : ${p1?.keptTitles.join(', ') || 'à explorer'}.

**Vos centres d'intérêt** (${p2?.yes || 0} retenus) : ${p2?.keptTitles.join(', ') || 'à définir'}.

**Vos métiers cibles** (${p3?.yes || 0} retenus) : ${p3?.keptTitles.join(', ') || 'à préciser'}.

Ce bilan est une première étape vers la construction de votre projet. Partagez-le avec votre conseiller pour approfondir l'analyse et définir un plan d'action personnalisé.`
}
