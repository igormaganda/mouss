import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const taskUpdateSchema = z.object({
  phase: z.enum(["reflexion", "creation", "gestion", "croissance"]).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
});

type Params = Promise<{ id: string }>;

// GET /api/admin/tasks/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const task = await db.task.findUnique({
      where: { id },
      include: {
        progress: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Tâche non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Admin task GET error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tasks/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = taskUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const task = await db.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json(
        { error: "Tâche non trouvée" },
        { status: 404 }
      );
    }

    const updated = await db.task.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error("Admin task PUT error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tasks/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const task = await db.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json(
        { error: "Tâche non trouvée" },
        { status: 404 }
      );
    }

    await db.task.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Tâche supprimée",
    });
  } catch (error) {
    console.error("Admin task DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
