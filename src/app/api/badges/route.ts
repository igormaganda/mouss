import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/badges - Fetch all badges with user's earned badges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Fetch all badges
    const badges = await db.badge.findMany({
      orderBy: [{ type: 'asc' }, { points: 'desc' }],
    });

    // Fetch user's earned badges if userId is provided
    let earnedBadges: { badgeId: string; earnedAt: Date }[] = [];
    if (userId) {
      const userBadges = await db.userBadge.findMany({
        where: { userId },
        select: {
          badgeId: true,
          earnedAt: true,
        },
      });
      earnedBadges = userBadges;
    }

    // Combine badges with user data
    const badgesWithUserData = badges.map(badge => {
      const earnedBadge = earnedBadges.find(eb => eb.badgeId === badge.id);
      return {
        id: badge.id,
        name: badge.name,
        nameAr: badge.nameAr,
        description: badge.description,
        icon: badge.icon,
        type: badge.type,
        criteria: badge.criteria,
        points: badge.points,
        earned: !!earnedBadge,
        earnedAt: earnedBadge?.earnedAt || null,
      };
    });

    // Group by type
    const groupedBadges = badgesWithUserData.reduce(
      (acc, badge) => {
        if (!acc[badge.type]) {
          acc[badge.type] = [];
        }
        acc[badge.type].push(badge);
        return acc;
      },
      {} as Record<string, typeof badgesWithUserData>
    );

    // Calculate user stats
    const userStats = {
      totalBadges: badges.length,
      earnedBadges: earnedBadges.length,
      totalPoints: badgesWithUserData
        .filter(b => b.earned)
        .reduce((sum, b) => sum + b.points, 0),
    };

    return NextResponse.json({
      success: true,
      data: {
        badges: badgesWithUserData,
        groupedByType: groupedBadges,
        stats: userStats,
      },
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}
