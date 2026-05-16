import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const singleEmailSchema = z.object({
  to: z.string().email("Email invalide"),
  subject: z.string().min(1, "Sujet requis"),
  body: z.string().min(1, "Contenu requis"),
  templateId: z.string().optional(),
});

const campaignSendSchema = z.object({
  campaignId: z.string().min(1, "ID campagne requis"),
  sendNow: z.boolean().default(true),
});

// POST /api/admin/email-send
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a single email send or campaign send
    if (body.campaignId) {
      const result = campaignSendSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: "Donnees invalides", details: result.error.flatten() },
          { status: 400 }
        );
      }
      return handleCampaignSend(result.data);
    }

    const result = singleEmailSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }
    return handleSingleSend(result.data);
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function handleSingleSend(data: z.infer<typeof singleEmailSchema>) {
  const { to, subject, body, templateId } = data;

  // Create email log
  const emailLog = await db.emailLog.create({
    data: {
      to,
      subject,
      body,
      templateId,
      status: "sent",
      sentAt: new Date(),
    },
  });

  // Log to console (production would use SendGrid/Mailgun)
  console.log(`📧 Email sent to: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Body preview: ${body.substring(0, 100)}...`);
  console.log(`   Log ID: ${emailLog.id}`);

  return NextResponse.json({
    success: true,
    sentCount: 1,
    logIds: [emailLog.id],
  });
}

async function handleCampaignSend(data: z.infer<typeof campaignSendSchema>) {
  const { campaignId } = data;

  const campaign = await db.emailCampaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    return NextResponse.json(
      { error: "Campagne non trouvée" },
      { status: 404 }
    );
  }

  if (campaign.status === "sent") {
    return NextResponse.json(
      { error: "Cette campagne a deja ete envoyee" },
      { status: 400 }
    );
  }

  // Get leads matching the segment
  const where: Record<string, unknown> = { consent: true };
  if (campaign.segment && campaign.segment !== "all") {
    where.profile = campaign.segment;
  }

  const leads = await db.lead.findMany({
    where,
    select: { email: true, firstName: true, lastName: true },
  });

  if (leads.length === 0) {
    return NextResponse.json(
      { error: "Aucun lead trouve pour ce segment" },
      { status: 400 }
    );
  }

  // Create email logs for each lead
  const emailLogs = [];
  for (const lead of leads) {
    const emailLog = await db.emailLog.create({
      data: {
        campaignId,
        to: lead.email,
        subject: campaign.subject,
        body: campaign.body,
        status: "sent",
        sentAt: new Date(),
      },
    });
    emailLogs.push(emailLog);

    console.log(`📧 Campaign email sent to: ${lead.email}`);
  }

  // Update campaign status and sent count
  const updatedCampaign = await db.emailCampaign.update({
    where: { id: campaignId },
    data: {
      status: "sent",
      sentAt: new Date(),
      sentCount: leads.length,
    },
  });

  console.log(
    `Campaign "${campaign.name}" sent to ${leads.length} leads`
  );

  return NextResponse.json({
    success: true,
    sentCount: leads.length,
    logIds: emailLogs.map((log) => log.id),
    campaign: updatedCampaign,
  });
}
