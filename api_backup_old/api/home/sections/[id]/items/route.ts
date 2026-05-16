import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const items = await db.homeSectionItem.findMany({
      where: { sectionId: id },
      orderBy: { order: "asc" },
    });

    const parsed = items.map((item) => ({
      ...item,
      data: item.data ? JSON.parse(item.data) : {},
    }));

    return NextResponse.json({ items: parsed });
  } catch (error) {
    console.error("Failed to fetch section items:", error);
    return NextResponse.json(
      { error: "Failed to fetch section items" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { label, content, icon, color, data, active, order } = body;

    const item = await db.homeSectionItem.create({
      data: {
        sectionId: id,
        label: label ?? "",
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

    return NextResponse.json(
      {
        ...item,
        data: item.data ? JSON.parse(item.data) : {},
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create section item:", error);
    return NextResponse.json(
      { error: "Failed to create section item" },
      { status: 500 }
    );
  }
}
