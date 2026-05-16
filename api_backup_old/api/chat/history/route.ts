import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// ── GET: Chat history ───────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? ((session.user as Record<string, unknown>).id as string) : null;

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Le paramètre sessionId est requis" },
        { status: 400 },
      );
    }

    // Build where clause: always require sessionId, optionally require userId
    const where: Record<string, unknown> = { sessionId };
    if (userId) {
      where.userId = userId;
    }

    const messages = await db.chatMessage.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: 50,
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      messages,
      count: messages.length,
      sessionId,
    });
  } catch (error) {
    console.error("Chat history error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
