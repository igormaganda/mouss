import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const postUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  published: z.boolean().optional(),
  authorId: z.string().min(1).optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
});

type Params = Promise<{ id: string }>;

// GET /api/admin/posts/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const post = await db.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Admin post GET error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/posts/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = postUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const post = await db.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changing
    if (result.data.slug && result.data.slug !== post.slug) {
      const existing = await db.post.findUnique({
        where: { slug: result.data.slug },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Un article avec ce slug existe deja" },
          { status: 409 }
        );
      }
    }

    // Check author exists if changing
    if (result.data.authorId) {
      const author = await db.user.findUnique({
        where: { id: result.data.authorId },
      });
      if (!author) {
        return NextResponse.json(
          { error: "Auteur non trouvé" },
          { status: 404 }
        );
      }
    }

    const updated = await db.post.update({
      where: { id },
      data: result.data,
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ post: updated });
  } catch (error) {
    console.error("Admin post PUT error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const post = await db.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    await db.post.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Article supprimé",
    });
  } catch (error) {
    console.error("Admin post DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
