import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { generateAuditResult } from "@/lib/audit-engine";

// ─── VALIDATION SCHEMA ─────────────────────────────────────────

const auditSchema = z.object({
  email: z.string().email("Email invalide"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  profile: z.enum(["etudiant", "salarie", "freelance", "tpe-pme"]),
  sector: z.string().min(1, "Le secteur est requis"),
  phase: z.enum(["reflexion", "creation", "gestion", "croissance"]),
  painPoints: z.array(z.string()).min(1, "Sélectionnez au moins une difficulté"),
  projectName: z.string().optional(),
  password: z.string().optional(),
  consent: z.boolean().default(true),
});

// ─── POST: Submit Audit ────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = auditSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // 1. Generate audit result using the engine
    const auditResultData = generateAuditResult(data);

    // 2. Determine regulated status
    const isRegulated = auditResultData.isRegulated;
    const regulatedProfession = auditResultData.regulatedProfession;

    // 3. Check if lead already exists
    const existingLead = await db.lead.findUnique({
      where: { email: data.email },
      include: { AuditResult: true },
    });

    // 4. Check if user already exists by email
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    let userId = existingUser?.id || null;
    let isNewUser = false;

    // 5. Create user account if password provided and no existing account
    if (data.password && !existingUser) {
      const bcrypt = (await import("bcryptjs")).default;
      const hashedPassword = await bcrypt.hash(data.password, 12);
      const newUser = await db.user.create({
        data: {
          email: data.email,
          name: `${data.firstName}${data.lastName ? ` ${data.lastName}` : ""}`,
          password: hashedPassword,
          newsletterSubscribed: true,
          newsletterSubscribedAt: new Date(),
          onboardingStep: 1,
          onboardingDone: false,
        },
      });

      userId = newUser.id;
      isNewUser = true;

      // Create onboarding with sector info
      await db.userOnboarding.create({
        data: {
          userId: newUser.id,
          profile: data.profile,
          sector: data.sector,
          phase: data.phase,
          company: data.projectName || null,
        },
      });

      // Create notification
      await db.userNotification.create({
        data: {
          userId: newUser.id,
          title: "Bienvenue sur Créa Entreprise !",
          message: `Votre compte a été créé suite à votre audit. Consultez vos recommandations personnalisées.`,
          type: "success",
          category: "audit",
          priority: "high",
          actionUrl: "/dashboard/audit",
          actionLabel: "Voir mon audit",
        },
      });
    }

    // 6. Upsert Lead
    if (existingLead) {
      await db.lead.update({
        where: { email: data.email },
        data: {
          firstName: data.firstName,
          lastName: data.lastName || null,
          phone: data.phone || null,
          profile: data.profile,
          sector: data.sector,
          phase: data.phase,
          painPoint: data.painPoints.join(", "),
          projectName: data.projectName || null,
          isRegulated,
          regulatedProfession,
          password: data.password || undefined,
          userId: userId || undefined,
          consent: data.consent,
          status: "audited",
        },
      });

      // Upsert AuditResult
      if (existingLead.AuditResult) {
        await db.auditResult.update({
          where: { leadId: existingLead.id },
          data: {
            profile: data.profile,
            sector: data.sector,
            phase: data.phase,
            painPoint: data.painPoints.join(", "),
            isRegulated,
            regulatedProfession,
            score: auditResultData.score,
            summary: auditResultData.summary,
            recommendations: auditResultData as any,
            regulatedWarnings: auditResultData.regulatoryAlerts?.join("\n") || null,
          },
        });
      } else {
        await db.auditResult.create({
          data: {
            leadId: existingLead.id,
            profile: data.profile,
            sector: data.sector,
            phase: data.phase,
            painPoint: data.painPoints.join(", "),
            isRegulated,
            regulatedProfession,
            score: auditResultData.score,
            summary: auditResultData.summary,
            recommendations: auditResultData as any,
            regulatedWarnings: auditResultData.regulatoryAlerts?.join("\n") || null,
          },
        });
      }
    } else {
      // Create new Lead
      const lead = await db.lead.create({
        data: {
          id: uuidv4(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName || null,
          phone: data.phone || null,
          profile: data.profile,
          sector: data.sector,
          phase: data.phase,
          painPoint: data.painPoints.join(", "),
          projectName: data.projectName || null,
          isRegulated,
          regulatedProfession,
          password: data.password || undefined,
          userId: userId || undefined,
          consent: data.consent,
          status: "audited",
        },
      });

      // Create AuditResult
      await db.auditResult.create({
        data: {
          id: uuidv4(),
          leadId: lead.id,
          profile: data.profile,
          sector: data.sector,
          phase: data.phase,
          painPoint: data.painPoints.join(", "),
          isRegulated,
          regulatedProfession,
          score: auditResultData.score,
          summary: auditResultData.summary,
          recommendations: auditResultData as any,
          regulatedWarnings: auditResultData.regulatoryAlerts?.join("\n") || null,
        },
      });
    }

    // 7. PDF will be generated on demand via /api/audit/pdf
    // (pdfmake requires fonts not available in standalone mode)

    // 8. Log email for future sending
    await db.emailLog.create({
      data: {
        to: data.email,
        subject: `Votre Audit de Lancement — ${auditResultData.score}/100`,
        body: `Audit généré pour ${data.firstName} ${data.lastName || ""} — Score: ${auditResultData.score}/100 — Profil: ${data.profile} — Secteur: ${data.sector}`,
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Audit créé avec succès",
        isNew: !existingLead,
        isNewUser,
        auditResult: auditResultData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// ─── PDF Generation (non-blocking, safe) ──────────────────────

async function generatePdfAsync(
  data: z.infer<typeof auditSchema>,
  auditResultData: ReturnType<typeof generateAuditResult>
) {
  try {
    const { generateAuditPdfContent } = await import("@/lib/pdf-generator");
    const PdfPrinter = (await import("pdfmake")).default;

    const docDefinition = generateAuditPdfContent(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        profile: data.profile,
        sector: data.sector,
        phase: data.phase,
      },
      auditResultData
    );

    return new Promise<void>((resolve) => {
      try {
        PdfPrinter.createPdf(docDefinition as any).getBuffer(async (buffer: Buffer) => {
          try {
            const base64 = buffer.toString("base64");
            const pdfUrl = `data:application/pdf;base64,${base64}`;
            const lead = await db.lead.findUnique({
              where: { email: data.email },
              include: { AuditResult: true },
            });
            if (lead?.AuditResult) {
              await db.auditResult.update({
                where: { leadId: lead.id },
                data: { pdfUrl },
              });
            }
          } catch (err) {
            console.error("PDF save error:", err);
          }
          resolve();
        });
      } catch (err) {
        console.error("PDF create error:", err);
        resolve();
      }
    });
  } catch (err) {
    console.error("PDF import error:", err);
  }
}

// ─── GET: Admin endpoint (protected in production) ─────────────

export async function GET() {
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { AuditResult: true },
    });

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("Audit GET error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
