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
  Lightbulb,
  FileText,
  Settings,
  Rocket,
  ArrowRight,
} from "lucide-react";

const phases = [
  {
    id: "reflexion",
    days: "J1 - J15",
    title: "Phase de Réflexion",
    description:
      "Je cherche mon idee ou je valide mon business model. Trouvez votre concept, testez votre marché et structurez votre projet.",
    icon: Lightbulb,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    solutions: [
      { name: "Outils de Business Plan", partner: "WiziShop" },
      { name: "Simulateurs de Revenus", partner: "Le Coin des Entrepreneurs" },
      { name: "Étude de Marché", partner: "Statista" },
    ],
  },
  {
    id: "creation",
    days: "J31 - J60",
    title: "Phase de Création",
    description:
      "Je lance les demarches administratives. Choisissez votre statut juridique et immatriculez votre entreprise en ligne.",
    icon: FileText,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    solutions: [
      { name: "Immatriculation en ligne", partner: "Legalstart" },
      { name: "Documents juridiques", partner: "Captain Contrat" },
      { name: "Création SASU / SARL", partner: "LegalPlace" },
    ],
  },
  {
    id: "gestion",
    days: "J61 - J80",
    title: "Phase de Gestion",
    description:
      "J'optimise mon organisation et ma compta. Automatisez votre comptabilité et simplifiez votre quotidien.",
    icon: Settings,
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    badgeColor: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
    solutions: [
      { name: "Banque pro en ligne", partner: "Qonto" },
      { name: "Comptabilité automatisée", partner: "Indy" },
      { name: "Facturation & Compta", partner: "Pennylane" },
    ],
  },
  {
    id: "croissance",
    days: "J81 - J100",
    title: "Phase de Croissance",
    description:
      "Je veux accélérer mon impact. Recrutez, automatisez votre marketing et développez votre chiffre d'affaires.",
    icon: Rocket,
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
    solutions: [
      { name: "CRM & Pipeline", partner: "HubSpot" },
      { name: "Recrutement", partner: "Welcome to the Jungle" },
      { name: "Marketing automation", partner: "Brevo" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function RoadmapSection() {
  return (
    <section id="roadmap" className="hidden md:block py-10 sm:py-14 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
          >
            Roadmap de Création
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Votre parcours, etape par etape
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Suivez notre guide structure en 4 phases pour passer de l'idee
            a la creation, puis a la croissance de votre entreprise.
          </p>
        </div>

        {/* Roadmap Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Connection line (desktop only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-200 via-emerald-200 to-rose-200 dark:from-amber-800 dark:via-emerald-800 dark:to-rose-800" />

          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              variants={itemVariants}
              className={`relative ${index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:col-start-2"}`}
            >
              {/* Timeline dot */}
              <div
                className={`hidden md:flex absolute top-8 w-4 h-4 rounded-full border-4 border-background ${
                  index % 2 === 0
                    ? "right-[-8px]"
                    : "left-[-8px]"
                }`}
                style={{
                  backgroundColor:
                    phase.id === "reflexion"
                      ? "oklch(0.769 0.188 70.08)"
                      : phase.id === "creation"
                        ? "oklch(0.696 0.17 162.48)"
                        : phase.id === "gestion"
                          ? "oklch(0.765 0.177 163.223)"
                          : "oklch(0.769 0.188 70.08)",
                }}
              />

              <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${phase.color}`}
                    >
                      <phase.icon className="h-6 w-6" />
                    </div>
                    <Badge
                      variant="outline"
                      className={phase.badgeColor}
                    >
                      {phase.days}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-3">{phase.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {phase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Solutions recommandees
                    </p>
                    {phase.solutions.map((sol) => (
                      <div
                        key={sol.name}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/50 group-hover:bg-primary/5 transition-colors"
                      >
                        <span className="text-sm font-medium">{sol.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {sol.partner}
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </div>
                    ))}
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
