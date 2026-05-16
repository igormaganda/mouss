import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const progress = await db.userProgress.findMany({
      where: { userId },
      include: { task: true },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { taskId, completed } = body;

    if (!taskId || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "taskId et completed sont requis" },
        { status: 400 }
      );
    }

    // Verify task exists
    const task = await db.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 });
    }

    // Upsert progress
    const progress = await db.userProgress.upsert({
      where: {
        userId_taskId: { userId, taskId },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId,
        taskId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
