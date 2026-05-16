import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Return the current user's referral code (or generate one)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Check if user already has a referral as referrer
    const existingReferral = await db.referral.findFirst({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
    });

    // Generate code format: CE-{first6chars_of_userid}
    const code = `CE-${userId.slice(0, 6).toUpperCase()}`;

    // Get stats
    const referrals = await db.referral.findMany({
      where: { referrerId: userId },
    });

    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter((r) => r.status === "completed" || r.status === "rewarded").length;
    const totalRewardsEarned = referrals.reduce((sum, r) => sum + r.amount, 0);

    return NextResponse.json({
      code,
      stats: {
        totalReferrals,
        completedReferrals,
        totalRewardsEarned,
      },
    });
  } catch (error) {
    console.error("Referral code GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST: Create a referral tracking entry when someone visits with a referral code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code de parrainage requis" }, { status: 400 });
    }

    // Find referrer by code (code format: CE-{first6chars})
    const codeMatch = code.match(/^CE-(.{6})$/i);
    if (!codeMatch) {
      return NextResponse.json({ error: "Code de parrainage invalide" }, { status: 400 });
    }

    const prefix = codeMatch[1].toLowerCase();

    // Find user whose ID starts with this prefix
    const referrer = await db.user.findFirst({
      where: {
        id: { startsWith: prefix },
      },
    });

    if (!referrer) {
      return NextResponse.json({ error: "Code de parrainage non reconnu" }, { status: 404 });
    }

    // Set cookie for 30 days
    const response = NextResponse.json({
      success: true,
      message: "Code de parrainage enregistre",
      referrerName: referrer.name || referrer.email,
    });

    response.cookies.set("ref", code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Referral code POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
