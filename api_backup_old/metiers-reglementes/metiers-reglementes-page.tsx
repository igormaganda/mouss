"use client";

import { useRef, useState } from "react";
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
  Stethoscope,
  Heart,
  Pill,
  Smile,
  Activity,
  Baby,
  Scale,
  Stamp,
  Calculator,
  ShieldCheck,
  Building2,
  HardHat,
  Compass,
  Search,
  Leaf,
  UtensilsCrossed,
  Croissant,
  Beef,
  Wine,
  Car,
  Truck,
  Box,
  Scissors,
  Sparkles,
  Dumbbell,
  ArrowRight,
  Zap,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  type LucideIcon,
  Rocket,
  Phone,
  Mail,
  Check,
  Users,
  FolderOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profession {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  authority: string;
  diploma: string;
}

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Stethoscope,
  Heart,
  Pill,
  Smile,
  Activity,
  Baby,
  Scale,
  Stamp,
  Calculator,
  ShieldCheck,
  Building2,
  HardHat,
  Compass,
  Search,
  Leaf,
  UtensilsCrossed,
  Croissant,
  Beef,
  Wine,
  Car,
  Truck,
  Box,
  Scissors,
  Sparkles,
  Dumbbell,
};

// ─── Color Gradients ──────────────────────────────────────────────────────────

const colorGradients: Record<string, string> = {
  rose: "from-rose-400 to-pink-500",
  red: "from-red-400 to-rose-500",
  emerald: "from-emerald-400 to-teal-500",
  blue: "from-blue-400 to-cyan-500",
  teal: "from-teal-400 to-emerald-500",
  pink: "from-pink-400 to-rose-500",
  amber: "from-amber-400 to-orange-500",
  yellow: "from-yellow-400 to-amber-500",
  indigo: "from-indigo-400 to-violet-500",
  cyan: "from-cyan-400 to-blue-500",
  orange: "from-orange-400 to-red-500",
  slate: "from-slate-400 to-gray-500",
  stone: "from-stone-400 to-neutral-500",
  green: "from-green-400 to-emerald-500",
  purple: "from-purple-400 to-violet-500",
  violet: "from-violet-400 to-purple-500",
  brown: "from-amber-700 to-orange-800",
  fuchsia: "from-fuchsia-400 to-pink-500",
  lime: "from-lime-400 to-green-500",
};

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Tous",
  "Santé & Médical",
  "Juridique & Finance",
  "BTP & Construction",
  "Commerce & Alimentation",
  "Transport & Logistique",
  "Beauté & Bien-être",
];

// ─── Fallback Data ────────────────────────────────────────────────────────────

