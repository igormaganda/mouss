import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentMethod } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId est requis" },
        { status: 400 }
      );
    }

    // Fetch the order with relations
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { pack: true, subscription: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    if (order.status === "completed") {
      return NextResponse.json(
        { error: "Cette commande a déjà été traitée" },
        { status: 400 }
      );
    }

    const now = new Date();

    // Update order status
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        status: "completed",
        completedAt: now,
        paymentMethod: paymentMethod || order.paymentMethod,
      },
      include: { pack: true },
    });

    // Update payment status
    const updatedPayment = await db.payment.updateMany({
      where: { orderId },
      data: {
        status: "succeeded",
      },
    });

    // Create or extend subscription
    let subscription = order.subscription;

    if (!subscription) {
      const periodStart = now;
      const periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      const nextBilling = new Date(periodEnd);
      nextBilling.setDate(nextBilling.getDate() - 1);

      subscription = await db.subscription.create({
        data: {
          userId: order.userId,
          leadId: order.leadId,
          packId: order.packId,
          status: "active",
          paymentMethod: paymentMethod || order.paymentMethod,
          providerCustomerId: `cus_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
          providerSubscriptionId: `sub_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
          lastBillingDate: now,
          nextBillingDate: nextBilling,
        },
        include: { pack: true },
      });

      // Link order to subscription
      await db.order.update({
        where: { id: orderId },
        data: { subscriptionId: subscription.id },
      });
    } else {
      // Extend existing subscription
      const periodEnd = new Date(subscription.currentPeriodEnd);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      const nextBilling = new Date(periodEnd);
      nextBilling.setDate(nextBilling.getDate() - 1);

      subscription = await db.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "active",
          currentPeriodEnd: periodEnd,
          lastBillingDate: now,
          nextBillingDate: nextBilling,
        },
        include: { pack: true },
      });
    }

    // Create invoice
    const invoiceNumber = `FAC-${now.getFullYear()}-${String(Date.now()).slice(-6)}`;
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 30);

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        subscriptionId: subscription.id,
        userId: order.userId,
        orderId: order.id,
        amount: order.amount,
        tax: order.tax,
        total: order.total,
        currency: order.currency,
        status: "paid",
        dueDate,
        paidAt: now,
        stripeInvoiceId: `in_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`,
      },
    });

    return NextResponse.json({
      subscription,
      invoice,
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de l'abonnement" },
      { status: 500 }
    );
  }
}
