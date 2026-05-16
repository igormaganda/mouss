import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where = category && category !== "all" ? { category, active: true } : { active: true };

    const tools = await db.tool.findMany({
      where,
      include: { _count: { select: { clicks: true } } },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ tools });
  } catch (error) {
    console.error("Tools fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tool = await db.tool.create({ data: body });
    return NextResponse.json(tool);
  } catch (error) {
    console.error("Tool create error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
