import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    const where = published !== null
      ? { published: published === "true" }
      : {};

    const posts = await db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true, email: true } } },
    });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const post = await db.post.create({ data: body });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Post create error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
