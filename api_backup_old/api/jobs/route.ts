import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/jobs - Fetch job opportunities with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sector = searchParams.get('sector');
    const location = searchParams.get('location');
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (minSalary || maxSalary) {
      where.AND = [];
      if (minSalary) {
        (where.AND as Record<string, unknown>[]).push({
          salaryMin: { gte: parseInt(minSalary) },
        });
      }
      if (maxSalary) {
        (where.AND as Record<string, unknown>[]).push({
          salaryMax: { lte: parseInt(maxSalary) },
        });
      }
    }

    // Fetch jobs with pagination
    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
          applications: userId
            ? {
                where: { userId },
                select: { id: true, status: true },
              }
            : false,
        },
        orderBy: { postedAt: 'desc' },
        skip,
        take: limit,
      }),
      db.job.count({ where }),
    ]);

    // Format response
    const formattedJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      titleAr: job.titleAr,
      company: job.company,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency,
      description: job.description,
      requirements: job.requirements,
      url: job.url,
      source: job.source,
      postedAt: job.postedAt,
      expiresAt: job.expiresAt,
      skills: job.skills.map(s => ({
        id: s.skill.id,
        name: s.skill.name,
        nameAr: s.skill.nameAr,
        category: s.skill.category,
        required: s.required,
        importance: s.importance,
      })),
      userApplication: job.applications?.[0] || null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: formattedJobs,
        total,
        page,
        pageSize: limit,
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
