import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const packId = searchParams.get("packId");

    const now = new Date();

    const coupons = await db.coupon.findMany({
      where: {
        active: true,
        ...(packId ? { packId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    // Filter for valid coupons: within date range, not maxed out
    const validCoupons = coupons.filter((coupon) => {
      if (coupon.startDate && coupon.startDate > now) return false;
      if (coupon.endDate && coupon.endDate < now) return false;
      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return false;
      return true;
    });

    return NextResponse.json(validCoupons);
  } catch (error) {
    console.error("Coupons fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
