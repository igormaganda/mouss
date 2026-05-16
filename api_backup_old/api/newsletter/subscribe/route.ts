import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Email invalide"),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, firstName, lastName } = parsed.data;

    // Check if already subscribed
    const existing = await db.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.active) {
        // Already active subscriber
        return NextResponse.json({
          success: true,
          message: "Deja inscrit",
        });
      }

      // Reactivate inactive subscriber
      await db.newsletter.update({
        where: { email },
        data: {
          active: true,
          firstName: firstName || existing.firstName,
          lastName: lastName || existing.lastName,
        },
      });

      // Also update User if registered
      await db.user.updateMany({
        where: { email },
        data: {
          newsletterSubscribed: true,
          newsletterSubscribedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Inscription reactivee !",
      });
    }

    // Create new Newsletter record
    await db.newsletter.create({
      data: {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
      },
    });

    // Also update User if registered
    await db.user.updateMany({
      where: { email },
      data: {
        newsletterSubscribed: true,
        newsletterSubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Inscription reussie !",
    });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
