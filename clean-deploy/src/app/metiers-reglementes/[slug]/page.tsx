import type { Metadata } from "next";
import { ProfessionDetailPage } from "./profession-detail-page";

// ─── Profession titles for metadata ───────────────────────────────────────────

const PROFESSION_TITLES: Record<string, string> = {
  medecin: "Médecin",
  infirmier: "Infirmier libéral",
  pharmacien: "Pharmacien",
  dentiste: "Chirurgien-dentiste",
  kinesitherapeute: "Kinésithérapeute",
  "sage-femme": "Sage-femme",
  avocat: "Avocat",
  notaire: "Notaire",
  "expert-comptable": "Expert-comptable",
  "courtier-assurance": "Courtier en assurance",
  "agent-immobilier": "Agent immobilier",
  "btp-artisan": "Artisan BTP",
  architecte: "Architecte",
  diagnostiqueur: "Diagnostiqueur immobilier",
  "rge-entrepreneur": "Entrepreneur RGE",
  restaurateur: "Restaurateur",
  boulanger: "Boulanger pâtissier",
  "boucher-charcutier": "Boucher charcutier",
  caviste: "Caviste",
  "taxi-vtc": "Taxi / VTC",
  "transporteur-marchandises": "Transporteur marchandises",
  demenagementur: "Déménageur professionnel",
  coiffeur: "Coiffeur barbier",
  estheticienne: "Esthéticienne",
  "coach-sportif": "Coach sportif",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = PROFESSION_TITLES[slug] || "Métier réglementé";

  return {
    title: `${title} | Métiers Réglementés | Créa Entreprise`,
    description: `Guide complet pour créer votre entreprise en tant que ${title}. Diplômes, autorités, démarches et conseils d'experts.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProfessionDetailPage slug={slug} />;
}
