import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const rewardSchema = z.object({
  orderId: z.string().min(1, "OrderId requis"),
  email: z.string().email("Email invalide"),
});

// POST: Process referral reward when referee makes a qualifying purchase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = rewardSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId, email } = result.data;

    // Find pending referral for this email
    const referral = await db.referral.findFirst({
      where: {
        refereeEmail: email.toLowerCase(),
        status: "pending",
      },
      include: { program: true },
    });

    if (!referral) {
      return NextResponse.json({ success: true, message: "Aucun parrainage en attente pour cet email" });
    }

    // Check program settings
    const program = referral.program;
    if (program && !program.active) {
      return NextResponse.json({ success: true, message: "Programme desactive" });
    }

    // Check if order qualifies (minimum amount)
    if (program && program.minOrderAmount > 0) {
      const order = await db.order.findUnique({
        where: { id: orderId },
      });
      if (!order || order.amount < program.minOrderAmount) {
        return NextResponse.json({
          success: true,
          message: "Montant minimum non atteint pour la recompense",
        });
      }
    }

    const rewardValue = program?.rewardValue ?? 10;

    // Update referral status to completed
    const updatedReferral = await db.referral.update({
      where: { id: referral.id },
      data: {
        status: "completed",
        referrerReward: true,
        refereeReward: true,
        amount: rewardValue,
        orderId,
      },
    });

    // Create notification for referrer
    const referrer = await db.user.findUnique({
      where: { id: referral.referrerId },
    });

    if (referrer) {
      await db.userNotification.create({
        data: {
          userId: referrer.id,
          title: "Parrainage complete !",
          message: `Votre filleul ${email} a complete une action qualifiante. Vous avez gagne ${rewardValue}€ de credit !`,
          type: "success",
          category: "referral",
          priority: "normal",
          actionUrl: "/dashboard",
          actionLabel: "Voir mes parrainages",
        },
      });
    }

    // Create notification for referee
    const refereeUser = referral.refereeId
      ? await db.user.findUnique({ where: { id: referral.refereeId } })
      : null;

    if (refereeUser) {
      await db.userNotification.create({
        data: {
          userId: refereeUser.id,
          title: "Bonus de parrainage !",
          message: `Merci d'avoir utilise le code de parrainage. Vous avez gagne ${program?.refereeRewardValue ?? 10}€ de credit !`,
          type: "success",
          category: "referral",
          priority: "normal",
          actionUrl: "/dashboard",
          actionLabel: "Voir mes credits",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Recompense de parrainage accordee",
      reward: rewardValue,
    });
  } catch (error) {
    console.error("Referral reward error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
