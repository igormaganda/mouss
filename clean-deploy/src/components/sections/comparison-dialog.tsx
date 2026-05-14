"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ExternalLink,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Filter,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── TYPES ────────────────────────────────────────────────────────

interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category: string;
  pricing: string;
  affiliateUrl: string | null;
  website: string | null;
  rating: number;
  pros: string | null;
  cons: string | null;
  features: string | null;
  _count: { clicks: number };
}

interface ComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  categoryBgColor: string;
  categoryIconColor: string;
}

// ─── CATEGORY COLOR MAP ──────────────────────────────────────────

const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
  bank: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  compta: { bg: "bg-sky-50 dark:bg-sky-950/30", text: "text-sky-600 dark:text-sky-400", border: "border-sky-200 dark:border-sky-800" },
  assurance: { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800" },
  legal: { bg: "bg-violet-50 dark:bg-violet-950/30", text: "text-violet-600 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800" },
  marketing: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
  crm: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
};

const pricingLabels: Record<string, string> = {
  gratuit: "Gratuit",
  freemium: "Freemium",
  payant: "Premium",
};

const pricingBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  gratuit: "default",
  freemium: "secondary",
  payant: "outline",
};

// ─── HELPERS ──────────────────────────────────────────────────────

function parseLines(str: string | null): string[] {
  if (!str) return [];
  return str.split("\n").filter((l) => l.trim());
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
  const safe = safeRating(rating);
  const full = Math.floor(safe);
  const half = safe - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < full
              ? "fill-amber-400 text-amber-400"
              : i === full && half
              ? "fill-amber-400/50 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-foreground/80">
        {safeToFixed(rating, 1)}
      </span>
    </div>
  );
}

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur");
  return res.json();
}

// ─── COMPONENT ────────────────────────────────────────────────────

