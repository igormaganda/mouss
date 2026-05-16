import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

// ── PUT: Mark single notification as read ───────────────────────────────────

export async function PUT(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const { id } = await context.params;

    const notification = await db.userNotification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Notification non trouvée" },
        { status: 404 },
      );
    }

    const updated = await db.userNotification.update({
      where: { id },
      data: { read: true, readAt: new Date() },
    });

    return NextResponse.json({ success: true, notification: updated });
  } catch (error) {
    console.error("Notification mark-read error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// ── DELETE: Delete a notification ───────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const { id } = await context.params;

    const notification = await db.userNotification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Notification non trouvée" },
        { status: 404 },
      );
    }

    await db.userNotification.delete({ where: { id } });

    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    console.error("Notification delete error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
