import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalLeads = await db.lead.count();
    const convertedLeads = await db.lead.count({ where: { status: "converted" } });
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
    const estimatedRevenue = await db.affiliateClick.aggregate({
      _sum: { revenue: true },
    });

    // Leads per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const leadsPerDay = await db.lead.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    });

    const dailyData = leadsPerDay.map((item) => ({
      date: item.createdAt.toISOString().split("T")[0],
      leads: item._count.id,
    }));

    // Leads by profile
    const leadsByProfile = await db.lead.groupBy({
      by: ["profile"],
      _count: { id: true },
    });

    const profileData = leadsByProfile.map((item) => ({
      profile: item.profile,
      count: item._count.id,
    }));

    // Recent leads
    const recentLeads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Top tools by clicks
    const topTools = await db.tool.findMany({
      include: { _count: { select: { clicks: true } } },
      orderBy: { clicks: { _count: "desc" } },
      take: 5,
    });

    const topToolsData = topTools.map((tool) => ({
      name: tool.name,
      clicks: tool._count.clicks,
    }));

    return NextResponse.json({
      totalLeads,
      convertedLeads,
      conversionRate,
      estimatedRevenue: estimatedRevenue._sum.revenue || 0,
      leadsPerDay: dailyData,
      leadsByProfile: profileData,
      recentLeads,
      topTools: topToolsData,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
