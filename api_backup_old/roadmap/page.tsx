"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
  ArrowLeft,
  Calendar,
} from "lucide-react";

const phases = [
  {
    id: "reflexion",
    days: "J1 - J15",
    title: "Phase de Reflexion",
    description:
      "Je cherche mon idee ou je valide mon business model. Trouvez votre concept, testez votre marche et structurez votre projet.",
    icon: Lightbulb,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    badgeColor:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    gradient: "from-amber-500 to-amber-600",
    dotColor: "bg-amber-500",
    solutions: [
      { name: "Outils de Business Plan", partner: "WiziShop" },
      {
        name: "Simulateurs de Revenus",
        partner: "Le Coin des Entrepreneurs",
      },
      { name: "Etude de Marche", partner: "Statista" },
    ],
  },
  {
    id: "creation",
    days: "J31 - J60",
    title: "Phase de Creation",
    description:
      "Je lance les demarches administratives. Choisissez votre statut juridique et immatriculez votre entreprise en ligne.",
    icon: FileText,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    badgeColor:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    gradient: "from-emerald-500 to-emerald-600",
    dotColor: "bg-emerald-500",
    solutions: [
      { name: "Immatriculation en ligne", partner: "Legalstart" },
      { name: "Documents juridiques", partner: "Captain Contrat" },
      { name: "Creation SASU / SARL", partner: "LegalPlace" },
    ],
  },
  {
    id: "gestion",
    days: "J61 - J80",
    title: "Phase de Gestion",
    description:
      "J'optimise mon organisation et ma compta. Automatisez votre comptabilite et simplifiez votre quotidien.",
    icon: Settings,
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    badgeColor:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
    gradient: "from-sky-500 to-sky-600",
    dotColor: "bg-sky-500",
    solutions: [
      { name: "Banque pro en ligne", partner: "Qonto" },
      { name: "Comptabilite automatisee", partner: "Indy" },
      { name: "Facturation & Compta", partner: "Pennylane" },
    ],
  },
  {
    id: "croissance",
    days: "J81 - J100",
    title: "Phase de Croissance",
    description:
      "Je veux accelerer mon impact. Recrutez, automatisez votre marketing et developpez votre chiffre d'affaires.",
    icon: Rocket,
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    badgeColor:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
    gradient: "from-rose-500 to-rose-600",
    dotColor: "bg-rose-500",
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
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2, ease: "easeOut" },
  },
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Back to home link */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour a l&apos;accueil
        </Link>
      </div>

      {/* Hero Banner */}
      <motion.section
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden py-20 sm:py-28"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-emerald-400 to-emerald-600 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300/40 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            <Badge className="mb-6 px-5 py-2 text-sm font-semibold bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Calendar className="h-4 w-4 mr-2" />
              100 Jours Pour Entreprendre
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Roadmap des 100 Jours
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Votre parcours, etape par etape
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Intro text */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Suivez notre guide structure en 4 phases pour passer de l&apos;idee
            a la creation, puis a la croissance de votre entreprise. A chaque
            etape, decouvrez les outils et solutions recommandees par notre
            communaute d&apos;entrepreneurs.
          </p>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          >
            {/* Connection line (desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-emerald-300 to-rose-300 dark:from-amber-800 dark:via-emerald-800 dark:to-rose-800 -translate-x-1/2" />

            {phases.map((phase, index) => (
              <motion.div
                key={phase.id}
                variants={itemVariants}
                className={`relative ${
                  index % 2 === 0
                    ? "md:pr-16"
                    : "md:pl-16 md:col-start-2"
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`hidden md:flex absolute top-8 w-5 h-5 rounded-full border-4 border-background shadow-lg ${
                    index % 2 === 0 ? "right-[-10px]" : "left-[-10px]"
                  } ${phase.dotColor}`}
                />

                <Card className="group h-full transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${phase.color} shadow-sm`}
                      >
                        <phase.icon className="h-7 w-7" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`${phase.badgeColor} text-sm font-semibold px-3 py-1`}
                      >
                        {phase.days}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-3">
                      {phase.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {phase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Solutions recommandees
                      </p>
                      {phase.solutions.map((sol) => (
                        <div
                          key={sol.name}
                          className="flex items-center justify-between gap-2 p-3 rounded-lg bg-muted/50 group-hover:bg-primary/5 transition-colors"
                        >
                          <span className="text-sm font-medium">
                            {sol.name}
                          </span>
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

      {/* Bottom CTA */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/30 dark:to-emerald-950/30 border border-amber-200/50 dark:border-emerald-800/30 p-8 sm:p-12 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Pret a commencer votre parcours ?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Decouvrez votre profil entrepreneurial et recevez un audit
              personnalise pour accelerer votre lancement.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Recevoir mon audit gratuit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
