import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const sector = await db.activitySector.findUnique({
      where: { slug },
    });

    if (!sector || !sector.active) {
      return NextResponse.json(
        { error: "Secteur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ sector });
  } catch (error) {
    console.error("Error fetching activity sector:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du secteur d'activité" },
      { status: 500 }
    );
  }
}
