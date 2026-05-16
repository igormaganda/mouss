import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Active subscriptions with pack info
    const activeSubs = await db.subscription.findMany({
      where: { status: "active" },
      include: { pack: true },
    });

    // MRR: sum of active subscription pack prices
    const mrr = activeSubs.reduce((sum, s) => sum + s.pack.price, 0);

    // Total revenue from completed orders
    const totalRevenueAgg = await db.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["completed"] } },
    });
    const totalRevenue = totalRevenueAgg._sum.total || 0;

    // Active subscriptions count
    const activeCount = await db.subscription.count({
      where: { status: "active" },
    });

    // Churn rate: cancelled + expired in last 30 days / (active + cancelled + expired in last 30 days)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const cancelledThisMonth = await db.subscription.count({
      where: {
        status: { in: ["cancelled", "expired"] },
        cancelledAt: { gte: startOfMonth },
      },
    });

    const totalActiveThisMonth = activeCount + cancelledThisMonth;
    const churnRate = totalActiveThisMonth > 0
      ? Math.round((cancelledThisMonth / totalActiveThisMonth) * 100)
      : 0;

    // New subscriptions this month
    const newThisMonth = await db.subscription.count({
      where: { createdAt: { gte: startOfMonth } },
    });

    // Pending invoices
    const pendingInvoices = await db.invoice.count({
      where: { status: { in: ["pending", "overdue"] } },
    });

    // Completed orders count
    const completedOrdersCount = await db.order.count({
      where: { status: "completed" },
    });

    // Revenue breakdown by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyOrders = await db.order.findMany({
      where: {
        status: "completed",
        completedAt: { gte: sixMonthsAgo },
      },
    });

    const revenueByMonth: Array<{ month: string; revenue: number; orders: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = monthDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

      const monthOrders = monthlyOrders.filter((o) => {
        if (!o.completedAt) return false;
        const orderMonth = `${o.completedAt.getFullYear()}-${String(o.completedAt.getMonth() + 1).padStart(2, "0")}`;
        return orderMonth === monthKey;
      });

      const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);

      revenueByMonth.push({
        month: monthLabel,
        revenue: Math.round(monthRevenue * 100) / 100,
        orders: monthOrders.length,
      });
    }

    return NextResponse.json({
      mrr: Math.round(mrr * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activeSubscriptions: activeCount,
      churnRate,
      newThisMonth,
      pendingInvoices,
      completedOrdersCount,
      revenueByMonth,
    });
  } catch (error) {
    console.error("Revenue API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
