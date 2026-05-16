"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building,
  Landmark,
  Receipt,
  Shield,
  Scale,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── THEME CONFIG ─────────────────────────────────────────────────

interface ThemeConfig {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  gradient: string;
  accentBar: string;
  iconBg: string;
  iconColor: string;
  dotColor: string;
  badgeVariant: "emerald" | "amber" | "sky" | "rose" | "violet" | "orange";
}

const themes: ThemeConfig[] = [
  {
    id: "creation",
    icon: Building,
    title: "Création d'entreprise",
    description:
      "Choisissez votre statut juridique (SASU, EURL, SARL, auto-entrepreneur) et lancez votre activité en quelques jours.",
    items: [
      "Comparatif statuts",
      "Guide immatriculation",
      "Documents constitutifs",
      "Kbis",
    ],
    gradient: "from-emerald-600 to-teal-600",
    accentBar: "from-emerald-500 to-emerald-700",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
    badgeVariant: "emerald",
  },
  {
    id: "banque",
    icon: Landmark,
    title: "Banque & Finance",
    description:
      "Comparez les comptes pro, terminaux de paiement et prêts professionnels pour optimiser vos finances.",
    items: [
      "Comparatif banques pro",
      "Terminal paiement",
      "Prêt professionnel",
      "Financement participatif",
    ],
    gradient: "from-amber-600 to-amber-800",
    accentBar: "from-amber-500 to-amber-700",
    iconBg: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
    badgeVariant: "amber",
  },
  {
    id: "compta",
    icon: Receipt,
    title: "Comptabilité & Facturation",
    description:
      "Logiciels de paie, gestion des notes de frais et expert-comptable en ligne pour une compta sans prise de tête.",
    items: [
      "Logiciels compta",
      "Facturation auto",
      "Notes de frais",
      "Expert-comptable en ligne",
    ],
    gradient: "from-sky-600 to-sky-800",
    accentBar: "from-sky-500 to-sky-700",
    iconBg: "bg-sky-50 dark:bg-sky-950/30",
    iconColor: "text-sky-600 dark:text-sky-400",
    dotColor: "bg-sky-500",
    badgeVariant: "sky",
  },
  {
    id: "assurances",
    icon: Shield,
    title: "Assurances",
    description:
      "RC Pro, mutuelle TNS, prévoyance et assurance décennale : protégez votre activité selon votre métier.",
    items: [
      "RC Pro par métier",
      "Mutuelle TNS",
      "Assurance décennale",
      "Comparatif offres",
    ],
    gradient: "from-rose-600 to-rose-800",
    accentBar: "from-rose-500 to-rose-700",
    iconBg: "bg-rose-50 dark:bg-rose-950/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    dotColor: "bg-rose-500",
    badgeVariant: "rose",
  },
  {
    id: "juridique",
    icon: Scale,
    title: "Juridique",
    description:
      "Contrats, mentions légales, protection de marque : tous les outils pour être en règle et protéger votre activité.",
    items: [
      "Générateur contrats",
      "Mentions légales/CGV",
      "Dépôt de marque",
      "Protection PI",
    ],
    gradient: "from-violet-600 to-violet-800",
    accentBar: "from-violet-500 to-violet-700",
    iconBg: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    dotColor: "bg-violet-500",
    badgeVariant: "violet",
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Marketing & CRM",
    description:
      "Email marketing, CRM, automation et outils de croissance pour attirer et fidéliser vos clients.",
    items: [
      "Email marketing",
      "CRM",
      "Automation",
      "Campagnes pub",
    ],
    gradient: "from-orange-600 to-orange-800",
    accentBar: "from-orange-500 to-orange-700",
    iconBg: "bg-orange-50 dark:bg-orange-950/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    dotColor: "bg-orange-500",
    badgeVariant: "orange",
  },
];

// ─── ANIMATION VARIANTS ──────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ─── BADGE COLOR MAP ─────────────────────────────────────────────

const badgeColorMap: Record<string, string> = {
  emerald:
    "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  amber:
    "border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  sky: "border-sky-500/30 text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30",
  rose: "border-rose-500/30 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30",
  violet:
    "border-violet-500/30 text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30",
  orange:
    "border-orange-500/30 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30",
};

// ─── PAGE COMPONENT ──────────────────────────────────────────────

export default function SolutionsPage() {
  const handleCardClick = (theme: ThemeConfig) => {
    toast.info(`Bientôt disponible : Comparatif ${theme.title}`, {
      description: "Cette section est en cours de préparation.",
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Retour à l&apos;accueil
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <Badge
              variant="outline"
              className="mb-5 px-4 py-1.5 text-sm font-medium border-white/30 text-white bg-white/10"
            >
              Navigation Thématique
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Explorez par thème
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-emerald-100/90 leading-relaxed max-w-2xl mx-auto">
              Vous avez déjà un besoin précis ? Accédez directement à nos guides
              et comparatifs classés par thématique pour avancer plus vite.
            </p>
          </div>
        </div>
      </section>

      {/* ── Theme Cards Grid ─────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <motion.div
                  key={theme.id}
                  variants={itemVariants}
                  onClick={() => handleCardClick(theme)}
                  className="group cursor-pointer"
                >
                  <Card className="relative overflow-hidden rounded-2xl py-0 gap-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/60">
                    {/* Color accent bar */}
                    <div
                      className={`h-1 w-full bg-gradient-to-r ${theme.accentBar}`}
                    />

                    <CardHeader className="pb-0 pt-6 px-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${theme.iconBg} transition-transform duration-300 group-hover:scale-110`}
                        >
                          <Icon className={`h-7 w-7 ${theme.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl">
                            {theme.title}
                          </CardTitle>
                          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                            {theme.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-0">
                      {/* Items list */}
                      <div className="mt-4 space-y-2.5">
                        {theme.items.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-2.5 text-sm text-foreground/80 group-hover:text-foreground transition-colors"
                          >
                            <div
                              className={`h-1.5 w-1.5 rounded-full ${theme.dotColor} opacity-60 shrink-0`}
                            />
                            {item}
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="px-6 pt-4 pb-6">
                      <div className="w-full pt-4 border-t border-border/60">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                          Voir le comparatif
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
