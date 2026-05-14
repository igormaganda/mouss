import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/pepites/[id] - Fetch single pepite details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const pepite = await db.pepite.findUnique({
      where: { id },
      include: {
        responses: userId
          ? {
              where: { userId },
              select: { category: true, createdAt: true },
            }
          : false,
      },
    });

    if (!pepite) {
      return NextResponse.json(
        { success: false, error: 'Pepite not found' },
        { status: 404 }
      );
    }

    // Get statistics about this pepite
    const stats = await db.pepiteResponse.groupBy({
      by: ['category'],
      where: { pepiteId: id },
      _count: {
        category: true,
      },
    });

    const response = {
      id: pepite.id,
      name: pepite.name,
      nameAr: pepite.nameAr,
      description: pepite.description,
      category: pepite.category,
      icon: pepite.icon,
      createdAt: pepite.createdAt,
      userResponse: pepite.responses?.[0]?.category || null,
      userResponseDate: pepite.responses?.[0]?.createdAt || null,
      stats: {
        have: stats.find(s => s.category === 'have')?._count.category || 0,
        want: stats.find(s => s.category === 'want')?._count.category || 0,
        not_priority: stats.find(s => s.category === 'not_priority')?._count.category || 0,
      },
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching pepite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pepite' },
      { status: 500 }
    );
  }
}
