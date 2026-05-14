import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/skills - Fetch all skills
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build filter conditions
    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch all skills
    const skills = await db.skill.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    // Fetch user's skills if userId is provided
    let userSkills: { skillId: string; level: number; source: string }[] = [];
    if (userId) {
      const userSkillsData = await db.userSkill.findMany({
        where: { userId },
        select: {
          skillId: true,
          level: true,
          source: true,
        },
      });
      userSkills = userSkillsData;
    }

    // Combine skills with user data
    const skillsWithUserData = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      nameAr: skill.nameAr,
      category: skill.category,
      userLevel: userSkills.find(s => s.skillId === skill.id)?.level || null,
      userSource: userSkills.find(s => s.skillId === skill.id)?.source || null,
    }));

    // Group by category
    const groupedSkills = skillsWithUserData.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      },
      {} as Record<string, typeof skillsWithUserData>
    );

    return NextResponse.json({
      success: true,
      data: {
        skills: skillsWithUserData,
        groupedByCategory: groupedSkills,
      },
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST /api/skills - Add skill to user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, skillId, level, source } = body;

    if (!userId || !skillId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, skillId' },
        { status: 400 }
      );
    }

    // Validate level
    if (level && (level < 1 || level > 5)) {
      return NextResponse.json(
        { success: false, error: 'Level must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate source
    const validSources = ['manual', 'cv', 'linkedin'];
    if (source && !validSources.includes(source)) {
      return NextResponse.json(
        { success: false, error: 'Invalid source. Must be: manual, cv, or linkedin' },
        { status: 400 }
      );
    }

    // Check if skill exists
    const skill = await db.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Upsert user skill
    const userSkill = await db.userSkill.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      update: {
        level: level || 1,
        source: source || 'manual',
      },
      create: {
        userId,
        skillId,
        level: level || 1,
        source: source || 'manual',
      },
      include: {
        skill: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: userSkill,
      message: 'Skill added to profile successfully',
    });
  } catch (error) {
    console.error('Error adding skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add skill' },
      { status: 500 }
    );
  }
}
