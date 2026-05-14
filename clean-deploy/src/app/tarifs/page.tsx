"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Check,
  X,
  Zap,
  Crown,
  Rocket,
  Star,
  Loader2,
  ShieldCheck,
  Clock,
  HeartHandshake,
  Building2,
  Quote,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Pack {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  features: string[];
  active: boolean;
  order: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PACK_ICONS: Record<string, React.ElementType> = {
  creation: Sparkles,
  starter: Rocket,
  pro: Zap,
  premium: Crown,
};

const PACK_GRADIENTS: Record<string, string> = {
  creation: "from-emerald-600/5 to-teal-500/5",
  starter: "from-slate-500/10 to-slate-600/5",
  pro: "from-emerald-500/10 to-emerald-600/5",
  premium: "from-orange-500/10 to-orange-600/5",
};

const PACK_ICON_COLORS: Record<string, string> = {
  creation: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  starter: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  pro: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  premium: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
};

const PACK_BORDERS: Record<string, string> = {
  creation: "border-emerald-500/50 ring-1 ring-emerald-500/10",
  starter: "",
  pro: "border-emerald-500/50 ring-1 ring-emerald-500/10",
  premium: "border-orange-500/50 ring-1 ring-orange-500/10",
};

const PACK_BUTTON_STYLES: Record<string, string> = {
  creation: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30",
  starter: "bg-muted hover:bg-muted/80 text-foreground",
  pro: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30",
  premium: "bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 hover:shadow-lg hover:shadow-orange-600/30",
};

const PACK_CHECK_COLORS: Record<string, string> = {
  creation: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  starter: "bg-muted text-muted-foreground",
  pro: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  premium: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
};

const ANNUAL_DISCOUNT = 0.2; // 20% off for annual billing

function FeatureIcon({ val }: { val: boolean | null }) {
  if (val === true) {
    return (
      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
        <Check className="h-3 w-3" />
      </span>
    );
  }
  if (val === false) {
    return (
      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-muted text-muted-foreground/40">
        <X className="h-3 w-3" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400 text-[10px] font-bold">
      Pro
    </span>
  );
}

// ─── Feature Comparison Types ───────────────────────────────────────────────

interface FeatureCategoryFromDB {
  id: string;
  name: string;
  order: number;
  items: {
    id: string;
    name: string;
    order: number;
    hasCreation: boolean;
    hasPro: boolean;
    hasPremium: boolean;
  }[];
}

// ─── Testimonials ────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Marie Lefèvre",
    role: "Fondatrice de Bloom Studio",
    quote:
      "Grâce au plan Pro, j'ai pu comparer plus de 15 banques pro et assurances en quelques heures seulement. Le gain de temps est considérable et les conseils sont vraiment pertinents.",
    rating: 5,
  },
  {
    name: "Thomas Durand",
    role: "Freelance développeur",
    quote:
      "J'ai commencé avec le plan Starter pour me familiariser, puis passé au Pro quand j'ai lancé mon activité. La transition était fluide et le support très réactif.",
    rating: 5,
  },
  {
    name: "Sophie Martin",
    role: "Directrice générale, TechVision SARL",
    quote:
      "Le plan Premium a été un investissement décisif pour notre PME. Le manager dédié et les audits approfondis nous ont permis d'optimiser nos coûts de 30% en 3 mois.",
    rating: 5,
  },
];

