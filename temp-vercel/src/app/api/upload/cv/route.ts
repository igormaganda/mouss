import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Helper: extract text from PDF buffer ───
async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')).default
    const uint8 = new Uint8Array(buffer)
    const data = await pdfParse(uint8)
    return (data.text || '').trim()
  } catch (err) {
    console.error('PDF parse error:', err)
    return ''
  }
}

// ─── Helper: extract text from DOCX buffer ───
async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const uint8 = new Uint8Array(buffer)
    const result = await mammoth.extractRawText({ buffer: uint8 })
    return (result.value || '').trim()
  } catch (err) {
    console.error('DOCX parse error:', err)
    return ''
  }
}

// ─── Helper: extract text from DOC (legacy) buffer ───
async function extractDocText(buffer: ArrayBuffer): Promise<string> {
  const decoder = new TextDecoder('utf-8', { fatal: false })
  return decoder
    .decode(new Uint8Array(buffer))
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ')
    .trim()
}

// ─── Helper: analyse CV text with AI (z-ai-web-dev-sdk) ───
async function analyzeCvWithAI(
  cvText: string,
  fileName: string
): Promise<{
  acquiredSkills: string[]
  gapSkills: string[]
  recommendedPlan: Record<string, string>
}> {
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()

    const prompt = `Tu es un expert en analyse de CV pour la création d'entreprise.
Analyse le CV suivant et identifie :
1. Les compétences acquises par le candidat (liste JSON de chaînes)
2. Les compétences manquantes pour entreprendre (liste JSON de chaînes)
3. Un plan de formation recommandé (objet JSON clé:valeur, clé = compétence à développer, valeur = action de formation concrète)

Réponds UNIQUEMENT avec un JSON valide au format :
{
  "acquiredSkills": ["compétence1", "compétence2"],
  "gapSkills": ["compétence1", "compétence2"],
  "recommendedPlan": {
    "compétence manquante": "formation recommandée"
  }
}

Si le texte est trop court ou incompréhensible, fournis une analyse par défaut basée sur le nom du fichier.

Nom du fichier : ${fileName}

--- CONTENU DU CV ---
${cvText.slice(0, 8000)}`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Tu es un assistant expert en analyse de CV entrepreneurial. Réponds uniquement en JSON valide, sans markdown ni backticks.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    })

    const content = completion.choices?.[0]?.message?.content || ''
    // Extract JSON from response (handle possible markdown wrapping)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (err) {
    console.error('AI analysis error:', err)
  }

  // Fallback: default analysis
  return {
    acquiredSkills: ['Communication', 'Travail en équipe', 'Organisation', 'Adaptabilité'],
    gapSkills: ['Gestion financière', 'Marketing digital', 'Planification stratégique'],
    recommendedPlan: {
      'Gestion financière': 'Formation à la gestion comptable et financière (3 mois)',
      'Marketing digital': 'Atelier de marketing numérique et réseaux sociaux (2 mois)',
      'Planification stratégique': 'Accompagnement business plan avec un conseiller (1 mois)',
    },
  }
}

// ─── GET: fetch existing analysis for a user ───
export async function GET(request: NextRequest) {
  try {
    const queryUserId = request.nextUrl.searchParams.get('userId')
    if (!queryUserId) {
      return NextResponse.json({ analysis: null })
    }

    const analysis = await prisma.skillGapAnalysis.findFirst({
      where: { userId: queryUserId },
      orderBy: { analyzedAt: 'desc' },
    })

    if (!analysis) {
      return NextResponse.json({ analysis: null })
    }

    return NextResponse.json({
      analysis: {
        id: analysis.id,
        cvFileName: analysis.cvFileName,
        cvFileUrl: analysis.cvFileUrl,
        acquiredSkills: analysis.acquiredSkills,
        gapSkills: analysis.gapSkills,
        recommendedPlan: analysis.recommendedPlan,
        analyzedAt: analysis.analyzedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('GET /api/upload/cv error:', error)
    return NextResponse.json({ analysis: null })
  }
}

// ─── POST: upload CV, extract text, analyze, save ───
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userId = formData.get('userId') as string | null

    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non identifié. Veuillez vous reconnecter.' },
        { status: 401 }
      )
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 })
    }

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez PDF, DOC ou DOCX.' },
        { status: 400 }
      )
    }

    // Validate file size (5 MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum 5 Mo.' },
        { status: 400 }
      )
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer()

    // Extract text based on file type
    let cvText = ''
    if (file.type === 'application/pdf') {
      cvText = await extractPdfText(arrayBuffer)
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cvText = await extractDocxText(arrayBuffer)
    } else if (file.type === 'application/msword') {
      cvText = await extractDocText(arrayBuffer)
    }

    // If no text extracted, use filename as context
    if (!cvText || cvText.length < 20) {
      cvText = `CV importé: ${file.name}. Aucun texte n'a pu être extrait automatiquement.`
    }

    // Analyze with AI
    const aiResult = await analyzeCvWithAI(cvText, file.name)

    // Delete previous analyses for this user to keep only the latest
    await prisma.skillGapAnalysis.deleteMany({ where: { userId } })

    // Create new analysis record
    const analysis = await prisma.skillGapAnalysis.create({
      data: {
        userId: userId,
        cvFileName: file.name,
        cvFileUrl: `uploaded://${file.name}`,
        acquiredSkills: aiResult.acquiredSkills,
        gapSkills: aiResult.gapSkills,
        recommendedPlan: aiResult.recommendedPlan,
      },
    })

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileUrl: analysis.cvFileUrl,
      analysisId: analysis.id,
    })
  } catch (error) {
    console.error('POST /api/upload/cv error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
