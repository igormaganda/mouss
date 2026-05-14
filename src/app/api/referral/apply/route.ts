import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/security";

const applySchema = z.object({
  code: z.string().min(1, "Code requis"),
  email: z.string().email("Email invalide"),
});

// POST: Apply a referral code during signup/checkout
export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp();
    if (!rateLimit("referral_apply:" + ip, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Trop de requetes. Reessayez plus tard." }, { status: 429 });
    }

    const body = await request.json();
    const result = applySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { code, email } = result.data;

    // Find referrer by code
    const codeMatch = code.match(/^CE-(.{6})$/i);
    if (!codeMatch) {
      return NextResponse.json({ error: "Code invalide" }, { status: 400 });
    }

    const prefix = codeMatch[1].toLowerCase();

    const referrer = await db.user.findFirst({
      where: { id: { startsWith: prefix } },
    });

    if (!referrer) {
      return NextResponse.json({ error: "Code non reconnu" }, { status: 404 });
    }

    // Check if email is the same as referrer (self-referral)
    if (referrer.email === email.toLowerCase()) {
      return NextResponse.json({ error: "Vous ne pouvez pas vous parrainer" }, { status: 400 });
    }

    // Check if referee already exists
    const referee = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    const refereeId = referee?.id ?? null;

    // Check if this email already has a pending/completed referral
    const existingReferral = await db.referral.findFirst({
      where: {
        refereeEmail: email.toLowerCase(),
      },
    });

    if (existingReferral) {
      return NextResponse.json(
        { error: "Cet email a deja un parrainage en cours" },
        { status: 409 }
      );
    }

    // Check if program is active
    let program = await db.referralProgram.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (program && !program.active) {
      return NextResponse.json({ error: "Le programme de parrainage est desactive" }, { status: 400 });
    }

    // Create referral record
    const referral = await db.referral.create({
      data: {
        referrerId: referrer.id,
        refereeId,
        refereeEmail: email.toLowerCase(),
        code,
        status: "pending",
        programId: program?.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Parrainage enregistre avec succes",
      referral: {
        id: referral.id,
        referrerName: referrer.name || referrer.email,
      },
    });
  } catch (error) {
    console.error("Referral apply error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
