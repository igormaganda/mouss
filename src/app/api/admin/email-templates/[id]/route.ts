import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const templateUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  category: z
    .enum(["welcome", "recommendation", "audit", "billing", "newsletter", "transactional"])
    .optional(),
  variables: z.string().nullable().optional(),
  active: z.boolean().optional(),
});

type Params = Promise<{ id: string }>;

// GET /api/admin/email-templates/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const template = await db.emailTemplate.findUnique({ where: { id } });

    if (!template) {
      return NextResponse.json(
        { error: "Template non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Email template GET error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/email-templates/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = templateUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const template = await db.emailTemplate.findUnique({ where: { id } });
    if (!template) {
      return NextResponse.json(
        { error: "Template non trouvé" },
        { status: 404 }
      );
    }

    const updated = await db.emailTemplate.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ template: updated });
  } catch (error) {
    console.error("Email template PUT error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/email-templates/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const template = await db.emailTemplate.findUnique({ where: { id } });
    if (!template) {
      return NextResponse.json(
        { error: "Template non trouvé" },
        { status: 404 }
      );
    }

    await db.emailTemplate.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Template supprimé",
    });
  } catch (error) {
    console.error("Email template DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
