import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ANTHROPIC_API_KEY = '8c3e54b9923a4ce6baf8464e08f00842.DDb9ovEKOWhEJviE'
const ANTHROPIC_BASE_URL = 'https://api.z.ai/api/anthropic'
const MODEL = 'claude-sonnet-4-20250514'

const SYSTEM_PROMPTS: Record<string, string> = {
  portfolio: `Tu es l'IA Co-Pilote de CréaPulse, assistant un conseiller dans l'analyse de son portefeuille de porteurs de projet.
Tu dois fournir:
- Une vue d'ensemble synthétique des porteurs assignés
- Des alertes sur les porteurs nécessitant une attention particulière (inactivité, GoNoGo négatif, faible progression)
- Des recommandations de priorisation pour les entretiens
- Des statistiques agrégées sur l'avancement global
- Des suggestions d'actions groupées (ateliers, annonces, relances)
Réponds en français avec un ton professionnel et structuré. Utilise des listes à puces et des sections claires.`,

  entretien: `Tu es l'IA Co-Pilote de CréaPulse, assistant un conseiller dans la préparation d'un entretien avec un porteur de projet.
Tu dois fournir:
- Des questions suggérées adaptées au profil du porteur (basées sur les lacunes identifiées dans le profil RIASEC, Kiviat, compétences)
- Des points d'attention issus des données de diagnostic (GoNoGo, Business Plan, entretiens précédents)
- Des recommandations sur le type d'entretien à mener
- Des pistes de conversation basées sur les notes d'entretiens précédents
- Des alertes si des zones critiques nécessitent une exploration approfondie
Réponds en français. Structure ta réponse avec des sections: "Questions suggérées", "Points d'attention", "Recommandations".`,

  'go-nogo': `Tu es l'IA Co-Pilote de CréaPulse, assistant un conseiller dans la prise de décision Go/No-Go pour un porteur de projet.
Tu dois fournir:
- Une recommandation consolidée GO / NO-GO / À APPROFONDIR
- Une analyse multi-critères basée sur: profil RIASEC, compétences (Kiviat), Business Plan, analyse de marché, prévisionnel financier, résultats des entretiens
- Les points forts et points faibles majeurs
- Les risques identifiés et propositions d'atténuation
- Les conditions éventuelles pour un GO (accompagnement spécifique, formation, etc.)
- Une synthèse en 3-5 phrases utilisable comme décision formelle
Réponds en français. Sois objectif et factuel. Utilise les données fournies pour justifier chaque point.`,

  synthese: `Tu es l'IA Co-Pilote de CréaPulse, assistant un conseiller dans l'élaboration d'une synthèse complète d'un porteur de projet.
Tu dois fournir:
- Un profil entrepreneurial complet du porteur
- L'analyse détaillée de chaque dimension: RIASEC, Kiviat (compétences), SwipeGame (motivations), Business Plan, Marché, Financier, GoNoGo
- Les points forts et axes d'amélioration identifiés
- L'historique des entretiens et les tendances d'évolution
- Les notes du conseiller et les actions de suivi en cours
- Un plan d'action personnalisé avec priorités
- Une recommandation finale sur la viabilité du projet et le parcours recommandé
Réponds en français avec une structure complète et professionnelle. Formatte avec des titres, sous-titres et listes.`,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { counselorId, userId, context } = body

    if (!counselorId || !userId || !context) {
      return NextResponse.json(
        { error: 'Les champs counselorId, userId et context sont requis' },
        { status: 400 }
      )
    }

    const validContexts = ['portfolio', 'entretien', 'go-nogo', 'synthese']
    if (!validContexts.includes(context)) {
      return NextResponse.json(
        { error: `Le context doit être l'un de: ${validContexts.join(', ')}` },
        { status: 400 }
      )
    }

    // Fetch ALL porteur data in parallel
    const [
      user,
      riasecResults,
      kiviatResults,
      businessPlans,
      goNoGoEvaluations,
      swipeGameResults,
      interviewSessions,
      interviewNotes,
      counselorNotes,
      diagnosisSessions,
      moduleResults,
      marketAnalyses,
    ] = await Promise.all([
      // User info
      db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatarUrl: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),

      // RIASEC results
      db.riasecResult.findMany({
        where: { userId },
        orderBy: { score: 'desc' },
      }),

      // Kiviat results
      db.kiviatResult.findMany({
        where: { userId },
      }),

      // Business Plans
      db.businessPlan.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      }),

      // GoNoGo Evaluations
      db.goNoGoEvaluation.findMany({
        where: { userId },
        orderBy: { evaluatedAt: 'desc' },
      }),

      // SwipeGame Results
      db.swipeGameResult.findMany({
        where: { userId, kept: true },
      }),

      // Interview Sessions
      db.interviewSession.findMany({
        where: { counselorId, userId },
        orderBy: { createdAt: 'desc' },
      }),

      // Interview Notes (for all sessions of this user with this counselor)
      db.interviewNote.findMany({
        where: {
          session: { counselorId, userId },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Counselor Notes
      db.counselorNote.findMany({
        where: { counselorId, userId },
        orderBy: { createdAt: 'desc' },
      }),

      // Diagnosis Sessions
      db.diagnosisSession.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),

      // Module Results
      db.moduleResult.findMany({
        where: { session: { userId } },
        orderBy: { completedAt: 'desc' },
      }),

      // Market Analyses
      db.marketAnalysis.findMany({
        where: { userId },
        orderBy: { analyzedAt: 'desc' },
      }),
    ])

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      )
    }

    // Build comprehensive context prompt
    const userName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email

    let contextData = `## Informations du Porteur
- Nom: ${userName}
- Email: ${user.email}
- Téléphone: ${user.phone || 'Non renseigné'}
- Inscrit le: ${user.createdAt.toLocaleDateString('fr-FR')}
- Dernière connexion: ${user.lastLoginAt?.toLocaleDateString('fr-FR') || 'Jamais'}
- Statut: ${user.isActive ? 'Actif' : 'Inactif'}
`

    // RIASEC
    if (riasecResults.length > 0) {
      const dominant = riasecResults.filter((r) => r.isDominant)
      contextData += `\n## Profil RIASEC
`
      for (const r of riasecResults) {
        contextData += `- ${r.profileType}: ${r.score} points${r.isDominant ? ' (dominant)' : ''}\n`
      }
      if (dominant.length > 0) {
        contextData += `Profil dominant: ${dominant.map((r) => r.profileType).join(' / ')}\n`
      }
    } else {
      contextData += '\n## Profil RIASEC\nNon complété\n'
    }

    // Kiviat
    if (kiviatResults.length > 0) {
      contextData += '\n## Compétences (Kiviat)\n'
      for (const k of kiviatResults) {
        const percent = k.maxValue > 0 ? Math.round((k.value / k.maxValue) * 100) : 0
        contextData += `- ${k.dimension}: ${k.value}/${k.maxValue} (${percent}%)\n`
      }
    } else {
      contextData += '\n## Compétences (Kiviat)\nNon complétées\n'
    }

    // Business Plan
    if (businessPlans.length > 0) {
      const latestBP = businessPlans[0]
      contextData += `\n## Business Plan (le plus récent)
- Nom du projet: ${latestBP.projectName}
- Secteur: ${latestBP.sector}
- Slogan: ${latestBP.slogan || 'Non défini'}
- Statut: ${latestBP.status}
- Progression: ${latestBP.completedSteps}/${latestBP.totalSteps} étapes
- Dernière MAJ: ${latestBP.updatedAt.toLocaleDateString('fr-FR')}
`
    } else {
      contextData += '\n## Business Plan\nNon commencé\n'
    }

    // GoNoGo
    if (goNoGoEvaluations.length > 0) {
      const latestGNG = goNoGoEvaluations[0]
      contextData += `\n## Évaluation Go/No-Go (la plus récente)
- Décision: ${latestGNG.decision}
- Score pondéré: ${latestGNG.weightedScore}/100
- Raison: ${latestGNG.reason || 'Non renseignée'}
- Date: ${latestGNG.evaluatedAt.toLocaleDateString('fr-FR')}
`
    } else {
      contextData += '\n## Évaluation Go/No-Go\nNon effectuée\n'
    }

    // SwipeGame
    if (swipeGameResults.length > 0) {
      contextData += '\n## Compétences Sélectionnées (Jeu de Pépites)\n'
      for (const s of swipeGameResults) {
        contextData += `- ${s.skillName}\n`
      }
    }

    // Interview Sessions
    if (interviewSessions.length > 0) {
      contextData += `\n## Entretiens (${interviewSessions.length} au total)
`
      for (const i of interviewSessions) {
        const notesCount = interviewNotes.filter((n) => n.sessionId === i.id).length
        contextData += `- [${i.type}] ${i.status} — ${i.scheduledAt?.toLocaleDateString('fr-FR') || 'Non planifié'} | ${i.duration ?? '?'} min | ${notesCount} notes\n`
      }
    } else {
      contextData += '\n## Entretiens\nAucun entretien\n'
    }

    // Interview Notes (last 20)
    const recentNotes = interviewNotes.slice(0, 20)
    if (recentNotes.length > 0) {
      contextData += '\n## Notes d\'Entretiens (20 dernières)\n'
      for (const n of recentNotes) {
        contextData += `- [${n.category}/${n.phase}] ${n.isAction ? '⏎ ACTION' : '📝'} ${n.isDone ? '✅' : ''} ${n.isPinned ? '📌' : ''}: ${n.content}\n`
      }
    }

    // Counselor Notes
    if (counselorNotes.length > 0) {
      contextData += '\n## Notes Privées du Conseiller\n'
      for (const n of counselorNotes.slice(0, 10)) {
        contextData += `- [${n.createdAt.toLocaleDateString('fr-FR')}]: ${n.content}\n`
      }
    }

    // Diagnosis Sessions
    if (diagnosisSessions.length > 0) {
      const completedSessions = diagnosisSessions.filter((s) => s.status === 'COMPLETED')
      contextData += `\n## Sessions de Diagnostic
- Total: ${diagnosisSessions.length} | Complétées: ${completedSessions.length}
`
      for (const s of diagnosisSessions) {
        const modCount = moduleResults.filter((m) => m.sessionId === s.id).length
        contextData += `- [${s.type}] ${s.status} — ${s.startedAt.toLocaleDateString('fr-FR')} | Score: ${s.score ?? '-'} | ${modCount} modules\n`
      }
    }

    // Market Analysis
    if (marketAnalyses.length > 0) {
      const latestMarket = marketAnalyses[0]
      contextData += `\n## Analyse de Marché (la plus récente)
- Secteur: ${latestMarket.sector}
- Score de confiance: ${latestMarket.confidenceScore}%
- Date: ${latestMarket.analyzedAt.toLocaleDateString('fr-FR')}
`
    }

    // Select the right system prompt
    const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.synthese

    // Build the user message
    const userMessage = `Analyse le dossier complet du porteur de projet ci-dessous et fournis ton analyse selon le contexte "${context}".

${contextData}

Fournis une analyse détaillée, actionnable et structurée.`

    // Call Anthropic API
    const response = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la communication avec l\'IA' },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Extract text from response
    const text = data.content
      ?.filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('') || 'Pas de réponse générée'

    // Build alerts based on data
    const alerts: string[] = []

    if (!user.lastLoginAt) {
      alerts.push('Le porteur ne s\'est jamais connecté')
    } else {
      const daysSinceLogin = Math.floor(
        (Date.now() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceLogin > 30) {
        alerts.push(`Inactif depuis ${daysSinceLogin} jours`)
      }
    }

    if (riasecResults.length === 0) {
      alerts.push('Profil RIASEC non complété')
    }
    if (kiviatResults.length === 0) {
      alerts.push('Compétences (Kiviat) non évaluées')
    }
    if (businessPlans.length === 0) {
      alerts.push('Business Plan non commencé')
    } else if (businessPlans[0].status === 'QUESTIONNAIRE') {
      alerts.push('Business Plan en cours de questionnaire')
    }
    if (goNoGoEvaluations.length === 0) {
      alerts.push('Évaluation Go/No-Go non effectuée')
    } else if (goNoGoEvaluations[0].decision === 'NO_GO') {
      alerts.push('Dernière évaluation Go/No-Go: défavorable')
    }
    if (interviewSessions.length === 0) {
      alerts.push('Aucun entretien réalisé')
    }

    const pendingActions = interviewNotes.filter(
      (n) => n.isAction && !n.isDone
    ).length
    if (pendingActions > 3) {
      alerts.push(`${pendingActions} actions de suivi en attente`)
    }

    return NextResponse.json({
      content: text,
      context,
      model: MODEL,
      usage: data.usage,
      alerts,
      porteurSummary: {
        id: user.id,
        name: userName,
        hasRiasec: riasecResults.length > 0,
        hasKiviat: kiviatResults.length > 0,
        hasBusinessPlan: businessPlans.length > 0,
        hasGoNoGo: goNoGoEvaluations.length > 0,
        hasMarketAnalysis: marketAnalyses.length > 0,
        interviewCount: interviewSessions.length,
        completedInterviews: interviewSessions.filter((i) => i.status === 'COMPLETED').length,
        pendingActions,
        lastLoginAt: user.lastLoginAt,
      },
    })
  } catch (error) {
    console.error('Erreur lors de l\'analyse IA:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
