import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// ── Validation schemas ──────────────────────────────────────────────────────

const updateToolStatusSchema = z.object({
  toolId: z.string().min(1, "L'ID de l'outil est requis"),
  status: z.enum(["suggested", "adopted", "dismissed", "rated"]),
  rating: z.number().int().min(1).max(5).optional(),
  note: z.string().max(500).optional(),
});

// ── GET: List tools with user status ────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const { searchParams } = new URL(request.url);

    const statusFilter = searchParams.get("status");
    const categoryFilter = searchParams.get("category");

    // Build tool where clause
    const toolWhere: Record<string, unknown> = { active: true };
    if (categoryFilter) {
      toolWhere.category = categoryFilter;
    }

    // Get tools with optional user status join
    const tools = await db.tool.findMany({
      where: toolWhere,
      orderBy: { order: "asc" },
      include: {
        ToolStatus: {
          where: { userId },
          select: {
            id: true,
            status: true,
            rating: true,
            note: true,
            adoptedAt: true,
          },
        },
      },
    });

    // Get all user tool statuses for filtering
    const userStatuses = await db.userToolStatus.findMany({
      where: { userId },
      select: { toolId: true, status: true },
    });

    const userStatusMap = new Map(userStatuses.map((s) => [s.toolId, s.status]));

    // Enrich tools with computed status
    const enrichedTools = tools.map((tool) => {
      const toolStatus = tool.ToolStatus[0] ?? null;
      return {
        ...tool,
        userStatus: toolStatus?.status ?? null,
        userRating: toolStatus?.rating ?? null,
        userNote: toolStatus?.note ?? null,
        userAdoptedAt: toolStatus?.adoptedAt ?? null,
      };
    });

    // Filter by status if provided
    const filteredTools = statusFilter
      ? enrichedTools.filter((t) => t.userStatus === statusFilter)
      : enrichedTools;

    return NextResponse.json({
      success: true,
      tools: filteredTools,
      total: filteredTools.length,
    });
  } catch (error) {
    console.error("User tools fetch error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// ── POST: Update tool status ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const body = await request.json();
    const parsed = updateToolStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { toolId, status, rating, note } = parsed.data;

    // Verify tool exists
    const tool = await db.tool.findUnique({ where: { id: toolId } });
    if (!tool) {
      return NextResponse.json(
        { success: false, error: "Outil non trouvé" },
        { status: 404 },
      );
    }

    // Upsert tool status
    const toolStatus = await db.userToolStatus.upsert({
      where: {
        userId_toolId: { userId, toolId },
      },
      update: {
        status,
        rating: rating ?? undefined,
        note: note ?? undefined,
        adoptedAt: status === "adopted" ? new Date() : undefined,
      },
      create: {
        userId,
        toolId,
        status,
        rating: rating ?? undefined,
        note: note ?? undefined,
        adoptedAt: status === "adopted" ? new Date() : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      toolStatus,
    });
  } catch (error) {
    console.error("Tool status update error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
