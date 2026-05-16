import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorise" }, { status: 401 });
    }

    const userEmail = session.user.email!;

    const orders = await db.order.findMany({
      where: { email: userEmail },
      include: {
        Payment: { select: { status: true, stripePaymentId: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const invoices = await db.invoice.findMany({
      where: { email: userEmail },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({
        id: o.id,
        packName: o.packName,
        amount: o.amount,
        currency: o.currency,
        status: o.status,
        paymentStatus: o.Payment?.status ?? "pending",
        createdAt: o.createdAt,
      })),
      invoices: invoices.map((i) => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        amount: i.amount,
        currency: i.currency,
        status: i.status,
        pdfUrl: i.pdfUrl,
        createdAt: i.createdAt,
      })),
    });
  } catch (error) {
    console.error("User orders fetch error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
