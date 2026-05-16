import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/email-logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const campaignId = searchParams.get("campaignId");
    const exportCsv = searchParams.get("export") === "csv";

    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status;
    }
    if (search) {
      where.to = { contains: search, mode: "insensitive" };
    }
    if (campaignId) {
      where.campaignId = campaignId;
    }

    if (exportCsv) {
      // Export all logs as CSV
      const logs = await db.emailLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      const csvHeader = "ID,To,Subject,Status,Sent At,Opened At,Clicked At,Error\n";
      const csvRows = logs
        .map(
          (log) =>
            `"${log.id}","${log.to}","${log.subject.replace(/"/g, '""')}","${log.status}","${log.sentAt?.toISOString() || ""}","${log.openedAt?.toISOString() || ""}","${log.clickedAt?.toISOString() || ""}","${(log.error || "").replace(/"/g, '""')}"`
        )
        .join("\n");

      const csv = csvHeader + csvRows;
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=email-logs.csv",
        },
      });
    }

    const [logs, total] = await Promise.all([
      db.emailLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset || (page - 1) * limit,
        take: limit,
      }),
      db.emailLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Email logs fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
