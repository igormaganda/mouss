import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const toggleSchema = z.object({
  subscribed: z.boolean(),
});

// GET: Returns user's newsletter status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorise" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        newsletterSubscribed: true,
        newsletterSubscribedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouve" }, { status: 404 });
    }

    return NextResponse.json({
      subscribed: user.newsletterSubscribed,
      subscribedAt: user.newsletterSubscribedAt?.toISOString() || null,
    });
  } catch (error) {
    console.error("User newsletter GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// POST: Toggle newsletter subscription for logged-in user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorise" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const body = await request.json();
    const parsed = toggleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { subscribed } = parsed.data;

    // Get user email for Newsletter table sync
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouve" }, { status: 404 });
    }

    if (subscribed) {
      // Subscribe: update User fields
      await db.user.update({
        where: { id: userId },
        data: {
          newsletterSubscribed: true,
          newsletterSubscribedAt: new Date(),
        },
      });

      // Create Newsletter record if not exists
      const existingNewsletter = await db.newsletter.findUnique({
        where: { email: user.email },
      });

      if (!existingNewsletter) {
        await db.newsletter.create({
          data: {
            email: user.email,
            source: "account",
          },
        });
      } else if (!existingNewsletter.active) {
        await db.newsletter.update({
          where: { email: user.email },
          data: { active: true },
        });
      }
    } else {
      // Unsubscribe: update User fields
      await db.user.update({
        where: { id: userId },
        data: {
          newsletterSubscribed: false,
          newsletterSubscribedAt: null,
        },
      });

      // Set Newsletter.active = false
      await db.newsletter.updateMany({
        where: { email: user.email },
        data: { active: false },
      });
    }

    return NextResponse.json({
      success: true,
      subscribed,
    });
  } catch (error) {
    console.error("User newsletter POST error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
