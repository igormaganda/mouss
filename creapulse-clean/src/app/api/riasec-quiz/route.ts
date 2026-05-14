import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// RIASEC Quiz Questions (60 questions, 10 per profile type)
const RIASEC_QUESTIONS: Array<{ id: string; text: string; type: string }> = [
  // Réaliste (R) - Questions 1-10
  { id: 'r1', text: 'J\'aime bricoler et réparer des objets mécaniques', type: 'R' },
  { id: 'r2', text: 'Je préfère travailler avec des outils ou des machines', type: 'R' },
  { id: 'r3', text: 'J\'aime les activités physiques et manuelles', type: 'R' },
  { id: 'r4', text: 'Je suis à l\'aise avec les travaux pratiques', type: 'R' },
  { id: 'r5', text: 'J\'aime construire des choses de mes mains', type: 'R' },
  { id: 'r6', text: 'Je préfère les tâches concrètes et tangibles', type: 'R' },
  { id: 'r7', text: 'J\'aime jardiner ou travailler en plein air', type: 'R' },
  { id: 'r8', text: 'Je suis intéressé par l\'artisanat', type: 'R' },
  { id: 'r9', text: 'J\'aime comprendre comment fonctionnent les machines', type: 'R' },
  { id: 'r10', text: 'Je préfère utiliser mes mains plutôt qu\'un ordinateur', type: 'R' },
  // Investigatif (I) - Questions 11-20
  { id: 'i1', text: 'J\'aime résoudre des problèmes complexes', type: 'I' },
  { id: 'i2', text: 'Je suis curieux de comprendre le fonctionnement des choses', type: 'I' },
  { id: 'i3', text: 'J\'aime analyser des données et des chiffres', type: 'I' },
  { id: 'i4', text: 'Je suis passionné par la recherche scientifique', type: 'I' },
  { id: 'i5', text: 'J\'aime observer et expérimenter', type: 'I' },
  { id: 'i6', text: 'Je préfère les activités intellectuelles', type: 'I' },
  { id: 'i7', text: 'J\'aime lire et apprendre de nouveaux sujets', type: 'I' },
  { id: 'i8', text: 'Je suis méthodique dans mon approche', type: 'I' },
  { id: 'i9', text: 'J\'aime les énigmes et les casse-têtes', type: 'I' },
  { id: 'i10', text: 'Je suis attiré par l\'innovation technologique', type: 'I' },
  // Artistique (A) - Questions 21-30
  { id: 'a1', text: 'J\'aime exprimer ma créativité', type: 'A' },
  { id: 'a2', text: 'Je suis sensible à l\'esthétique et au design', type: 'A' },
  { id: 'a3', text: 'J\'aime la musique, la peinture ou la photographie', type: 'A' },
  { id: 'a4', text: 'Je suis imaginatif et original', type: 'A' },
  { id: 'a5', text: 'J\'aime créer plutôt que suivre des instructions', type: 'A' },
  { id: 'a6', text: 'Je suis attiré par les métiers créatifs', type: 'A' },
  { id: 'a7', text: 'J\'aime écrire ou raconter des histoires', type: 'A' },
  { id: 'a8', text: 'Je suis spontané et non conventionnel', type: 'A' },
  { id: 'a9', text: 'J\'aime décorer et aménager des espaces', type: 'A' },
  { id: 'a10', text: 'Je suis sensible aux tendances visuelles', type: 'A' },
  // Social (S) - Questions 31-40
  { id: 's1', text: 'J\'aime aider et conseiller les autres', type: 'S' },
  { id: 's2', text: 'Je suis à l\'aise pour prendre la parole en public', type: 'S' },
  { id: 's3', text: 'Je préfère travailler en équipe', type: 'S' },
  { id: 's4', text: 'Je suis empathique et à l\'écoute', type: 'S' },
  { id: 's5', text: 'J\'aime enseigner ou transmettre des connaissances', type: 'S' },
  { id: 's6', text: 'Je suis patient et compréhensif', type: 'S' },
  { id: 's7', text: 'J\'aime le contact humain', type: 'S' },
  { id: 's8', text: 'Je suis naturellement diplomate', type: 'S' },
  { id: 's9', text: 'Je m\'intéresse aux métiers de la santé ou du social', type: 'S' },
  { id: 's10', text: 'Je suis motivé par l\'impact positif sur les autres', type: 'S' },
  // Entreprenant (E) - Questions 41-50
  { id: 'e1', text: 'J\'aime prendre des décisions et diriger', type: 'E' },
  { id: 'e2', text: 'Je suis convaincant et persuasif', type: 'E' },
  { id: 'e3', text: 'J\'aime organiser et planifier des projets', type: 'E' },
  { id: 'e4', text: 'Je suis ambitieux et orienté vers les résultats', type: 'E' },
  { id: 'e5', text: 'J\'aime négocier et convaincre', type: 'E' },
  { id: 'e6', text: 'Je suis à l\'aise avec la prise de risques', type: 'E' },
  { id: 'e7', text: 'J\'aime vendre des produits ou des idées', type: 'E' },
  { id: 'e8', text: 'Je suis naturellement leader', type: 'E' },
  { id: 'e9', text: 'Je m\'intéresse à la gestion et au management', type: 'E' },
  { id: 'e10', text: 'Je suis motivé par le succès financier', type: 'E' },
  // Conventionnel (C) - Questions 51-60
  { id: 'c1', text: 'J\'aime organiser et classer des informations', type: 'C' },
  { id: 'c2', text: 'Je suis attentif aux détails', type: 'C' },
  { id: 'c3', text: 'Je préfère les tâches structurées et planifiées', type: 'C' },
  { id: 'c4', text: 'J\'aime travailler avec des chiffres et des tableaux', type: 'C' },
  { id: 'c5', text: 'Je suis méthodique et rigoureux', type: 'C' },
  { id: 'c6', text: 'J\'aime suivre des procédures établies', type: 'C' },
  { id: 'c7', text: 'Je suis à l\'aise avec l\'administration', type: 'C' },
  { id: 'c8', text: 'J\'aime la comptabilité et la gestion financière', type: 'C' },
  { id: 'c9', text: 'Je préfère les environnements de travail organisés', type: 'C' },
  { id: 'c10', text: 'Je suis fidèle aux règles et aux normes', type: 'C' },
]

