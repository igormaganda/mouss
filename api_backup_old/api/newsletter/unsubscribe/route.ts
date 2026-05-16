import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const unsubscribeSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = unsubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Set newsletter.active = false for the matching email
    const existing = await db.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      await db.newsletter.update({
        where: { email },
        data: { active: false },
      });
    }

    // Also update User if exists with that email
    await db.user.updateMany({
      where: { email },
      data: {
        newsletterSubscribed: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Desinscription reussie",
    });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
