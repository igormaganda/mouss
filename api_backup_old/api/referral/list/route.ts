import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Return the current user's referral list (as referrer)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const referrals = await db.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
    });

    // Enrich with referee names
    const enrichedReferrals = await Promise.all(
      referrals.map(async (ref) => {
        let refereeName = ref.refereeEmail || "Inconnu";
        if (ref.refereeId) {
          const referee = await db.user.findUnique({
            where: { id: ref.refereeId },
            select: { name: true, email: true },
          });
          if (referee) {
            refereeName = referee.name || referee.email || ref.refereeEmail || "Inconnu";
          }
        }
        return {
          ...ref,
          refereeName,
        };
      })
    );

    return NextResponse.json({ referrals: enrichedReferrals });
  } catch (error) {
    console.error("Referral list GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
