"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  ArrowRight,
  Star,
  ArrowLeft,
  Mail,
  Phone,
  Megaphone,
  Users,
  Palette,
  Target,
  FileBarChart,
  Banknote,
  Compass,
  TrendingUp,
  Search,
  Globe,
  GraduationCap,
  Scale,
  type LucideIcon,
  Calendar,
  Check,
  Zap,
  ShieldCheck,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceTier {
  name: string;
  price: string;
  description: string;
  includes: string[];
  duration: string;
  cta: string;
  popular: boolean;
}

interface Service {
  slug: string;
  shortTitle: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  priceFrom: number;
  priceUnit: string;
  icon: string;
  gradient: string;
  features: string[];
  deliverables: string[];
  tiers: ServiceTier[];
  faq: { question: string; answer: string }[];
}

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Megaphone,
  Users,
  Palette,
  Target,
  FileBarChart,
  Banknote,
  Compass,
  TrendingUp,
  Search,
  Globe,
  GraduationCap,
  Scale,
};

// ─── Fallback Service ─────────────────────────────────────────────────────────

const FALLBACK_SERVICE: Service = {
  slug: "service",
  shortTitle: "Service",
  title: "Service d'accompagnement",
  description: "Description du service d'accompagnement.",
  shortDescription: "Description courte du service.",
  category: "Accompagnement",
  priceFrom: 490,
  priceUnit: "€/mois",
  icon: "Zap",
  gradient: "from-emerald-500 to-teal-600",
  features: ["Feature 1", "Feature 2", "Feature 3"],
  deliverables: ["Livrable 1", "Livrable 2"],
  tiers: [],
  faq: [],
};

// ─── Animation Helpers ────────────────────────────────────────────────────────

