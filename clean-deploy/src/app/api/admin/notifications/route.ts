import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const notificationSchema = z.object({
  userId: z.string().optional(),
  segment: z.string().optional(),
  title: z.string().min(1, "Titre requis"),
  message: z.string().min(1, "Message requis"),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
  category: z.string().default("general"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
});

// POST /api/admin/notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = notificationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, segment, title, message, type, category, priority, actionUrl, actionLabel } = result.data;

    // If userId provided, create notification for that user
    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json(
          { error: "Utilisateur non trouvé" },
          { status: 404 }
        );
      }

      const notification = await db.notification.create({
        data: {
          userId,
          title,
          content: message,
          type,
          link: actionUrl,
          metadata: {
            category,
            priority,
            actionLabel,
          },
        },
      });

      return NextResponse.json({
        success: true,
        count: 1,
        notification,
      });
    }

    // If segment provided, broadcast to all users matching that segment
    if (segment) {
      const users = await db.user.findMany({
        where: {
          isActive: true,
        },
        select: { id: true },
      });

      // For now, create notifications for all active users
      // In production, you could match against UserOnboarding.profile
      const targetUsers = users;

      if (targetUsers.length === 0) {
        return NextResponse.json({
          success: true,
          count: 0,
          message: "Aucun utilisateur correspondant trouve",
        });
      }

      const notifications = await db.notification.createMany({
        data: targetUsers.map((user) => ({
          userId: user.id,
          title,
          content: message,
          type,
          link: actionUrl,
          metadata: {
            category,
            priority,
            actionLabel,
          },
        })),
      });

      return NextResponse.json({
        success: true,
        count: notifications.count,
        message: `Notification envoyee a ${notifications.count} utilisateur(s)`,
      });
    }

    // If neither userId nor segment, return error
    return NextResponse.json(
      { error: "userId ou segment requis" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Notification send error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
