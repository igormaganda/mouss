import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.packFeatureCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Admin pack features GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des fonctionnalités" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { categories } = body as {
      categories: {
        id?: string;
        name: string;
        order: number;
        active: boolean;
        items: {
          id?: string;
          name: string;
          order: number;
          hasCreation: boolean;
          hasPro: boolean;
          hasPremium: boolean;
          active: boolean;
        }[];
      }[];
    };

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: "Format invalide: categories requis" },
        { status: 400 }
      );
    }

    // Collect all item IDs that should remain
    const keepItemIds = new Set<string>();
    const keepCategoryIds = new Set<string>();

    for (const cat of categories) {
      if (cat.id) keepCategoryIds.add(cat.id);
      for (const item of cat.items) {
        if (item.id) keepItemIds.add(item.id);
      }
    }

    // Delete items not in the payload (belonging to existing categories)
    const existingCategories = await db.packFeatureCategory.findMany({
      select: { id: true },
    });
    const existingCatIds = new Set(existingCategories.map((c) => c.id));

    for (const existingCatId of existingCatIds) {
      if (!keepCategoryIds.has(existingCatId)) {
        // Category was removed entirely (cascade deletes items)
        await db.packFeatureCategory.delete({ where: { id: existingCatId } });
      }
    }

    for (const keepCatId of keepCategoryIds) {
      // Delete items that belong to this category but are not in the payload
      await db.packFeatureItem.deleteMany({
        where: {
          categoryId: keepCatId,
          id: { notIn: Array.from(keepItemIds) },
        },
      });
    }

    // Upsert categories and their items
    const result = await db.$transaction(
      categories.map((cat) => {
        const categoryData = {
          name: cat.name,
          order: cat.order,
          active: cat.active,
        };

        if (cat.id) {
          return db.packFeatureCategory.update({
            where: { id: cat.id },
            data: {
              ...categoryData,
              items: {
                deleteMany: {
                  id: { notIn: cat.items.map((i) => i.id).filter(Boolean) },
                },
                upsert: cat.items.map((item) => ({
                  where: item.id ? { id: item.id } : { id: "__never__" },
                  create: {
                    name: item.name,
                    order: item.order,
                    hasCreation: item.hasCreation,
                    hasPro: item.hasPro,
                    hasPremium: item.hasPremium,
                    active: item.active,
                  },
                  update: {
                    name: item.name,
                    order: item.order,
                    hasCreation: item.hasCreation,
                    hasPro: item.hasPro,
                    hasPremium: item.hasPremium,
                    active: item.active,
                  },
                })),
              },
            },
            include: { items: { orderBy: { order: "asc" } } },
          });
        } else {
          return db.packFeatureCategory.create({
            data: {
              ...categoryData,
              items: {
                create: cat.items.map((item) => ({
                  name: item.name,
                  order: item.order,
                  hasCreation: item.hasCreation,
                  hasPro: item.hasPro,
                  hasPremium: item.hasPremium,
                  active: item.active,
                })),
              },
            },
            include: { items: { orderBy: { order: "asc" } } },
          });
        }
      })
    );

    return NextResponse.json({
      message: "Matrice sauvegardée avec succès",
      categories: result,
    });
  } catch (error) {
    console.error("Admin pack features PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}
