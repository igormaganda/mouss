"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Star,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  Wrench,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// ─── TYPES ────────────────────────────────────────────────────────

interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  affiliateUrl: string | null;
  commission: number;
  category: string;
  pricing: string;
  rating: number;
  pros: string | null;
  cons: string | null;
  features: string | null;
  active: boolean;
  order: number;
}

// ─── CONSTANTS ────────────────────────────────────────────────────

const categoryLabels: Record<string, string> = {
  bank: "Banque",
  compta: "Comptabilité",
  juridique: "Juridique",
  legal: "Juridique",
  assurance: "Assurance",
  communication: "Communication",
  marketing: "Marketing",
  crm: "CRM",
  gestion: "Gestion",
};

const categoryColors: Record<string, string> = {
  bank: "bg-amber-100 text-amber-700 border-amber-200",
  compta: "bg-emerald-100 text-emerald-700 border-emerald-200",
  juridique: "bg-violet-100 text-violet-700 border-violet-200",
  legal: "bg-violet-100 text-violet-700 border-violet-200",
  assurance: "bg-rose-100 text-rose-700 border-rose-200",
  communication: "bg-cyan-100 text-cyan-700 border-cyan-200",
  marketing: "bg-orange-100 text-orange-700 border-orange-200",
  crm: "bg-teal-100 text-teal-700 border-teal-200",
  gestion: "bg-slate-100 text-slate-700 border-slate-200",
};

const categoryGradients: Record<string, string> = {
  bank: "from-amber-400 to-orange-500",
  compta: "from-emerald-400 to-teal-500",
  juridique: "from-violet-400 to-purple-500",
  legal: "from-violet-400 to-purple-500",
  assurance: "from-rose-400 to-pink-500",
  communication: "from-cyan-400 to-sky-500",
  marketing: "from-orange-400 to-red-500",
  crm: "from-teal-400 to-emerald-500",
  gestion: "from-slate-400 to-gray-500",
};

const pricingLabels: Record<string, string> = {
  gratuit: "Gratuit",
  freemium: "Freemium",
  payant: "Payant",
};

// ─── FALLBACK DATA ────────────────────────────────────────────────

