import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const subscriptionId = searchParams.get("subscriptionId");

    if (!userId && !subscriptionId) {
      return NextResponse.json(
        { error: "userId ou subscriptionId est requis" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (subscriptionId) where.subscriptionId = subscriptionId;

    const invoices = await db.invoice.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
        subscription: {
          include: {
            pack: { select: { id: true, name: true, slug: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Invoices fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des factures" },
      { status: 500 }
    );
  }
}
