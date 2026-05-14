import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const toolUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  website: z.string().optional(),
  affiliateUrl: z.string().optional(),
  commission: z.number().min(0).optional(),
  category: z
    .enum(["bank", "compta", "assurance", "legal", "marketing", "crm", "other"])
    .optional(),
  pricing: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  features: z.string().optional(),
  active: z.boolean().optional(),
  order: z.number().optional(),
});

type Params = Promise<{ id: string }>;

// GET /api/admin/tools/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const tool = await db.tool.findUnique({
      where: { id },
      include: {
        clicks: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });

    if (!tool) {
      return NextResponse.json({ error: "Outil non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ tool });
  } catch (error) {
    console.error("Admin tool GET error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tools/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = toolUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const tool = await db.tool.findUnique({ where: { id } });
    if (!tool) {
      return NextResponse.json({ error: "Outil non trouvé" }, { status: 404 });
    }

    // Check slug uniqueness if changing
    if (result.data.slug && result.data.slug !== tool.slug) {
      const existing = await db.tool.findUnique({
        where: { slug: result.data.slug },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Un outil avec ce slug existe deja" },
          { status: 409 }
        );
      }
    }

    const updated = await db.tool.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ tool: updated });
  } catch (error) {
    console.error("Admin tool PUT error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tools/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const tool = await db.tool.findUnique({ where: { id } });
    if (!tool) {
      return NextResponse.json({ error: "Outil non trouvé" }, { status: 404 });
    }

    await db.tool.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Outil supprimé" });
  } catch (error) {
    console.error("Admin tool DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
