import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/security";

export async function GET() {
  try {
    await requireAdmin();

    const coupons = await db.coupon.findMany({
      include: {
        _count: { select: { usages: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get coupon usage stats for this month
    const usageThisMonth = await db.couponUsage.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _count: { id: true },
      _sum: { discountAmount: true },
    });

    // Get total discount ever
    const totalDiscount = await db.couponUsage.aggregate({
      _sum: { discountAmount: true },
    });

    const activeCoupons = coupons.filter((c) => c.active).length;
    const usedThisMonth = usageThisMonth._count.id;
    const totalDiscountValue = totalDiscount._sum.discountAmount || 0;

    const enrichedCoupons = coupons.map((coupon) => ({
      ...coupon,
      totalUsages: coupon._count.usages,
    }));

    return NextResponse.json({
      coupons: enrichedCoupons,
      stats: {
        total: coupons.length,
        active: activeCoupons,
        usedThisMonth,
        totalDiscount: totalDiscountValue,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Admin coupons fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      code,
      type,
      value,
      description,
      packId,
      minAmount,
      maxUses,
      startDate,
      endDate,
      active,
    } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { error: "Code, type et valeur sont requis" },
        { status: 400 }
      );
    }

    const existingCoupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCoupon) {
      return NextResponse.json(
        { error: "Ce code promo existe déjà" },
        { status: 409 }
      );
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: parseInt(value, 10),
        description: description || null,
        packId: packId || null,
        minAmount: parseInt(minAmount, 10) || 0,
        maxUses: parseInt(maxUses, 10) || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Admin coupon create error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
