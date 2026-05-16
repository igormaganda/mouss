import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schema for project creation
const createProjectSchema = z.object({
  name: z.string().min(2, 'Le nom du projet doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  sector: z.string().optional(),
  subSector: z.string().optional(),
  projectType: z.enum(['creation', 'reprise', 'franchise', 'auto_enterprise']).optional(),
  targetMarket: z.string().optional(),
  valueProposition: z.string().optional(),
});

// Demo user ID for when auth is not implemented
const DEMO_USER_ID = 'demo-user';

// GET /api/projects - Get all projects for a user
export async function GET(request: NextRequest) {
  try {
    // In a real app, get userId from session
    const userId = request.headers.get('x-user-id') || DEMO_USER_ID;
    
    const projects = await db.entrepreneurProject.findMany({
      where: { userId },
      include: {
        businessPlans: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        marketStudies: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        registrations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des projets', data: [] },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createProjectSchema.parse(body);
    
    // In a real app, get userId from session
    const userId = request.headers.get('x-user-id') || DEMO_USER_ID;
    
    // Create project in database
    const newProject = await db.entrepreneurProject.create({
      data: {
        userId,
        name: validatedData.name,
        description: validatedData.description || null,
        sector: validatedData.sector || null,
        subSector: validatedData.subSector || null,
        projectType: validatedData.projectType || null,
        targetMarket: validatedData.targetMarket || null,
        valueProposition: validatedData.valueProposition || null,
        status: 'idea',
        advancementLevel: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: newProject,
      message: 'Projet créé avec succès'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du projet' },
      { status: 500 }
    );
  }
}
