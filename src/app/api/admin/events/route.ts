import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all events
export async function GET() {
  try {
    const events = await db.event.findMany({
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des événements" },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      category,
      location,
      address,
      startDate,
      endDate,
      capacity,
      price,
      isPublished,
      isFeatured,
    } = body;

    // Validation
    if (!title || !startDate) {
      return NextResponse.json(
        { error: "Le titre et la date de début sont obligatoires" },
        { status: 400 }
      );
    }

    // Create event
    const event = await db.event.create({
      data: {
        title,
        description: description || null,
        type: type || "training",
        category: category || null,
        location: location || null,
        address: address || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        capacity: capacity ? parseInt(capacity) : null,
        price: price ? parseFloat(price) : null,
        isPublished: isPublished ?? true,
        isFeatured: isFeatured ?? false,
      },
    });

    return NextResponse.json({ event, message: "Événement créé avec succès" });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'événement" },
      { status: 500 }
    );
  }
}
