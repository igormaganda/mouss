"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
import { Check, Zap, Crown, Rocket, Star, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

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

interface PricingSectionProps {
  initialPacks?: Pack[];
}

export function PricingSection({ initialPacks }: PricingSectionProps) {
  const [packs, setPacks] = useState<Pack[]>(initialPacks || []);
  const [isLoading, setIsLoading] = useState(!initialPacks || initialPacks.length === 0);
  const [processingPack, setProcessingPack] = useState<string | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [email, setEmail] = useState("");

  const fetchPacks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/packs");
      if (!res.ok) throw new Error("Erreur de chargement");

      const data = await res.json();
      if (data.packs && data.packs.length > 0) {
        setPacks(data.packs);
      } else {
        // Auto-seed packs
        const seedRes = await fetch("/api/packs/seed?seed=true");
        const seedData = await seedRes.json();
        if (seedData.packs) {
          setPacks(seedData.packs);
        }
      }
    } catch (error) {
      console.error("Error fetching packs:", error);
      toast.error("Impossible de charger les plans tarifaires");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (packs.length === 0) {
      fetchPacks();
    }
  }, [fetchPacks, packs.length]);

  const handleSelectPlan = (pack: Pack) => {
    if (pack.slug === "creation") {
      // Redirect to the creation page
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

  const handleCheckout = async (pack: Pack) => {
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
        // In production, redirect to Stripe checkout
        // window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez reessayer."
      );
    } finally {
      setProcessingPack(null);
    }
  };

  return (
    <section id="pricing" className="hidden md:block py-10 sm:py-14 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800">
            <Star className="h-3.5 w-3.5 mr-1.5" />
            Tarifs transparents
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Choisissez le plan qui vous correspond
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Des solutions adaptées a chaque etape de votre parcours
            entrepreneurial. Sans engagement, annulez a tout moment.
          </p>
        </div>

        {/* Pricing Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-24 mx-auto" />
                <Skeleton className="h-[400px] w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ── One-time Creation Pack (highlighted) ── */}
            {packs.filter((p) => p.slug === "creation").map((pack) => {
              const Icon = PACK_ICONS[pack.slug] || Sparkles;
              return (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl group border-2 border-emerald-500/50 ring-1 ring-emerald-500/10 shadow-lg shadow-emerald-500/10">
                    {/* Badge */}
                    <div className="absolute top-0 left-0 right-0 z-10">
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold text-center py-1.5 tracking-wide uppercase flex items-center justify-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        Offre limitée
                      </div>
                    </div>

                    <CardContent className="p-6 sm:p-8">
                      <div className="grid gap-8 md:grid-cols-2 md:items-center">
                        {/* Left — Info */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 transition-transform group-hover:scale-110">
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{pack.name}</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {pack.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            {pack.features.slice(0, 5).map((feature: string, i: number) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                                className="flex items-start gap-3"
                              >
                                <div className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                                  <Check className="h-3 w-3" />
                                </div>
                                <span className="text-sm text-foreground/80 leading-relaxed">{feature}</span>
                              </motion.div>
                            ))}
                            {pack.features.length > 5 && (
                              <p className="text-xs text-muted-foreground pl-8">
                                +{pack.features.length - 5} autres fonctionnalités...
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right — Price + CTA */}
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-emerald-600">
                                {formatPrice(pack.price, pack.currency)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Paiement unique, accès à vie
                            </p>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-xs font-semibold">
                              Au lieu de 150 €
                            </div>
                          </div>

                          <Button
                            size="lg"
                            className="w-full max-w-xs h-14 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 gap-2 transition-all hover:scale-[1.02]"
                            onClick={() => handleSelectPlan(pack)}
                          >
                            <Sparkles className="h-5 w-5" />
                            Créer mon entreprise
                            <ArrowRight className="h-4 w-4" />
                          </Button>

                          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <span>15 minutes</span>
                            <span>·</span>
                            <span>Satisfait ou remboursé</span>
                            <span>·</span>
                            <span>SASU, SAS, SARL, EURL</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* ── Subscription Packs ── */}
            <div className="mt-16">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Abonnements d&apos;accompagnement
                </h3>
                <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                  Pour un suivi continu de votre activité au quotidien
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
                {packs.filter((p) => p.slug !== "creation" && p.slug !== "starter").map((pack, index) => {
                  const Icon = PACK_ICONS[pack.slug] || Zap;
                  const isPopular = pack.slug === "pro";
                  const isPremium = pack.slug === "premium";

                  return (
                    <motion.div
                      key={pack.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={isPopular ? "md:-mt-4 md:mb-[-16px]" : ""}
                    >
                      <Card
                        className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg group h-full flex flex-col ${
                          isPopular || isPremium
                            ? `border-2 ${PACK_BORDERS[pack.slug]}`
                            : ""
                        } ${
                          isPopular
                            ? "shadow-lg shadow-emerald-500/10"
                            : isPremium
                              ? "shadow-lg shadow-orange-500/10"
                              : "hover:shadow-md"
                        }`}
                      >
                        {/* Popular badge */}
                        {isPopular && (
                          <div className="absolute top-0 left-0 right-0">
                            <div className="bg-emerald-500 text-white text-xs font-semibold text-center py-1.5 tracking-wide uppercase">
                              Populaire
                            </div>
                          </div>
                        )}

                        <CardHeader className="text-center pb-2 pt-8 px-6">
                          {/* Icon */}
                          <div
                            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 mx-auto transition-transform group-hover:scale-110 ${
                              PACK_ICON_COLORS[pack.slug] || "bg-muted text-muted-foreground"
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
                            <div className="flex items-baseline justify-center gap-1">
                              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                                {formatPrice(pack.price, pack.currency)}
                              </span>
                              {pack.price > 0 && (
                                <span className="text-base font-medium text-muted-foreground">
                                  /mois
                                </span>
                              )}
                            </div>
                            {pack.price === 0 && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Pour toujours, sans carte bancaire
                              </p>
                            )}
                            {pack.price > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Facture annuellement
                              </p>
                            )}
                          </div>

                          {/* Features */}
                          <div className="space-y-3">
                            {pack.features.map((feature: string, i: number) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                                className="flex items-start gap-3"
                              >
                                <div
                                  className={`flex-shrink-0 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${
                                    isPopular
                                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                                      : isPremium
                                        ? "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400"
                                        : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  <Check className="h-3 w-3" />
                                </div>
                                <span className="text-sm text-foreground/80 leading-relaxed">
                                  {feature}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>

                        <CardFooter className="px-6 pb-8 pt-4">
                          <Button
                            size="lg"
                            className={`w-full h-12 text-sm font-semibold transition-all ${
                              isPopular
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30"
                                : isPremium
                                  ? "bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 hover:shadow-lg hover:shadow-orange-600/30"
                                  : "bg-muted hover:bg-muted/80 text-foreground"
                            }`}
                            onClick={() => handleSelectPlan(pack)}
                            disabled={processingPack === pack.id}
                          >
                            {processingPack === pack.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Traitement en cours...
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
              </div>
            </div>
          </>
        )}

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            {[
              { text: "Annulation a tout moment" },
              { text: "Support reactif" },
              { text: "Donnees securisees" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Dialog */}
      {emailDialogOpen && selectedPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEmailDialogOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
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
              <h3 className="text-xl font-bold">
                Confirmez votre choix
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Plan <strong className="text-foreground">{selectedPack.name}</strong>{" "}
                — {formatPrice(selectedPack.price, selectedPack.currency)}/mois
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
                d&apos;utilisation. Paiement securise par Stripe.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