const fallbackTools: Tool[] = [
  {
    id: "fb-qonto",
    name: "Qonto",
    slug: "qonto",
    tagline: "La néobanque pour les entreprises",
    description:
      "Qonto est une solution bancaire professionnelle conçue pour les TPE, PME, freelances et auto-entrepreneurs. Elle offre un compte pro avec IBAN français, carte Visa, virements SEPA, et une interface de gestion intuitive. Qonto permet de gérer facilement les dépenses, de suivre la trésorerie en temps réel, et d'automatiser les tâches comptables grâce à ses intégrations avec les principaux logiciels de comptabilité.",
    logoUrl: null,
    website: "https://qonto.com",
    affiliateUrl: "https://qonto.com/?ref=crea-entreprise",
    commission: 50,
    category: "bank",
    pricing: "payant",
    rating: 4.6,
    pros: JSON.stringify([
      "Interface intuitive et moderne",
      "IBAN français et virements SEPA instantanés",
      "Excellent suivi des dépenses et notes de frais",
      "Intégrations avec Pennylane, Indy, et autres outils compta",
      "Service client réactif et disponible par chat",
    ]),
    cons: JSON.stringify([
      "Pas de découvert autorisé",
      "Frais supplémentaires pour les virements internationaux",
      "Pas de cashback sur les paiements",
    ]),
    features: JSON.stringify([
      "Compte bancaire pro avec IBAN français",
      "Cartes Visa physiques et virtuelles",
      "Gestion des notes de frais",
      "Suivi de trésorerie en temps réel",
      "Virements SEPA et instantanés",
      "Export comptable automatique",
      "Mobile banking app iOS et Android",
      "Multi-utilisateurs et permissions",
    ]),
    active: true,
    order: 1,
  },
  {
    id: "fb-indy",
    name: "Indy",
    slug: "indy",
    tagline: "La comptabilité automatisée pour indépendants",
    description:
      "Indy est un logiciel de comptabilité en ligne conçu spécialement pour les auto-entrepreneurs, freelances et micro-entreprises. Il automatise la comptabilité en synchronisant automatiquement les transactions bancaires, en catégorisant les dépenses et en générant les déclarations de TVA et de revenus. Indy simplifie considérablement la gestion administrative pour les travailleurs indépendants.",
    logoUrl: null,
    website: "https://indy.fr",
    affiliateUrl: "https://indy.fr/?ref=crea-entreprise",
    commission: 30,
    category: "compta",
    pricing: "gratuit",
    rating: 4.7,
    pros: JSON.stringify([
      "Gratuit et sans engagement",
      "Automatisation complète de la compta",
      "Interface simple et conviviale",
      "Synchronisation bancaire automatique",
    ]),
    cons: JSON.stringify([
      "Limité aux auto-entrepreneurs et micro-entreprises",
      "Pas de facturation avancée incluse",
      "Fonctionnalités moins complètes qu'un logiciel de compta complet",
    ]),
    features: JSON.stringify([
      "Synchronisation bancaire automatique",
      "Catégorisation intelligente des dépenses",
      "Génération des déclarations URSSAF",
      "Calcul automatique de la TVA",
      "Tableaux de bord et graphiques",
      "Export des données comptables",
      "Rappels de déclarations",
      "Accompagnement par chat",
    ]),
    active: true,
    order: 2,
  },
  {
    id: "fb-pennylane",
    name: "Pennylane",
    slug: "pennylane",
    tagline: "La comptabilité collaborative pour TPE/PME",
    description:
      "Pennylane est une plateforme de comptabilité en ligne collaborative qui relie les dirigeants, les experts-comptables et les équipes financières. Elle offre un tableau de bord en temps réel, une facturation intégrée, et une automatisation des tâches comptables. Pennylane est la solution idéale pour les TPE et PME qui souhaitent moderniser leur gestion financière.",
    logoUrl: null,
    website: "https://pennylane.com",
    affiliateUrl: "https://pennylane.com/?ref=crea-entreprise",
    commission: 45,
    category: "compta",
    pricing: "payant",
    rating: 4.6,
    pros: JSON.stringify([
      "Collaboration facilitée avec l'expert-comptable",
      "Interface moderne et ergonomique",
      "Facturation et compta intégrées",
      "Bonne intégration avec les outils bancaires",
    ]),
    cons: JSON.stringify([
      "Tarifs qui peuvent être élevés pour les très petites structures",
      "Nécessite un temps d'adaptation pour les non-initiés",
      "Certains modules avancés en option payante",
    ]),
    features: JSON.stringify([
      "Comptabilité en temps réel",
      "Facturation et relances automatiques",
      "Gestion des dépenses et notes de frais",
      "Synchronisation bancaire multi-comptes",
      "Collaboration expert-comptable intégrée",
      "Rapprochement bancaire automatisé",
      "Tableaux de bord financiers",
      "Gestion des immobilisations",
    ]),
    active: true,
    order: 3,
  },
  {
    id: "fb-legalstart",
    name: "Legalstart",
    slug: "legalstart",
    tagline: "Création d'entreprise en ligne simplifiée",
    description:
      "Legalstart est une plateforme juridique en ligne qui simplifie la création d'entreprise et les formalités juridiques. Elle accompagne les entrepreneurs dans toutes les démarches : création de société (SAS, SARL, SCI, auto-entreprise), rédaction de statuts, modification d'entreprise, et gestion des formalités juridiques récurrentes. Legalstart rend le droit accessible à tous avec des tarifs transparents.",
    logoUrl: null,
    website: "https://legalstart.fr",
    affiliateUrl: "https://legalstart.fr/?ref=crea-entreprise",
    commission: 60,
    category: "juridique",
    pricing: "payant",
    rating: 4.3,
    pros: JSON.stringify([
      "Processus de création d'entreprise rapide et guidé",
      "Tarifs transparents et compétitifs",
      "Accompagnement juridique disponible",
      "Large gamme de documents juridiques",
    ]),
    cons: JSON.stringify([
      "Certains services juridiques restent onéreux",
      "Le suivi n'est pas toujours aussi réactif qu'un cabinet physique",
      "Pas de conseil stratégique personnalisé approfondi",
    ]),
    features: JSON.stringify([
      "Création de société en ligne",
      "Rédaction de statuts juridiques",
      "Gestion des formalités de modification",
      "Documents juridiques sur mesure",
      "Marque et propriété intellectuelle",
      "Suivi du dossier en temps réel",
      "Accès à un réseau de juristes",
      "Garantie satisfaction",
    ]),
    active: true,
    order: 4,
  },
  {
    id: "fb-hiscox",
    name: "Hiscox",
    slug: "hiscox",
    tagline: "Assurance professionnelle pour indépendants et TPE",
    description:
      "Hiscox est un assureur spécialisé dans la protection des professionnels indépendants, des TPE et des PME. Il propose des assurances RC Professionnelle, décennale, multirisque et cyber protection adaptées à chaque métier. Hiscox se distingue par sa souscription 100% en ligne, ses tarifs compétitifs et sa rapidité de prise en charge.",
    logoUrl: null,
    website: "https://hiscox.fr",
    affiliateUrl: "https://hiscox.fr/?ref=crea-entreprise",
    commission: 80,
    category: "assurance",
    pricing: "payant",
    rating: 4.4,
    pros: JSON.stringify([
      "Souscription rapide 100% en ligne",
      "Couverture adaptée à chaque profession",
      "Tarifs compétitifs pour les indépendants",
      "Service client disponible et réactif",
    ]),
    cons: JSON.stringify([
      "Pas de rendez-vous physique avec un conseiller",
      "Couverture parfois limitée pour certains métiers spécifiques",
      "Augmentation tarifaire possible à chaque renouvellement",
    ]),
    features: JSON.stringify([
      "RC Professionnelle sur mesure",
      "Assurance décennale BTP",
      "Protection juridique",
      "Cyber assurance",
      "Assurance multirisque pro",
      "Devis gratuit instantané",
      "Gestion des sinistres en ligne",
      "Annulation flexible",
    ]),
    active: true,
    order: 5,
  },
  {
    id: "fb-captain-contrat",
    name: "Captain Contrat",
    slug: "captain-contrat",
    tagline: "Documents juridiques générés par intelligence artificielle",
    description:
      "Captain Contrat est une plateforme de génération de documents juridiques assistée par IA. Elle permet aux entrepreneurs de créer des contrats de travail, baux commerciaux, CGV, conditions générales, NDA, et bien d'autres documents juridiques en quelques minutes. Captain Contrat démocratise l'accès au droit pour les TPE, PME et indépendants.",
    logoUrl: null,
    website: "https://captaincontrat.com",
    affiliateUrl: "https://captaincontrat.com/?ref=crea-entreprise",
    commission: 35,
    category: "juridique",
    pricing: "payant",
    rating: 4.3,
    pros: JSON.stringify([
      "Documents juridiques générés rapidement",
      "Tarifs abordables par document",
      "Assistance juridique en option",
      "Bibliothèque de modèles très complète",
    ]),
    cons: JSON.stringify([
      "Les documents générés ne remplacent pas un avis juridique complet",
      "Qualité variable selon la complexité du besoin",
      "Personnalisation limitée pour les cas très spécifiques",
    ]),
    features: JSON.stringify([
      "Génération de contrats par IA",
      "Bibliothèque de 200+ modèles juridiques",
      "Contrats de travail et RH",
      "Baux commerciaux et immobiliers",
      "CGV et mentions légales",
      "NDA et accords de confidentialité",
      "Mises à jour conformes au droit en vigueur",
      "Consultation juridique en ligne",
    ]),
    active: true,
    order: 6,
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────

function parseList(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return value.split(",").map((f) => f.trim()).filter(Boolean);
  }
}

function renderStars(rating: number) {
  const stars: React.ReactNode[] = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          className="h-5 w-5 fill-amber-400 text-amber-400"
        />
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <div key={i} className="relative">
          <Star className="h-5 w-5 text-muted-foreground/30" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star
          key={i}
          className="h-5 w-5 text-muted-foreground/30"
        />
      );
    }
  }
  return stars;
}

