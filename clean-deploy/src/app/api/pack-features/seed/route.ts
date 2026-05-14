import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const DEFAULT_CATEGORIES = [
  {
    name: "Création d'entreprise",
    order: 0,
    items: [
      { name: "Statuts juridiques IA", order: 0, hasCreation: true, hasPro: true, hasPremium: true },
      { name: "PV d'Assemblée Générale", order: 1, hasCreation: true, hasPro: true, hasPremium: true },
      { name: "Formulaire Cerfa pré-rempli", order: 2, hasCreation: true, hasPro: true, hasPremium: true },
      { name: "Kit banque pro", order: 3, hasCreation: true, hasPro: true, hasPremium: true },
      { name: "Checklist création pas-à-pas", order: 4, hasCreation: true, hasPro: true, hasPremium: true },
      { name: "Modifications illimitées", order: 5, hasCreation: true, hasPro: true, hasPremium: true },
      { name: "Rédaction IA objet social", order: 6, hasCreation: true, hasPro: true, hasPremium: true },
    ],
  },
  {
    name: "Gestion de compte",
    order: 1,
    items: [
      { name: "Compte entrepreneur", order: 0, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Profil personnalisé", order: 1, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Gestion multi-projets", order: 2, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Accès collaborateur", order: 3, hasCreation: false, hasPro: false, hasPremium: true },
    ],
  },
  {
    name: "Outils & Comparatifs",
    order: 2,
    items: [
      { name: "Comparatifs de base", order: 0, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Comparatifs avancés", order: 1, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Outils de simulation", order: 2, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Export de données", order: 3, hasCreation: false, hasPro: false, hasPremium: true },
      { name: "API d'intégration", order: 4, hasCreation: false, hasPro: false, hasPremium: true },
    ],
  },
  {
    name: "Audit & Conseil",
    order: 3,
    items: [
      { name: "Audit de lancement", order: 0, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Audit approfondi", order: 1, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Conseil personnalisé", order: 2, hasCreation: false, hasPro: false, hasPremium: true },
      { name: "Plan d'action détaillé", order: 3, hasCreation: false, hasPro: false, hasPremium: true },
    ],
  },
  {
    name: "Support",
    order: 4,
    items: [
      { name: "Email", order: 0, hasCreation: true, hasPro: true, hasPremium: true },
      { name: "Chat en direct", order: 1, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Support téléphonique", order: 2, hasCreation: false, hasPro: false, hasPremium: true },
      { name: "Manager dédié", order: 3, hasCreation: false, hasPro: false, hasPremium: true },
    ],
  },
  {
    name: "Avancés",
    order: 5,
    items: [
      { name: "Accès anticipé aux nouveautés", order: 0, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Webinaires exclusifs", order: 1, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Communauté privée", order: 2, hasCreation: false, hasPro: true, hasPremium: true },
      { name: "Badge Premium certifié", order: 3, hasCreation: false, hasPro: false, hasPremium: true },
    ],
  },
];

export async function POST() {
  try {
    const existing = await db.packFeatureCategory.count();
    if (existing > 0) {
      const categories = await db.packFeatureCategory.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
        include: {
          items: {
            where: { active: true },
            orderBy: { order: "asc" },
          },
        },
      });
      return NextResponse.json({
        message: "Données déjà existantes",
        categories,
      });
    }

    const created = await db.$transaction(
      DEFAULT_CATEGORIES.map((cat) =>
        db.packFeatureCategory.create({
          data: {
            name: cat.name,
            order: cat.order,
            items: {
              create: cat.items,
            },
          },
          include: { items: { orderBy: { order: "asc" } } },
        })
      )
    );

    return NextResponse.json({
      message: "Données initiales créées avec succès",
      categories: created,
    });
  } catch (error) {
    console.error("Pack features seed error:", error);
    return NextResponse.json(
      { error: "Erreur lors du seed des fonctionnalités" },
      { status: 500 }
    );
  }
}
