"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Search,
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  Sparkles,
  Wrench,
  Award,
  Trophy,
  Shield,
  Landmark,
  Calculator,
  Scale,
  Megaphone,
  Users,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

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

const CATEGORIES = [
  { value: "all", label: "Tous", icon: Wrench },
  { value: "bank", label: "Banque", icon: Landmark },
  { value: "compta", label: "Comptabilité", icon: Calculator },
  { value: "assurance", label: "Assurance", icon: Shield },
  { value: "legal", label: "Juridique", icon: Scale },
  { value: "marketing", label: "Marketing", icon: Megaphone },
  { value: "crm", label: "CRM", icon: Users },
] as const;

const categoryLabels: Record<string, string> = {
  bank: "Banque",
  compta: "Comptabilité",
  assurance: "Assurance",
  legal: "Juridique",
  marketing: "Marketing",
  crm: "CRM",
};

const categoryColors: Record<string, string> = {
  bank: "bg-amber-100 text-amber-700 border-amber-200",
  compta: "bg-emerald-100 text-emerald-700 border-emerald-200",
  assurance: "bg-rose-100 text-rose-700 border-rose-200",
  legal: "bg-violet-100 text-violet-700 border-violet-200",
  marketing: "bg-orange-100 text-orange-700 border-orange-200",
  crm: "bg-teal-100 text-teal-700 border-teal-200",
};

const categoryGradients: Record<string, string> = {
  bank: "from-amber-400 to-orange-500",
  compta: "from-emerald-400 to-teal-500",
  assurance: "from-rose-400 to-pink-500",
  legal: "from-violet-400 to-purple-500",
  marketing: "from-orange-400 to-red-500",
  crm: "from-teal-400 to-emerald-500",
};

const categoryBestFor: Record<string, Record<string, string>> = {
  bank: {
    blank: "Auto-entrepreneurs & TPE",
    pennylane: "TPE avec comptable",
    nickel: "Débutants & micro",
    "nickel-business": "Micro-entrepreneurs",
    "memo-bank": "PME en croissance",
    "lydia-pro": "Artisans & commerçants",
    qonto: "TPE/PME récurrentes",
    shine: "Freelances & auto-entrepreneurs",
  },
  compta: {
    pennylane: "TPE/PME collaboratives",
    dougs: "TPE avec accompagnement",
    abby: "Indépendants & auto-entrepreneurs",
    tiime: "TPE administratives",
  },
  assurance: {
    hiscox: "Indépendants & professions libérales",
    simplitoo: "TNS & indépendants",
    swile: "Entreprises avec salariés",
  },
  legal: {
    legalstart: "Création d'entreprise",
    "captain-contrat": "Documents juridiques récurrents",
    avostart: "Consultations juridiques",
  },
  marketing: {
    brevo: "TPE/PME email marketing",
    hubspot: "Entreprises en croissance",
    loomly: "Gestion réseaux sociaux",
    mailchimp: "Email marketing international",
    "le-collectif": "Agences & marketeurs",
  },
  crm: {
    pipedrive: "Équipes commerciales",
    tally: "Formulaires & enquêtes",
    notion: "Organisation d'équipe",
    amelia: "Prise de rendez-vous",
    "surveymonkey": "Sondages & feedback",
  },
};

const pricingConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  gratuit: {
    label: "Gratuit",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: Sparkles,
  },
  freemium: {
    label: "Freemium",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    icon: TrendingUp,
  },
  payant: {
    label: "Payant",
    className: "bg-rose-100 text-rose-700 border-rose-200",
    icon: TrendingUp,
  },
};

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
          className="h-4 w-4 fill-amber-400 text-amber-400"
        />
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <div key={i} className="relative">
          <Star className="h-4 w-4 text-muted-foreground/30" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star
          key={i}
          className="h-4 w-4 text-muted-foreground/30"
        />
      );
    }
  }
  return stars;
}

// ─── SECTORS DATA & HELPERS ────────────────────────────────────