const fallbackProfessions: Profession[] = [
  { slug: "medecin", name: "Médecin", shortName: "Médecin généraliste", description: "Médecin généraliste ou spécialiste - création de cabinet médical, conventions, gestion du tiers payant", icon: "Stethoscope", color: "rose", category: "Santé & Médical", authority: "Ordre des médecins", diploma: "Doctorat en médecine" },
  { slug: "infirmier", name: "Infirmier libéral", shortName: "Infirmier", description: "Infirmier libéral - création de cabinet infirmier, conventions ARS, télétransmission", icon: "Heart", color: "red", category: "Santé & Médical", authority: "Ordre infirmiers", diploma: "DEI" },
  { slug: "pharmacien", name: "Pharmacien", shortName: "Pharmacien d'officine", description: "Pharmacien d'officine - ouverture de pharmacie, licence d'exploitation, gestion des stocks", icon: "Pill", color: "emerald", category: "Santé & Médical", authority: "Ordre pharmaciens", diploma: "Doctorat en pharmacie" },
  { slug: "dentiste", name: "Chirurgien-dentiste", shortName: "Dentiste", description: "Chirurgien-dentiste - cabinet dentaire, conventions, équipements et normes sanitaires", icon: "Smile", color: "blue", category: "Santé & Médical", authority: "Ordre chirurgiens-dentistes", diploma: "Doctorat chirurgie dentaire" },
  { slug: "kinesitherapeute", name: "Kinésithérapeute", shortName: "Kinésithérapeute", description: "Masseur-kinésithérapeute - cabinet de kinésithérapie, prescriptions médicales, conventions", icon: "Activity", color: "teal", category: "Santé & Médical", authority: "Ordre MK", diploma: "DE MK" },
  { slug: "sage-femme", name: "Sage-femme", shortName: "Sage-femme", description: "Sage-femme libérale - cabinet, maison de naissance, suivi grossesse et post-partum", icon: "Baby", color: "pink", category: "Santé & Médical", authority: "Ordre sages-femmes", diploma: "DE sage-femme" },
  { slug: "avocat", name: "Avocat", shortName: "Avocat", description: "Avocat au barreau - création de cabinet d'avocat, inscription au barreau, développement clientèle", icon: "Scale", color: "amber", category: "Juridique & Finance", authority: "Barreau", diploma: "CAPA" },
  { slug: "notaire", name: "Notaire", shortName: "Notaire", description: "Office notarial - études notariales, succession, immobilier, droit de la famille", icon: "Stamp", color: "yellow", category: "Juridique & Finance", authority: "Chambre des notaires", diploma: "Master notariat" },
  { slug: "expert-comptable", name: "Expert-comptable", shortName: "Expert-comptable", description: "Cabinet d'expertise comptable - gestion comptable, fiscale, sociale et conseil aux entreprises", icon: "Calculator", color: "indigo", category: "Juridique & Finance", authority: "Ordre experts-comptables", diploma: "DEC" },
  { slug: "courtier-assurance", name: "Courtier en assurance", shortName: "Courtier assurance", description: "Courtage en assurance - intermédiation, ORIAS, garantie financière, portefeuille clients", icon: "ShieldCheck", color: "cyan", category: "Juridique & Finance", authority: "ORIAS", diploma: "Carte ORIAS" },
  { slug: "agent-immobilier", name: "Agent immobilier", shortName: "Agent immobilier", description: "Agent immobilier / Négociateur - carte T, transaction, gestion locative, syndic de copropriété", icon: "Building2", color: "orange", category: "Juridique & Finance", authority: "Préfecture", diploma: "Attestation capacité" },
  { slug: "btp-artisan", name: "Artisan BTP", shortName: "Plombier, électricien, maçon", description: "Artisan du BTP - inscription Chambre des Métiers, assurance décennale obligatoire, qualification", icon: "HardHat", color: "yellow", category: "BTP & Construction", authority: "Chambre des Métiers", diploma: "CAP/BP du métier" },
  { slug: "architecte", name: "Architecte", shortName: "Architecte", description: "Agence d'architecture - permis de construire, maîtrise d'œuvre, conception et suivi de chantier", icon: "Compass", color: "slate", category: "BTP & Construction", authority: "Ordre des architectes", diploma: "DEA/HMONP" },
  { slug: "diagnostiqueur", name: "Diagnostiqueur immobilier", shortName: "Diagnostiqueur", description: "Bureau de diagnostic immobilier - DPE, amiante, plomb, termites, certification COFRAC", icon: "Search", color: "stone", category: "BTP & Construction", authority: "COFRAC", diploma: "Certification COFRAC" },
  { slug: "rge-entrepreneur", name: "Entrepreneur RGE", shortName: "RGE (Éco-rénovation)", description: "Entrepreneur Reconnu Garant de l'Environnement - rénovation énergétique, certification Qualibat/Cerqual", icon: "Leaf", color: "green", category: "BTP & Construction", authority: "Qualibat/Cerqual", diploma: "Qualification RGE" },
  { slug: "restaurateur", name: "Restaurateur", shortName: "Restaurateur / Traiteur", description: "Restaurant / Traiteur - formation HACCP, licence de restaurant, plan de maîtrise sanitaire", icon: "UtensilsCrossed", color: "orange", category: "Commerce & Alimentation", authority: "DDPP", diploma: "Formation HACCP" },
  { slug: "boulanger", name: "Boulanger pâtissier", shortName: "Boulanger / Pâtissier", description: "Boulangerie pâtisserie artisanale - CAP Boulanger, déclaration d'activité, appellation boulanger", icon: "Croissant", color: "amber", category: "Commerce & Alimentation", authority: "Chambre des Métiers", diploma: "CAP Boulanger" },
  { slug: "boucher-charcutier", name: "Boucher charcutier", shortName: "Boucher / Charcutier", description: "Boucherie charcuterie - CAP Boucher, formation hygiène, agrément sanitaire DSV", icon: "Beef", color: "red", category: "Commerce & Alimentation", authority: "DSV", diploma: "CAP Boucher/Charcutier" },
  { slug: "caviste", name: "Caviste", shortName: "Caviste / Débit de boissons", description: "Caviste, bar, débit de boissons - licence III/IV, formation EFS, respect des horaires", icon: "Wine", color: "purple", category: "Commerce & Alimentation", authority: "Préfecture", diploma: "Licence III/IV" },
  { slug: "taxi-vtc", name: "Taxi / VTC", shortName: "Chauffeur Taxi / VTC", description: "Transport de personnes - carte professionnelle, registre préfectoral, conditions d'accès", icon: "Car", color: "violet", category: "Transport & Logistique", authority: "Préfecture", diploma: "Carte professionnelle" },
  { slug: "transporteur-marchandises", name: "Transporteur marchandises", shortName: "Transporteur", description: "Transport de marchandises - licence communautaire, attestation capacité, assurance fret", icon: "Truck", color: "blue", category: "Transport & Logistique", authority: "DREAL", diploma: "Attestation capacité" },
  { slug: "demenagementur", name: "Déménageur professionnel", shortName: "Déménageur", description: "Déménagement professionnel - carte de déménageur, garantie responsabilité, tarification réglementée", icon: "Box", color: "brown", category: "Transport & Logistique", authority: "Préfecture", diploma: "Attestation capacité" },
  { slug: "coiffeur", name: "Coiffeur barbier", shortName: "Coiffeur / Barbier", description: "Salon de coiffure / Barbier - CAP Coiffure, déclaration d'activité, formation hygiène et sécurité", icon: "Scissors", color: "fuchsia", category: "Beauté & Bien-être", authority: "Chambre des Métiers", diploma: "CAP Coiffure" },
  { slug: "estheticienne", name: "Esthéticienne", shortName: "Esthéticienne / Ongulaire", description: "Cabinet d'esthétique - BP Esthétique, déclaration d'activité, respect des normes d'hygiène", icon: "Sparkles", color: "rose", category: "Beauté & Bien-être", authority: "Chambre des Métiers", diploma: "BP Esthétique" },
  { slug: "coach-sportif", name: "Coach sportif", shortName: "Coach / Préparateur physique", description: "Coach sportif en salle ou extérieur - BPJEPS, DEUST STAPS, assurance RC Pro, cadre légal", icon: "Dumbbell", color: "lime", category: "Beauté & Bien-être", authority: "DRJSCS", diploma: "BPJEPS/DEUST STAPS" },
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

export function MetiersReglementesPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const { data, isLoading } = useQuery({
    queryKey: ["regulated-professions"],
    queryFn: async () => {
      const res = await fetch("/api/regulated-professions");
      if (!res.ok) throw new Error("Erreur");
      const json = await res.json();
      return json.professions as Profession[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const professions = data || fallbackProfessions;

  const filteredProfessions =
    activeCategory === "Tous"
      ? professions
      : professions.filter((p) => p.category === activeCategory);

  const categoryCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    if (cat === "Tous") {
      acc[cat] = professions.length;
    } else {
      acc[cat] = professions.filter((p) => p.category === cat).length;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-400/10 blur-3xl" />

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
                    <BreadcrumbLink href="/" className="text-slate-300 hover:text-white">
                      Accueil
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-slate-400" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-semibold">Métiers Réglementés</BreadcrumbPage>
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
                  <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                  Guide Complet
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Métiers Réglementés
              </motion.h1>

              <motion.p
                className="mt-6 text-lg sm:text-xl text-slate-300/90 leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Guide complet pour créer votre entreprise dans les secteurs réglementés en France.
                Diplômes, autorités, démarches : tout ce que vous devez savoir.
              </motion.p>

              {/* Stats row */}
              <motion.div
                className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {[
                  { value: "25", label: "métiers", icon: FolderOpen },
                  { value: "6", label: "catégories", icon: BookOpen },
                  { value: "+500", label: "démarches", icon: ClipboardCheck },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-4"
                  >
                    <stat.icon className="h-5 w-5 text-blue-300 mb-1" />
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {stat.value}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-300/80">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — CATEGORY FILTER + PROFESSIONS GRID
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Category Filter Tabs */}
            <FadeInWhenVisible className="mb-12">
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-white text-muted-foreground border border-border hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                    }`}
                  >
                    {cat}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeCategory === cat
                          ? "bg-white/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {categoryCounts[cat] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </FadeInWhenVisible>

            {/* Professions Grid */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-14 w-14 rounded-full mx-auto" />
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-1/3 mx-auto" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
                {filteredProfessions.map((profession) => {
                  const Icon = ICON_MAP[profession.icon] || GraduationCap;
                  const gradient = colorGradients[profession.color] || "from-slate-400 to-gray-500";

                  return (
                    <motion.div key={profession.slug} variants={staggerChild}>
                      <Card className="h-full bg-white border-border/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                        <CardHeader className="text-center pb-3">
                          <div className="flex justify-center mb-3">
                            <div
                              className={`inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                            >
                              <Icon className="h-7 w-7" />
                            </div>
                          </div>
                          <CardTitle className="text-lg font-bold leading-tight">
                            {profession.name}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed mt-1.5 line-clamp-2">
                            {profession.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0 flex-1">
                          <div className="flex flex-col gap-2">
                            <Badge
                              variant="secondary"
                              className="self-center text-xs font-normal bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                            >
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              {profession.authority}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="self-center text-xs font-normal bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                            >
                              <GraduationCap className="h-3 w-3 mr-1" />
                              {profession.diploma}
                            </Badge>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-4 justify-center">
                          <a
                            href={`/metiers-reglementes/${profession.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                          >
                            Découvrir
                            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                          </a>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </StaggerContainer>
            )}

            {filteredProfessions.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Aucun métier dans cette catégorie.</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — CTA
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center lg:px-8 lg:py-28">
            <FadeInWhenVisible>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Vous exercez un métier réglementé ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100/90">
                Notre équipe vous accompagne dans toutes les démarches administratives, 
                réglementaires et stratégiques pour lancer votre activité en toute sérénité.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/audit">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-bold bg-white text-emerald-700 hover:bg-white/90 shadow-xl shadow-emerald-900/40 gap-2.5 transition-all hover:scale-[1.02]"
                  >
                    <ClipboardCheck className="h-5 w-5" />
                    Audit Gratuit
                  </Button>
                </a>
                <a href="/accompagnement">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10 hover:text-white gap-2.5 transition-all"
                  >
                    <Rocket className="h-5 w-5" />
                    Accompagnement
                  </Button>
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-200/80">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Réponse sous 24h
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Sans engagement
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
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
