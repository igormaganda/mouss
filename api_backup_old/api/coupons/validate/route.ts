import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp();
    if (!rateLimit("coupon_validate:" + ip, 30, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Trop de requetes. Reessayez plus tard." }, { status: 429 });
    }

    const body = await request.json();
    const { code, packId, amount } = body;

    if (!code || amount === undefined) {
      return NextResponse.json(
        { valid: false, discount: 0, newTotal: amount, message: "Code et montant requis" },
        { status: 400 }
      );
    }

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        newTotal: amount,
        message: "Code promo invalide",
      });
    }

    if (!coupon.active) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        newTotal: amount,
        message: "Ce code promo n'est plus actif",
      });
    }

    const now = new Date();
    if (coupon.startDate && coupon.startDate > now) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        newTotal: amount,
        message: "Ce code promo n'est pas encore disponible",
      });
    }

    if (coupon.endDate && coupon.endDate < now) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        newTotal: amount,
        message: "Ce code promo a expiré",
      });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        newTotal: amount,
        message: "Ce code promo a atteint sa limite d'utilisation",
      });
    }

    if (coupon.packId && packId && coupon.packId !== packId) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        newTotal: amount,
        message: "Ce code promo n'est pas applicable à ce pack",
      });
    }

    if (coupon.minAmount > 0 && amount < coupon.minAmount) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        newTotal: amount,
        message: `Montant minimum de ${(coupon.minAmount / 100).toFixed(2)} € requis`,
      });
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.round((amount * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }

    // Ensure discount doesn't exceed amount
    discount = Math.min(discount, amount);
    const newTotal = amount - discount;

    return NextResponse.json({
      valid: true,
      discount,
      newTotal,
      message: coupon.description || `Code promo appliqué : -${coupon.type === "percentage" ? `${coupon.value}%` : `${(coupon.value / 100).toFixed(2)} €`}`,
      couponType: coupon.type,
      couponValue: coupon.value,
    });
  } catch (error) {
    console.error("Coupon validate error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
