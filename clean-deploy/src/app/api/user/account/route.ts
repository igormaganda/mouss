import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateNameSchema = z.object({
  name: z.string().min(1).max(100),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(100),
  confirmPassword: z.string().min(1),
});

// ── GET: Get current user info ──────────────────────────────────────────────

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
        id: true,
        email: true,
        name: true,
        role: true,
        onboardingStep: true,
        onboardingDone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User account fetch error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// ── PUT: Update user profile ────────────────────────────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorise" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const body = await request.json();

    // Detect which operation
    if (body.action === "changePassword") {
      const parsed = changePasswordSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: "Donnees invalides", details: parsed.error.flatten() },
          { status: 400 },
        );
      }

      const { currentPassword, newPassword, confirmPassword } = parsed.data;

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { success: false, error: "Les mots de passe ne correspondent pas" },
          { status: 400 },
        );
      }

      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user || !user.password) {
        return NextResponse.json(
          { success: false, error: "Utilisateur non trouvé" },
          { status: 404 },
        );
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Mot de passe actuel incorrect" },
          { status: 400 },
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ success: true });
    }

    // Default: update name
    const parsed = updateNameSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Donnees invalides" },
        { status: 400 },
      );
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { name: parsed.data.name },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User account update error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// ── DELETE: Delete user account ─────────────────────────────────────────────

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorise" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    // Delete user and all related data (cascade)
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    console.error("User account delete error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
