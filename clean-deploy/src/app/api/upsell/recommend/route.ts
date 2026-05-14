import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auditResultId, leadId, profile, phase, score } = body;

    // Build where clause for matching offers
    const whereConditions: Record<string, unknown>[] = [
      { sourcePage: "audit", active: true },
    ];

    // If phase provided, match offers with this phase OR no phase filter
    if (phase) {
      whereConditions.push({
        OR: [
          { triggerPhase: phase },
          { triggerPhase: null },
        ],
      });
    }

    // If score provided, match offers with score threshold <= this score OR no score filter
    if (typeof score === "number") {
      whereConditions.push({
        OR: [
          { triggerScore: { lte: score } },
          { triggerScore: null },
        ],
      });
    }

    const offers = await db.upsellOffer.findMany({
      where: {
        sourcePage: "audit",
        active: true,
        AND: [
          phase
            ? { OR: [{ triggerPhase: phase }, { triggerPhase: null }] }
            : {},
          typeof score === "number"
            ? { OR: [{ triggerScore: { lte: score } }, { triggerScore: null }] }
            : {},
        ],
      },
      orderBy: { priority: "desc" },
      take: 5,
    });

    if (offers.length === 0) {
      return NextResponse.json({
        offer: null,
        personalizedMessage: null,
        alternatives: [],
      });
    }

    // Enrich each offer with target pack data
    const enrichedOffers = [];
    for (const offer of offers) {
      const pack = await db.pack.findFirst({
        where: {
          slug: offer.targetPackSlug,
          active: true,
        },
      });

      if (pack) {
        const features = pack.features ? JSON.parse(pack.features) : [];
        enrichedOffers.push({
          ...offer,
          pack: {
            id: pack.id,
            name: pack.name,
            slug: pack.slug,
            description: pack.description,
            price: pack.price,
            currency: pack.currency,
            features,
            order: pack.order,
          },
          discountedPrice:
            offer.discountPercent > 0
              ? Math.round(pack.price * (1 - offer.discountPercent / 100))
              : pack.price,
        });
      }
    }

    // Pick the top offer
    const topOffer = enrichedOffers[0] || null;

    // Build personalized message
    let personalizedMessage = "";
    if (topOffer) {
      const profileLabel =
        profile === "etudiant"
          ? "etudiant entrepreneur"
          : profile === "salarie"
            ? "salarie en transition"
            : profile === "freelance"
              ? "freelance"
              : profile === "tpe-pme"
                ? " dirigeant de TPE/PME"
                : "entrepreneur";

      const phaseLabel =
        phase === "reflexion"
          ? "reflexion"
          : phase === "creation"
            ? "creation"
            : phase === "gestion"
              ? "gestion"
              : phase === "croissance"
                ? "croissance"
                : "";

      personalizedMessage = `Base sur votre profil de ${profileLabel}${phaseLabel ? ` en phase de ${phaseLabel}` : ""}, nous vous recommandons le pack ${topOffer.pack.name}. ${topOffer.message}`;
    }

    // Get alternatives (lower-priced packs)
    let alternatives: { name: string; slug: string; price: number; currency: string }[] = [];
    if (topOffer) {
      alternatives = await db.pack
        .findMany({
          where: {
            active: true,
            slug: { not: topOffer.targetPackSlug },
            price: { lte: topOffer.pack.price },
          },
          orderBy: { order: "asc" },
        })
        .then((packs) =>
          packs.map((p) => ({
            name: p.name,
            slug: p.slug,
            price: p.price,
            currency: p.currency,
          }))
        );
    }

    return NextResponse.json({
      offer: topOffer,
      personalizedMessage: personalizedMessage || null,
      alternatives,
    });
  } catch (error) {
    console.error("Upsell recommend error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
