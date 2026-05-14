"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Landmark,
  Receipt,
  Shield,
  ArrowRight,
  Scale,
  Megaphone,
  Users,
} from "lucide-react";
import { ComparisonDialog } from "@/components/sections/comparison-dialog";

// ─── THEME CONFIG ─────────────────────────────────────────────────

const themes = [
  {
    id: "creation",
    icon: Building,
    title: "Création d'entreprise",
    description:
      "Choisissez votre statut juridique (SASU, EURL, SARL, auto-entrepreneur) et lancez votre activité en quelques jours.",
    items: [
      "Comparatif des statuts juridiques",
      "Guide immatriculation en ligne",
      "Documents constitutifs",
      "Kbis et extrait d'immatriculation",
    ],
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    // Comparison dialog props
    category: "legal",
    categoryLabel: "Création d'entreprise",
    categoryColor: "emerald",
  },
  {
    id: "banque",
    icon: Landmark,
    title: "Banque & Finance",
    description:
      "Comparez les comptes pro, terminaux de paiement et prets professionnels pour optimiser vos finances.",
    items: [
      "Comparatif banques pro en ligne",
      "Terminal de paiement sans engagement",
      "Pret professionnel & credit",
      "Financement participatif",
    ],
    color: "from-amber-500 to-amber-700",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    category: "bank",
    categoryLabel: "Banque & Finance",
    categoryColor: "amber",
  },
  {
    id: "compta",
    icon: Receipt,
    title: "Comptabilité & Facturation",
    description:
      "Logiciels de paie, gestion des notes de frais et expert-comptable en ligne pour une compta sans prise de tete.",
    items: [
      "Logiciels de comptabilite",
      "Facturation et relances automatisées",
      "Gestion des notes de frais",
      "Expert-comptable en ligne",
    ],
    color: "from-sky-500 to-sky-700",
    bgColor: "bg-sky-50 dark:bg-sky-950/30",
    iconColor: "text-sky-600 dark:text-sky-400",
    category: "compta",
    categoryLabel: "Comptabilité & Facturation",
    categoryColor: "sky",
  },
  {
    id: "assurances",
    icon: Shield,
    title: "Assurances",
    description:
      "RC Pro, mutuelle TNS, prévoyance et assurance décennale : protégez votre activité selon votre métier.",
    items: [
      "RC Pro par métier (VTC, IT, BTP)",
      "Mutuelle TNS & prévoyance",
      "Assurance décennale obligatoire",
      "Comparatif des offres",
    ],
    color: "from-rose-500 to-rose-700",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    category: "assurance",
    categoryLabel: "Assurances",
    categoryColor: "rose",
  },
  {
    id: "juridique",
    icon: Scale,
    title: "Juridique",
    description:
      "Contrats, mentions légales, protection de marque : tous les outils pour être en règle et proteger votre activité.",
    items: [
      "Générateur de contrats",
      "Mentions legales et CGV",
      "Depot de marque",
      "Protection de la propriete intellectuelle",
    ],
    color: "from-violet-500 to-violet-700",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    category: "legal",
    categoryLabel: "Juridique",
    categoryColor: "violet",
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Marketing & CRM",
    description:
      "Email marketing, CRM, automation et outils de croissance pour attirer et fideliser vos clients.",
    items: [
      "Email marketing & newsletters",
      "CRM pour gerer vos prospects",
      "Automatisation marketing",
      "Campagnes publicitaires",
    ],
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    category: "marketing",
    categoryLabel: "Marketing",
    categoryColor: "orange",
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

// ─── COMPONENT ────────────────────────────────────────────────────

export function ThematicSection() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const activeTheme = themes.find((t) => t.id === activeDialog);

  return (
    <section className="hidden md:block py-10 sm:py-14 bg-muted/30" id="solutions">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
          >
            Navigation Thematique
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explorez par theme
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Vous avez deja un besoin précis ? Accédez directement a nos guides
            et comparatifs classes par thematique.
          </p>
        </div>

        {/* Theme Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              variants={itemVariants}
              onClick={() => setActiveDialog(theme.id)}
              className={`group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
            >
              {/* Color accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.color}`}
              />

              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${theme.bgColor}`}
                  >
                    <theme.icon className={`h-7 w-7 ${theme.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{theme.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-6 space-y-2.5">
                  {theme.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-foreground/80 group-hover:text-foreground transition-colors"
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${theme.color} opacity-60`}
                      />
                      {item}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6 pt-4 border-t">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                    Voir le comparatif complet
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Comparison Dialog */}
      {activeTheme && (
        <ComparisonDialog
          open={activeDialog !== null}
          onOpenChange={(open) => {
            if (!open) setActiveDialog(null);
          }}
          category={activeTheme.category}
          categoryLabel={activeTheme.categoryLabel}
          categoryColor={activeTheme.categoryColor}
          categoryBgColor={activeTheme.bgColor}
          categoryIconColor={activeTheme.iconColor}
        />
      )}
    </section>
  );
}
