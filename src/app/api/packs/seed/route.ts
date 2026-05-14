import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_PACKS = [
  {
    id: uuidv4(),
    name: "Créer mon Entreprise",
    slug: "creation",
    description:
      "Générez vos statuts juridiques, PV d'AG, Cerfa et tous les documents de création avec l'IA en 15 minutes.",
    price: 900,
    currency: "eur",
    features: JSON.stringify([
      "Statuts juridiques personnalisés",
      "PV d'Assemblée Générale",
      "Formulaire Cerfa pré-rempli",
      "Attestation de non-condamnation",
      "Rédaction IA de l'objet social",
      "Kit banque pro",
      "Checklist création pas-à-pas",
      "Modifications illimitées",
      "Support réactif",
      "Garantie satisfait ou remboursé 14 jours",
    ]),
    stripePriceId: "price_creation_onetime",
    active: true,
    order: 0,
  },
  {
    id: uuidv4(),
    name: "Starter",
    slug: "starter",
    description:
      "Lancez votre activité avec les essentiels. Parfait pour démarrer sans investissement initial.",
    price: 0,
    currency: "eur",
    features: JSON.stringify([
      "Audit de lancement personnalisé",
      "Guide de démarrage par email",
      "Accès à la communauté",
      "Checklist administrative",
      "Recommandations bancaires de base",
    ]),
    stripePriceId: null,
    active: true,
    order: 1,
  },
  {
    id: uuidv4(),
    name: "Pro",
    slug: "pro",
    description:
      "Tout ce dont vous avez besoin pour gérer votre activité au quotidien de manière efficace.",
    price: 2900,
    currency: "eur",
    features: JSON.stringify([
      "Tout le plan Starter inclus",
      "Recommandations Banque + Compta + Assurance",
      "Templates de documents professionnels",
      "Suivi de progression personnalisé",
      "Support prioritaire par email",
      "Mises a jour mensuelles des recommandations",
      "Webinaires exclusifs entrepreneurs",
      "Acces au tableau de bord avance",
    ]),
    stripePriceId: "price_pro_monthly",
    active: true,
    order: 2,
  },
  {
    id: uuidv4(),
    name: "Premium",
    slug: "premium",
    description:
      "L'accompagnement complet pour accélérer votre croissance et scaler votre activité.",
    price: 7900,
    currency: "eur",
    features: JSON.stringify([
      "Tout le plan Pro inclus",
      "Accompagnement individuel 1-to-1",
      "Strategie de croissance sur mesure",
      "Connexion avec des experts comptables",
      "Audit juridique annuel",
      "Formation avancée gestion financière",
      "Accès anticipé aux nouvelles fonctionnalités",
      "Dashboard analytics avance",
      "Support telephone prioritaire",
      "Badge Premium sur la communauté",
    ]),
    stripePriceId: "price_premium_monthly",
    active: true,
    order: 3,
  },
];

export async function POST(request: NextRequest) {
  try {
    // Check if packs already exist
    const existingCount = await db.pack.count();

    if (existingCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Des packs existent déjà. Supprimez-les d'abord si vous souhaitez les réinitialiser.",
          existingCount,
        },
        { status: 409 }
      );
    }

    // Create all packs in a transaction
    const result = await db.$transaction(
      DEFAULT_PACKS.map((pack) =>
        db.pack.create({
          data: pack,
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        message: `${result.length} packs créés avec succès`,
        packsCreated: result.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pack seed error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation des packs" },
      { status: 500 }
    );
  }
}

// Allow GET with ?seed=true for auto-seeding
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const seed = searchParams.get("seed");

  if (seed === "true") {
    const existingCount = await db.pack.count();

    if (existingCount > 0) {
      const packs = await db.pack.findMany({
        where: { active: true, slug: { not: "starter" } },
        orderBy: { order: "asc" },
      });

      return NextResponse.json({
        success: true,
        message: `${existingCount} packs existent déjà`,
        packs: packs.map((pack) => ({
          id: pack.id,
          name: pack.name,
          slug: pack.slug,
          description: pack.description,
          price: pack.price,
          currency: pack.currency,
          features: pack.features ? JSON.parse(pack.features) : [],
          active: pack.active,
          order: pack.order,
        })),
      });
    }

    const result = await db.$transaction(
      DEFAULT_PACKS.map((pack) =>
        db.pack.create({
          data: pack,
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `${result.length} packs créés avec succès`,
      packsCreated: result.length,
    });
  }

  return NextResponse.json(
    { error: "Utilisez POST ou GET avec ?seed=true" },
    { status: 400 }
  );
}