// ─── FAQ Data ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer:
      "Oui, absolument ! Vous pouvez passer à un plan supérieur ou inférieur à tout moment depuis votre espace client. Le changement prend effet immédiatement et la différence est calculée au prorata pour les upgrades.",
  },
  {
    question: "Y a-t-il une période d'essai ?",
    answer:
      "Oui, tous nos plans payants incluent 14 jours d'essai gratuit. Vous pouvez tester toutes les fonctionnalités sans aucun engagement. Aucune carte bancaire n'est requise pour démarrer l'essai.",
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal et les virements bancaires. Tous les paiements sont sécurisés par Stripe. Pour les plans annuels, le paiement en plusieurs fois est également disponible.",
  },
  {
    question: "Puis-je annuler à tout moment ?",
    answer:
      "Oui, il n'y a aucun engagement minimum. Vous pouvez annuler votre abonnement à tout moment depuis votre espace client. Votre accès reste actif jusqu'à la fin de la période déjà payée.",
  },
  {
    question: "Les prix incluent-ils la TVA ?",
    answer:
      "Tous les prix affichés sont hors taxes (HT). La TVA de 20% sera ajoutée pour les professionnels soumis à cette taxe. Les auto-entrepreneurs et entreprises en franchise de TVA ne seront pas facturés de la TVA supplémentaire.",
  },
  {
    question: "Comment fonctionne la garantie ?",
    answer:
      "Nous offrons une garantie satisfait ou rembourse de 30 jours. Si le plan ne répond pas à vos attentes, contactez notre support et nous vous rembourserons intégralement, sans condition ni justification.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(priceInCents: number, currency: string): string {
  if (priceInCents === 0) return "0 €";
  const euros = priceInCents / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase() === "EUR" ? "EUR" : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(euros);
}

function getAnnualPrice(monthlyPriceCents: number): number {
  return Math.round(monthlyPriceCents * 12 * (1 - ANNUAL_DISCOUNT));
}

