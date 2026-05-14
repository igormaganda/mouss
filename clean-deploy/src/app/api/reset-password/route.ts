import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { rateLimitCheck, withSecurityHeaders, createAuditLog, getClientIp } from "@/lib/auth-helpers";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requis").max(100),
  newPassword: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128, "Le mot de passe ne doit pas dépasser 128 caractères")
    .refine(pw => /[A-Z]/.test(pw), "Doit contenir au moins une majuscule")
    .refine(pw => /[a-z]/.test(pw), "Doit contenir au moins une minuscule")
    .refine(pw => /[0-9]/.test(pw), "Doit contenir au moins un chiffre")
    .refine(pw => /[^A-Za-z0-9]/.test(pw), "Doit contenir au moins un caractère spécial"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: max 5 reset attempts per IP per minute
    const rateLimitResult = rateLimitCheck(request, "reset-password", 5, 60_000);
    if (rateLimitResult) return rateLimitResult;

    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { token, newPassword } = result.data;

    // Find user by reset token
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }, // Token must not be expired
      },
    });

    if (!user) {
      // SECURITY: Do not reveal whether token is invalid or expired
      return NextResponse.json(
        { error: "Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien." },
        { status: 400 }
      );
    }

    // Check new password is not the same as current password
    if (user.password) {
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return NextResponse.json(
          { error: "Le nouveau mot de passe doit être différent de l'ancien" },
          { status: 400 }
        );
      }
    }

    // Hash new password and clear reset token
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Clear brute-force lockout (allow user to login with new password)
    const { clearLoginLockout } = await import("@/lib/auth");
    clearLoginLockout(user.email);

    // Audit log
    await createAuditLog({
      action: "user.password.reset.success",
      userId: user.id,
      details: "Password reset via token",
      ip: getClientIp(request),
    }).catch(() => {});

    return withSecurityHeaders(NextResponse.json({
      success: true,
      message: "Mot de passe modifié avec succès. Vous pouvez maintenant vous connecter.",
    }));
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
