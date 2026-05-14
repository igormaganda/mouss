"use client";

import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  BarChart3,
  ClipboardList,
  Search,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

// ─── DOCUMENT TYPES ──────────────────────────────────────────────

interface DocumentType {
  id: string;
  icon: LucideIcon;
  name: string;
  description: string;
  sections: string[];
  featured?: boolean;
}

const documents: DocumentType[] = [
  {
    id: "plan-affaires",
    icon: FileText,
    name: "Plan d'Affaires",
    description:
      "Document complet pour présenter votre projet aux banques, investisseurs et partenaires. Inclut tous les éléments légaux et financiers.",
    sections: [
      "Résumé opérationnel & présentation du projet",
      "Statut juridique & forme sociale",
      "Capital social & répartition des parts",
      "Immatriculation & formalités de création",
      "Prévisions financières sur 3 ans",
      "Analyse SWOT & stratégie de développement",
    ],
    featured: true,
  },
  {
    id: "plan-marketing",
    icon: BarChart3,
    name: "Plan Marketing",
    description:
      "Stratégie marketing complète avec positionnement, canaux d'acquisition et plan d'action pour lancer et développer votre activité.",
    sections: [
      "Analyse du marché cible & persona client",
      "Positionnement & proposition de valeur",
      "Stratégie de prix & politique commerciale",
      "Plan de communication & canaux d'acquisition",
      "Budget marketing & KPI de performance",
      "Calendrier de lancement & actions prioritaires",
    ],
    featured: true,
  },
  {
    id: "sommaire-executif",
    icon: BookOpen,
    name: "Sommaire Exécutif",
    description:
      "Résumé percutant de votre plan d'affaires pour convaincre en 2 pages. Idéal pour les banques et investisseurs.",
    sections: [
      "Présentation de l'opportunité",
      "Problème identifié & solution proposée",
      "Modèle économique & sources de revenus",
      "Avantages concurrentiels clés",
      "Besoin en financement & projections",
    ],
  },
  {
    id: "guide-creation",
    icon: ClipboardList,
    name: "Guide de Création d'Entreprise",
    description:
      "Guide pas-à-pas avec toutes les étapes, les statuts juridiques et les formalités pour lancer votre entreprise sereinement.",
    sections: [
      "Choix du statut juridique (SASU, EURL, SARL, micro-entreprise)",
      "Étapes de création de A à Z",
      "Formalités d'immatriculation",
      "Obligations comptables & fiscales",
      "Aides & dispositifs de financement",
      "Checklist des démarches administratives",
    ],
  },
  {
    id: "plan-etude-marche",
    icon: Search,
    name: "Plan d'Étude de Marché",
    description:
      "Analyse approfondie du marché, de la concurrence et de la segmentation client pour valider la viabilité de votre projet.",
    sections: [
      "Taille du marché & tendances",
      "Analyse de la concurrence directe & indirecte",
      "Segmentation & ciblage client",
      "Enquêtes terrain & sondages",
      "Validation de la demande",
      "Opportunités & menaces du marché",
    ],
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

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ─── COMPONENT ────────────────────────────────────────────────────

export function DocumentsSection() {
  const featured = documents.filter((d) => d.featured);
  const standard = documents.filter((d) => !d.featured);

  return (
    <section className="py-20 sm:py-28 bg-muted/30" id="documents">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Intelligence Artificielle
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Générez vos documents professionnels avec{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              l&apos;IA
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Notre intelligence artificielle crée pour vous des documents sur
            mesure, adaptés à votre projet et conformes aux exigences légales
            françaises. Gagnez des heures de travail en quelques clics.
          </p>
        </motion.div>

        {/* Featured Documents Grid (2 columns) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        >
          {featured.map((doc) => (
            <motion.div key={doc.id} variants={itemVariants} className="flex">
              <DocumentCard doc={doc} />
            </motion.div>
          ))}
        </motion.div>

        {/* Standard Documents Grid (3 columns) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {standard.map((doc) => (
            <motion.div key={doc.id} variants={itemVariants} className="flex">
              <DocumentCard doc={doc} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Disponible avec le plan{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Pack IA
            </span>{" "}
            à partir de 29€/mois
          </p>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
            onClick={() => {
              document
                .getElementById("packs")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Découvrir le Pack IA
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── DOCUMENT CARD ───────────────────────────────────────────────

function DocumentCard({ doc }: { doc: DocumentType }) {
  const Icon = doc.icon;

  return (
    <Card className="relative flex flex-col w-full h-full transition-all duration-300 rounded-2xl overflow-hidden border bg-card hover:shadow-lg hover:-translate-y-1 group">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

      <CardHeader className="pb-0 pt-6 px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{doc.name}</h3>
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {doc.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pt-5 pb-6 flex-1">
        <div className="space-y-2.5">
          {doc.sections.map((section) => (
            <div
              key={section}
              className="flex items-start gap-2.5 text-sm text-foreground/80 group-hover:text-foreground transition-colors"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 mt-0.5">
                <Check
                  className="h-3 w-3 text-emerald-600 dark:text-emerald-400"
                  strokeWidth={3}
                />
              </div>
              <span className="leading-snug">{section}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
