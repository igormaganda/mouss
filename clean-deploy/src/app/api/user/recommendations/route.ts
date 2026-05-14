import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// ── Types ───────────────────────────────────────────────────────────────────

interface Recommendation {
  tool: Record<string, unknown>;
  score: number;
  reason: string;
  urgency: "basse" | "normale" | "haute" | "critique";
}

// ── Category / profile / phase mapping ──────────────────────────────────────

const PROFILE_CATEGORY_AFFINITY: Record<string, string[]> = {
  freelance: ["compta", "bank", "assurance"],
  "auto-entrepreneur": ["compta", "bank", "assurance"],
  eurl: ["compta", "bank", "assurance", "other"],
  sasu: ["compta", "bank", "assurance", "other"],
  sarl: ["compta", "bank", "assurance", "other"],
  startup: ["marketing", "bank", "other"],
  artisan: ["assurance", "bank", "compta"],
  commercial: ["marketing", "bank", "compta"],
  liberal: ["compta", "assurance", "bank"],
};

const PHASE_URGENCY_MAP: Record<string, { weight: number; urgency: Recommendation["urgency"] }> = {
  reflexion: { weight: 0.6, urgency: "basse" },
  creation: { weight: 1.4, urgency: "haute" },
  gestion: { weight: 1.0, urgency: "normale" },
  croissance: { weight: 0.8, urgency: "normale" },
};

const PAIN_POINT_CATEGORIES: Record<string, string[]> = {
  financement: ["bank", "other"],
  comptabilite: ["compta"],
  juridique: ["compta", "assurance"],
  assurance: ["assurance"],
  marketing: ["marketing"],
  visibilite: ["marketing"],
  clients: ["marketing", "bank"],
};

const CATEGORY_LABELS: Record<string, string> = {
  bank: "banque et finance",
  compta: "comptabilité",
  assurance: "assurance",
  marketing: "marketing et communication",
  other: "paiements et services",
};

const PROFILE_LABELS: Record<string, string> = {
  freelance: "freelance",
  "auto-entrepreneur": "auto-entrepreneur",
  eurl: "EURL",
  sasu: "SASU",
  sarl: "SARL",
  startup: "startup",
  artisan: "artisan",
  commercial: "commercial",
  liberal: "profession libérale",
};

const PHASE_LABELS: Record<string, string> = {
  reflexion: "réflexion",
  creation: "création",
  gestion: "gestion",
  croissance: "croissance",
};

// ── GET: Intelligent recommendations ────────────────────────────────────────

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    // 1. Fetch user onboarding data
    const userWithOnboarding = await db.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    });

    const onboarding = userWithOnboarding?.onboarding;
    const userProfile = onboarding?.profile?.toLowerCase() || "";
    const userSector = onboarding?.sector?.toLowerCase() || "";
    const userPhase = onboarding?.phase?.toLowerCase() || "";

    // 2. Fetch audit result if exists (linked by user email)
    const userEmail = userWithOnboarding?.email;
    let auditResult: { painPoint: string; profile: string; phase: string } | null = null;

    if (userEmail) {
      const lead = await db.lead.findUnique({
        where: { email: userEmail },
        include: { auditResult: true },
      });
      if (lead?.auditResult) {
        auditResult = {
          painPoint: lead.auditResult.painPoint.toLowerCase(),
          profile: lead.auditResult.profile.toLowerCase(),
          phase: lead.auditResult.phase.toLowerCase(),
        };
      }
    }

    // 3. Fetch user's current tool statuses
    const userToolStatuses = await db.userToolStatus.findMany({
      where: { userId },
      select: { toolId: true, status: true },
    });

    // Build a set of tool IDs already adopted or dismissed
    const excludedToolIds = new Set(
      userToolStatuses
        .filter((s) => s.status === "adopted" || s.status === "dismissed")
        .map((s) => s.toolId),
    );

    // 4. Fetch all active tools
    const tools = await db.tool.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    // 5. Score each tool
    const phaseWeight = PHASE_URGENCY_MAP[userPhase]?.weight ?? 1.0;
    const phaseUrgency = PHASE_URGENCY_MAP[userPhase]?.urgency ?? "normale";

    const auditPainPoint = auditResult?.painPoint || "";
    const auditProfile = auditResult?.profile || userProfile;
    const effectivePhase = auditResult?.phase || userPhase;

    const recommendations: Recommendation[] = [];

    for (const tool of tools) {
      // Skip already adopted/dismissed tools
      if (excludedToolIds.has(tool.id)) continue;

      let score = 0;
      const reasons: string[] = [];

      // ── Score: profile → category affinity ─────────────────────────────
      const effectiveProfile = auditProfile || userProfile;
      const matchingCategories = PROFILE_CATEGORY_AFFINITY[effectiveProfile] || [];

      if (matchingCategories.includes(tool.category)) {
        score += 30;
        const profileLabel = PROFILE_LABELS[effectiveProfile] || effectiveProfile;
        const catLabel = CATEGORY_LABELS[tool.category] || tool.category;
        reasons.push(`Idéal pour votre profil ${profileLabel} (${catLabel})`);
      }

      // ── Score: phase urgency ───────────────────────────────────────────
      const effPhaseUrgency = PHASE_URGENCY_MAP[effectivePhase];
      if (effPhaseUrgency) {
        score += Math.round(20 * effPhaseUrgency.weight);
        const phaseLabel = PHASE_LABELS[effectivePhase] || effectivePhase;
        if (effPhaseUrgency.urgency === "haute" || effPhaseUrgency.urgency === "critique") {
          reasons.push(`Prioritaire en phase de ${phaseLabel}`);
        }
      }

      // ── Score: pain point → category match ─────────────────────────────
      if (auditPainPoint) {
        const painCategories = PAIN_POINT_CATEGORIES[auditPainPoint] || [];
        if (painCategories.includes(tool.category)) {
          score += 25;
          reasons.push(`Répond à votre besoin identifié : ${auditPainPoint}`);
        }
      }

      // ── Score: tool rating boost ───────────────────────────────────────
      if (tool.rating > 4.0) {
        score += Math.round((tool.rating - 4.0) * 10);
      }

      // ── Score: free / freemium boost for creation phase ────────────────
      if (effectivePhase === "creation" && (tool.pricing === "gratuit" || tool.pricing === "freemium")) {
        score += 10;
        reasons.push("Solution gratuite, parfaite pour démarrer");
      }

      // ── Minimum threshold ──────────────────────────────────────────────
      if (score < 15) continue;

      // Determine final urgency
      let urgency: Recommendation["urgency"] = phaseUrgency;
      if (score >= 60) urgency = "critique";
      else if (score >= 45) urgency = "haute";
      else if (score >= 30) urgency = "normale";
      else urgency = "basse";

      recommendations.push({
        tool: {
          id: tool.id,
          name: tool.name,
          slug: tool.slug,
          tagline: tool.tagline,
          description: tool.description,
          logoUrl: tool.logoUrl,
          website: tool.website,
          affiliateUrl: tool.affiliateUrl,
          category: tool.category,
          pricing: tool.pricing,
          rating: tool.rating,
        },
        score,
        reason: reasons.slice(0, 2).join(". ") + ".",
        urgency,
      });
    }

    // Sort by score desc
    recommendations.sort((a, b) => b.score - a.score);

    const urgentCount = recommendations.filter(
      (r) => r.urgency === "haute" || r.urgency === "critique",
    ).length;

    return NextResponse.json({
      success: true,
      recommendations,
      urgentCount,
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
