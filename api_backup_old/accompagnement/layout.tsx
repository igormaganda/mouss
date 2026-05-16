import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accompagnement Entreprise | Créa Entreprise",
  description:
    "12 services d'accompagnement pour TPE/PME : marketing digital, community management, lead generation, business plan, copilote entreprise, DAF externalisé, SEO, création de site web, formation et juridique. À partir de 149€.",
  keywords: [
    "accompagnement entreprise",
    "coaching entrepreneur",
    "marketing digital TPE",
    "community management",
    "lead generation B2B",
    "business plan",
    "DAF externalisé",
    "SEO TPE",
    "création site web",
    "formation entrepreneur",
    "juridique TPE",
    "recouvrement de créances",
  ],
  openGraph: {
    title: "Accompagnement Entreprise | Créa Entreprise",
    description:
      "12 services d'accompagnement pour propulser votre TPE/PME. Du marketing au juridique, un partenaire unique pour votre croissance.",
    siteName: "Créa Entreprise",
    type: "website",
  },
};

export default function AccompagnementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
