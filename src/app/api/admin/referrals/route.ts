import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Returns all referrals with stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [referrals, total] = await Promise.all([
      db.referral.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.referral.count({ where }),
    ]);

    // Enrich referrals with user names
    const enrichedReferrals = await Promise.all(
      referrals.map(async (ref) => {
        const referrer = await db.user.findUnique({
          where: { id: ref.referrerId },
          select: { name: true, email: true },
        });

        const referee = ref.refereeId
          ? await db.user.findUnique({
              where: { id: ref.refereeId },
              select: { name: true, email: true },
            })
          : null;

        return {
          ...ref,
          referrerName: referrer?.name || referrer?.email || "Inconnu",
          referrerEmail: referrer?.email || "",
          refereeName: referee?.name || ref.refereeEmail || "Inconnu",
          refereeEmail: referee?.email || ref.refereeEmail || "",
        };
      })
    );

    // Stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalReferralsThisMonth,
      totalRewardsGiven,
      totalReferralsAll,
      completedReferrals,
    ] = await Promise.all([
      db.referral.count({
        where: { createdAt: { gte: monthStart } },
      }),
      db.referral.aggregate({
        where: { status: { in: ["completed", "rewarded"] } },
        _sum: { amount: true },
      }),
      db.referral.count(),
      db.referral.count({
        where: { status: { in: ["completed", "rewarded"] } },
      }),
    ]);

    const conversionRate = totalReferralsAll > 0
      ? Math.round((completedReferrals / totalReferralsAll) * 100)
      : 0;

    return NextResponse.json({
      referrals: enrichedReferrals,
      total,
      page,
      limit,
      stats: {
        totalReferralsThisMonth,
        totalRewardsGiven: totalRewardsGiven._sum.amount || 0,
        conversionRate,
        totalReferralsAll,
        completedReferrals,
      },
    });
  } catch (error) {
    console.error("Admin referrals GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
