import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp();
    if (!rateLimit("exit_intent:" + ip, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Trop de requetes. Reessayez plus tard." }, { status: 429 });
    }

    const body = await request.json();
    const { sessionId, email, page } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId requis" },
        { status: 400 }
      );
    }

    // Check if session already saw popup in the last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentLog = await db.exitIntentLog.findFirst({
      where: {
        sessionId,
        shown: true,
        createdAt: { gte: twentyFourHoursAgo },
      },
    });

    if (recentLog) {
      return NextResponse.json({ showPopup: false });
    }

    // Check for an active exit-intent coupon
    const coupon = await db.coupon.findFirst({
      where: {
        active: true,
        code: "BIENVENUE20",
        OR: [
          { maxUses: 0 },
          { usedCount: { lt: 500 } },
        ],
      },
    });

    // Create exit intent log
    await db.exitIntentLog.create({
      data: {
        sessionId,
        email: email || null,
        page: page || null,
        shown: true,
        couponUsed: coupon ? coupon.code : null,
      },
    });

    const couponData = coupon
      ? {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          description: coupon.description,
        }
      : null;

    return NextResponse.json({
      showPopup: true,
      coupon: couponData,
    });
  } catch (error) {
    console.error("Exit intent API error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