function formatMonthlyFromAnnual(annualCents: number, currency: string): string {
  if (annualCents === 0) return "0 €";
  const monthly = annualCents / 12;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase() === "EUR" ? "EUR" : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monthly);
}

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function TarifsPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [processingPack, setProcessingPack] = useState<string | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [email, setEmail] = useState("");

  // ─── Data Fetching ───────────────────────────────────────────────────────

  const {
    data: packsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["packs"],
    queryFn: async () => {
      const res = await fetch("/api/packs");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      if (data.packs && data.packs.length > 0) {
        return data.packs as Pack[];
      }
      // Auto-seed if empty
      const seedRes = await fetch("/api/packs/seed?seed=true");
      const seedData = await seedRes.json();
      return (seedData.packs || []) as Pack[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const packs = packsData || [];

  // ─── Feature Matrix Fetching ───────────────────────────────────────────

  const {
    data: featureData,
    isLoading: featuresLoading,
  } = useQuery({
    queryKey: ["pack-features"],
    queryFn: async () => {
      const res = await fetch("/api/pack-features");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      return (data.categories || []) as FeatureCategoryFromDB[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const featureCategories = featureData || [];

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleSelectPlan = (pack: Pack) => {
    if (pack.slug === "creation") {
      window.location.href = "/creer-mon-entreprise";
      return;
    }
    if (pack.price === 0) {
      handleCheckout(pack);
    } else {
      setSelectedPack(pack);
      setEmail("");
      setEmailDialogOpen(true);
    }
  };

  const handleCheckout = useCallback(
    async (pack: Pack) => {
      setProcessingPack(pack.id);
      try {
        const res = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            packId: pack.id,
            email: pack.price === 0 ? "guest@starter.plan" : email,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || "Erreur lors de la commande");
        }

        const data = await res.json();

        if (data.isFree) {
          toast.success(data.message);
          setEmailDialogOpen(false);
        } else {
          toast.success("Redirection vers le paiement...");
          setEmailDialogOpen(false);
        }
      } catch (error) {
        console.error("Checkout error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Une erreur est survenue. Veuillez réessayer."
        );
      } finally {
        setProcessingPack(null);
      }
    },
    [email]
  );

  // ─── Render Helpers ──────────────────────────────────────────────────────

  function getDisplayPrice(pack: Pack) {
    // Creation pack is one-time, not monthly
    if (pack.slug === "creation") {
      return {
        price: formatPrice(pack.price, pack.currency),
        sub: "Paiement unique, accès à vie",
        savings: 0,
        oneTime: true,
      };
    }
    if (isAnnual) {
      const annualTotal = getAnnualPrice(pack.price);
      return {
        price: formatPrice(annualTotal, pack.currency),
        sub: pack.price > 0
          ? `${formatMonthlyFromAnnual(annualTotal, pack.currency)}/mois`
          : "Pour toujours, sans carte bancaire",
        savings: pack.price > 0
          ? Math.round(ANNUAL_DISCOUNT * 100)
          : 0,
        oneTime: false,
      };
    }
    return {
      price: formatPrice(pack.price, pack.currency),
      sub: pack.price > 0
        ? "/mois"
        : "Pour toujours, sans carte bancaire",
      savings: 0,
      oneTime: false,
    };
  }

  // renderFeatureIcon moved to module-level FeatureIcon component

  // ─── Page Render ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ─── Background Decoration ──────────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.03] blur-3xl" />
          <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/[0.03] blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-slate-500/[0.03] blur-3xl" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative pt-8 pb-4 sm:pt-12 sm:pb-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Tarifs</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.nav>

            {/* Hero Content */}
            <div className="text-center mt-8 sm:mt-12 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Badge className="mb-5 px-4 py-1.5 text-sm font-medium bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Offres transparentes
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Choisissez{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  votre plan
                </span>
              </motion.h1>

              <motion.p
                className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Des solutions adaptées à chaque étape de votre projet entrepreneurial.
                Commencez gratuitement et évoluez à votre rythme.
              </motion.p>

              {/* Trust Badges */}
              <motion.div
                className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {[
                  {
                    icon: Clock,
                    text: "14 jours d\u2019essai gratuit",
                    color: "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    icon: ShieldCheck,
                    text: "Sans engagement",
                    color: "text-slate-600 dark:text-slate-400",
                  },
                  {
                    icon: HeartHandshake,
                    text: "Support réactif",
                    color: "text-orange-600 dark:text-orange-400",
                  },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/60 border border-border/50 text-sm text-muted-foreground"
                  >
                    <badge.icon className={`h-4 w-4 ${badge.color}`} />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — PRICING CARDS
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative py-16 sm:py-20" id="pricing">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Monthly / Annual Toggle */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <span
                className={`text-sm font-medium transition-colors ${
                  !isAnnual ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Mensuel
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                aria-label="Basculer entre facturation mensuelle et annuelle"
              />
              <span
                className={`text-sm font-medium transition-colors ${
                  isAnnual ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Annuel
              </span>
              <AnimatePresence>
                {isAnnual && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8, x: -5 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -5 }}
                    className="ml-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-xs font-semibold"
                  >
                    -20%
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-24 mx-auto" />
                    <Skeleton className="h-[450px] w-full rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Impossible de charger les plans tarifaires.
                </p>
                <Button variant="outline" onClick={() => refetch()}>
                  Réessayer
                </Button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {packs.filter((p) => p.slug !== "starter").map((pack, index) => {
                  const Icon = PACK_ICONS[pack.slug] || Zap;
                  const isPopular = pack.slug === "pro";
                  const isPremium = pack.slug === "premium";
                  const isCreation = pack.slug === "creation";
                  const display = getDisplayPrice(pack);

                  return (
                    <motion.div
                      key={pack.id}
                      variants={fadeInUp}
                      custom={index}
                      className={`${isPopular ? "md:-mt-4 md:mb-[-16px]" : ""} ${isCreation ? "md:col-span-1" : ""}`}
                    >
                      <Card
                        className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl group h-full flex flex-col bg-gradient-to-b ${
                          PACK_GRADIENTS[pack.slug] || ""
                        } bg-card ${
                          isPopular || isPremium || isCreation
                            ? `border-2 ${PACK_BORDERS[pack.slug]}`
                            : "border-border"
                        } ${
                          isCreation
                            ? "shadow-lg shadow-emerald-500/10"
                            : isPopular
                              ? "shadow-lg shadow-emerald-500/10"
                              : isPremium
                                ? "shadow-lg shadow-orange-500/10"
                                : "hover:shadow-md"
                        }`}
                      >
                        {/* Badge */}
                        {isCreation && (
                          <div className="absolute top-0 left-0 right-0 z-10">
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold text-center py-1.5 tracking-wide uppercase flex items-center justify-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              Offre limitée
                            </div>
                          </div>
                        )}
                        {/* Popular Badge */}
                        {isPopular && (
                          <div className="absolute top-0 left-0 right-0 z-10">
                            <div className="bg-emerald-500 text-white text-xs font-semibold text-center py-1.5 tracking-wide uppercase flex items-center justify-center gap-1">
                              <Star className="h-3 w-3" />
                              Populaire
                            </div>
                          </div>
                        )}
                        {isPremium && !isPopular && (
                          <div className="absolute top-0 left-0 right-0 z-10">
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold text-center py-1.5 tracking-wide uppercase flex items-center justify-center gap-1">
                              <Crown className="h-3 w-3" />
                              Premium
                            </div>
                          </div>
                        )}

                        <CardHeader className="text-center pb-2 pt-8 px-6">
                          {/* Icon */}
                          <div
                            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 mx-auto transition-transform duration-300 group-hover:scale-110 ${
                              PACK_ICON_COLORS[pack.slug] ||
                              "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-7 w-7" />
                          </div>

                          <CardTitle className="text-xl font-bold">
                            {pack.name}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed mt-2 min-h-[2.5rem]">
                            {pack.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 px-6 pt-4">
                          {/* Price */}
                          <div className="text-center mb-6">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={isCreation ? "creation" : isAnnual ? "annual" : "monthly"}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.25 }}
                              >
                                <div className="flex items-baseline justify-center gap-1">
                                  <span className={`font-extrabold tracking-tight ${isCreation ? "text-4xl sm:text-5xl text-emerald-600" : "text-4xl sm:text-5xl"}`}>
                                    {display.price}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1.5">
                                  {display.sub}
                                </p>
                                {display.savings > 0 && (
                                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                                    Vous économisez{" "}
                                    {formatPrice(
                                      Math.round(pack.price * 12 * ANNUAL_DISCOUNT),
                                      pack.currency
                                    )}{" "}
                                    / an
                                  </p>
                                )}
                              </motion.div>
                            </AnimatePresence>
                          </div>

                          {/* Features */}
                          <div className="space-y-3">
                            {pack.features.map((feature: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-start gap-3"
                              >
                                <div
                                  className={`flex-shrink-0 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${
                                    PACK_CHECK_COLORS[pack.slug] ||
                                    "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  <Check className="h-3 w-3" />
                                </div>
                                <span className="text-sm text-foreground/80 leading-relaxed">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>

                        <CardFooter className="px-6 pb-8 pt-4">
                          <Button
                            size="lg"
                            className={`w-full h-12 text-sm font-semibold transition-all duration-200 ${
                              PACK_BUTTON_STYLES[pack.slug] ||
                              "bg-muted hover:bg-muted/80 text-foreground"
                            }`}
                            onClick={() => handleSelectPlan(pack)}
                            disabled={processingPack === pack.id}
                          >
                            {processingPack === pack.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Traitement...
                              </>
                            ) : isCreation ? (
                              <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Créer mon entreprise
                              </>
                            ) : pack.price === 0 ? (
                              <>
                                <Rocket className="h-4 w-4 mr-2" />
                                Commencer gratuitement
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 mr-2" />
                                Choisir ce plan
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — FEATURE COMPARISON TABLE
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Comparez les fonctionnalités
              </h2>
              <p className="mt-3 text-muted-foreground text-lg">
                Un aperçu détaillé de ce que chaque plan vous offre
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="overflow-x-auto rounded-xl border bg-background shadow-sm"
            >
              <table className="w-full text-sm">
                {/* Sticky Header */}
                <thead className="sticky top-0 z-10 bg-background">
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 sm:px-6 font-semibold text-foreground min-w-[200px]">
                      Fonctionnalités
                    </th>
                    {packs.length > 0 ? (
                      <>
                        <th className="text-center py-4 px-3 sm:px-6 font-semibold text-foreground min-w-[100px] bg-emerald-50/50 dark:bg-emerald-950/20">
                          <div className="flex flex-col items-center gap-1">
                            <Sparkles className="h-4 w-4 text-emerald-600" />
                            <span>Création</span>
                          </div>
                        </th>

                        <th className="text-center py-4 px-3 sm:px-6 font-semibold text-foreground min-w-[100px] bg-emerald-50/50 dark:bg-emerald-950/20">
                          <div className="flex flex-col items-center gap-1">
                            <Zap className="h-4 w-4 text-emerald-600" />
                            <span>Pro</span>
                          </div>
                        </th>
                        <th className="text-center py-4 px-3 sm:px-6 font-semibold text-foreground min-w-[100px] bg-orange-50/50 dark:bg-orange-950/20">
                          <div className="flex flex-col items-center gap-1">
                            <Crown className="h-4 w-4 text-orange-600" />
                            <span>Premium</span>
                          </div>
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="text-center py-4 px-3 sm:px-6 font-semibold min-w-[100px] bg-emerald-50/50 dark:bg-emerald-950/20">Création</th>

                        <th className="text-center py-4 px-3 sm:px-6 font-semibold min-w-[100px] bg-emerald-50/50 dark:bg-emerald-950/20">Pro</th>
                        <th className="text-center py-4 px-3 sm:px-6 font-semibold min-w-[100px] bg-orange-50/50 dark:bg-orange-950/20">Premium</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {featuresLoading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <>
                        <tr key={`cat-skel-${idx}`}>
                          <td colSpan={4} className="py-3 px-4 sm:px-6">
                            <Skeleton className="h-4 w-40" />
                          </td>
                        </tr>
                        <tr key={`feat-skel-${idx}`}>
                          <td className="py-3 px-4 sm:px-6"><Skeleton className="h-4 w-48" /></td>
                          <td className="py-3 px-3 sm:px-6 text-center"><Skeleton className="h-5 w-5 mx-auto rounded-full" /></td>
                          <td className="py-3 px-3 sm:px-6 text-center"><Skeleton className="h-5 w-5 mx-auto rounded-full" /></td>
                          <td className="py-3 px-3 sm:px-6 text-center"><Skeleton className="h-5 w-5 mx-auto rounded-full" /></td>
                        </tr>
                      </>
                    ))
                  ) : (
                    featureCategories.map((category, catIdx) => (
                      <FeatureCategoryRow
                        key={category.id}
                        category={category}
                        isLast={catIdx === featureCategories.length - 1}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — TESTIMONIALS
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Ce que disent nos entrepreneurs
              </h2>
              <p className="mt-3 text-muted-foreground text-lg">
                Rejoignez des milliers d&apos;entrepreneurs qui nous font confiance
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div key={testimonial.name} variants={fadeInUp} custom={index}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="pt-6 pb-6 flex-1 flex flex-col">
                      {/* Stars */}
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-sm leading-relaxed text-foreground/80 flex-1 mb-6">
                        <Quote className="h-5 w-5 text-emerald-500/30 mb-2 flex-shrink-0" />
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {testimonial.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — FAQ
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative py-16 sm:py-20 bg-muted/30" id="faq">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Questions fréquentes
              </h2>
              <p className="mt-3 text-muted-foreground text-lg">
                Tout ce que vous devez savoir avant de commencer
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((item, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6 — ENTERPRISE CTA
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-12 lg:p-16"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-orange-500/10 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.03]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/[0.03]" />

              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 mb-6">
                  <Building2 className="h-7 w-7 text-emerald-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Besoin d&apos;une solution sur mesure ?
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed mb-8">
                  Pour les entreprises et organisations avec des besoins spécifiques,
                  nous proposons des offres personnalisées avec des conditions adaptées
                  à votre structure et votre volume.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-200"
                    onClick={() => {
                      toast.info(
                        "Un conseiller vous contactera sous 24h. Merci de votre intérêt !"
                      );
                    }}
                  >
                    Contacter notre équipe
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 border-white/20 text-white hover:bg-white/10 hover:text-white transition-all duration-200"
                    onClick={() => {
                      setEmailDialogOpen(true);
                      setSelectedPack(null);
                    }}
                  >
                    Demander un devis
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
                  {[
                    "Tarifs négociés",
                    "Intégration sur mesure",
                    "SLA garanti",
                    "Formation équipe",
                  ].map((item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ═══════════════════════════════════════════════════════════════
          EMAIL DIALOG (Checkout)
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {emailDialogOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setEmailDialogOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-background border rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full"
            >
              <button
                onClick={() => setEmailDialogOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fermer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              {selectedPack ? (
                <>
                  {/* Checkout Dialog */}
                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 ${
                        PACK_ICON_COLORS[selectedPack.slug]
                      }`}
                    >
                      {(() => {
                        const DIcon = PACK_ICONS[selectedPack.slug] || Zap;
                        return <DIcon className="h-7 w-7" />;
                      })()}
                    </div>
                    <h3 className="text-xl font-bold">Confirmez votre choix</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Plan{" "}
                      <strong className="text-foreground">
                        {selectedPack.name}
                      </strong>{" "}
                      &mdash; {formatPrice(selectedPack.price, selectedPack.currency)}
                      /mois
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="checkout-email"
                        className="block text-sm font-medium mb-1.5"
                      >
                        Adresse email
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && email.includes("@")) {
                            handleCheckout(selectedPack);
                          }
                        }}
                      />
                    </div>

                    <Button
                      size="lg"
                      className={`w-full h-11 font-semibold ${
                        selectedPack.slug === "premium"
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                      onClick={() => handleCheckout(selectedPack)}
                      disabled={
                        !email ||
                        !email.includes("@") ||
                        processingPack === selectedPack.id
                      }
                    >
                      {processingPack === selectedPack.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        "Poursuivre le paiement"
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      En poursuivant, vous acceptez nos conditions générales
                      d&apos;utilisation. Paiement sécurisé par Stripe.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Enterprise / Custom Dialog */}
                  <div className="text-center mb-6">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 mb-4">
                      <Building2 className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold">Demande de devis</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Notre équipe commerciale vous répondra sous 24h
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="enterprise-email"
                        className="block text-sm font-medium mb-1.5"
                      >
                        Adresse email professionnelle
                      </label>
                      <input
                        id="enterprise-email"
                        type="email"
                        placeholder="vous@entreprise.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    <Button
                      size="lg"
                      className="w-full h-11 font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900"
                      onClick={() => {
                        if (email.includes("@")) {
                          toast.success(
                            "Votre demande de devis a été envoyée ! Nous vous recontacterons sous 24h."
                          );
                          setEmailDialogOpen(false);
                        }
                      }}
                      disabled={!email || !email.includes("@")}
                    >
                      Envoyer ma demande
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Feature Category Row Sub-component ──────────────────────────────────────

function FeatureCategoryRow({
  category,
  isLast,
}: {
  category: FeatureCategoryFromDB;
  isLast: boolean;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={4}
          className={`pt-5 pb-2 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
            !isLast ? "border-b-0" : ""
          }`}
        >
          {category.name}
        </td>
      </tr>
      {category.items.map((item, fIdx) => (
        <tr
          key={item.id}
          className={`border-b last:border-b-0 hover:bg-muted/30 transition-colors ${
            fIdx === category.items.length - 1 && isLast
              ? "border-b-0"
              : ""
          }`}
        >
          <td className="py-3 px-4 sm:px-6 text-sm text-foreground/80">
            {item.name}
          </td>
          <td className="py-3 px-3 sm:px-6 text-center">
            <FeatureIcon val={item.hasCreation} />
          </td>
          <td className="py-3 px-3 sm:px-6 text-center bg-emerald-50/30 dark:bg-emerald-950/10">
            <FeatureIcon val={item.hasPro} />
          </td>
          <td className="py-3 px-3 sm:px-6 text-center bg-orange-50/30 dark:bg-orange-950/10">
            <FeatureIcon val={item.hasPremium} />
          </td>
        </tr>
      ))}
    </>
  );
}
