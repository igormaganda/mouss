import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all articles
export async function GET() {
  try {
    const articles = await db.article.findMany({
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des articles" },
      { status: 500 }
    );
  }
}

// POST - Create new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      thumbnail,
      author,
      isPublished,
      isFeatured,
    } = body;

    // Validation
    if (!title || !slug) {
      return NextResponse.json(
        { error: "Le titre est obligatoire" },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existingArticle = await db.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: "Un article avec ce slug existe déjà" },
        { status: 400 }
      );
    }

    // Create article
    const article = await db.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        category: category || "sport",
        thumbnail: thumbnail || null,
        author: author || null,
        isPublished: isPublished ?? true,
        isFeatured: isFeatured ?? false,
      },
    });

    return NextResponse.json({ article, message: "Article créé avec succès" });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'article" },
      { status: 500 }
    );
  }
}
