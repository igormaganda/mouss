import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "subscriptionId est requis" },
        { status: 400 }
      );
    }

    // Verify subscription exists
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
      include: { pack: true, user: true, lead: true },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Abonnement introuvable" },
        { status: 404 }
      );
    }

    if (subscription.status === "cancelled") {
      return NextResponse.json(
        { error: "Cet abonnement est déjà annulé" },
        { status: 400 }
      );
    }

    const now = new Date();

    // Update subscription
    const updated = await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: true,
        cancelledAt: now,
        status: "cancelled",
        nextBillingDate: null,
      },
      include: { pack: true, user: true, lead: true },
    });

    return NextResponse.json({
      subscription: updated,
      message: "L'abonnement sera annulé à la fin de la période en cours",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de l'abonnement" },
      { status: 500 }
    );
  }
}
