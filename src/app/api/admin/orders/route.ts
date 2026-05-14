import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const pack = searchParams.get('pack') || '';

    const where: Prisma.OrderWhereInput = {};

    if (search) {
      where.email = { contains: search, mode: 'insensitive' };
    }
    if (status) {
      where.status = status;
    }
    if (pack) {
      where.packId = pack;
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: { payment: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des commandes' },
      { status: 500 }
    );
  }
}
