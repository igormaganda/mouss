import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

// POST /api/upload/cv - Upload and analyze CV
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non identifié' },
        { status: 401, headers: corsHeaders }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez PDF, DOC ou DOCX.' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum 5 Mo.' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Convert file to base64 for storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // For now, do a simple skill extraction based on common keywords
    // In production, this would use an AI service to properly parse the CV
    const text = buffer.toString('utf-8')

    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'React', 'Angular', 'Vue',
      'Node.js', 'SQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
      'Git', 'Agile', 'Scrum', 'Management', 'Leadership', 'Communication',
      'Marketing', 'Sales', 'Finance', 'Accounting', 'Excel', 'PowerPoint',
      'Project Management', 'Data Analysis', 'Machine Learning', 'DevOps'
    ]

    const foundSkills = commonSkills.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase())
    )

    // Create or update skill gap analysis
    const analysis = await db.skillGapAnalysis.upsert({
      where: { userId },
      create: {
        userId,
        cvFileName: file.name,
        cvFileUrl: `data:${file.type};base64,${base64.substring(0, 100)}...`, // Store preview only
        acquiredSkills: foundSkills,
        gapSkills: commonSkills.filter(s => !foundSkills.includes(s)),
        recommendedPlan: {
          message: 'Analyse complétée avec succès',
          skillsFound: foundSkills.length,
          totalSkills: commonSkills.length
        }
      },
      update: {
        cvFileName: file.name,
        cvFileUrl: `data:${file.type};base64,${base64.substring(0, 100)}...`,
        acquiredSkills: foundSkills,
        gapSkills: commonSkills.filter(s => !foundSkills.includes(s)),
        recommendedPlan: {
          message: 'Analyse mise à jour',
          skillsFound: foundSkills.length,
          totalSkills: commonSkills.length
        },
        analyzedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileUrl: analysis.cvFileUrl,
      analysisId: analysis.id,
      analysis: {
        id: analysis.id,
        acquiredSkills: analysis.acquiredSkills as string[],
        gapSkills: analysis.gapSkills as string[],
        recommendedPlan: analysis.recommendedPlan as Record<string, unknown>,
        analyzedAt: analysis.analyzedAt
      }
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('CV upload error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement du CV' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// GET /api/upload/cv - Get latest CV analysis for user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non identifié' },
        { status: 401, headers: corsHeaders }
      )
    }

    const analysis = await db.skillGapAnalysis.findFirst({
      where: { userId },
      orderBy: { analyzedAt: 'desc' }
    })

    if (!analysis) {
      return NextResponse.json(
        { analysis: null },
        { headers: corsHeaders }
      )
    }

    return NextResponse.json({
      analysis: {
        id: analysis.id,
        cvFileName: analysis.cvFileName,
        acquiredSkills: analysis.acquiredSkills,
        gapSkills: analysis.gapSkills,
        recommendedPlan: analysis.recommendedPlan,
        analyzedAt: analysis.analyzedAt
      }
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Get CV analysis error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'analyse' },
      { status: 500, headers: corsHeaders }
    )
  }
}
