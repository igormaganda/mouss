import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const FEATURE_DEFINITIONS = [
  {
    category: "Création d'entreprise",
    features: [
      { name: "Compte entrepreneur", slug: "compte-entrepreneur", order: 1 },
      { name: "Profil personnalisé", slug: "profil-personnalise", order: 2 },
      { name: "Gestion multi-projets", slug: "gestion-multi-projets", order: 3 },
      { name: "Accès collaborateur", slug: "acces-collaborateur", order: 4 },
    ],
  },
  {
    category: "Outils & Comparatifs",
    features: [
      { name: "Comparatifs de base", slug: "comparatifs-base", order: 5 },
      { name: "Comparatifs avancés", slug: "comparatifs-avances", order: 6 },
      { name: "Outils de simulation", slug: "outils-simulation", order: 7 },
      { name: "Export de données", slug: "export-donnees", order: 8 },
      { name: "API d'intégration", slug: "api-integration", order: 9 },
    ],
  },
  {
    category: "Audit & Conseil",
    features: [
      { name: "Audit de lancement", slug: "audit-lancement", order: 10 },
      { name: "Audit approfondi", slug: "audit-approfondi", order: 11 },
      { name: "Conseil personnalisé", slug: "conseil-personnalise", order: 12 },
      { name: "Plan d'action détaillé", slug: "plan-action-detaille", order: 13 },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "Email", slug: "email-support", order: 14 },
      { name: "Chat en direct", slug: "chat-direct", order: 15 },
      { name: "Support téléphonique", slug: "support-telephone", order: 16 },
      { name: "Manager dédié", slug: "manager-dedie", order: 17 },
    ],
  },
  {
    category: "Avancés",
    features: [
      { name: "Accès anticipé aux nouveautés", slug: "acces-anticipe", order: 18 },
      { name: "Webinaires exclusifs", slug: "webinaires-exclusifs", order: 19 },
      { name: "Communauté privée", slug: "communaute-privee", order: 20 },
      { name: "Badge Premium certifié", slug: "badge-premium", order: 21 },
    ],
  },
];

const CREATION_DISABLED_SLUGS = [
  "acces-collaborateur",
  "api-integration",
  "export-donnees",
  "comparatifs-avances",
  "audit-approfondi",
  "conseil-personnalise",
  "plan-action-detaille",
  "support-telephone",
  "manager-dedie",
  "badge-premium",
];

const PRO_DISABLED_SLUGS = [
  "acces-collaborateur",
  "export-donnees",
  "api-integration",
  "conseil-personnalise",
  "plan-action-detaille",
  "support-telephone",
  "manager-dedie",
  "badge-premium",
];

function getEnabledForPack(packSlug: string, featureSlug: string): boolean {
  if (packSlug === "premium") return true;
  if (packSlug === "pro") return !PRO_DISABLED_SLUGS.includes(featureSlug);
  if (packSlug === "creation") return !CREATION_DISABLED_SLUGS.includes(featureSlug);
  return false;
}

export async function GET() {
  try {
    const existingCount = await db.feature.count();

    // If features already exist, return early
    if (existingCount > 0) {
      return NextResponse.json({
        message: "Features already seeded",
        count: existingCount,
      });
    }

    // Create all features
    const allFeatures = FEATURE_DEFINITIONS.flatMap((cat) =>
      cat.features.map((f) => ({
        name: f.name,
        category: cat.category,
        slug: f.slug,
        order: f.order,
        active: true,
      }))
    );

    await db.feature.createMany({ data: allFeatures });

    // Fetch created features
    const features = await db.feature.findMany({ orderBy: { order: "asc" } });

    // Fetch packs
    const packs = await db.pack.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    // Create PackFeature records
    const packFeatureData = features.flatMap((feature) =>
      packs.map((pack) => ({
        packId: pack.id,
        featureId: feature.id,
        enabled: getEnabledForPack(pack.slug, feature.slug),
      }))
    );

    if (packFeatureData.length > 0) {
      await db.packFeature.createMany({ data: packFeatureData });
    }

    return NextResponse.json({
      message: "Features seeded successfully",
      featuresCreated: allFeatures.length,
      packFeaturesCreated: packFeatureData.length,
      packsFound: packs.length,
    });
  } catch (error) {
    console.error("Seed features error:", error);
    return NextResponse.json(
      { error: "Failed to seed features" },
      { status: 500 }
    );
  }
}

// POST to force re-seed (delete existing and recreate)
export async function POST() {
  try {
    // Delete existing PackFeatures first (due to foreign key)
    await db.packFeature.deleteMany({});
    // Delete existing features
    await db.feature.deleteMany({});

    // Create all features
    const allFeatures = FEATURE_DEFINITIONS.flatMap((cat) =>
      cat.features.map((f) => ({
        name: f.name,
        category: cat.category,
        slug: f.slug,
        order: f.order,
        active: true,
      }))
    );

    await db.feature.createMany({ data: allFeatures });

    const features = await db.feature.findMany({ orderBy: { order: "asc" } });

    const packs = await db.pack.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    const packFeatureData = features.flatMap((feature) =>
      packs.map((pack) => ({
        packId: pack.id,
        featureId: feature.id,
        enabled: getEnabledForPack(pack.slug, feature.slug),
      }))
    );

    if (packFeatureData.length > 0) {
      await db.packFeature.createMany({ data: packFeatureData });
    }

    return NextResponse.json({
      message: "Features re-seeded successfully",
      featuresCreated: allFeatures.length,
      packFeaturesCreated: packFeatureData.length,
    });
  } catch (error) {
    console.error("Re-seed features error:", error);
    return NextResponse.json(
      { error: "Failed to re-seed features" },
      { status: 500 }
    );
  }
}
