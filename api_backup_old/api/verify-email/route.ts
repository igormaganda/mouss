import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { rateLimitCheck, withSecurityHeaders, createAuditLog, getClientIp } from "@/lib/auth-helpers";

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token requis").max(100),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: max 10 verification attempts per IP per minute
    const rateLimitResult = rateLimitCheck(request, "verify-email", 10, 60_000);
    if (rateLimitResult) return rateLimitResult;

    const body = await request.json();
    const result = verifyEmailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 400 }
      );
    }

    const { token } = result.data;

    // Find user by email verification token (stored in resetToken field temporarily)
    // Re-using resetToken field to avoid adding another column — token prefix distinguishes usage
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Lien de vérification invalide ou expiré" },
        { status: 400 }
      );
    }

    // Mark email as verified and clear the token
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Audit log
    await createAuditLog({
      action: "user.email.verified",
      userId: user.id,
      details: "Email verified successfully",
      ip: getClientIp(request),
    }).catch(() => {});

    return withSecurityHeaders(NextResponse.json({
      success: true,
      message: "Email vérifié avec succès ! Votre compte est maintenant actif.",
    }));
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
