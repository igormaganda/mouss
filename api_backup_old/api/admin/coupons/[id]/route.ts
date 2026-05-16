import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      code,
      type,
      value,
      description,
      packId,
      minAmount,
      maxUses,
      startDate,
      endDate,
      active,
      usedCount,
    } = body;

    const existing = await db.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon non trouvé" }, { status: 404 });
    }

    // Check code uniqueness if changing
    if (code && code.toUpperCase() !== existing.code) {
      const codeExists = await db.coupon.findUnique({
        where: { code: code.toUpperCase() },
      });
      if (codeExists) {
        return NextResponse.json(
          { error: "Ce code promo existe déjà" },
          { status: 409 }
        );
      }
    }

    const coupon = await db.coupon.update({
      where: { id },
      data: {
        ...(code ? { code: code.toUpperCase() } : {}),
        ...(type ? { type } : {}),
        ...(value !== undefined ? { value: parseInt(value, 10) } : {}),
        ...(description !== undefined ? { description: description || null } : {}),
        ...(packId !== undefined ? { packId: packId || null } : {}),
        ...(minAmount !== undefined ? { minAmount: parseInt(minAmount, 10) || 0 } : {}),
        ...(maxUses !== undefined ? { maxUses: parseInt(maxUses, 10) || 0 } : {}),
        ...(startDate !== undefined
          ? { startDate: startDate ? new Date(startDate) : null }
          : {}),
        ...(endDate !== undefined
          ? { endDate: endDate ? new Date(endDate) : null }
          : {}),
        ...(active !== undefined ? { active } : {}),
        ...(usedCount !== undefined ? { usedCount: parseInt(usedCount, 10) } : {}),
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Admin coupon update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon non trouvé" }, { status: 404 });
    }

    // Soft delete
    const coupon = await db.coupon.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Admin coupon delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
