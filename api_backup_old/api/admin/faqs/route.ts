import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all FAQs
export async function GET() {
  try {
    const faqs = await db.fAQ.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des FAQs" },
      { status: 500 }
    );
  }
}

// POST - Create new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, isPublished } = body;

    // Validation
    if (!question || !answer) {
      return NextResponse.json(
        { error: "La question et la réponse sont obligatoires" },
        { status: 400 }
      );
    }

    // Get max order
    const maxOrder = await db.fAQ.aggregate({
      _max: { order: true },
    });

    const order = (maxOrder._max.order || 0) + 1;

    // Create FAQ
    const faq = await db.fAQ.create({
      data: {
        question,
        answer,
        order,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ faq, message: "FAQ créée avec succès" });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la FAQ" },
      { status: 500 }
    );
  }
}