export function ComparisonDialog({
  open,
  onOpenChange,
  category,
  categoryLabel,
  categoryColor,
  categoryBgColor,
  categoryIconColor,
}: ComparisonDialogProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pricingFilter, setPricingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rating" | "name" | "clicks">("rating");
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const { data: tools, isLoading } = useQuery({
    queryKey: ["comparison-tools", category],
    queryFn: () => fetcher(`/api/admin/tools?category=${category}`),
    enabled: open,
  });

  const filteredTools = useMemo(() => {
    if (!tools) return [];
    let result = [...tools];

    // Filter by pricing
    if (pricingFilter !== "all") {
      result = result.filter((t: Tool) => t.pricing === pricingFilter);
    }

    // Sort
    result.sort((a: Tool, b: Tool) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "clicks") return b._count.clicks - a._count.clicks;
      return 0;
    });

    return result;
  }, [tools, pricingFilter, sortBy]);

  const handleTrackClick = async (tool: Tool) => {
    try {
      const res = await fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: tool.slug }),
      });
      const data = await res.json();
      const url = data.redirectUrl || tool.website || tool.affiliateUrl;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      const url = tool.affiliateUrl || tool.website;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const colors = categoryColorMap[category] || categoryColorMap.bank;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${categoryBgColor}`}
              >
                <span className={`text-lg font-bold ${categoryIconColor}`}>
                  {categoryLabel.charAt(0)}
                </span>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Comparatif {categoryLabel}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isLoading
                    ? "Chargement..."
                    : `${filteredTools.length} outil${filteredTools.length > 1 ? "s" : ""} disponible${filteredTools.length > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {/* Pricing Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              {["all", "gratuit", "freemium", "payant"].map((p) => (
                <Button
                  key={p}
                  variant={pricingFilter === p ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs px-2.5"
                  onClick={() => setPricingFilter(p)}
                >
                  {p === "all" ? "Tous" : pricingLabels[p] || p}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs text-muted-foreground mr-1">Trier :</span>
              {(
                [
                  { value: "rating", label: "Note" },
                  { value: "name", label: "Nom" },
                  { value: "clicks", label: "Popularité" },
                ] as const
              ).map((s) => (
                <Button
                  key={s.value}
                  variant={sortBy === s.value ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs px-2.5"
                  onClick={() => setSortBy(s.value)}
                >
                  {s.label}
                </Button>
              ))}

              {/* View Mode */}
              <div className="flex border rounded-md overflow-hidden ml-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-5">
            {isLoading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                    : "space-y-3"
                }
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-52 rounded-xl" />
                ))}
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className={`h-16 w-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-4`}
                >
                  <span className={`text-2xl font-bold ${colors.text}`}>
                    ?
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  Aucun outil trouvé
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Essayez de modifier vos filtres
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTools.map((tool: Tool, index: number) => (
                  <ToolCardGrid
                    key={tool.id}
                    tool={tool}
                    colors={colors}
                    expanded={expandedTool === tool.id}
                    onToggle={() =>
                      setExpandedTool(expandedTool === tool.id ? null : tool.id)
                    }
                    onTrackClick={() => handleTrackClick(tool)}
                    rank={index + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTools.map((tool: Tool) => (
                  <ToolCardList
                    key={tool.id}
                    tool={tool}
                    colors={colors}
                    expanded={expandedTool === tool.id}
                    onToggle={() =>
                      setExpandedTool(expandedTool === tool.id ? null : tool.id)
                    }
                    onTrackClick={() => handleTrackClick(tool)}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ─── GRID CARD ────────────────────────────────────────────────────

function ToolCardGrid({
  tool,
  colors,
  expanded,
  onToggle,
  onTrackClick,
  rank,
}: {
  tool: Tool;
  colors: { bg: string; text: string; border: string };
  expanded: boolean;
  onToggle: () => void;
  onTrackClick: () => void;
  rank: number;
}) {
  const features = parseLines(tool.features);
  const pros = parseLines(tool.pros);
  const cons = parseLines(tool.cons);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
    >
      <Card
        className={`overflow-hidden transition-all duration-200 hover:shadow-lg border ${colors.border} group`}
      >
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3.5">
            {/* Logo placeholder */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} transition-transform group-hover:scale-105`}
            >
              <span className={`text-xl font-bold ${colors.text}`}>
                {tool.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base truncate">{tool.name}</h3>
                {rank <= 3 && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-1.5 py-0.5 rounded">
                    #{rank}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {tool.tagline}
              </p>
              <div className="flex items-center gap-3 mt-2">
                {renderStars(tool.rating)}
                <Badge
                  variant={pricingBadgeVariant[tool.pricing] || "outline"}
                  className="text-[10px] px-1.5 py-0"
                >
                  {pricingLabels[tool.pricing] || tool.pricing}
                </Badge>
              </div>
            </div>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {features.slice(0, 3).map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-foreground/75"
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${colors.text} opacity-70`} />
                  {f}
                </div>
              ))}
            </div>
          )}

          {/* Expandable Pros/Cons */}
          {(pros.length > 0 || cons.length > 0) && (
            <div className="mt-4 pt-3 border-t">
              <button
                onClick={onToggle}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
              >
                <span>Détails</span>
                {expanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      {/* Pros */}
                      {pros.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <ThumbsUp className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              Points forts
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {pros.map((p, i) => (
                              <li
                                key={i}
                                className="text-xs text-muted-foreground flex items-start gap-1.5"
                              >
                                <span className="text-emerald-500 mt-0.5">+</span>
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Cons */}
                      {cons.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <ThumbsDown className="h-3.5 w-3.5 text-rose-500" />
                            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                              Points faibles
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {cons.map((c, i) => (
                              <li
                                key={i}
                                className="text-xs text-muted-foreground flex items-start gap-1.5"
                              >
                                <span className="text-rose-500 mt-0.5">-</span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* CTA */}
          <Button
            onClick={onTrackClick}
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Découvrir {tool.name}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── LIST CARD ────────────────────────────────────────────────────

function ToolCardList({
  tool,
  colors,
  expanded,
  onToggle,
  onTrackClick,
}: {
  tool: Tool;
  colors: { bg: string; text: string; border: string };
  expanded: boolean;
  onToggle: () => void;
  onTrackClick: () => void;
}) {
  const features = parseLines(tool.features);
  const pros = parseLines(tool.pros);
  const cons = parseLines(tool.cons);

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md border ${colors.border}`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Logo */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}
          >
            <span className={`text-lg font-bold ${colors.text}`}>
              {tool.name.charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm">{tool.name}</h3>
              {renderStars(tool.rating)}
              <Badge
                variant={pricingBadgeVariant[tool.pricing] || "outline"}
                className="text-[10px] px-1.5 py-0"
              >
                {pricingLabels[tool.pricing] || tool.pricing}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {tool.tagline}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {(pros.length > 0 || cons.length > 0) && (
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onToggle}>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
            <Button
              onClick={onTrackClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              Essayer
            </Button>
          </div>
        </div>

        {/* Features pills in list mode */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {features.slice(0, 4).map((f, i) => (
              <span
                key={i}
                className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Expandable details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pros */}
                {pros.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Points forts
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {pros.map((p, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5">+</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {cons.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <ThumbsDown className="h-3.5 w-3.5 text-rose-500" />
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        Points faibles
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {cons.map((c, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-rose-500 mt-0.5">-</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
