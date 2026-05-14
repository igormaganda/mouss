import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/billing/subscription?userId=demo
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Return demo data if userId is "demo" or no user is provided
    if (!userId || userId === "demo") {
      return NextResponse.json({
        subscription: {
          id: "sub_demo_1",
          status: "active",
          paymentMethod: "card",
          pack: {
            id: "pack_demo_ia",
            name: "Pack IA",
            slug: "pack-ia",
            tagline: "Intelligence artificielle pour entrepreneurs",
            price: 29,
            period: "mois",
            features: '["Génération de documents IA","Plan d\'affaires automatique","Plan marketing IA","Support prioritaire","Documents illimités","Accès API IA"]',
            highlighted: true,
          },
          currentPeriodStart: "2026-03-15T00:00:00.000Z",
          currentPeriodEnd: "2026-05-15T00:00:00.000Z",
          nextBillingDate: "2026-05-15T00:00:00.000Z",
          lastBillingDate: "2026-04-15T00:00:00.000Z",
          cancelAtPeriodEnd: false,
          last4: "4242",
          brand: "visa",
        },
      });
    }

    // Real user lookup
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: { in: ["active", "paused", "trialing", "past_due"] },
      },
      include: { pack: true },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    // Get last payment for card info
    const lastOrder = await db.order.findFirst({
      where: { subscriptionId: subscription.id, status: "completed" },
      include: { payments: { take: 1, orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });

    const lastPayment = lastOrder?.payments?.[0];

    return NextResponse.json({
      subscription: {
        ...subscription,
        last4: lastPayment?.last4 || null,
        brand: lastPayment?.brand || null,
      },
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'abonnement" },
      { status: 500 }
    );
  }
}
