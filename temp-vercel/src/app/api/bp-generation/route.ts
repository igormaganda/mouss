import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'
import { BusinessPlanStatus, SectionStatus } from '@prisma/client'

// Section definitions with titles and prompt instructions
const SECTION_DEFINITIONS = [
  {
    type: 'resume_executif',
    title: 'Résumé Exécutif',
    usesMarketData: false,
    promptInstruction: `Rédige un résumé exécutif convaincant de 300-400 mots qui capte l'essence du projet.
Il doit inclure:
- L'opportunité identifiée
- La proposition de valeur unique
- Le marché cible
- Les perspectives financières
- La demande d'investissement ou financement
Le ton doit être professionnel, concis et percutant. C'est la première section lue, elle doit donner envie de continuer.`,
  },
  {
    type: 'presentation',
    title: 'Présentation du Projet',
    usesMarketData: false,
    promptInstruction: `Rédige une présentation détaillée du projet entrepreneurial (500-700 mots).
Structure:
1. Concept et vision du projet
2. Problème identifié et solution proposée
3. Proposition de valeur unique
4. Public cible et bénéficiaires
5. Innovations apportées (technologiques, sociales, environnementales)
6. Aspects RSE (Responsabilité Sociétale des Entreprises) si applicable
Sois précis et inspirant, en utilisant les données du questionnaire.`,
  },
  {
    type: 'etude_marche',
    title: 'Étude de Marché',
    usesMarketData: true,
    promptInstruction: `Rédige une étude de marché complète et détaillée (600-800 mots) en t'appuyant sur les données de marché fournies.
Structure:
1. Taille et dynamique du marché
2. Segmentation et clients cibles
3. Analyse de la concurrence (forces et faiblesses)
4. Tendances clés du secteur
5. Opportunités et menaces identifiées
6. Positionnement stratégique proposé
Utilise les données concrètes fournies (chiffres, pourcentages, acteurs).`,
  },
  {
    type: 'strategie',
    title: 'Stratégie Générale',
    usesMarketData: false,
    promptInstruction: `Rédige la stratégie générale du projet (500-700 mots).
Structure:
1. Vision et objectifs à 1, 3 et 5 ans
2. Avantages concurrentiels
3. Stratégie de différenciation
4. Modèle économique (B2B, B2C, B2B2C, marketplace, etc.)
5. Partenariats stratégiques potentiels
6. Barrières à l'entrée
Sois concret et réaliste, avec des objectifs SMART.`,
  },
  {
    type: 'strategy_marketing',
    title: 'Stratégie Marketing',
    usesMarketData: false,
    promptInstruction: `Rédige la stratégie marketing et commerciale (500-700 mots).
Structure:
1. Stratégie de marque et identité
2. Canaux d'acquisition et de communication
3. Stratégie de prix
4. Plan de lancement et communication
5. Stratégie digitale (SEO, réseaux sociaux, publicité en ligne)
6. Fidélisation et rétention client
Adapte les recommandations au secteur et au budget du porteur de projet.`,
  },
  {
    type: 'strategy_operationnelle',
    title: 'Stratégie Opérationnelle',
    usesMarketData: false,
    promptInstruction: `Rédige la stratégie opérationnelle (500-600 mots).
Structure:
1. Localisation et infrastructure
2. Organisation et équipes (postes clés, recrutement)
3. Processus de production/prestation de services
4. Chaîne d'approvisionnement et fournisseurs
5. Outils et technologies nécessaires
6. Plan de qualité et indicateurs de performance
Sois pragmatique et adapté à la phase de démarrage du projet.`,
  },
  {
    type: 'previsionnel',
    title: 'Prévisionnel Financier',
    usesMarketData: false,
    promptInstruction: `Rédige une analyse financière structurée (500-700 mots) basée sur les données du questionnaire.
Structure:
1. Hypothèses de chiffre d'affaires (année 1, 2, 3)
2. Charges principales (salaires, loyer, marketing, approvisionnement, assurances)
3. Seuil de rentabilité estimé
4. Besoins en fonds de roulement
5. Plan de trésorerie sur 12 mois
6. Ratios financiers clés (marge, ROI, CA par employé)
Présente les chiffres de manière claire avec des tableaux ou listes structurées.
Format de réponse: JSON avec les clés: "text" (texte narratif), "yearlyProjections" (array de {year, revenue, expenses, netResult, margin})`,
  },
  {
    type: 'plan_financement',
    title: 'Plan de Financement',
    usesMarketData: false,
    promptInstruction: `Rédige le plan de financement (400-600 mots).
Structure:
1. Besoins financiers totaux au démarrage
2. Sources de financement envisagées:
   - Apport personnel
   - Love money (famille/amis)
   - Prêts bancaires (prêt d'amorçage Bpifrance, etc.)
   - Aides et subventions (ACRE, ARE, ARCE, etc.)
   - Investisseurs (business angels, crowdfunding)
3. Plan de remboursement
4. Calendrier de décaissement
5. Scénarios de financement (optimiste/réaliste/pessimiste)
Adapte les recommandations au profil du porteur de projet (demandeur d'emploi, auto-entrepreneur, etc.).`,
  },
  {
    type: 'risques',
    title: 'Analyse des Risques',
    usesMarketData: true,
    promptInstruction: `Rédige une analyse des risques complète (400-500 mots).
Structure:
1. Identification des risques principaux:
   - Risques commerciaux (marché, concurrence)
   - Risques financiers (trésorerie, rentabilité)
   - Risques opérationnels (production, équipe)
   - Risques juridiques et réglementaires
   - Risques technologiques
2. Probabilité et impact de chaque risque
3. Plans de mitigation et contingence
4. Assurance et protection juridique
Utilise les données de marché pour contextualiser les risques sectoriels.`,
  },
  {
    type: 'conclusion',
    title: 'Conclusion et Feuille de Route',
    usesMarketData: false,
    promptInstruction: `Rédige une conclusion motivante et une feuille de route opérationnelle (400-500 mots).
Structure:
1. Synthèse des points forts du projet
2. Étapes clés de lancement (chronogramme sur 6 mois)
3. Prochaines actions immédiates
4. Indicateurs de succès à suivre
5. Mot de fin encourageant et vision à long terme
Le ton doit être dynamique, actionnable et inspirant pour le porteur de projet.`,
  },
] as const

