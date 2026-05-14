import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const campaignUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  segment: z
    .enum(["all", "etudiant", "salarie", "freelance", "tpe-pme"])
    .optional(),
  status: z.enum(["draft", "scheduled", "sent"]).optional(),
  sentCount: z.number().min(0).optional(),
  openCount: z.number().min(0).optional(),
  clickCount: z.number().min(0).optional(),
  scheduledAt: z.string().nullable().optional(),
  sentAt: z.string().nullable().optional(),
});

type Params = Promise<{ id: string }>;

// GET /api/admin/campaigns/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const campaign = await db.emailCampaign.findUnique({ where: { id } });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campagne non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Admin campaign GET error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/campaigns/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = campaignUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const campaign = await db.emailCampaign.findUnique({ where: { id } });
    if (!campaign) {
      return NextResponse.json(
        { error: "Campagne non trouvée" },
        { status: 404 }
      );
    }

    const data = result.data;

    const updated = await db.emailCampaign.update({
      where: { id },
      data: {
        ...data,
        scheduledAt: data.scheduledAt !== undefined && data.scheduledAt !== null
          ? new Date(data.scheduledAt)
          : data.scheduledAt === null
            ? null
            : undefined,
        sentAt: data.sentAt !== undefined && data.sentAt !== null
          ? new Date(data.sentAt)
          : data.sentAt === null
            ? null
            : undefined,
      },
    });

    return NextResponse.json({ campaign: updated });
  } catch (error) {
    console.error("Admin campaign PUT error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/campaigns/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const campaign = await db.emailCampaign.findUnique({ where: { id } });
    if (!campaign) {
      return NextResponse.json(
        { error: "Campagne non trouvée" },
        { status: 404 }
      );
    }

    await db.emailCampaign.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Campagne supprimée",
    });
  } catch (error) {
    console.error("Admin campaign DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
