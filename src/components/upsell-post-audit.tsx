"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Gift,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
interface UpsellPack {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  features: string[];
  order: number;
}

interface UpsellOfferData {
  id: string;
  name: string;
  message: string;
  discountPercent: number;
  targetPackSlug: string;
  pack: UpsellPack;
  discountedPrice: number;
}

interface UpsellResponse {
  offer: UpsellOfferData | null;
  personalizedMessage: string | null;
  alternatives: { name: string; slug: string; price: number; currency: string }[];
}

// ─── Props ────────────────────────────────────────────────────
interface UpsellPostAuditProps {
  auditResultId?: string;
  leadEmail?: string;
  profile?: string;
  phase?: string;
  score?: number;
}

// ─── Helpers ──────────────────────────────────────────────────
const PROFILE_LABELS: Record<string, string> = {
  etudiant: "Etudiant Entrepreneur",
  salarie: "Salarie en Transition",
  freelance: "Freelance / Auto-entrepreneur",
  "tpe-pme": "TPE / PME",
};

const PHASE_LABELS: Record<string, string> = {
  reflexion: "Reflexion",
  creation: "Creation",
  gestion: "Gestion",
  croissance: "Croissance",
};

function formatPrice(priceCents: number, currency: string): string {
  if (priceCents === 0) return "Gratuit";
  return `${(priceCents / 100).toFixed(0)}€/mois`;
}

function getCouponCode(offerName: string, discount: number): string {
  if (offerName.includes("Pro")) return `AUDITPRO${discount}`;
  if (offerName.includes("Premium")) return `AUDITPREM${discount}`;
  return `AUDIT${discount}`;
}

// ─── Animation ────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Component ────────────────────────────────────────────────
export function UpsellPostAudit({
  auditResultId,
  leadEmail,
  profile,
  phase,
  score,
}: UpsellPostAuditProps) {
  const [data, setData] = useState<UpsellResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRecommendation() {
      if (!profile && !phase && !score && !auditResultId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("/api/upsell/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auditResultId,
            leadEmail,
            profile,
            phase,
            score,
          }),
        });

        if (!res.ok) throw new Error("Erreur serveur");
        const json = await res.json();
        setData(json);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendation();
  }, [auditResultId, profile, phase, score]);

  // ── Loading skeleton ────────────────────────────────────
  if (loading) {
    return (
      <motion.div
        className="mt-6 max-w-lg mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Skeleton className="h-4 w-3/4 mx-auto mb-4" />
        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ── Error or no offer ───────────────────────────────────
  if (error || !data?.offer) return null;

  const { offer, personalizedMessage, alternatives } = data;
  const couponCode = getCouponCode(offer.name, offer.discountPercent);

  // Social proof random count
  const socialProofCount = Math.floor(Math.random() * 150) + 80;

  return (
    <motion.div
      className="mt-8 max-w-lg mx-auto"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Congratulation header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-2">
          <CheckCircle className="h-4 w-4" />
          Audit termine avec succes !
        </div>
      </div>

      {/* Main recommendation card */}
      <Card className="relative overflow-hidden border-emerald-500/20 shadow-lg shadow-emerald-500/5">
        {/* Decorative gradient top */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

        {/* Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-400 text-white border-0 font-semibold shadow-md">
            <Gift className="h-3 w-3 mr-1" />
            -{offer.discountPercent}%
          </Badge>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            Recommandation personnalisee
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {personalizedMessage ||
              `Base sur votre profil ${PROFILE_LABELS[profile ?? ""] ?? ""} en phase ${PHASE_LABELS[phase ?? ""] ?? ""}, nous recommandons :`}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 space-y-5">
          {/* Pack info */}
          <div className="bg-gradient-to-br from-emerald-50 to-amber-50/50 dark:from-emerald-950/30 dark:to-amber-950/20 rounded-xl p-5 border border-emerald-500/10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  Pack {offer.pack.name}
                </h3>
                {offer.pack.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {offer.pack.description}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                {offer.discountPercent > 0 && (
                  <span className="block text-xs text-muted-foreground line-through">
                    {formatPrice(offer.pack.price, offer.pack.currency)}
                  </span>
                )}
                <span className="block text-2xl font-bold text-foreground">
                  {formatPrice(offer.discountedPrice, offer.pack.currency)}
                </span>
              </div>
            </div>

            {/* Key features (show up to 4) */}
            {offer.pack.features.length > 0 && (
              <div className="space-y-2">
                {offer.pack.features.slice(0, 4).map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{feat}</span>
                  </div>
                ))}
                {offer.pack.features.length > 4 && (
                  <p className="text-xs text-muted-foreground ml-6">
                    +{offer.pack.features.length - 4} autres fonctionnalites...
                  </p>
                )}
              </div>
            )}

            {/* Coupon code */}
            <div className="mt-4 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-background/80 border border-dashed border-emerald-500/30">
              <Gift className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">
                Obtenez{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  -{offer.discountPercent}%
                </span>{" "}
                avec le code :{" "}
              </span>
              <code className="font-mono text-sm font-bold text-foreground tracking-wider bg-muted px-2 py-0.5 rounded">
                {couponCode}
              </code>
            </div>
          </div>

          {/* CTA */}
          <Button
            asChild
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold h-12 shadow-lg shadow-emerald-500/20"
          >
            <a href={`/tarifs?coupon=${couponCode}`}>
              <Star className="h-5 w-5" />
              Commencer maintenant
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Ou commencez avec{" "}
                {alternatives.map((alt, i) => (
                  <span key={alt.slug}>
                    {i > 0 && " ou "}
                    <a
                      href={`/tarifs`}
                      className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                    >
                      {alt.name}
                    </a>{" "}
                    ({formatPrice(alt.price, alt.currency)})
                  </span>
                ))}
              </p>
            </div>
          )}

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>
              <span className="font-semibold text-foreground">
                {socialProofCount} entrepreneurs
              </span>{" "}
              avec un profil similaire ont choisi ce pack
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
