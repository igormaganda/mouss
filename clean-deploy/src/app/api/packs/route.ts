import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const packs = await db.pack.findMany({
      where: { active: true, slug: { not: "starter" } },
      orderBy: { order: "asc" },
    });

    const formattedPacks = packs.map((pack) => ({
      id: pack.id,
      name: pack.name,
      slug: pack.slug,
      description: pack.description,
      price: pack.price,
      currency: pack.currency,
      features: pack.features ? JSON.parse(pack.features) : [],
      active: pack.active,
      order: pack.order,
    }));

    return NextResponse.json({
      success: true,
      packs: formattedPacks,
    });
  } catch (error) {
    console.error("Packs API error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
