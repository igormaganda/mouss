import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const toggleSchema = z.object({
  active: z.boolean(),
});

type Params = Promise<{ id: string }>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Auth check — admin only
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = toggleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.newsletter.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Abonne non trouve" }, { status: 404 });
    }

    const updated = await db.newsletter.update({
      where: { id },
      data: { active: parsed.data.active },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        source: true,
        active: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin newsletter PATCH error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Auth check — admin only
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await db.newsletter.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Abonne non trouve" }, { status: 404 });
    }

    await db.newsletter.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin newsletter DELETE error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
