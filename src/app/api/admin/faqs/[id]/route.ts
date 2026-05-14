import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch single FAQ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faq = await db.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return NextResponse.json(
        { error: "FAQ non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ faq });
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la FAQ" },
      { status: 500 }
    );
  }
}

// PUT - Update FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if FAQ exists
    const existingFAQ = await db.fAQ.findUnique({
      where: { id },
    });

    if (!existingFAQ) {
      return NextResponse.json(
        { error: "FAQ non trouvée" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      question?: string;
      answer?: string;
      order?: number;
      isPublished?: boolean;
    } = {};

    if (body.question) updateData.question = body.question;
    if (body.answer) updateData.answer = body.answer;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;

    // Update FAQ
    const faq = await db.fAQ.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ faq, message: "FAQ modifiée avec succès" });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de la FAQ" },
      { status: 500 }
    );
  }
}

// DELETE - Delete FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if FAQ exists
    const existingFAQ = await db.fAQ.findUnique({
      where: { id },
    });

    if (!existingFAQ) {
      return NextResponse.json(
        { error: "FAQ non trouvée" },
        { status: 404 }
      );
    }

    // Delete FAQ
    await db.fAQ.delete({
      where: { id },
    });

    return NextResponse.json({ message: "FAQ supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la FAQ" },
      { status: 500 }
    );
  }
}
