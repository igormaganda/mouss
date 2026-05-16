import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/pepites - Fetch all pepites with user responses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Fetch all pepites
    const pepites = await db.pepite.findMany({
      orderBy: { category: 'asc' },
    });

    // Fetch user responses if userId is provided
    let userResponses: { pepiteId: string; category: string }[] = [];
    if (userId) {
      const responses = await db.pepiteResponse.findMany({
        where: { userId },
        select: {
          pepiteId: true,
          category: true,
        },
      });
      userResponses = responses;
    }

    // Combine pepites with user responses
    const pepitesWithResponses = pepites.map(pepite => ({
      id: pepite.id,
      name: pepite.name,
      nameAr: pepite.nameAr,
      description: pepite.description,
      category: pepite.category,
      icon: pepite.icon,
      userResponse: userResponses.find(r => r.pepiteId === pepite.id)?.category || null,
    }));

    return NextResponse.json({
      success: true,
      data: pepitesWithResponses,
    });
  } catch (error) {
    console.error('Error fetching pepites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pepites' },
      { status: 500 }
    );
  }
}

// POST /api/pepites - Save user's pepite response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, pepiteId, category } = body;

    if (!userId || !pepiteId || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, pepiteId, category' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['have', 'want', 'not_priority'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category. Must be: have, want, or not_priority' },
        { status: 400 }
      );
    }

    // Upsert the response
    const response = await db.pepiteResponse.upsert({
      where: {
        userId_pepiteId: {
          userId,
          pepiteId,
        },
      },
      update: {
        category,
      },
      create: {
        userId,
        pepiteId,
        category,
      },
    });

    return NextResponse.json({
      success: true,
      data: response,
      message: 'Pepite response saved successfully',
    });
  } catch (error) {
    console.error('Error saving pepite response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save pepite response' },
      { status: 500 }
    );
  }
}
