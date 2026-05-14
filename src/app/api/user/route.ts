import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/user - Fetch current user profile
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

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        badges: {
          include: {
            badge: true,
          },
        },
        careerPaths: {
          include: {
            nodes: {
              orderBy: { position: 'asc' },
            },
          },
        },
        careerIdentity: true,
        pepites: {
          select: {
            pepiteId: true,
            category: true,
          },
        },
        _count: {
          select: {
            jobApplications: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Format response
    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      persona: user.persona,
      language: user.language,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      skills: user.skills.map(s => ({
        id: s.skill.id,
        name: s.skill.name,
        nameAr: s.skill.nameAr,
        category: s.skill.category,
        level: s.level,
        source: s.source,
      })),
      badges: user.badges.map(b => ({
        id: b.badge.id,
        name: b.badge.name,
        nameAr: b.badge.nameAr,
        description: b.badge.description,
        icon: b.badge.icon,
        type: b.badge.type,
        points: b.badge.points,
        earnedAt: b.earnedAt,
      })),
      careerPaths: user.careerPaths,
      careerIdentity: user.careerIdentity,
      pepites: {
        have: user.pepites.filter(p => p.category === 'have').map(p => p.pepiteId),
        want: user.pepites.filter(p => p.category === 'want').map(p => p.pepiteId),
        notPriority: user.pepites.filter(p => p.category === 'not_priority').map(p => p.pepiteId),
      },
      stats: {
        totalJobApplications: user._count.jobApplications,
        totalSkills: user.skills.length,
        totalBadges: user.badges.length,
      },
    };

    return NextResponse.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PUT /api/user - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, avatar, persona, language } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate persona if provided
    const validPersonas = ['Explorateur', 'Lanceur', 'Pivot', 'Ambitieux'];
    if (persona && !validPersonas.includes(persona)) {
      return NextResponse.json(
        { success: false, error: 'Invalid persona. Must be: Explorateur, Lanceur, Pivot, or Ambitieux' },
        { status: 400 }
      );
    }

    // Validate language if provided
    const validLanguages = ['fr', 'ar'];
    if (language && !validLanguages.includes(language)) {
      return NextResponse.json(
        { success: false, error: 'Invalid language. Must be: fr or ar' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (persona !== undefined) updateData.persona = persona;
    if (language !== undefined) updateData.language = language;

    // Update user
    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
