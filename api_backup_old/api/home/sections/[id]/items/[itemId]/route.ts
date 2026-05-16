import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params;
    const body = await request.json();
    const { label, content, icon, color, data, active, order } = body;

    const item = await db.homeSectionItem.update({
      where: { id: itemId },
      data: {
        ...(label !== undefined && { label }),
        ...(content !== undefined && { content }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
        ...(data !== undefined && {
          data: typeof data === "string" ? data : JSON.stringify(data),
        }),
        ...(active !== undefined && { active }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({
      ...item,
      data: item.data ? JSON.parse(item.data) : {},
    });
  } catch (error) {
    console.error("Failed to update section item:", error);
    return NextResponse.json(
      { error: "Failed to update section item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;

    await db.homeSectionItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete section item:", error);
    return NextResponse.json(
      { error: "Failed to delete section item" },
      { status: 500 }
    );
  }
}
