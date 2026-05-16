import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const leadUpdateSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  profile: z.enum(["etudiant", "salarie", "freelance", "tpe-pme"]).optional(),
  phase: z.enum(["reflexion", "creation", "gestion", "croissance"]).optional(),
  painPoint: z.string().optional(),
  projectName: z.string().optional(),
  consent: z.boolean().optional(),
  status: z.enum(["new", "contacted", "converted", "lost"]).optional(),
  source: z.string().optional(),
});

type Params = Promise<{ id: string }>;

// GET /api/admin/leads/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        auditResult: true,
        clicks: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Admin lead GET error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/leads/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = leadUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const lead = await db.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: "Lead non trouvé" }, { status: 404 });
    }

    // Check email uniqueness if changing
    if (result.data.email && result.data.email !== lead.email) {
      const existing = await db.lead.findUnique({
        where: { email: result.data.email },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Un lead avec cet email existe deja" },
          { status: 409 }
        );
      }
    }

    const updated = await db.lead.update({
      where: { id },
      data: result.data,
      include: { auditResult: true },
    });

    return NextResponse.json({ lead: updated });
  } catch (error) {
    console.error("Admin lead PUT error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/leads/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const lead = await db.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: "Lead non trouvé" }, { status: 404 });
    }

    await db.lead.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Lead supprimé" });
  } catch (error) {
    console.error("Admin lead DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
