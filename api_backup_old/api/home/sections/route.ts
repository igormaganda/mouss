import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    const sections = await db.homeSection.findMany({
      where: showAll ? {} : { active: true },
      include: {
        items: {
          orderBy: { order: "asc" },
          ...(showAll ? {} : { where: { active: true } }),
        },
      },
      orderBy: { order: "asc" },
    });

    const parsed = sections.map((section) => ({
      id: section.id,
      type: section.type,
      title: section.title,
      subtitle: section.subtitle || "",
      badge: section.badge || "",
      active: section.active,
      order: section.order,
      settings: section.settings ? JSON.parse(section.settings) : {},
      items: section.items.map((item) => ({
        id: item.id,
        label: item.label,
        content: item.content || "",
        icon: item.icon || "",
        color: item.color || "",
        active: item.active,
        data: item.data ? JSON.parse(item.data) : {},
        order: item.order,
      })),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching home sections:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des sections" },
      { status: 500 }
    );
  }
}
