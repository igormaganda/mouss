import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const verifySchema = z.object({
  sessionId: z.string().min(1, "L'identifiant de session est requis"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = verifySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { sessionId } = result.data;

    // Find order by session ID
    const order = await db.order.findUnique({
      where: { stripeSession: sessionId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Session introuvable" },
        { status: 404 }
      );
    }

    // Update order status to completed
    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        status: "completed",
      },
    });

    // Create a Payment record
    await db.payment.create({
      data: {
        id: order.id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: "succeeded",
        metadata: JSON.stringify({
          packId: order.packId,
          packName: order.packName,
          email: order.email,
          sessionId,
          verifiedAt: new Date().toISOString(),
        }),
        stripePaymentId: `pi_simulated_${sessionId}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Paiement vérifié avec succès",
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        amount: updatedOrder.amount,
        currency: updatedOrder.currency,
        packName: updatedOrder.packName,
      },
    });
  } catch (error) {
    console.error("Stripe verify error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification du paiement" },
      { status: 500 }
    );
  }
}