// GET: get quiz questions and user progress
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  return NextResponse.json({
    questions: RIASEC_QUESTIONS,
    totalQuestions: RIASEC_QUESTIONS.length,
    hasUserId: !!userId,
  })
}

// POST: save quiz answers and compute scores
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, answers } = body // answers: Record<questionId, 'yes'|'no'|number>
    if (!userId || !answers) return NextResponse.json({ error: 'userId et answers requis' }, { status: 400 })

    // Calculate scores per type
    const scores: Record<string, { yes: number; no: number; total: number }> = {}
    for (const q of RIASEC_QUESTIONS) {
      if (!scores[q.type]) scores[q.type] = { yes: 0, no: 0, total: 0 }
      scores[q.type].total++
      const answer = answers[q.id]
      if (answer === 'yes' || answer === true || (typeof answer === 'number' && answer >= 4)) {
        scores[q.type].yes++
      } else {
        scores[q.type].no++
      }
    }

    // Compute percentages
    const profiles = Object.entries(scores).map(([type, data]) => ({
      type,
      yes: data.yes,
      no: data.no,
      percent: Math.round((data.yes / data.total) * 100),
      isDominant: data.yes >= 7,
    })).sort((a, b) => b.yes - a.yes)

    // Find dominant types (top 2)
    const dominantTypes = profiles.filter((p) => p.isDominant).map((p) => p.type)

    // Save results
    const { PrismaClient: PC } = await import('@prisma/client')
    const prisma2 = new PC()
    await prisma2.riasecResult.deleteMany({ where: { userId } })
    for (const p of profiles) {
      await prisma2.riasecResult.create({
        data: {
          userId,
          profileType: p.type,
          score: p.yes,
          isDominant: p.isDominant,
        },
      })
    }

    return NextResponse.json({ profiles, dominantTypes, totalAnswered: Object.keys(answers).length })
  } catch (err) {
    console.error('RIASEC quiz error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
