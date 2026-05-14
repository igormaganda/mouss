import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const results: { entity: string; action: string; id: string; name: string }[] = [];

    // Seed exit-intent coupon
    const existingCoupon = await db.coupon.findUnique({
      where: { code: "BIENVENUE20" },
    });

    if (!existingCoupon) {
      const coupon = await db.coupon.create({
        data: {
          code: "BIENVENUE20",
          type: "percentage",
          value: 20,
          description: "Offre exit-intent -20%",
          active: true,
          maxUses: 500,
          startDate: new Date(),
        },
      });
      results.push({ entity: "Coupon", action: "cree", id: coupon.id, name: coupon.code });
    } else {
      results.push({ entity: "Coupon", action: "existe deja", id: existingCoupon.id, name: existingCoupon.code });
    }

    // Seed UpsellOffer 1: Audit → Pro
    const existingOffer1 = await db.upsellOffer.findFirst({
      where: { name: "Audit vers Pro" },
    });

    if (!existingOffer1) {
      const offer1 = await db.upsellOffer.create({
        data: {
          name: "Audit vers Pro",
          sourcePage: "audit",
          triggerPhase: "reflexion",
          triggerScore: null,
          targetPackSlug: "pro",
          message: "Votre projet en est au stade d'idee. Le pack Pro vous accompagne avec un audit approfondi et un plan d'action personnalise.",
          discountPercent: 15,
          active: true,
          priority: 10,
        },
      });
      results.push({ entity: "UpsellOffer", action: "cree", id: offer1.id, name: offer1.name });
    } else {
      results.push({ entity: "UpsellOffer", action: "existe deja", id: existingOffer1.id, name: existingOffer1.name });
    }

    // Seed UpsellOffer 2: Audit → Premium
    const existingOffer2 = await db.upsellOffer.findFirst({
      where: { name: "Audit vers Premium" },
    });

    if (!existingOffer2) {
      const offer2 = await db.upsellOffer.create({
        data: {
          name: "Audit vers Premium",
          sourcePage: "audit",
          triggerPhase: null,
          triggerScore: 60,
          targetPackSlug: "premium",
          message: "Votre score d'audit est excellent ! Passez au niveau superieur avec Premium et maximisez vos chances de reussite.",
          discountPercent: 10,
          active: true,
          priority: 20,
        },
      });
      results.push({ entity: "UpsellOffer", action: "cree", id: offer2.id, name: offer2.name });
    } else {
      results.push({ entity: "UpsellOffer", action: "existe deja", id: existingOffer2.id, name: existingOffer2.name });
    }

    return NextResponse.json({
      success: true,
      message: `${results.length} elements traites`,
      results,
    });
  } catch (error) {
    console.error("Exit intent seed error:", error);
    return NextResponse.json(
      { error: "Erreur lors du seed" },
      { status: 500 }
    );
  }
}
