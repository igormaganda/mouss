import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Find the lead with this email that has an audit result
    const lead = await db.lead.findUnique({
      where: { email: userEmail! },
      include: { AuditResult: true },
    });

    if (!lead || !lead.AuditResult) {
      return NextResponse.json({ auditResult: null });
    }

    return NextResponse.json({
      auditResult: lead.AuditResult,
      lead: {
        id: lead.id,
        email: lead.email,
        firstName: lead.firstName,
        lastName: lead.lastName,
        profile: lead.profile,
        phase: lead.phase,
      },
      tools: [], // Tools now embedded in auditResult.recommendations
    });
  } catch (error) {
    console.error("User audit fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