const fallbackSectors = [
  { slug: "restauration-alimentaire", name: "Restauration & Alimentation", description: "Restaurateurs, traiteurs, boulangeries, cavistes...", icon: "UtensilsCrossed", color: "amber", category: "commerce", tools: '[{"name":"Qonto","category":"Banque","description":"Banque pro pour restaurateurs","slug":"qonto"},{"name":"Pennylane","category":"Comptabilité","description":"Gestion compta restauration","slug":"pennylane"},{"name":"Hiscox","category":"Assurance","description":"Assurance RC Pro restaurateur","slug":"hiscox"}]' },
  { slug: "btp-construction", name: "BTP & Construction", description: "Artisans du bâtiment, entreprises de construction...", icon: "HardHat", color: "orange", category: "artisanat", tools: '[{"name":"Blank","category":"Banque","description":"Banque pour BTP","slug":"blank"},{"name":"Dougs","category":"Comptabilité","description":"Compta BTP simplifiée","slug":"dougs"}]' },
  { slug: "e-commerce", name: "E-commerce", description: "Boutiques en ligne, dropshipping, marketplace...", icon: "ShoppingCart", color: "violet", category: "commerce", tools: '[{"name":"Shopify","category":"E-commerce","description":"Création de boutique en ligne","slug":"shopify"},{"name":"Brevo","category":"Marketing","description":"Email marketing e-commerce","slug":"brevo"}]' },
  { slug: "conseil-b2b", name: "Conseil & Services B2B", description: "Consultants, experts-comptables, avocats...", icon: "Briefcase", color: "blue", category: "services", tools: '[{"name":"Qonto","category":"Banque","description":"Banque pro B2B","slug":"qonto"},{"name":"Notion","category":"CRM","description":"Gestion de projets","slug":"notion"}]' },
  { slug: "coiffure-barbier", name: "Coiffure & Barbier", description: "Salons de coiffure, barbiers, centres de beauté...", icon: "Scissors", color: "rose", category: "artisanat", tools: '[{"name":"Blank","category":"Banque","description":"Banque pour coiffeurs","slug":"blank"},{"name":"Amelia","category":"CRM","description":"Prise de RDV en ligne","slug":"amelia"}]' },
  { slug: "sport-fitness", name: "Sport & Fitness", description: "Salles de sport, coachs personnels, studios...", icon: "Dumbbell", color: "emerald", category: "sante-bien-etre", tools: '[{"name":"Pennylane","category":"Comptabilité","description":"Compta pour salles de sport","slug":"pennylane"}]' },
  { slug: "informatique-tech", name: "Informatique & Tech", description: "Développeurs freelances, SSII, réparateurs...", icon: "Monitor", color: "teal", category: "tech-numerique", tools: '[{"name":"Shine","category":"Banque","description":"Banque pour tech","slug":"shine"},{"name":"GitHub","category":"Outils","description":"Dépôts de code","slug":"github"}]' },
  { slug: "formation-education", name: "Formation & Éducation", description: "Formateurs indépendants, organismes de formation...", icon: "GraduationCap", color: "blue", category: "services", tools: '[{"name":"Qonto","category":"Banque","description":"Banque pour formateurs","slug":"qonto"}]' },
  { slug: "immobilier", name: "Immobilier", description: "Agents immobiliers, syndics, investisseurs...", icon: "Building2", color: "amber", category: "tech-numerique", tools: '[{"name":"Qonto","category":"Banque","description":"Banque pro immobilier","slug":"qonto"}]' },
  { slug: "transport-logistique", name: "Transport & Logistique", description: "Transporteurs, coursiers, déménageurs...", icon: "Truck", color: "orange", category: "tech-numerique", tools: '[{"name":"Blank","category":"Banque","description":"Banque pour transporteurs","slug":"blank"}]' },
  { slug: "photographie-video", name: "Photographie & Vidéo", description: "Photographes, vidéastes, monteurs...", icon: "Camera", color: "violet", category: "artisanat", tools: '[{"name":"Blank","category":"Banque","description":"Banque pour photographes","slug":"blank"}]' },
  { slug: "evenementiel", name: "Événementiel", description: "Organisateurs d'événements, wedding planners...", icon: "PartyPopper", color: "rose", category: "services", tools: '[{"name":"Qonto","category":"Banque","description":"Banque pro événementiel","slug":"qonto"}]' },
];

const SECTOR_CATEGORIES = [
  { value: "all", label: "Tous" },
  { value: "commerce", label: "Commerce" },
  { value: "services", label: "Services" },
  { value: "artisanat", label: "Artisanat" },
  { value: "sante-bien-etre", label: "Santé & Bien-être" },
  { value: "tech-numerique", label: "Tech & Numérique" },
] as const;

