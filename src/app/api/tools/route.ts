import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const where: Record<string, unknown> = { active: true };

    if (category && category !== "all") {
      where.category = category;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { tagline: { contains: q, mode: "insensitive" } },
      ];
    }

    const skip = offset ? parseInt(offset, 10) : 0;
    const take = limit ? parseInt(limit, 10) : undefined;

    const [tools, total] = await Promise.all([
      db.tool.findMany({
        where,
        orderBy: { order: "asc" },
        skip,
        take,
      }),
      db.tool.count({ where }),
    ]);

    return NextResponse.json({ tools, total });
  } catch (error) {
    console.error("Public tools fetch error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
