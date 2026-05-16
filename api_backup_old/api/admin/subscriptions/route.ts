import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    const where: Prisma.SubscriptionWhereInput = {};

    if (status) {
      where.status = status;
    }

    const [subscriptions, total] = await Promise.all([
      db.subscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.subscription.count({ where }),
    ]);

    return NextResponse.json({
      subscriptions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin subscriptions error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des abonnements' },
      { status: 500 }
    );
  }
}
