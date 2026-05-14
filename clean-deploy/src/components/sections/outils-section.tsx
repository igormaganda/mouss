"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ExternalLink,
  Wrench,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
  { value: "all", label: "Tous" },
  { value: "bank", label: "Banque" },
  { value: "compta", label: "Comptabilité" },
  { value: "juridique", label: "Juridique" },
  { value: "assurance", label: "Assurance" },
  { value: "communication", label: "Communication" },
] as const;

const categoryLabels: Record<string, string> = {
  bank: "Banque",
  compta: "Comptabilité",
  juridique: "Juridique",
  assurance: "Assurance",
  communication: "Communication",
  marketing: "Marketing",
  crm: "CRM",
  gestion: "Gestion",
};

const categoryColors: Record<string, string> = {
  bank: "bg-amber-100 text-amber-700",
  compta: "bg-emerald-100 text-emerald-700",
  juridique: "bg-violet-100 text-violet-700",
  assurance: "bg-rose-100 text-rose-700",
  communication: "bg-cyan-100 text-cyan-700",
  marketing: "bg-orange-100 text-orange-700",
  crm: "bg-teal-100 text-teal-700",
  gestion: "bg-slate-100 text-slate-700",
};

const logoGradients: Record<string, string> = {
  bank: "from-amber-400 to-orange-500",
  compta: "from-emerald-400 to-teal-500",
  juridique: "from-violet-400 to-purple-500",
  assurance: "from-rose-400 to-pink-500",
  communication: "from-cyan-400 to-sky-500",
  marketing: "from-orange-400 to-red-500",
  crm: "from-teal-400 to-emerald-500",
  gestion: "from-slate-400 to-gray-500",
};

// ─── HELPERS ──────────────────────────────────────────────────────

function parseFeatures(features: string | null): string[] {
  if (!features) return [];
  try {
    return JSON.parse(features);
  } catch {
    return features.split(",").map((f) => f.trim()).filter(Boolean);
  }
}

// Safe number formatting utility
function safeToFixed(value: unknown, digits: number = 1): string {
  const num = typeof value === 'number' && !isNaN(value) ? value : 0;
  return num.toFixed(digits);
}

function safeRating(rating: unknown): number {
  return typeof rating === 'number' && !isNaN(rating) ? rating : 0;
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

async function fetchTools(category: string, limit?: number) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (limit) params.set("limit", String(limit));

  const res = await fetch(`/api/tools?${params}`);
  if (!res.ok) throw new Error("Erreur");
  return res.json() as Promise<{ tools: Tool[] }>;
}

// ─── COMPONENT ────────────────────────────────────────────────────

interface OutilsSectionProps {
  initialTools?: Tool[];
}

export function OutilsSection({ initialTools }: OutilsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["public-tools", activeCategory],
    queryFn: () => fetchTools(activeCategory, 6),
    initialData: initialTools ? { tools: initialTools } : undefined,
    staleTime: 60 * 1000,
  });

  const tools = data?.tools ?? [];

  return (
    <section className="py-10 sm:py-14 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-amber-500/30 text-amber-600 bg-amber-50"
          >
            <Wrench className="h-3.5 w-3.5 mr-1.5" />
            Sélection d&apos;experts
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Outils Recommandés
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Les meilleures solutions pour votre entreprise, sélectionnées et
            testées par nos experts.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-background text-muted-foreground hover:text-foreground hover:bg-accent border border-border"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[360px] rounded-2xl" />
            ))}
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-16">
            <Wrench className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-semibold text-muted-foreground">
              Aucun outil dans cette catégorie
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Nous ajoutons régulièrement de nouveaux outils recommandés.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* CTA: Voir tous les outils */}
        <div className="mt-10 text-center">
          <Link href="/outils">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all font-semibold"
            >
              Voir tous les outils
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── TOOL CARD ────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: Tool }) {
  const features = parseFeatures(tool.features);
  const displayFeatures = features.slice(0, 3);
  const gradient =
    logoGradients[tool.category] || "from-gray-400 to-gray-500";
  const categoryColor =
    categoryColors[tool.category] || "bg-slate-100 text-slate-700";

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
              {renderStars(safeRating(tool.rating))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {safeToFixed(tool.rating, 1)}
            </span>
          </div>
        )}

        {/* Description */}
        {tool.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
            {tool.description}
          </p>
        )}

        {/* Features */}
        {displayFeatures.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {displayFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground leading-snug">
                  {feature}
                </span>
              </div>
            ))}
            {features.length > 3 && (
              <span className="text-[10px] text-muted-foreground/70 pl-5">
                +{features.length - 3} autres fonctionnalités
              </span>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full gap-2">
          {/* Pricing Badge */}
          <Badge
            variant={
              tool.pricing === "gratuit" ? "secondary" : "outline"
            }
            className={`text-xs font-medium ${
              tool.pricing === "gratuit"
                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                : tool.pricing === "freemium"
                  ? "bg-amber-100 text-amber-700 border-amber-200"
                  : "border-rose-300 text-rose-700"
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

          {/* CTA Button */}
          <a
            href={tool.affiliateUrl || tool.website || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              className="group/btn gap-1.5 bg-primary hover:bg-primary/90 text-xs font-semibold"
            >
              Découvrir
              <ExternalLink className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Button>
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