function getSectorIcon(iconName: string): string {
  const icons: Record<string, string> = {
    UtensilsCrossed: "🍽️", HardHat: "🏗️", ShoppingCart: "🛒", Briefcase: "💼",
    Scissors: "✂️", Dumbbell: "💪", Monitor: "💻", GraduationCap: "🎓",
    Building2: "🏢", Truck: "🚛", Camera: "📷", PartyPopper: "🎉",
    Heart: "❤️", Palette: "🎨", Globe: "🌐", PenTool: "✏️",
    Shield: "🛡️", Users: "👥", TrendingUp: "📈", Search: "🔍",
    Megaphone: "📢", FileText: "📄", Target: "🎯", Compass: "🧭",
    Scale: "⚖️", HandCoins: "🪙"
  };
  return icons[iconName] || "📦";
}

const sectorColorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", gradient: "from-emerald-400 to-teal-500" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", gradient: "from-amber-400 to-orange-500" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", gradient: "from-violet-400 to-purple-500" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", gradient: "from-rose-400 to-pink-500" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", gradient: "from-blue-400 to-indigo-500" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", gradient: "from-teal-400 to-cyan-500" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", gradient: "from-orange-400 to-red-500" },
};

function parseTools(toolsJson: string): Array<{ name: string; category: string; description: string; slug: string }> {
  try {
    return JSON.parse(toolsJson);
  } catch {
    return [];
  }
}

async function fetchSectors() {
  try {
    const res = await fetch("/api/sectors");
    if (!res.ok) return fallbackSectors;
    const data = await res.json();
    return (data.sectors || []).length > 0 ? data.sectors : fallbackSectors;
  } catch {
    return fallbackSectors;
  }
}

async function fetchTools(category: string, search: string) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (search) params.set("search", search);

  const res = await fetch(`/api/tools?${params}`);
  if (!res.ok) throw new Error("Erreur");
  return res.json() as Promise<{ tools: Tool[]; total: number }>;
}

function getCategoryToolCount(categoryTools: Tool[], catValue: string): number {
  if (catValue === "all") return categoryTools.length;
  return categoryTools.filter((t) => t.category === catValue).length;
}

// ─── COMPONENT ────────────────────────────────────────────────────

