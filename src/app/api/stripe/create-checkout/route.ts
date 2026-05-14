import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const checkoutSchema = z.object({
  packId: z.string().min(1, "L'identifiant du pack est requis"),
  email: z.string().email("Email invalide"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = checkoutSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { packId, email } = result.data;

    // Find the pack
    const pack = await db.pack.findUnique({
      where: { id: packId },
    });

    if (!pack) {
      return NextResponse.json(
        { error: "Pack introuvable" },
        { status: 404 }
      );
    }

    if (!pack.active) {
      return NextResponse.json(
        { error: "Ce pack n'est plus disponible" },
        { status: 400 }
      );
    }

    // Generate session ID
    const sessionId = uuidv4();
    const orderId = uuidv4();

    // Create order in DB
    const order = await db.order.create({
      data: {
        id: orderId,
        packId: pack.id,
        amount: pack.price,
        currency: pack.currency,
        email,
        packName: pack.name,
        stripeSession: sessionId,
        status: "pending",
      },
    });

    // For free packs, complete immediately
    if (pack.price === 0) {
      await db.order.update({
        where: { id: order.id },
        data: { status: "completed" },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        sessionId,
        url: `/checkout/success?orderId=${order.id}`,
        isFree: true,
        status: "completed",
        message: "Votre compte gratuit a été activé avec succès !",
      });
    }

    // Simulated Stripe checkout URL
    // In production, this would call stripe.checkout.sessions.create()
    const checkoutUrl = `/checkout/success?orderId=${order.id}&sessionId=${sessionId}`;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      sessionId,
      url: checkoutUrl,
      isFree: false,
      status: "pending",
      message: "Session de paiement créée avec succès",
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}
