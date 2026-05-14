import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    // In production, send an actual email with reset token
    // For now, we'll log and return success
    if (user) {
      console.log(`[Forgot Password] Reset requested for: ${email}`);
      // In production: send email with reset link
      // const resetToken = crypto.randomUUID();
      // await db.user.update({ where: { id: user.id }, data: { resetToken, resetTokenExpiry: new Date(Date.now() + 3600000) } });
      // await sendResetEmail(user.email, resetToken);
    }

    return NextResponse.json({
      success: true,
      message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
