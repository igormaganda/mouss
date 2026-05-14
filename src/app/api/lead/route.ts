import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const leadSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  postalCode: z.string().optional(),
  housingType: z.string().optional(),
  concern: z.string().optional(),
  message: z.string().optional(),
  consentRGPD: z.literal(true, {
    message: "Vous devez accepter la politique de confidentialité",
  }),
  consentNewsletter: z.boolean().default(false),
  formSource: z.string().default("unknown"),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  consentRGPD: z.literal(true, {
    message: "Vous devez accepter la politique de confidentialité",
  }),
});

const newsletterSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  consentRGPD: z.literal(true, {
    message: "Vous devez accepter la politique de confidentialité",
  }),
  source: z.string().optional().default("footer"),
});

function getClientInfo(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return { ip, userAgent };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = body.type || "lead";

    if (type === "contact") {
      const contactData = contactSchema.parse(body);
      const { ip, userAgent } = getClientInfo(request);

      await db.contactRequest.create({
        data: {
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          email: contactData.email,
          phone: contactData.phone || null,
          subject: contactData.subject || null,
          message: contactData.message,
          consentRGPD: contactData.consentRGPD,
          ipAddress: ip,
          userAgent,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message:
            "Votre message a bien été envoyé. Nous vous répondrons sous 24h.",
        },
        { status: 201 }
      );
    }

    if (type === "newsletter") {
      const newsletterData = newsletterSchema.parse(body);
      const { ip } = getClientInfo(request);

      try {
        await db.newsletterSubscription.create({
          data: {
            email: newsletterData.email,
            consentRGPD: newsletterData.consentRGPD,
            source: newsletterData.source,
            ipAddress: ip,
          },
        });
      } catch {
        // Email already exists - still return success
      }

      return NextResponse.json(
        {
          success: true,
          message: "Merci ! Vous êtes inscrit(e) à notre newsletter.",
        },
        { status: 201 }
      );
    }

    // Default: lead form
    const leadData = leadSchema.parse(body);
    const { ip, userAgent } = getClientInfo(request);

    await db.lead.create({
      data: {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone || null,
        postalCode: leadData.postalCode || null,
        housingType: leadData.housingType || null,
        concern: leadData.concern || null,
        message: leadData.message || null,
        consentRGPD: leadData.consentRGPD,
        consentNewsletter: leadData.consentNewsletter,
        formSource: leadData.formSource,
        utmSource: leadData.utmSource || null,
        utmMedium: leadData.utmMedium || null,
        utmCampaign: leadData.utmCampaign || null,
        ipAddress: ip,
        userAgent,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Votre demande de devis a bien été enregistrée. Nous vous contacterons sous 24h.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Données invalides",
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur serveur est survenue. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