// POST: Generate the full business plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, planId } = body

    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'userId et planId requis' },
        { status: 400 }
      )
    }

    // Fetch the BusinessPlan
    const plan = await db.businessPlan.findUnique({
      where: { id: planId, userId },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan d\'affaires introuvable' },
        { status: 404 }
      )
    }

    // Update status to GENERATING
    await db.businessPlan.update({
      where: { id: planId },
      data: { status: BusinessPlanStatus.GENERATING },
    })

    const answers = (plan.answers as Record<string, any>) || {}
    const marketData = (plan.marketData as Record<string, any>) || {}

    // Build the project context for all sections
    const projectContext = buildProjectContext(answers, marketData, plan)

    const zai = await ZAI.create()
    const generatedSections: Array<{
      type: string
      title: string
      content: any
      status: string
    }> = []

    // Generate all sections in sequence
    for (const sectionDef of SECTION_DEFINITIONS) {
      try {
        // Create section record with GENERATING status
        const sectionRecord = await db.businessPlanSection.upsert({
          where: {
            planId_sectionType: {
              planId,
              sectionType: sectionDef.type,
            },
          },
          create: {
            planId,
            sectionType: sectionDef.type,
            title: sectionDef.title,
            content: {},
            status: SectionStatus.GENERATING,
            aiGenerated: true,
          },
          update: {
            status: SectionStatus.GENERATING,
            aiGenerated: true,
            version: { increment: 1 },
          },
        })

        // Build the prompt for this section
        const marketDataStr = sectionDef.usesMarketData
          ? `\n\nDONNÉES DE MARCHÉ À UTILISER:\n${JSON.stringify(marketData, null, 2)}`
          : ''

        const prompt = `Tu es un consultant expert en création d'entreprise. Tu rédiges des sections de business plan professionnelles en français.

CONTEXTE DU PROJET:
${projectContext}
${marketDataStr}

${sectionDef.promptInstruction}

Réponds en JSON avec la structure suivante:
{
  "text": "Le contenu rédigé de la section en markdown",
  "keyPoints": ["Point clé 1", "Point clé 2", "Point clé 3"],
  "highlights": ["Élément marquant 1", "Élément marquant 2"]
}

Si la section concerne le prévisionnel financier, utilise cette structure:
{
  "text": "Le contenu rédigé en markdown",
  "yearlyProjections": [{"year": 1, "revenue": 0, "expenses": 0, "netResult": 0, "margin": 0}],
  "keyPoints": ["Point clé 1"],
  "highlights": ["Élément marquant 1"]
}

Réponds UNIQUEMENT en JSON valide, sans blocs de code markdown.`

        const completion = await zai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'claude-sonnet-4-20250514',
        })

        const rawText = completion.choices?.[0]?.message?.content || '{}'

        // Parse the section content
        let sectionContent: Record<string, any>
        try {
          const jsonMatch = rawText.match(/\{[\s\S]*\}/)
          sectionContent = jsonMatch
            ? JSON.parse(jsonMatch[0])
            : { text: rawText, keyPoints: [], highlights: [] }
        } catch {
          sectionContent = { text: rawText, keyPoints: [], highlights: [] }
        }

        // Save the completed section
        await db.businessPlanSection.update({
          where: { id: sectionRecord.id },
          data: {
            content: sectionContent,
            status: SectionStatus.COMPLETED,
          },
        })

        generatedSections.push({
          type: sectionDef.type,
          title: sectionDef.title,
          content: sectionContent,
          status: 'COMPLETED',
        })
      } catch (sectionErr) {
        console.error(`Failed to generate section ${sectionDef.type}:`, sectionErr)

        // Save the section with NEEDS_REVIEW status
        await db.businessPlanSection.upsert({
          where: {
            planId_sectionType: {
              planId,
              sectionType: sectionDef.type,
            },
          },
          create: {
            planId,
            sectionType: sectionDef.type,
            title: sectionDef.title,
            content: { text: 'Erreur lors de la génération. Veuillez réessayer.' },
            status: SectionStatus.NEEDS_REVIEW,
            aiGenerated: true,
          },
          update: {
            status: SectionStatus.NEEDS_REVIEW,
          },
        })

        generatedSections.push({
          type: sectionDef.type,
          title: sectionDef.title,
          content: { text: 'Erreur lors de la génération' },
          status: 'NEEDS_REVIEW',
        })
      }
    }

    // Update the BusinessPlan status to COMPLETED
    await db.businessPlan.update({
      where: { id: planId },
      data: { status: BusinessPlanStatus.COMPLETED },
    })

    // Fetch all sections for the final response
    const allSections = await db.businessPlanSection.findMany({
      where: { planId },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({
      success: true,
      planId,
      status: 'COMPLETED',
      sections: allSections,
      generatedCount: generatedSections.filter((s) => s.status === 'COMPLETED').length,
      totalSections: SECTION_DEFINITIONS.length,
    })
  } catch (err) {
    console.error('POST bp-generation error:', err)

    // Attempt to reset the plan status on failure
    try {
      const { planId } = await request.json().catch(() => ({ planId: null }))
      if (planId) {
        await db.businessPlan.update({
          where: { id: planId },
          data: { status: BusinessPlanStatus.DRAFT },
        })
      }
    } catch {
      // Silently ignore reset errors
    }

    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// Helper: Build a project context string from questionnaire answers
function buildProjectContext(
  answers: Record<string, any>,
  marketData: Record<string, any>,
  plan: { projectName: string; sector: string; slogan: string | null }
): string {
  const parts: string[] = []

  parts.push(`Nom du projet: ${plan.projectName}`)
  if (plan.slogan) parts.push(`Slogan: ${plan.slogan}`)
  parts.push(`Secteur: ${plan.sector}`)

  // Add all answers in a structured way
  for (const [key, value] of Object.entries(answers)) {
    if (key === 'sector' || key === 'projectName' || key === 'slogan') continue
    if (typeof value === 'string' && value.trim()) {
      parts.push(`${key}: ${value}`)
    } else if (Array.isArray(value) && value.length > 0) {
      parts.push(`${key}: ${value.join(', ')}`)
    } else if (typeof value === 'object' && value !== null) {
      parts.push(`${key}: ${JSON.stringify(value)}`)
    }
  }

  return parts.join('\n')
}
