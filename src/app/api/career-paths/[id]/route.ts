import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/career-paths/[id] - Fetch single career path
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const careerPath = await db.careerPath.findUnique({
      where: { id },
      include: {
        nodes: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!careerPath) {
      return NextResponse.json(
        { success: false, error: 'Career path not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: careerPath,
    });
  } catch (error) {
    console.error('Error fetching career path:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch career path' },
      { status: 500 }
    );
  }
}

// PUT /api/career-paths/[id] - Update career path
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, color, isPrimary, nodes } = body;

    // Check if career path exists
    const existingPath = await db.careerPath.findUnique({
      where: { id },
    });

    if (!existingPath) {
      return NextResponse.json(
        { success: false, error: 'Career path not found' },
        { status: 404 }
      );
    }

    // If setting as primary, unset other primary paths
    if (isPrimary) {
      await db.careerPath.updateMany({
        where: { userId: existingPath.userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    // Update career path
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (isPrimary !== undefined) updateData.isPrimary = isPrimary;

    const careerPath = await db.careerPath.update({
      where: { id },
      data: updateData,
      include: {
        nodes: {
          orderBy: { position: 'asc' },
        },
      },
    });

    // Update nodes if provided
    if (nodes && Array.isArray(nodes)) {
      // Delete existing nodes and recreate
      await db.careerNode.deleteMany({
        where: { careerPathId: id },
      });

      await db.careerNode.createMany({
        data: nodes.map((node: Record<string, unknown>, index: number) => ({
          careerPathId: id,
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
      });

      // Fetch updated path with nodes
      const updatedPath = await db.careerPath.findUnique({
        where: { id },
        include: {
          nodes: {
            orderBy: { position: 'asc' },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedPath,
        message: 'Career path updated successfully',
      });
    }

    return NextResponse.json({
      success: true,
      data: careerPath,
      message: 'Career path updated successfully',
    });
  } catch (error) {
    console.error('Error updating career path:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update career path' },
      { status: 500 }
    );
  }
}

// DELETE /api/career-paths/[id] - Delete career path
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if career path exists
    const existingPath = await db.careerPath.findUnique({
      where: { id },
    });

    if (!existingPath) {
      return NextResponse.json(
        { success: false, error: 'Career path not found' },
        { status: 404 }
      );
    }

    // Delete the career path (nodes will be cascade deleted)
    await db.careerPath.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Career path deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting career path:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete career path' },
      { status: 500 }
    );
  }
}
