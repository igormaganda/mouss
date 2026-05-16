import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// ── Validation schemas ──────────────────────────────────────────────────────

const createNotificationSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  message: z.string().min(1, "Le message est requis"),
  type: z.enum(["info", "success", "warning", "urgent", "recommendation"]).optional(),
  category: z.enum(["general", "audit", "tools", "billing", "system", "recommendation"]).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  actionUrl: z.string().url().optional().or(z.literal("")),
  actionLabel: z.string().optional(),
});

const markReadSchema = z.object({
  ids: z.array(z.string()).min(1, "Au moins un ID est requis"),
});

// ── Helpers ─────────────────────────────────────────────────────────────────

function requireAuth() {
  return async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { error: NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 }) };
    }
    const userId = (session.user as Record<string, unknown>).id as string;
    return { userId, session };
  };
}

// ── GET: List notifications ─────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const { searchParams } = new URL(request.url);

    const unreadOnly = searchParams.get("unread") === "true";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const where: Record<string, unknown> = { userId };
    if (unreadOnly) where.read = false;

    const [notifications, total, unreadCount] = await Promise.all([
      db.userNotification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      db.userNotification.count({ where }),
      db.userNotification.count({
        where: { userId, read: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      notifications,
      total,
      unreadCount,
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// ── POST: Create notification ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const body = await request.json();
    const parsed = createNotificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const notification = await db.userNotification.create({
      data: {
        userId,
        title: parsed.data.title,
        message: parsed.data.message,
        type: parsed.data.type ?? "info",
        category: parsed.data.category ?? "general",
        priority: parsed.data.priority ?? "normal",
        actionUrl: parsed.data.actionUrl || null,
        actionLabel: parsed.data.actionLabel || null,
      },
    });

    return NextResponse.json({ success: true, notification }, { status: 201 });
  } catch (error) {
    console.error("Notification create error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// ── PUT: Mark notifications as read ─────────────────────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const body = await request.json();
    const parsed = markReadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await db.userNotification.updateMany({
      where: {
        id: { in: parsed.data.ids },
        userId,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      updated: result.count,
    });
  } catch (error) {
    console.error("Notifications mark-read error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
