import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, orderId, email } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId requis" },
        { status: 400 }
      );
    }

    // Find the most recent exit intent log for this session and mark as converted
    const log = await db.exitIntentLog.findFirst({
      where: {
        sessionId,
        shown: true,
        converted: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (log) {
      await db.exitIntentLog.update({
        where: { id: log.id },
        data: {
          converted: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Conversion enregistree",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Aucun log exit-intent trouve",
    });
  } catch (error) {
    console.error("Exit intent convert error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
