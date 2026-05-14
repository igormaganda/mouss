import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await db.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'article" },
      { status: 500 }
    );
  }
}

// PUT - Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if article exists
    const existingArticle = await db.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    // Check if new slug is taken by another article
    if (body.slug && body.slug !== existingArticle.slug) {
      const slugTaken = await db.article.findUnique({
        where: { slug: body.slug },
      });

      if (slugTaken) {
        return NextResponse.json(
          { error: "Ce slug est déjà utilisé" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: {
      title?: string;
      slug?: string;
      excerpt?: string | null;
      content?: string | null;
      category?: string;
      thumbnail?: string | null;
      author?: string | null;
      isPublished?: boolean;
      isFeatured?: boolean;
    } = {};

    if (body.title) updateData.title = body.title;
    if (body.slug) updateData.slug = body.slug;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt || null;
    if (body.content !== undefined) updateData.content = body.content || null;
    if (body.category) updateData.category = body.category;
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail || null;
    if (body.author !== undefined) updateData.author = body.author || null;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;

    // Update article
    const article = await db.article.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ article, message: "Article modifié avec succès" });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'article" },
      { status: 500 }
    );
  }
}

// DELETE - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if article exists
    const existingArticle = await db.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    // Delete article
    await db.article.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Article supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article" },
      { status: 500 }
    );
  }
}
