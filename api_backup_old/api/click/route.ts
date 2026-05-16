import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const clickSchema = z.object({
  toolSlug: z.string().min(1, "Le slug de l'outil est requis"),
  leadId: z.string().optional(),
  sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = clickSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { toolSlug, leadId, sessionId } = result.data;

    // Find the tool
    const tool = await db.tool.findUnique({
      where: { slug: toolSlug },
    });

    if (!tool) {
      return NextResponse.json(
        { error: "Outil non trouvé" },
        { status: 404 }
      );
    }

    // Determine redirect URL
    const redirectUrl = tool.affiliateUrl || tool.website || "";

    // Record the click
    await db.affiliateClick.create({
      data: {
        toolId: tool.id,
        leadId: leadId || null,
        sessionId: sessionId || null,
        ip: request.headers.get("x-forwarded-for") || null,
        referer: request.headers.get("referer") || null,
      },
    });

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
