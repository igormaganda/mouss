import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// ── Validation schemas ──────────────────────────────────────────────────────

const saveStepSchema = z.object({
  step: z.number().int().min(1).max(10),
  data: z.object({
    profile: z.string().optional(),
    company: z.string().optional(),
    sector: z.string().optional(),
    phase: z.string().optional(),
    goals: z.string().optional(),
  }).optional(),
});

// ── GET: Retrieve onboarding data ───────────────────────────────────────────

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        onboardingStep: true,
        onboardingDone: true,
        onboarding: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      onboardingStep: user.onboardingStep,
      onboardingDone: user.onboardingDone,
      onboarding: user.onboarding,
    });
  } catch (error) {
    console.error("Onboarding fetch error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// ── POST: Save onboarding step ──────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const body = await request.json();
    const parsed = saveStepSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { step, data } = parsed.data;
    const isFinalStep = step >= 4;

    // Upsert onboarding record
    const existing = await db.userOnboarding.findUnique({
      where: { userId },
    });

    const onboardingData = {
      ...(existing?.profile ? { profile: existing.profile } : {}),
      ...(existing?.company ? { company: existing.company } : {}),
      ...(existing?.sector ? { sector: existing.sector } : {}),
      ...(existing?.phase ? { phase: existing.phase } : {}),
      ...(existing?.goals ? { goals: existing.goals } : {}),
      ...(data ?? {}),
    };

    const onboarding = await db.userOnboarding.upsert({
      where: { userId },
      update: {
        ...onboardingData,
        ...(isFinalStep ? { completedAt: new Date() } : {}),
      },
      create: {
        userId,
        profile: data?.profile,
        company: data?.company,
        sector: data?.sector,
        phase: data?.phase,
        goals: data?.goals,
        ...(isFinalStep ? { completedAt: new Date() } : {}),
      },
    });

    // Update user step + completion flag
    const user = await db.user.update({
      where: { id: userId },
      data: {
        onboardingStep: step,
        onboardingDone: isFinalStep ? true : undefined,
      },
    });

    // ── Generate personalized notifications on completion ──────────────────

    if (isFinalStep) {
      const notifications: Array<{
        title: string;
        message: string;
        type: string;
        category: string;
        priority: string;
        actionUrl?: string;
        actionLabel?: string;
      }> = [];

      // Welcome notification
      notifications.push({
        title: "Bienvenue sur Créa Entreprise ! 🎉",
        message: `Bienvenue ${user.name || ""} ! Votre parcours entrepreneurial commence maintenant. Explorez nos outils et ressources pour lancer votre projet.`,
        type: "success",
        category: "system",
        priority: "high",
      });

      // Recommended tools notification
      notifications.push({
        title: "Outils recommandés pour vous",
        message: "Découvrez les outils que nous avons sélectionnés spécialement pour votre profil. Consultez vos recommandations personnalisées.",
        type: "recommendation",
        category: "tools",
        priority: "normal",
        actionUrl: "/outils",
        actionLabel: "Voir les outils",
      });

      // Profile-specific notifications
      const profile = onboarding.profile?.toLowerCase();
      const phase = onboarding.phase?.toLowerCase();

      if (profile === "freelance" || profile === "auto-entrepreneur") {
        notifications.push({
          title: "Comptabilité : les outils indispensables",
          message: "En tant que freelance, une bonne gestion comptable est essentielle. Découvrez nos outils de compta recommandés pour simplifier vos déclarations.",
          type: "recommendation",
          category: "tools",
          priority: "normal",
          actionUrl: "/outils",
          actionLabel: "Voir la comptabilité",
        });
      }

      if (phase === "creation") {
        notifications.push({
          title: "Création d'entreprise : outils juridiques",
          message: "Vous êtes en phase de création ! Découvrez nos outils juridiques pour faciliter vos démarches d'immatriculation et de statuts.",
          type: "recommendation",
          category: "tools",
          priority: "high",
          actionUrl: "/outils",
          actionLabel: "Outils juridiques",
        });
      }

      // Create all notifications in parallel
      await Promise.all(
        notifications.map((n) =>
          db.userNotification.create({
            data: {
              userId,
              title: n.title,
              message: n.message,
              type: n.type,
              category: n.category,
              priority: n.priority,
              actionUrl: n.actionUrl ?? null,
              actionLabel: n.actionLabel ?? null,
            },
          }),
        ),
      );
    }

    return NextResponse.json({
      success: true,
      onboardingStep: step,
      onboardingDone: isFinalStep,
      onboarding,
    });
  } catch (error) {
    console.error("Onboarding save error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
