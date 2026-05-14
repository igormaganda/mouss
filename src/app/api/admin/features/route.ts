import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, AuthError } from "@/lib/security";

// ─── GET: Fetch all features with pack access info for admin ──────────────

export async function GET() {
  try {
    await requireAdmin();

    const features = await db.feature.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
      include: {
        packs: {
          include: {
            pack: {
              select: { slug: true, name: true, active: true, order: true },
            },
          },
        },
      },
    });

    const packs = await db.pack.findMany({
      orderBy: { order: "asc" },
      select: { id: true, slug: true, name: true, active: true },
    });

    // Group features by category
    const categoryMap = new Map<string, typeof features>();

    for (const feature of features) {
      const cat = feature.category;
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push(feature);
    }

    const categories = Array.from(categoryMap.entries()).map(
      ([name, categoryFeatures]) => ({
        name,
        features: categoryFeatures.map((f) => {
          const packsMap: Record<string, boolean> = {};
          for (const pf of f.packs) {
            packsMap[pf.pack.slug] = pf.enabled;
          }
          return {
            id: f.id,
            name: f.name,
            slug: f.slug,
            category: f.category,
            order: f.order,
            active: f.active,
            packs: packsMap,
          };
        }),
      })
    );

    return NextResponse.json({
      categories,
      packs,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Admin fetch features error:", error);
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}

// ─── PUT: Update feature access for a specific pack/feature ───────────────

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { featureId, packId, enabled } = body;

    if (!featureId || !packId || typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: featureId, packId, enabled" },
        { status: 400 }
      );
    }

    // Upsert the PackFeature record
    const packFeature = await db.packFeature.upsert({
      where: {
        packId_featureId: {
          packId,
          featureId,
        },
      },
      update: {
        enabled,
      },
      create: {
        packId,
        featureId,
        enabled,
      },
    });

    return NextResponse.json({
      success: true,
      packFeature: {
        id: packFeature.id,
        enabled: packFeature.enabled,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Admin update feature error:", error);
    return NextResponse.json(
      { error: "Failed to update feature access" },
      { status: 500 }
    );
  }
}
