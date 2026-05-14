"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
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
  Rocket,
  TrendingUp,
  Building2,
  ArrowRight,
  Check,
  Star,
  Zap,
  Megaphone,
  Users,
  Palette,
  Target,
  FileBarChart,
  Banknote,
  Compass,
  Search,
  Globe,
  GraduationCap,
  Scale,
  type LucideIcon,
  Calendar,
  Mail,
  Phone,
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

interface Bundle {
  name: string;
  price: string;
  subtitle: string;
  includes: string[];
  discount: string;
  recommended: boolean;
  cta: string;
  gradient: string;
  icon: LucideIcon;
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

// ─── Fallback Data ────────────────────────────────────────────────────────────

const FALLBACK_SERVICES: Service[] = [
  {
    slug: "marketing-digital", shortTitle: "Marketing Digital", title: "Accompagnement Marketing Digital",
    description: "Stratégie marketing complète pour attirer vos premiers clients en ligne.",
    shortDescription: "Audit, réseaux sociaux, Google Ads, SEO basique et reporting pour attirer vos premiers clients en ligne.",
    category: "Marketing", priceFrom: 490, priceUnit: "€/mois", icon: "Megaphone", gradient: "from-violet-500 to-purple-600",
    features: ["Audit digital", "Stratégie social media", "Google Ads / Meta Ads", "Reporting mensuel"],
    deliverables: ["Audit initial", "Calendrier éditorial", "Rapport mensuel"],
    tiers: [], faq: [],
  },
  {
    slug: "community-management", shortTitle: "Community Management", title: "Community Management",
    description: "Gestion complète de vos réseaux sociaux.",
    shortDescription: "Contenu, engagement, stories, reels et stratégie de croissance sur vos réseaux sociaux.",
    category: "Marketing", priceFrom: 390, priceUnit: "€/mois", icon: "Users", gradient: "from-pink-500 to-rose-600",
    features: ["Gestion plateformes", "Création contenu", "Stories quotidiennes", "Reporting"],
    deliverables: ["Posts mensuels", "Stories", "Veille concurrentielle"],
    tiers: [], faq: [],
  },
  {
    slug: "supports-communication", shortTitle: "Supports de Communication", title: "Création de Supports de Communication",
    description: "Identité visuelle professionnelle pour votre marque.",
    shortDescription: "Logo, charte graphique, kit de lancement et brand book pour une image de marque forte.",
    category: "Design", priceFrom: 290, priceUnit: "€", icon: "Palette", gradient: "from-amber-500 to-orange-600",
    features: ["Logo professionnel", "Identité de marque", "Kit de lancement", "Brand Book"],
    deliverables: ["Fichiers source", "Guide identité", "Papeterie"],
    tiers: [], faq: [],
  },
  {
    slug: "lead-generation", shortTitle: "Lead Generation B2B", title: "Lead Generation B2B",
    description: "Flux constant de prospects qualifiés.",
    shortDescription: "Prospection LinkedIn, email outreach, landing pages et campagnes ciblées pour générer des leads.",
    category: "Commercial", priceFrom: 790, priceUnit: "€/mois", icon: "Target", gradient: "from-cyan-500 to-blue-600",
    features: ["Profil LinkedIn", "Prospection automatique", "Séquences email", "CRM"],
    deliverables: ["Leads qualifiés", "CRM configuré", "Reporting"],
    tiers: [], faq: [],
  },
  {
    slug: "business-plan", shortTitle: "Business Plan", title: "Business Plan & Prévisionnel Financier",
    description: "Business plan professionnel pré-rempli avec vos données.",
    shortDescription: "Business plan et prévisionnel 3 ans, pré-rempli automatiquement pour un gain de temps maximal.",
    category: "Finance", priceFrom: 290, priceUnit: "€", icon: "FileBarChart", gradient: "from-emerald-500 to-green-600",
    features: ["BP pré-rempli", "Prévisionnel 3 ans", "Étude de marché", "Pitch deck"],
    deliverables: ["BP PDF", "Prévisionnel", "Pitch deck"],
    tiers: [], faq: [],
  },
  {
    slug: "recouvrement", shortTitle: "Recouvrement de Créances", title: "Recouvrement de Créances",
    description: "Recouvrement amiable 100% au succès.",
    shortDescription: "Relances, négociation et suivi jusqu'au paiement. Zéro frais avancés, paiement au succès uniquement.",
    category: "Finance", priceFrom: 0, priceUnit: "Au succès", icon: "Banknote", gradient: "from-red-500 to-rose-600",
    features: ["Relances email/tel", "Mise en demeure", "Négociation", "Coordination huissier"],
    deliverables: ["Rapport suivi", "Scoring clients", "Modèles CGV"],
    tiers: [], faq: [],
  },
  {
    slug: "copilote-entreprise", shortTitle: "Copilote Entreprise", title: "Copilote Entreprise (Coaching Opérationnel)",
    description: "Partenaire opérationnel pour le dirigeant.",
    shortDescription: "Sessions visio, support Slack illimité, tableau de bord KPIs et Pain Tracker exclusif pour piloter votre croissance.",
    category: "Coaching", priceFrom: 149, priceUnit: "€/session", icon: "Compass", gradient: "from-emerald-600 to-teal-600",
    features: ["Sessions visio", "Support Slack", "Pain Tracker", "Dashboard KPIs"],
    deliverables: ["Comptes-rendus", "Dashboard KPIs", "Pain Tracker"],
    tiers: [], faq: [],
  },
  {
    slug: "daf-externalise", shortTitle: "DAF Externalisé", title: "DAF Externalisé & Pilotage Financier",
    description: "Pilotage financier professionnel à fraction du coût.",
    shortDescription: "Reporting, trésorerie, optimisation fiscale, relation banque/investisseurs et business plan récurrent.",
    category: "Finance", priceFrom: 1490, priceUnit: "€/mois", icon: "TrendingUp", gradient: "from-blue-500 to-indigo-600",
    features: ["Reporting financier", "Trésorerie", "Optimisation fiscale", "Relation banque"],
    deliverables: ["Reporting mensuel", "Dashboard", "Prévisions"],
    tiers: [], faq: [],
  },
  {
    slug: "seo-referencement", shortTitle: "SEO & Référencement", title: "SEO & Référencement Naturel",
    description: "Visibilité durable sur Google.",
    shortDescription: "Audit SEO, référencement local, stratégie de contenu, netlinking et suivi de positions pour dominer Google.",
    category: "Marketing", priceFrom: 490, priceUnit: "€", icon: "Search", gradient: "from-green-500 to-emerald-600",
    features: ["Audit SEO", "SEO local", "Contenu", "Netlinking"],
    deliverables: ["Plan d'action 90j", "Articles", "Rapport positions"],
    tiers: [], faq: [],
  },
  {
    slug: "creation-site-web", shortTitle: "Création Site Web", title: "Création & Refonte de Site Web",
    description: "Site professionnel optimisé SEO.",
    shortDescription: "Landing page, site vitrine ou site business avec blog et CMS. Design responsive et performant.",
    category: "Tech", priceFrom: 890, priceUnit: "€", icon: "Globe", gradient: "from-sky-500 to-cyan-600",
    features: ["Design responsive", "SEO", "Analytics", "CMS admin"],
    deliverables: ["Site en ligne", "Formation CMS", "3 mois support"],
    tiers: [], faq: [],
  },
  {
    slug: "formation", shortTitle: "Formation & Compétences", title: "Formation & Montée en Compétences",
    description: "Formations pratiques pour dirigeants de TPE/PME.",
    shortDescription: "Masterclasses en ligne, bootcamps et formations sur-mesure pour développer vos compétences clés.",
    category: "Formation", priceFrom: 49, priceUnit: "€/session", icon: "GraduationCap", gradient: "from-orange-500 to-amber-600",
    features: ["Masterclasses", "Bootcamps", "Certification", "Communauté"],
    deliverables: ["Certificat", "Supports PDF", "Exercices"],
    tiers: [], faq: [],
  },
  {
    slug: "juridique-ongoing", shortTitle: "Juridique & Conformité", title: "Juridique & Conformité Ongoing",
    description: "Accompagnement juridique continu abordable.",
    shortDescription: "Audit, rédaction de contrats, consultation, veille réglementaire et conformité RGPD au quotidien.",
    category: "Juridique", priceFrom: 149, priceUnit: "€", icon: "Scale", gradient: "from-slate-500 to-gray-700",
    features: ["Audit juridique", "Contrats", "Consultation", "Veille"],
    deliverables: ["Rapport conformité", "Contrats", "Veille mensuelle"],
    tiers: [], faq: [],
  },
];

// ─── Bundles Data ─────────────────────────────────────────────────────────────

const BUNDLES: Bundle[] = [
  {
    name: "Créateur Confiant",
    price: "4 990€",
    subtitle: "L'essentiel pour bien démarrer",
    includes: ["Kit de Lancement", "Copilote 6 mois", "SEO Local 6 mois", "BP Express"],
    discount: "-41%",
    recommended: false,
    cta: "Choisir ce pack",
    gradient: "from-emerald-500 to-emerald-700",
    icon: Rocket,
  },
  {
    name: "Machine à Leads",
    price: "14 990€",
    subtitle: "Générez un flux constant de prospects",
    includes: ["Site Business", "Lead Gen 6 mois", "CM 6 mois", "SEO Croissance 6 mois"],
    discount: "-43%",
    recommended: false,
    cta: "Choisir ce pack",
    gradient: "from-cyan-500 to-blue-600",
    icon: Target,
  },
  {
    name: "CEO Délégué",
    price: "29 990€/an",
    subtitle: "Déléguez et concentrez-vous",
    includes: ["Copilote Premium", "DAF Essentiel", "Legal Care", "CM Engagement"],
    discount: "-44%",
    recommended: true,
    cta: "Choisir ce pack",
    gradient: "from-amber-500 to-orange-600",
    icon: Building2,
  },
];

// ─── Personas Data ────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    icon: Rocket,
    emoji: "🚀",
    title: "Je viens de créer",
    description: "Vous venez de recevoir votre KBIS et devez tout construire de zéro.",
    services: "Pack Créer mon entreprise, Kit de Lancement, Business Plan, Copilote Light",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    textColor: "text-emerald-700 dark:text-emerald-400",
  },
  {
    icon: TrendingUp,
    emoji: "📈",
    title: "Je veux grandir",
    description: "Votre entreprise tourne et vous cherchez à accélérer votre croissance.",
    services: "Marketing Digital, Lead Generation, SEO, Community Management",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    borderColor: "border-cyan-200 dark:border-cyan-800",
    textColor: "text-cyan-700 dark:text-cyan-400",
  },
  {
    icon: Building2,
    emoji: "🏢",
    title: "Je dirige une PME",
    description: "Vous avez une équipe et devez déléguer pour vous concentrer sur votre cœur de métier.",
    services: "DAF Externalisé, Copilote Premium, Juridique Ongoing, Formation",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    textColor: "text-amber-700 dark:text-amber-400",
  },
];

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
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className,
  staggerDelay = 0.07,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function AccompagnementPage() {
  const { data, isLoading } = useQuery({
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

  const services = data || FALLBACK_SERVICES;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-teal-400/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
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
                    <BreadcrumbPage className="text-white font-semibold">Accompagnement</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.nav>

            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/15 text-white border-white/25 hover:bg-white/25 backdrop-blur-sm">
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  Notre Univers Accompagnement
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Bien plus qu&apos;une création,{" "}
                <span className="bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
                  un partenaire de croissance
                </span>
              </motion.h1>

              <motion.p
                className="mt-6 text-lg sm:text-xl text-emerald-100/90 leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Du marketing au juridique, nos 12 services couvrent tous les besoins
                de votre TPE/PME pour passer de la création à la croissance.
              </motion.p>

              {/* Stats row */}
              <motion.div
                className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {[
                  { value: "12", label: "services", icon: Star },
                  { value: "490€", label: "/mois à partir de", icon: Zap },
                  { value: "500+", label: "entrepreneurs accompagnés", icon: ShieldCheck },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-4"
                  >
                    <stat.icon className="h-5 w-5 text-emerald-300 mb-1" />
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {stat.value}
                    </span>
                    <span className="text-xs sm:text-sm text-emerald-200/80">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — USER JOURNEY / PERSONAS
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Votre profil
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Quel type d&apos;entrepreneur êtes-vous ?
              </h2>
              <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
                Découvrez les services recommandés pour votre situation
              </p>
            </FadeInWhenVisible>

            <StaggerContainer className="grid gap-6 md:grid-cols-3">
              {PERSONAS.map((persona) => (
                <motion.div key={persona.title} variants={staggerChild}>
                  <Card
                    className={`h-full border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${persona.borderColor} ${persona.bgColor}`}
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="text-4xl mb-3">{persona.emoji}</div>
                      <CardTitle className="text-xl">{persona.title}</CardTitle>
                      <CardDescription className="text-sm mt-2 leading-relaxed">
                        {persona.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {persona.services.split(", ").map((service) => (
                          <Badge key={service} variant="secondary" className="text-xs font-normal">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 justify-center">
                      <a href="#services">
                        <Button
                          variant="outline"
                          className={`gap-2 border-current/20 ${persona.textColor} hover:${persona.textColor}`}
                        >
                          Voir mes recommandations
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — SERVICES GRID
        ═══════════════════════════════════════════════════════════════ */}
        <section id="services" className="py-16 sm:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Nos services
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Nos 12 services d&apos;accompagnement
              </h2>
              <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
                Du marketing au juridique, nous couvrons tous les besoins de votre TPE/PME
              </p>
            </FadeInWhenVisible>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
                {services.map((service) => {
                  const Icon = ICON_MAP[service.icon] || Zap;

                  return (
                    <motion.div key={service.slug} variants={staggerChild}>
                      <Card className="h-full bg-white border-border/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <div
                              className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-xs font-normal bg-muted text-muted-foreground"
                            >
                              {service.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-bold leading-tight">
                            {service.shortTitle}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed mt-1.5 line-clamp-2">
                            {service.shortDescription}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0 flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            {service.priceFrom > 0 ? (
                              <>
                                <span className="text-lg font-extrabold text-emerald-600">
                                  {service.priceFrom.toLocaleString("fr-FR")}€
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {service.priceUnit}
                                </span>
                              </>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400">
                                Au succès
                              </Badge>
                            )}
                          </div>
                        </CardContent>

                        <CardFooter className="pt-2">
                          <a
                            href={`/accompagnement/${service.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group/link"
                          >
                            En savoir plus
                            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                          </a>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </StaggerContainer>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — BUNDLES
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Packs avantageux
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Nos bundles stratégiques
              </h2>
              <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
                Combinez nos services et économisez jusqu&apos;à 44% sur votre accompagnement
              </p>
            </FadeInWhenVisible>

            <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
              {BUNDLES.map((bundle) => {
                const BundleIcon = bundle.icon;

                return (
                  <motion.div
                    key={bundle.name}
                    variants={staggerChild}
                    className={bundle.recommended ? "md:-mt-4 md:mb-[-16px]" : ""}
                  >
                    <Card
                      className={`h-full relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                        bundle.recommended
                          ? "border-2 border-primary ring-2 ring-primary/10 shadow-lg shadow-primary/10 scale-[1.02] md:scale-105"
                          : "border-border hover:-translate-y-1"
                      }`}
                    >
                      {/* Discount badge */}
                      <div className="absolute top-0 right-0 z-10">
                        <div className={`bg-gradient-to-r ${bundle.gradient} text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl`}>
                          {bundle.discount}
                        </div>
                      </div>

                      {/* Recommended badge */}
                      {bundle.recommended && (
                        <div className="absolute top-0 left-0 right-0 z-10">
                          <div className="bg-primary text-white text-xs font-semibold text-center py-1.5 tracking-wide uppercase flex items-center justify-center gap-1">
                            <Star className="h-3 w-3" />
                            Recommandé
                          </div>
                        </div>
                      )}

                      <CardHeader className="text-center pb-2 pt-8 px-6">
                        <div
                          className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 bg-gradient-to-br ${bundle.gradient} text-white shadow-lg`}
                        >
                          <BundleIcon className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-xl font-bold">{bundle.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">{bundle.subtitle}</CardDescription>
                      </CardHeader>

                      <CardContent className="px-6 pt-2">
                        {/* Price */}
                        <div className="text-center mb-6">
                          <span className="text-4xl font-extrabold tracking-tight text-foreground">
                            {bundle.price}
                          </span>
                          <p className="text-sm text-muted-foreground mt-1">Paiement unique</p>
                        </div>

                        {/* Includes */}
                        <div className="space-y-3">
                          {bundle.includes.map((item) => (
                            <div key={item} className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 shrink-0">
                                <Check className="h-3 w-3" />
                              </span>
                              <span className="text-sm text-foreground/80">{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="px-6 pb-8 pt-4">
                        <Button
                          size="lg"
                          className={`w-full h-12 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.01] bg-gradient-to-r ${bundle.gradient}`}
                        >
                          {bundle.cta}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — CTA
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

              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Vous avez un projet ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
                Parlons-en. Nos experts sont là pour vous orienter vers les services
                les plus adaptés à votre situation.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:contact@crea-entreprise.fr">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-xl shadow-emerald-900/40 gap-2.5 transition-all hover:scale-[1.02]"
                  >
                    <Calendar className="h-5 w-5" />
                    Prendre rendez-vous
                  </Button>
                </a>
                <a href="mailto:contact@crea-entreprise.fr">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base font-semibold border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white gap-2.5 transition-all"
                  >
                    <Mail className="h-5 w-5" />
                    Nous contacter
                  </Button>
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400/70" />
                  Réponse sous 24h
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400/70" />
                  Sans engagement
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