export function OutilsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [activeSectorCategory, setActiveSectorCategory] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["outils-tools", activeCategory, search],
    queryFn: () => fetchTools(activeCategory, search),
  });

  const { data: sectorsData } = useQuery({
    queryKey: ["outils-sectors"],
    queryFn: () => fetchSectors(),
  });

  const allTools = data?.tools ?? [];
  const total = data?.total ?? 0;
  const sectors = sectorsData ?? fallbackSectors;

  const filteredSectors = useMemo(() => {
    if (activeSectorCategory === "all") return sectors;
    return sectors.filter((s) => s.category === activeSectorCategory);
  }, [sectors, activeSectorCategory]);

  // Category tool counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: total };
    CATEGORIES?.forEach((cat) => {
      if (cat.value !== "all") {
        counts[cat.value] = allTools.filter(
          (t) => t.category === cat.value
        ).length;
      }
    });
    return counts;
  }, [allTools, total]);

  // Comparison data: top 3 tools per active category
  const comparisonTools = useMemo(() => {
    if (activeCategory === "all") return [];
    return allTools
      .filter((t) => t.category === activeCategory)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [allTools, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero Section ──────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-amber-50 via-white to-emerald-50 border-b">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>

            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-4 px-4 py-1.5 text-sm font-medium border-amber-500/30 text-amber-600 bg-amber-50"
              >
                <Wrench className="h-3.5 w-3.5 mr-1.5" />
                Outils &amp; Comparatifs
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Comparatifs &amp; Avis
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Trouvez les meilleurs outils B2B pour votre entreprise.
                Comparez les offres, lisez les avis et choisissez la solution
                adaptée à vos besoins.
              </p>
            </div>

            {/* Search */}
            <div className="mt-8 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un outil..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 bg-background"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Secteurs d'activité ────────────────────────────────── */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge
                variant="outline"
                className="mb-4 px-4 py-1.5 text-sm font-medium border-violet-500/30 text-violet-600 bg-violet-50"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Secteurs d&apos;activité
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explorez par secteur d&apos;activité
              </h2>
              <p className="mt-3 text-muted-foreground">
                Trouvez les outils adaptés à votre métier
              </p>
            </div>

            {/* Sector Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {SECTOR_CATEGORIES.map((cat) => {
                const isActive = activeSectorCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setActiveSectorCategory(cat.value)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent border border-border"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Sector Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSectors.map((sector, index) => {
                const colorConfig = sectorColorMap[sector.color] || sectorColorMap.amber;
                const tools = parseTools(sector.tools);
                return (
                  <motion.div
                    key={sector.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link
                      href={`/outils/secteur/${sector.slug}`}
                      className={`group block rounded-2xl border ${colorConfig.border} ${colorConfig.bg} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${colorConfig.gradient} text-xl shadow-sm`}>
                          {getSectorIcon(sector.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold text-base ${colorConfig.text} group-hover:underline decoration-1 underline-offset-2`}>
                            {sector.name}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {sector.description.length > 80
                              ? sector.description.slice(0, 80) + "..."
                              : sector.description}
                          </p>
                        </div>
                      </div>

                      {tools.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {tools.slice(0, 4).map((tool, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-full bg-white/70 border border-border/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                            >
                              {tool.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className={`mt-4 flex items-center gap-1 text-sm font-semibold ${colorConfig.text} group-hover:gap-2 transition-all`}>
                        Découvrir →
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Content ────────────────────────────────────────────── */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-10">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent border border-border"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat.label}
                    <span
                      className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-primary-foreground/20"
                          : "bg-muted-foreground/10"
                      }`}
                    >
                      {categoryCounts[cat.value] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tools Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[360px] rounded-2xl" />
                ))}
              </div>
            ) : allTools.length === 0 ? (
              <div className="text-center py-20">
                <Wrench className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">
                  Aucun outil trouvé
                </p>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  Essayez une autre catégorie ou recherche.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${search}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {allTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.06 }}
                    >
                      <ToolCard tool={tool} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* ─── Comparison Section ─────────────────────────────── */}
            {comparisonTools.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-20"
              >
                <div className="text-center mb-10">
                  <Badge
                    variant="outline"
                    className="mb-4 px-4 py-1.5 text-sm font-medium border-emerald-500/30 text-emerald-600 bg-emerald-50"
                  >
                    <Award className="h-3.5 w-3.5 mr-1.5" />
                    Comparatif
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Top {comparisonTools.length} en{" "}
                    {categoryLabels[activeCategory] || activeCategory}
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    Comparez les meilleurs outils de cette catégorie pour faire
                    le bon choix.
                  </p>
                </div>

                <ComparisonTable tools={comparisonTools} />
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ─── TOOL CARD ────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: Tool }) {
  const gradient =
    categoryGradients[tool.category] || "from-gray-400 to-gray-500";
  const categoryColor =
    categoryColors[tool.category] || "bg-slate-100 text-slate-700";
  const pricing = pricingConfig[tool.pricing] || pricingConfig.payant;
  const PricingIcon = pricing.icon;

  return (
    <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col rounded-2xl border-border/60 overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-0">
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div
            className={`flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}
          >
            {tool.logoUrl ? (
              <img
                src={tool.logoUrl}
                alt={tool.name}
                className="h-8 w-8 rounded-md object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-white">
                {tool.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base leading-tight truncate">
                {tool.name}
              </h3>
              <Badge
                variant="secondary"
                className={`text-[10px] px-1.5 py-0 h-5 ${categoryColor}`}
              >
                {categoryLabels[tool.category] || tool.category}
              </Badge>
            </div>
            {tool.tagline && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {tool.tagline}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 pt-2">
        {/* Rating */}
        {(tool.rating ?? 0) > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {renderStars(tool.rating ?? 0)}
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {(tool.rating ?? 0).toFixed(1)}
            </span>
          </div>
        )}

        {/* Pricing Badge */}
        <Badge
          variant="outline"
          className={`text-[11px] font-medium mb-3 inline-flex items-center gap-1 ${pricing.className}`}
        >
          <PricingIcon className="h-3 w-3" />
          {pricing.label}
        </Badge>

        {/* Description */}
        {tool.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {tool.description}
          </p>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-0">
        <a
          href={tool.affiliateUrl || tool.website || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button
            variant="outline"
            className="w-full group/btn gap-2 text-sm font-semibold border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Voir le comparatif
            <ExternalLink className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}

// ─── COMPARISON TABLE ────────────────────────────────────────────

function ComparisonTable({ tools }: { tools: Tool[] }) {
  const bestTool = tools[0];
  const prosAll = tools.map((t) => parseList(t.pros));

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-4 sm:p-6 font-semibold text-sm text-muted-foreground min-w-[140px]">
              Comparatif
            </th>
            {tools.map((tool, i) => (
              <th
                key={tool.id}
                className={`text-center p-4 sm:p-6 min-w-[200px] ${
                  i === 0 ? "bg-amber-50/50" : ""
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-br ${
                      categoryGradients[tool.category] || "from-gray-400 to-gray-500"
                    } flex items-center justify-center`}
                  >
                    <span className="text-lg font-bold text-white">
                      {tool.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-bold text-sm">{tool.name}</span>
                  {i === 0 && (
                    <Badge className="bg-amber-500 text-white text-[10px] gap-1">
                      <Trophy className="h-3 w-3" />
                      Meilleur
                    </Badge>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Rating row */}
          <tr className="border-b">
            <td className="p-4 sm:p-6 text-sm font-medium text-muted-foreground">
              Note
            </td>
            {tools.map((tool, i) => (
              <td
                key={tool.id}
                className={`text-center p-4 sm:p-6 ${
                  i === 0 ? "bg-amber-50/50" : ""
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {renderStars(tool.rating ?? 0)}
                  </div>
                  <span className="text-sm font-bold">{(tool.rating ?? 0).toFixed(1)}/5</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Pricing row */}
          <tr className="border-b">
            <td className="p-4 sm:p-6 text-sm font-medium text-muted-foreground">
              Tarif
            </td>
            {tools.map((tool, i) => {
              const pricing = pricingConfig[tool.pricing] || pricingConfig.payant;
              return (
                <td
                  key={tool.id}
                  className={`text-center p-4 sm:p-6 ${
                    i === 0 ? "bg-amber-50/50" : ""
                  }`}
                >
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium ${pricing.className}`}
                  >
                    {pricing.label}
                  </Badge>
                </td>
              );
            })}
          </tr>

          {/* Pros row */}
          <tr className="border-b">
            <td className="p-4 sm:p-6 text-sm font-medium text-muted-foreground">
              Points forts
            </td>
            {tools.map((tool, i) => (
              <td
                key={tool.id}
                className={`p-4 sm:p-6 ${
                  i === 0 ? "bg-amber-50/50" : ""
                }`}
              >
                <ul className="space-y-1.5">
                  {prosAll[i].slice(0, 3).map((pro, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>

          {/* Cons row */}
          <tr className="border-b">
            <td className="p-4 sm:p-6 text-sm font-medium text-muted-foreground">
              Points faibles
            </td>
            {tools.map((tool, i) => {
              const cons = parseList(tool.cons);
              return (
                <td
                  key={tool.id}
                  className={`p-4 sm:p-6 ${
                    i === 0 ? "bg-amber-50/50" : ""
                  }`}
                >
                  <ul className="space-y-1.5">
                    {cons.length > 0
                      ? cons.slice(0, 2).map((con, j) => (
                          <li key={j} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                            <XCircle className="h-3.5 w-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))
                      : <span className="text-xs text-muted-foreground/50">—</span>}
                  </ul>
                </td>
              );
            })}
          </tr>

          {/* Best for row */}
          <tr>
            <td className="p-4 sm:p-6 text-sm font-medium text-muted-foreground">
              Meilleur pour
            </td>
            {tools.map((tool, i) => {
              const bestFor =
                categoryBestFor[tool.category]?.[tool.slug] ||
                categoryBestFor[tool.category]?.[tool.name.toLowerCase()] ||
                "Usage polyvalent";
              return (
                <td
                  key={tool.id}
                  className={`text-center p-4 sm:p-6 ${
                    i === 0 ? "bg-amber-50/50" : ""
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">
                    {bestFor}
                  </span>
                </td>
              );
            })}
          </tr>
        </tbody>

        {/* CTA row */}
        <tfoot>
          <tr className="border-t bg-muted/30">
            <td />
            {tools.map((tool, i) => (
              <td key={tool.id} className={`text-center p-4 sm:p-6 ${i === 0 ? "bg-amber-50/50" : ""}`}>
                <a
                  href={tool.affiliateUrl || tool.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    className={`gap-1.5 text-xs font-semibold ${
                      i === 0
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    Découvrir {tool.name}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
