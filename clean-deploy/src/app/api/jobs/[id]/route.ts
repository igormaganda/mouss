import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/jobs/[id] - Fetch single job details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const job = await db.job.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        applications: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Get similar jobs (same company or similar skills)
    const similarJobs = await db.job.findMany({
      where: {
        OR: [
          { company: job.company },
          {
            skills: {
              some: {
                skillId: { in: job.skills.map(s => s.skillId) },
              },
            },
          },
        ],
        id: { not: id },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        currency: true,
      },
    });

    const response = {
      ...job,
      skills: job.skills.map(s => ({
        id: s.skill.id,
        name: s.skill.name,
        nameAr: s.skill.nameAr,
        category: s.skill.category,
        required: s.required,
        importance: s.importance,
      })),
      userApplication: job.applications?.[0] || null,
      similarJobs,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}
