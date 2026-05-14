"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileQuestion,
  Wallet,
  Calculator,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const painPoints = [
  {
    id: "administratif",
    icon: FileQuestion,
    title: "Je suis perdu dans l'administratif",
    description:
      "Trop de demarches, trop de jargon, trop de Paperasse. Trouvez votre chemin avec notre guide structuré.",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    solutions: [
      "Création clé en main en ligne",
      "Guides pas-a-pas par statut",
      "Assistance juridique illimitee",
      "Templates de documents",
    ],
    affiliatePartners: ["Legalstart", "Captain Contrat"],
  },
  {
    id: "frais-bancaires",
    icon: Wallet,
    title: "Mes frais bancaires sont trop eleves",
    description:
      "Les banques traditionnelles prélèvent des frais disproportionnés. Comparez les offres gratuites et sans conditions.",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    solutions: [
      "Comparatif des banques pro gratuites",
      "Carte CB sans frais a l'etranger",
      "Virements SEPA gratuits et illimites",
      "Sous-comptes et budget intelligent",
    ],
    affiliatePartners: ["Qonto", "Shine", "N26 Business"],
  },
  {
    id: "compta",
    icon: Calculator,
    title: "Je n'ai pas le temps pour ma compta",
    description:
      "La compta vous fait perdre des heures precieuses. Automatisez-la grace a la synchronisation bancaire intelligente.",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    solutions: [
      "Synchronisation bancaire automatique",
      "Categorisation intelligente des ecritures",
      "Declarations URSSAF automatiques",
      "Bilan et compte de resultat en 1 clic",
    ],
    affiliatePartners: ["Indy", "Tiime", "Freebe"],
  },
  {
    id: "juridique",
    icon: ShieldAlert,
    title: "Je crains les risques juridiques",
    description:
      "Une erreur juridique peut couter cher. Protégez votre activité avec les assurances adaptées a votre métier.",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    solutions: [
      "RC Pro par métier (VTC, IT, Artisan)",
      "Mutuelle TNS & prévoyance",
      "Assurance décennale obligatoire",
      "Protection juridique entreprise",
    ],
    affiliatePartners: ["Hiscox", "Simplit", "Abeille Assurances"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function PainPointsSection() {
  return (
    <section id="solutions" className="hidden md:block py-10 sm:py-14 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
          >
            Vos Frustrations
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quelle est votre plus grande difficulte ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cibler votre frustration nous permet de vous orienter vers la
            solution la plus pertinente. Pas de perte de temps, juste des
            resultats concrets.
          </p>
        </div>

        {/* Pain Point Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {painPoints.map((pain) => (
            <motion.div key={pain.id} variants={itemVariants}>
              <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${pain.color}`}
                    >
                      <pain.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-snug">
                        {pain.title}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1.5 leading-relaxed">
                        {pain.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Solutions list */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Ce que nous vous proposons
                    </p>
                    {pain.solutions.map((sol) => (
                      <div
                        key={sol}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-foreground/80">{sol}</span>
                      </div>
                    ))}
                  </div>

                  {/* Partners */}
                  <div className="pt-3 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Partenaires :
                      </span>
                      <div className="flex gap-1.5">
                        {pain.affiliatePartners.map((partner) => (
                          <Badge
                            key={partner}
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {partner}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <a href="#audit" className="shrink-0">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                        Comparer
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
