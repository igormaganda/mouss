import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subtitle, badge, active, order, settings } = body;

    const section = await db.homeSection.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(badge !== undefined && { badge }),
        ...(active !== undefined && { active }),
        ...(order !== undefined && { order }),
        ...(settings !== undefined && {
          settings: typeof settings === "string" ? settings : JSON.stringify(settings),
        }),
      },
      include: {
        items: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json({
      ...section,
      settings: section.settings ? JSON.parse(section.settings) : {},
      items: section.items.map((item) => ({
        ...item,
        data: item.data ? JSON.parse(item.data) : {},
      })),
    });
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
