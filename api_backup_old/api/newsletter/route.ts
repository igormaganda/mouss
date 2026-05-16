import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const count = await db.newsletter.count({
      where: { active: true },
    });

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Newsletter count error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
