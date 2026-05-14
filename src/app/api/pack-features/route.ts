import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    let categories = await db.packFeatureCategory.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        items: {
          where: { active: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            order: true,
            hasCreation: true,
            hasPro: true,
            hasPremium: true,
          },
        },
      },
    });

    // Auto-seed if empty
    if (categories.length === 0) {
      const seedRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/pack-features/seed`,
        { method: "POST" }
      );
      if (seedRes.ok) {
        const seedData = await seedRes.json();
        categories = seedData.categories || [];
      }
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Pack features GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des fonctionnalités" },
      { status: 500 }
    );
  }
}
