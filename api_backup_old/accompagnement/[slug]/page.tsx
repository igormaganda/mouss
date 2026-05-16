import type { Metadata } from "next";
import { ServiceDetailPage } from "./service-detail-page";

// ─── Service titles for static generation ─────────────────────────────────────

const SERVICE_TITLES: Record<string, string> = {
  "marketing-digital": "Marketing Digital",
  "community-management": "Community Management",
  "supports-communication": "Supports de Communication",
  "lead-generation": "Lead Generation B2B",
  "business-plan": "Business Plan & Prévisionnel Financier",
  recouvrement: "Recouvrement de Créances",
  "copilote-entreprise": "Copilote Entreprise",
  "daf-externalise": "DAF Externalisé & Pilotage Financier",
  "seo-referencement": "SEO & Référencement Naturel",
  "creation-site-web": "Création & Refonte de Site Web",
  formation: "Formation & Montée en Compétences",
  "juridique-ongoing": "Juridique & Conformité Ongoing",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = SERVICE_TITLES[slug] || "Service";

  return {
    title: `${title} | Accompagnement | Créa Entreprise`,
    description: `Découvrez notre service ${title} pour votre TPE/PME. Accompagnement professionnel, résultats concrets.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceDetailPage slug={slug} />;
}
