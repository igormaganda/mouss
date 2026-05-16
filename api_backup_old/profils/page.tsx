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
  GraduationCap,
  Briefcase,
  Laptop,
  Building2,
  ArrowRight,
  ArrowLeft,
  Users,
} from "lucide-react";

const profiles = [
  {
    id: "etudiant",
    title: "L'Etudiant Entrepreneur",
    description:
      "Etudier et entreprendre en parallele. Beneficiez du statut d'auto-entrepreneur ou etudiant-entrepreneur pour lancer votre premier projet sans risque financier.",
    icon: GraduationCap,
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    borderHover: "hover:border-violet-300 dark:hover:border-violet-700",
    tagline: "Etudier & entreprendre",
    solutions: [
      "Auto-entrepreneur gratuit",
      "Abby (compta gratuite)",
      "Indy Basic (gratuit)",
      "ACRE (exoneration charges)",
    ],
    needs: ["Statut simple", "Cout reduit", "Flexibilite"],
  },
  {
    id: "salarie",
    title: "Le Salarie en Transition",
    description:
      "Securiser le lancement avant de quitter son poste ou cumuler les deux activites. Anticipez les impacts fiscaux et optimisez votre transition.",
    icon: Briefcase,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    borderHover: "hover:border-amber-300 dark:hover:border-amber-700",
    tagline: "Securiser & transitionner",
    solutions: [
      "Cumul emploi + auto-entrepreneur",
      "Simulation impact fiscal",
      "Assurance perte d'emploi",
      "Accompagnement juridique",
    ],
    needs: [
      "Securite financiere",
      "Conseil juridique",
      "Simulation revenus",
    ],
  },
  {
    id: "freelance",
    title: "Le Freelance / Auto-entrepreneur",
    description:
      "Besoin de simplicite et de gratuit pour demarrer. Concentrez-vous sur votre activite grace aux outils automatises et gratuits.",
    icon: Laptop,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    borderHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
    tagline: "Simplicite & efficacite",
    solutions: [
      "Indy Basic (gratuit)",
      "Abby (gratuit)",
      "Shine par Qonto (gratuit)",
      "Tiime (gratuit)",
    ],
    needs: ["Gratuite", "Automatisation", "Interface simple"],
  },
  {
    id: "tpe-pme",
    title: "La TPE / PME",
    description:
      "Besoin de gestion d'equipe et de flux complexes. Equipez votre entreprise avec des outils professionnels adaptes a votre taille.",
    icon: Building2,
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    borderHover: "hover:border-sky-300 dark:hover:border-sky-700",
    tagline: "Gestion & performance",
    solutions: [
      "Qonto Business",
      "Pennylane (compta complete)",
      "HubSpot CRM (gratuit)",
      "PayFit (paie)",
    ],
    needs: [
      "Gestion d'equipe",
      "Comptabilite avancee",
      "Outils collaboratifs",
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

export default function ProfilsPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-400/30 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            <Badge className="mb-6 px-5 py-2 text-sm font-semibold bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Users className="h-4 w-4 mr-2" />
              Trouvez votre profil
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Quel entrepreneur etes-vous ?
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Les besoins juridiques et bancaires different radicalement selon
              votre profil. Identifiez le votre pour recevoir des
              recommandations ciblees.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Intro text */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Chaque profil entrepreneurial a des besoins specifiques. Que vous
            soyez etudiant, salarie en transition, freelance ou dirigeant de
            TPE/PME, decouvrez les solutions adaptees a votre situation et vos
            priorites.
          </p>
        </div>
      </section>

      {/* Profile Cards Grid */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {profiles.map((profile) => (
              <motion.div key={profile.id} variants={itemVariants}>
                <Card
                  className={`group h-full transition-all duration-300 hover:shadow-xl ${profile.borderHover} hover:-translate-y-1 flex flex-col`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${profile.color} shadow-sm`}
                      >
                        <profile.icon className="h-6 w-6" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {profile.tagline}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{profile.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {profile.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    {/* Solutions */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Solutions adaptees
                      </p>
                      <div className="space-y-1.5">
                        {profile.solutions.map((sol) => (
                          <div
                            key={sol}
                            className="flex items-center gap-2 text-sm text-foreground/80"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {sol}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Needs */}
                    <div className="pt-3 border-t mt-auto">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Vos priorites
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.needs.map((need) => (
                          <Badge
                            key={need}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {need}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href="/quizz"
                      className="block pt-2"
                    >
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                        Decouvrir mon audit
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
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
            className="rounded-2xl bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30 border border-violet-200/50 dark:border-violet-800/30 p-8 sm:p-12 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Pas sur de votre profil ?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Repondez a quelques questions et notre algorithme identifiera
              votre profil entrepreneurial avec precision. Recevez ensuite des
              recommandations personnalisees.
            </p>
            <Link
              href="/quizz"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Lancer le quizz
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
