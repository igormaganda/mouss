import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where = { active: true } as { active: boolean; category?: string };
    if (category) {
      where.category = category;
    }

    const sectors = await db.activitySector.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ sectors });
  } catch (error) {
    console.error("Error fetching activity sectors:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des secteurs d'activité" },
      { status: 500 }
    );
  }
}