function FadeInWhenVisible({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.55, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ServiceDetailPage({ slug }: { slug: string }) {
  const { data: serviceData, isLoading } = useQuery({
    queryKey: ["accompagnement-service", slug],
    queryFn: async () => {
      const res = await fetch(`/api/accompagnement/${slug}`);
      if (!res.ok) throw new Error("Service not found");
      const json = await res.json();
      return json.service as Service;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allServicesData } = useQuery({
    queryKey: ["accompagnement-services"],
    queryFn: async () => {
      const res = await fetch("/api/accompagnement");
      if (!res.ok) throw new Error("Erreur");
      const json = await res.json();
      return json.services as Service[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const service = serviceData || FALLBACK_SERVICE;
  const allServices = allServicesData || [];
  const Icon = ICON_MAP[service.icon] || Zap;

  // Related services: same category, excluding current
  const relatedServices = allServices
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 4);

  // If not enough related, add others
  if (relatedServices.length < 4) {
    const others = allServices
      .filter((s) => s.slug !== service.slug && !relatedServices.find((r) => r.slug === s.slug))
      .slice(0, 4 - relatedServices.length);
    relatedServices.push(...others);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
          <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-teal-400/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Breadcrumb className="mb-8">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-emerald-200 hover:text-white">
                      Accueil
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-emerald-300" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/accompagnement" className="text-emerald-200 hover:text-white">
                      Accompagnement
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-emerald-300" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-semibold">
                      {isLoading ? "Chargement..." : service.shortTitle}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.nav>

            <div className="max-w-3xl">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-16 rounded-xl bg-white/20" />
                  <Skeleton className="h-10 w-2/3 bg-white/20" />
                  <Skeleton className="h-5 w-full bg-white/15" />
                  <Skeleton className="h-5 w-3/4 bg-white/15" />
                </div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-xl mb-6`}>
                      <Icon className="h-7 w-7" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="flex flex-wrap items-center gap-3 mb-4"
                  >
                    <Badge className="bg-white/15 text-white border-white/25 text-sm">
                      {service.category}
                    </Badge>
                    {service.priceFrom > 0 ? (
                      <Badge className="bg-emerald-400/20 text-emerald-100 border-emerald-300/30 text-sm">
                        À partir de {service.priceFrom.toLocaleString("fr-FR")}€{service.priceUnit}
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-400/20 text-amber-100 border-amber-300/30 text-sm">
                        100% au succès
                      </Badge>
                    )}
                  </motion.div>

                  <motion.h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {service.title}
                  </motion.h1>

                  <motion.p
                    className="mt-5 text-lg text-emerald-100/90 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {service.description}
                  </motion.p>

                  <motion.div
                    className="mt-8 flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <a href="mailto:contact@crea-entreprise.fr">
                      <Button
                        size="lg"
                        className="h-13 px-8 text-base font-bold bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl shadow-emerald-900/30 gap-2.5 transition-all hover:scale-[1.02]"
                      >
                        <Mail className="h-5 w-5" />
                        Demander un devis
                      </Button>
                    </a>
                    <Link href="/accompagnement">
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-13 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10 gap-2.5 transition-all"
                      >
                        <ArrowLeft className="h-5 w-5" />
                        Tous les services
                      </Button>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — FEATURES & DELIVERABLES
        ═══════════════════════════════════════════════════════════════ */}
        {!isLoading && (
          <section className="py-16 sm:py-24 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2">
                {/* Features */}
                <FadeInWhenVisible>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      Ce que nous faisons pour vous
                    </h2>
                    <div className="space-y-4">
                      {service.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.06 }}
                          className="flex items-start gap-3"
                        >
                          <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 shrink-0">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-foreground/80 leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeInWhenVisible>

                {/* Deliverables */}
                <FadeInWhenVisible delay={0.15}>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                      <ArrowRight className="h-6 w-6 text-emerald-600" />
                      Vos livrables
                    </h2>
                    <div className="space-y-4">
                      {service.deliverables.map((deliverable, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.06 }}
                          className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50"
                        >
                          <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="text-foreground/80 leading-relaxed">{deliverable}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeInWhenVisible>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — PRICING TIERS
        ═══════════════════════════════════════════════════════════════ */}
        {!isLoading && service.tiers && service.tiers.length > 0 && (
          <section className="py-16 sm:py-24 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <FadeInWhenVisible className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Tarification
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Choisissez votre formule
                </h2>
                <p className="mt-3 text-muted-foreground text-lg">
                  Des options adaptées à chaque budget et chaque besoin
                </p>
              </FadeInWhenVisible>

              <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                {service.tiers.map((tier, index) => (
                  <FadeInWhenVisible key={tier.name} delay={index * 0.1}>
                    <Card
                      className={`h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                        tier.popular
                          ? "border-2 border-primary ring-2 ring-primary/10 shadow-lg"
                          : "border-border hover:-translate-y-1"
                      }`}
                    >
                      {tier.popular && (
                        <div className="absolute top-0 left-0 right-0 z-10">
                          <div className="bg-primary text-white text-xs font-semibold text-center py-1.5 tracking-wide uppercase flex items-center justify-center gap-1">
                            <Star className="h-3 w-3" />
                            Populaire
                          </div>
                        </div>
                      )}

                      <CardHeader className="text-center pb-2 pt-8 px-6">
                        <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">{tier.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="flex-1 px-6 pt-2">
                        {/* Price */}
                        <div className="text-center mb-6">
                          <span className="text-3xl font-extrabold tracking-tight text-foreground">
                            {tier.price}
                          </span>
                          {tier.duration && (
                            <p className="text-sm text-muted-foreground mt-1">{tier.duration}</p>
                          )}
                        </div>

                        {/* Includes */}
                        <div className="space-y-3">
                          {tier.includes.map((item) => (
                            <div key={item} className="flex items-start gap-3">
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 shrink-0 mt-0.5">
                                <Check className="h-3 w-3" />
                              </span>
                              <span className="text-sm text-foreground/80 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="px-6 pb-8 pt-4">
                        <a href="mailto:contact@crea-entreprise.fr">
                          <Button
                            size="lg"
                            className={`w-full h-12 text-sm font-semibold gap-2 transition-all hover:shadow-lg ${
                              tier.popular
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                                : "bg-muted hover:bg-muted/80 text-foreground"
                            }`}
                          >
                            {tier.cta}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </a>
                      </CardFooter>
                    </Card>
                  </FadeInWhenVisible>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — FAQ
        ═══════════════════════════════════════════════════════════════ */}
        {!isLoading && service.faq && service.faq.length > 0 && (
          <section className="py-16 sm:py-24 bg-white">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <FadeInWhenVisible className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  FAQ
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Questions fréquentes
                </h2>
                <p className="mt-3 text-muted-foreground text-lg">
                  Tout ce que vous devez savoir sur {service.shortTitle}
                </p>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={0.1}>
                <Card className="border-border/80">
                  <CardContent className="p-2 sm:p-4">
                    <Accordion type="single" collapsible className="w-full">
                      {service.faq.map((faq, idx) => (
                        <AccordionItem key={idx} value={`faq-${idx}`} className="px-2 sm:px-4">
                          <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-emerald-700 hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — OTHER SERVICES
        ═══════════════════════════════════════════════════════════════ */}
        {!isLoading && relatedServices.length > 0 && (
          <section className="py-16 sm:py-24 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <FadeInWhenVisible className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Explorer
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Découvrez nos autres services
                </h2>
                <p className="mt-3 text-muted-foreground text-lg">
                  Complétez votre accompagnement avec des services complémentaires
                </p>
              </FadeInWhenVisible>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
                {relatedServices.map((related, index) => {
                  const RelIcon = ICON_MAP[related.icon] || Zap;

                  return (
                    <FadeInWhenVisible key={related.slug} delay={index * 0.08}>
                      <Link href={`/accompagnement/${related.slug}`}>
                        <Card className="h-full bg-white border-border/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                          <CardHeader className="pb-3">
                            <div
                              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${related.gradient} text-white shadow-md mb-3 transition-transform duration-300 group-hover:scale-110`}
                            >
                              <RelIcon className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-base font-bold">{related.shortTitle}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center gap-2">
                              {related.priceFrom > 0 ? (
                                <>
                                  <span className="text-sm font-bold text-emerald-600">
                                    {related.priceFrom.toLocaleString("fr-FR")}€
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {related.priceUnit}
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                                  Au succès
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </FadeInWhenVisible>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6 — CTA
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-slate-900">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center lg:px-8 lg:py-28">
            <FadeInWhenVisible>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
                <Compass className="h-8 w-8 text-emerald-400" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Prêt à vous lancer avec {isLoading ? "ce service" : service.shortTitle} ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
                Contactez-nous pour un devis personnalisé. Nous répondons sous 24h.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:contact@crea-entreprise.fr">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-xl shadow-emerald-900/40 gap-2.5 transition-all hover:scale-[1.02]"
                  >
                    <Mail className="h-5 w-5" />
                    Nous contacter
                  </Button>
                </a>
                <a href="mailto:contact@crea-entreprise.fr">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base font-semibold border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white gap-2.5 transition-all"
                  >
                    <Calendar className="h-5 w-5" />
                    Prendre rendez-vous
                  </Button>
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400/70" />
                  Sans engagement
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400/70" />
                  Réponse sous 24h
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-400/70" />
                  Devis gratuit
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
