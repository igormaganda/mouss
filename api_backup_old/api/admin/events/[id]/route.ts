import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await db.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            child: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'événement" },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if event exists
    const existingEvent = await db.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      title?: string;
      description?: string | null;
      type?: string;
      category?: string | null;
      location?: string | null;
      address?: string | null;
      startDate?: Date;
      endDate?: Date | null;
      capacity?: number | null;
      price?: number | null;
      isPublished?: boolean;
      isFeatured?: boolean;
    } = {};

    if (body.title) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.type) updateData.type = body.type;
    if (body.category !== undefined) updateData.category = body.category || null;
    if (body.location !== undefined) updateData.location = body.location || null;
    if (body.address !== undefined) updateData.address = body.address || null;
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.capacity !== undefined) updateData.capacity = body.capacity ? parseInt(body.capacity) : null;
    if (body.price !== undefined) updateData.price = body.price ? parseFloat(body.price) : null;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;

    // Update event
    const event = await db.event.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ event, message: "Événement modifié avec succès" });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'événement" },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if event exists
    const existingEvent = await db.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    // Delete registrations first
    await db.registration.deleteMany({
      where: { eventId: id },
    });

    // Delete event
    await db.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Événement supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'événement" },
      { status: 500 }
    );
  }
}
