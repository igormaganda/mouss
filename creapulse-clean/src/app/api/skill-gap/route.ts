import { NextRequest, NextResponse } from 'next/server'

interface SkillGapRequest {
  cvText?: string
  currentSkills: string[]
  targetRole: string
  sector?: string
}

interface Skill {
  name: string
  level: 'débutant' | 'intermédiaire' | 'avancé' | 'expert'
  priority: 'haute' | 'moyenne' | 'basse'
}

interface TrainingAction {
  skill: string
  action: string
  duration: string
  resource: string
}

// Predefined skill maps per role
const roleSkills: Record<string, { required: string[]; common: string[] }> = {
  'entrepreneur': {
    required: ['Gestion financière', 'Marketing digital', 'Leadership', 'Planification stratégique', 'Négociation'],
    common: ['Communication', 'Gestion de projet', 'Analyse de données'],
  },
  'dirigeant': {
    required: ['Direction générale', 'Finance corporate', 'RH & Management', 'Stratégie de croissance', 'Gouvernance'],
    common: ['Communication', 'Gestion de projet', 'Analyse de données'],
  },
  default: {
    required: ['Compétences techniques', 'Gestion de projet', 'Communication', 'Leadership'],
    common: ['Esprit d\'analyse', 'Adaptabilité', 'Travail en équipe'],
  },
}

export async function POST(request: NextRequest) {
  try {
    const body: SkillGapRequest = await request.json()
    const { cvText, currentSkills = [], targetRole = 'default', sector } = body

    const roleMap = roleSkills[targetRole] || roleSkills.default
    const allRequired = [...roleMap.required, ...roleMap.common]

    // Match acquired skills (simple fuzzy match)
    const acquiredSkills: Skill[] = allRequired
      .filter((required) =>
        currentSkills.some(
          (current) =>
            required.toLowerCase().includes(current.toLowerCase()) ||
            current.toLowerCase().includes(required.toLowerCase())
        )
      )
      .map((name) => ({
        name,
        level: 'intermédiaire' as const,
        priority: 'basse' as const,
      }))

    // Identify gaps
    const gapSkills: Skill[] = allRequired
      .filter(
        (required) =>
          !currentSkills.some(
            (current) =>
              required.toLowerCase().includes(current.toLowerCase()) ||
              current.toLowerCase().includes(required.toLowerCase())
          )
      )
      .map((name) => ({
        name,
        level: 'débutant' as const,
        priority: roleMap.required.includes(name) ? ('haute' as const) : ('moyenne' as const),
      }))

    // Generate recommended plan
    const recommendedPlan: TrainingAction[] = gapSkills
      .sort((a, b) => (a.priority === 'haute' ? -1 : 1))
      .slice(0, 6)
      .map((skill) => ({
        skill: skill.name,
        action: `Formation certifiante en ${skill.name}`,
        duration: skill.priority === 'haute' ? '3-6 mois' : '1-3 mois',
        resource: sector
          ? `Ressource sectorielle: ${sector}`
          : 'Plateforme en ligne ou organisme de formation',
      }))

    return NextResponse.json({
      targetRole,
      summary: {
        totalRequired: allRequired.length,
        acquired: acquiredSkills.length,
        gaps: gapSkills.length,
        coveragePercent: +((acquiredSkills.length / allRequired.length) * 100).toFixed(1),
      },
      acquiredSkills,
      gapSkills,
      recommendedPlan,
      overallLevel:
        gapSkills.length === 0
          ? 'Profil complet'
          : gapSkills.filter((s) => s.priority === 'haute').length > 3
            ? 'Formation intensive requise'
            : 'Profil en cours de développement',
    })
  } catch (error) {
    console.error('Skill gap analysis error:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
