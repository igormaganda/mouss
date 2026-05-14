import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Return current referral program settings (create default if none exists)
export async function GET() {
  try {
    let program = await db.referralProgram.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!program) {
      program = await db.referralProgram.create({
        data: {
          active: true,
          rewardType: "credit",
          rewardValue: 10,
          refereeRewardType: "credit",
          refereeRewardValue: 10,
          minOrderAmount: 0,
          maxUsesPerUser: 50,
        },
      });
    }

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Referral program GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT: Admin updates program settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    const body = await request.json();
    const {
      rewardType,
      rewardValue,
      refereeRewardType,
      refereeRewardValue,
      minOrderAmount,
      maxUsesPerUser,
      active,
    } = body;

    let program = await db.referralProgram.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!program) {
      program = await db.referralProgram.create({
        data: {
          active: active ?? true,
          rewardType: rewardType ?? "credit",
          rewardValue: rewardValue ?? 10,
          refereeRewardType: refereeRewardType ?? "credit",
          refereeRewardValue: refereeRewardValue ?? 10,
          minOrderAmount: minOrderAmount ?? 0,
          maxUsesPerUser: maxUsesPerUser ?? 50,
        },
      });
    } else {
      program = await db.referralProgram.update({
        where: { id: program.id },
        data: {
          ...(active !== undefined && { active }),
          ...(rewardType !== undefined && { rewardType }),
          ...(rewardValue !== undefined && { rewardValue }),
          ...(refereeRewardType !== undefined && { refereeRewardType }),
          ...(refereeRewardValue !== undefined && { refereeRewardValue }),
          ...(minOrderAmount !== undefined && { minOrderAmount }),
          ...(maxUsesPerUser !== undefined && { maxUsesPerUser }),
        },
      });
    }

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Referral program PUT error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
