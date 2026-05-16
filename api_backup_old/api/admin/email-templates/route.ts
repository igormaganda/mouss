import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const templateCreateSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  subject: z.string().min(1, "Sujet requis"),
  body: z.string().min(1, "Contenu requis"),
  category: z.enum(["welcome", "recommendation", "audit", "billing", "newsletter", "transactional"]).default("newsletter"),
  variables: z.string().optional(),
  active: z.boolean().default(true),
});

const templateUpdateSchema = templateCreateSchema.partial();

// GET /api/admin/email-templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (category && category !== "all") {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }

    const [templates, total] = await Promise.all([
      db.emailTemplate.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.emailTemplate.count({ where }),
    ]);

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Email templates fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/admin/email-templates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = templateCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const template = await db.emailTemplate.create({
      data: result.data,
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Email template create error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/admin/email-templates
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const result = templateUpdateSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const template = await db.emailTemplate.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Email template update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
