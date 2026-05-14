import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimitCheck } from "@/lib/auth-helpers";

/**
 * Public tasks endpoint - returns only active tasks.
 * Used by user dashboard progress page.
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limit: max 30 requests per IP per minute
    const rateLimitResult = rateLimitCheck(request, "public:tasks", 30, 60_000);
    if (rateLimitResult) return rateLimitResult;

    const tasks = await db.task.findMany({
      where: { active: true },
      orderBy: [{ phase: "asc" }, { order: "asc" }],
      select: {
        id: true,
        phase: true,
        title: true,
        description: true,
        order: true,
        active: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Public tasks fetch error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
