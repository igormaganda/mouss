import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/career-paths - Fetch user's career paths with nodes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const careerPaths = await db.careerPath.findMany({
      where: { userId },
      include: {
        nodes: {
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: careerPaths,
    });
  } catch (error) {
    console.error('Error fetching career paths:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch career paths' },
      { status: 500 }
    );
  }
}

// POST /api/career-paths - Create new career path
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, description, color, isPrimary, nodes } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, name' },
        { status: 400 }
      );
    }

    // If this is set as primary, unset other primary paths
    if (isPrimary) {
      await db.careerPath.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    // Create the career path with nodes
    const careerPath = await db.careerPath.create({
      data: {
        userId,
        name,
        description,
        color: color || '#10B981',
        isPrimary: isPrimary || false,
        nodes: nodes
          ? {
              create: nodes.map((node: Record<string, unknown>, index: number) => ({
                title: node.title as string,
                titleAr: node.titleAr as string | undefined,
                description: node.description as string | undefined,
                nodeType: (node.nodeType as string) || 'milestone',
                position: index,
                x: (node.x as number) || 0,
                y: (node.y as number) || 0,
                salaryMin: node.salaryMin as number | undefined,
                salaryMax: node.salaryMax as number | undefined,
                currency: (node.currency as string) || 'EUR',
                duration: node.duration as string | undefined,
                requirements: (node.requirements as string[]) || [],
                growthRate: node.growthRate as number | undefined,
                isCurrent: (node.isCurrent as boolean) || false,
                isTarget: (node.isTarget as boolean) || false,
              })),
            }
          : undefined,
      },
      include: {
        nodes: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: careerPath,
      message: 'Career path created successfully',
    });
  } catch (error) {
    console.error('Error creating career path:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create career path' },
      { status: 500 }
    );
  }
}