async function fetchAllTools() {
  try {
    const res = await fetch("/api/tools");
    if (!res.ok) throw new Error("Erreur");
    return res.json() as Promise<{ tools: Tool[] }>;
  } catch {
    return { tools: fallbackTools };
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────

export default function ToolDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tool-detail", slug],
    queryFn: async () => {
      const result = await fetchAllTools();
      const allTools = result.tools.length > 0 ? result.tools : fallbackTools;
      const tool = allTools.find((t) => t.slug === slug) || null;
      const relatedTools = tool
        ? allTools
            .filter((t) => t.category === tool.category && t.slug !== tool.slug)
            .slice(0, 3)
        : [];
      return { tool, relatedTools };
    },
  });

  const tool = data?.tool ?? null;
  const relatedTools = data?.relatedTools ?? [];

  const features = parseList(tool?.features ?? null);
  const pros = parseList(tool?.pros ?? null);
  const cons = parseList(tool?.cons ?? null);
  const gradient =
    categoryGradients[tool?.category ?? ""] || "from-gray-400 to-gray-500";
  const categoryColor =
    categoryColors[tool?.category ?? ""] || "bg-slate-100 text-slate-700";
  const ctaUrl = tool?.affiliateUrl || tool?.website || "#";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-64 mb-8" />
            <Skeleton className="h-16 w-96 mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
              </div>
              <div>
                <Skeleton className="h-80 rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!tool || isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Wrench className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              Outil introuvable
            </h1>
            <p className="text-muted-foreground mb-8">
              L&apos;outil que vous recherchez n&apos;existe pas ou a été supprimé.
            </p>
            <Link href="/outils">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux outils
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ─── Hero Section ──────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className={`absolute -top-32 -right-32 h-72 w-72 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-3xl`}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Accueil
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-muted-foreground" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/outils"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Outils
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-muted-foreground" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">
                    {tool.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-shrink-0"
              >
                <div
                  className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
                >
                  {tool.logoUrl ? (
                    <img
                      src={tool.logoUrl}
                      alt={tool.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {tool.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </motion.div>

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                      {tool.name}
                    </h1>
                    <Badge
                      variant="secondary"
                      className={`text-xs px-2.5 py-1 ${categoryColor}`}
                    >
                      {categoryLabels[tool.category] || tool.category}
                    </Badge>
                  </div>

                  {tool.tagline && (
                    <p className="text-lg text-muted-foreground mb-3">
                      {tool.tagline}
                    </p>
                  )}

                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Rating */}
                    {(tool.rating ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {renderStars(tool.rating ?? 0)}
                        </div>
                        <span className="text-sm font-semibold">
                          {(tool.rating ?? 0).toFixed(1)}/5
                        </span>
                      </div>
                    )}

                    {/* Pricing */}
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${
                        tool.pricing === "gratuit"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : tool.pricing === "freemium"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-rose-100 text-rose-700 border-rose-200"
                      }`}
                    >
                      {tool.pricing === "gratuit" ? (
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Gratuit
                        </span>
                      ) : tool.pricing === "freemium" ? (
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Freemium
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Payant
                        </span>
                      )}
                    </Badge>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Content + Sidebar ─────────────────────────────── */}
        <section className="py-10 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Présentation
                  </h2>
                  {tool.description ? (
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {tool.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Aucune description disponible pour cet outil.
                    </p>
                  )}
                </motion.div>

                {/* Features */}
                {features.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-primary" />
                      Fonctionnalités principales
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/50"
                        >
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Pros */}
                  {pros.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card className="border-emerald-200/60 bg-emerald-50/30">
                        <CardHeader>
                          <CardTitle className="text-base font-bold text-emerald-700 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Points forts
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {pros.map((pro, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2.5"
                            >
                              <div className="flex-shrink-0 mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              </div>
                              <span className="text-sm text-muted-foreground leading-relaxed">
                                {pro}
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Cons */}
                  {cons.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Card className="border-rose-200/60 bg-rose-50/30">
                        <CardHeader>
                          <CardTitle className="text-base font-bold text-rose-700 flex items-center gap-2">
                            <XCircle className="h-5 w-5" />
                            Points faibles
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {cons.map((con, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2.5"
                            >
                              <div className="flex-shrink-0 mt-1 h-5 w-5 rounded-full bg-rose-100 flex items-center justify-center">
                                <XCircle className="h-3.5 w-3.5 text-rose-600" />
                              </div>
                              <span className="text-sm text-muted-foreground leading-relaxed">
                                {con}
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>

                {/* Related Tools */}
                {relatedTools.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="pt-4 border-t"
                  >
                    <h2 className="text-xl font-bold mb-4">
                      Vous pourriez aussi être intéressé par
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {relatedTools.map((related) => {
                        const relGradient =
                          categoryGradients[related.category] ||
                          "from-gray-400 to-gray-500";
                        const relColor =
                          categoryColors[related.category] ||
                          "bg-slate-100 text-slate-700";
                        return (
                          <Link key={related.id} href={`/outils/${related.slug}`}>
                            <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full">
                              <CardContent className="pt-5">
                                <div className="flex items-center gap-3 mb-3">
                                  <div
                                    className={`h-10 w-10 rounded-lg bg-gradient-to-br ${relGradient} flex items-center justify-center shadow-sm`}
                                  >
                                    <span className="text-sm font-bold text-white">
                                      {related.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                                      {related.name}
                                    </h3>
                                    <Badge
                                      variant="secondary"
                                      className={`text-[10px] px-1.5 py-0 h-4 ${relColor}`}
                                    >
                                      {categoryLabels[related.category] ||
                                        related.category}
                                    </Badge>
                                  </div>
                                </div>
                                {related.tagline && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                    {related.tagline}
                                  </p>
                                )}
                                {related.rating > 0 && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <div className="flex items-center gap-0.5">
                                      {renderStars(related.rating).map(
                                        (star, i) => (
                                          <span key={i} className="scale-75">
                                            {star}
                                          </span>
                                        )
                                      )}
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">
                                      {(related.rating ?? 0).toFixed(1)}
                                    </span>
                                  </div>
                                )}
                                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                                  Voir la fiche
                                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar — Sticky CTA */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Affiliate CTA Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
                      <div
                        className={`h-2 bg-gradient-to-r ${gradient}`}
                      />
                      <CardContent className="pt-6">
                        {/* Logo */}
                        <div className="flex flex-col items-center text-center mb-6">
                          <div
                            className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md mb-4`}
                          >
                            {tool.logoUrl ? (
                              <img
                                src={tool.logoUrl}
                                alt={tool.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <span className="text-2xl font-bold text-white">
                                {tool.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold">{tool.name}</h3>
                          {tool.tagline && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {tool.tagline}
                            </p>
                          )}
                        </div>

                        {/* Rating */}
                        {tool.rating > 0 && (
                          <div className="flex items-center justify-center gap-1.5 mb-4">
                            <div className="flex items-center gap-0.5">
                              {renderStars(tool.rating)}
                            </div>
                            <span className="text-sm font-bold">
                              {(tool.rating ?? 0).toFixed(1)}/5
                            </span>
                          </div>
                        )}

                        {/* Pricing */}
                        <div className="flex items-center justify-center mb-6">
                          <Badge
                            variant="outline"
                            className={`text-sm font-semibold px-3 py-1 ${
                              tool.pricing === "gratuit"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : tool.pricing === "freemium"
                                  ? "bg-amber-100 text-amber-700 border-amber-200"
                                  : "bg-rose-100 text-rose-700 border-rose-200"
                            }`}
                          >
                            {tool.pricing === "gratuit"
                              ? "Gratuit"
                              : tool.pricing === "freemium"
                                ? "Freemium"
                                : "Payant"}
                          </Badge>
                        </div>

                        {/* Affiliate Button */}
                        <a
                          href={ctaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="lg"
                            className="w-full h-14 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 transition-all gap-2"
                          >
                            <ExternalLink className="h-5 w-5" />
                            Découvrir {tool.name}
                          </Button>
                        </a>

                        <p className="text-center text-xs text-muted-foreground/70 mt-3">
                          En cliquant, vous accédez au site officiel de{" "}
                          {tool.name}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Quick Info Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card>
                      <CardContent className="pt-5 space-y-4">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Informations
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Catégorie
                            </span>
                            <Badge
                              variant="secondary"
                              className={categoryColor}
                            >
                              {categoryLabels[tool.category] || tool.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Tarification
                            </span>
                            <span className="font-medium">
                              {pricingLabels[tool.pricing] || tool.pricing}
                            </span>
                          </div>
                          {tool.rating > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Note moyenne
                              </span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="font-semibold">
                                  {(tool.rating ?? 0).toFixed(1)}/5
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Back to tools */}
                  <Link href="/outils" className="block">
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Retour aux outils
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Mobile Bottom CTA (sticky) ──────────────────── */}
        <div className="lg:hidden sticky bottom-0 z-50 border-t bg-background/95 backdrop-blur-sm px-4 py-3">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 transition-all gap-2"
            >
              <ExternalLink className="h-5 w-5" />
              Découvrir {tool.name}
            </Button>
          </a>
        </div>
      </main>

      {/* Footer — hidden on mobile to avoid overlap with bottom CTA */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
