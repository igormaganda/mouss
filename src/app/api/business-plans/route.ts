import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { analyzeBusinessPlan, type BusinessPlanInput } from '@/lib/business-plan-ai';

// Validation schema for business plan analysis
const analyzeBusinessPlanSchema = z.object({
  projectId: z.string(),
  projectName: z.string().min(2),
  sector: z.string(),
  projectType: z.string().optional(),
  description: z.string().optional(),
  targetMarket: z.string().optional(),
  valueProposition: z.string().optional(),
  revenueModel: z.string().optional(),
  initialInvestment: z.number().optional(),
  monthlyRevenue: z.number().optional(),
  teamSize: z.string().optional(),
  competition: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
});

// POST /api/business-plans/analyze - Analyze business plan with real AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = analyzeBusinessPlanSchema.parse(body);
    
    // Use real AI analysis
    const analysis = await analyzeBusinessPlan({
      projectName: validatedData.projectName,
      sector: validatedData.sector,
      projectType: validatedData.projectType,
      description: validatedData.description,
      targetMarket: validatedData.targetMarket,
      valueProposition: validatedData.valueProposition,
      revenueModel: validatedData.revenueModel,
      initialInvestment: validatedData.initialInvestment,
      monthlyRevenue: validatedData.monthlyRevenue,
      teamSize: validatedData.teamSize,
      competition: validatedData.competition,
      strengths: validatedData.strengths,
      weaknesses: validatedData.weaknesses,
    });
    
    // Save business plan to database
    const businessPlan = await db.businessPlan.create({
      data: {
        projectId: validatedData.projectId,
        executiveSummary: `${validatedData.projectName} - Analyse IA générée le ${new Date().toLocaleDateString('fr-FR')}`,
        presentation: {
          projectName: validatedData.projectName,
          sector: validatedData.sector,
          projectType: validatedData.projectType,
          description: validatedData.description,
        },
        marketAnalysis: {
          targetMarket: validatedData.targetMarket,
          competition: validatedData.competition,
        },
        financials: {
          initialInvestment: validatedData.initialInvestment,
          monthlyRevenue: validatedData.monthlyRevenue,
          revenueModel: validatedData.revenueModel,
        },
        score: analysis.score,
        status: 'completed',
        aiAnalysis: analysis,
        improvements: analysis.recommendations.map(r => ({
          section: 'general',
          priority: 'medium' as const,
          suggestion: r,
        })),
      },
    });

    // Update project viability score if project exists
    try {
      await db.entrepreneurProject.update({
        where: { id: validatedData.projectId },
        data: { viabilityScore: analysis.score },
      });
    } catch {
      // Project might not exist, that's ok for demo
    }

    return NextResponse.json({
      success: true,
      data: {
        businessPlan,
        analysis
      },
      message: 'Analyse IA terminée avec succès'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Error analyzing business plan:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'analyse du business plan' },
      { status: 500 }
    );
  }
}

// GET /api/business-plans - Get business plans for a project
export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'projectId requis' },
        { status: 400 }
      );
    }

    const businessPlans = await db.businessPlan.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: businessPlans
    });
  } catch (error) {
    console.error('Error fetching business plans:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des business plans' },
      { status: 500 }
    );
  }
}
