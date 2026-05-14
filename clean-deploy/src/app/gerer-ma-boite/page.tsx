import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Calculator,
  ClipboardList,
  Compass,
  Globe,
  Headphones,
  Landmark,
  LayoutDashboard,
  Megaphone,
  Package,
  PenTool,
  PieChart,
  Rocket,
  Scale,
  Search,
  Shield,
  ShoppingCart,
  Star,
  Target,
  TrendingUp,
  Users,
  FileText,
  Wrench,
  Zap,
  CheckCircle,
  ChevronRight,
  Quote,
  Phone,
  UserPlus,
  Lightbulb,
  Bot,
  Presentation,
  GraduationCap,
  Banknote,
  ScrollText,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = {
  title: "Accompagnement & Outils pour entreprises | Créa Entreprise",
  description:
    "Marketing, comptabilité, juridique, CRM... Accédez aux meilleurs outils et à un accompagnement sur-mesure pour accélérer la croissance de votre entreprise. 12 services d'accompagnement, 200+ outils comparés.",
};

// ---------------------------------------------------------------------------
// Data — Tool Categories (Section 2)
// ---------------------------------------------------------------------------

interface ToolCategory {
  icon: LucideIcon;
  name: string;
  tools: string[];
  description: string;
  gradient: string;
}

const toolCategories: ToolCategory[] = [
  {
    icon: Landmark,
    name: "Banque Pro",
    tools: ["Qonto", "Shine", "Finom"],
    description: "La banque qui simplifie votre quotidien",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    icon: Calculator,
    name: "Comptabilité",
    tools: ["Indy", "Pennylane", "Abby"],
    description: "Automatisez votre compta sans effort",
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    icon: Shield,
    name: "Assurance",
    tools: ["Hiscox", "Simplis"],
    description: "Protégez votre activité en quelques clics",
    gradient: "from-violet-500 to-violet-700",
  },
  {
    icon: Users,
    name: "CRM & Ventes",
    tools: ["HubSpot", "Brevo"],
    description: "Convertissez plus de prospects en clients",
    gradient: "from-orange-500 to-orange-700",
  },
  {
    icon: Scale,
    name: "Juridique",
    tools: ["Legalstart", "Captain Contrat"],
    description: "Documents légaux conformes",
    gradient: "from-rose-500 to-rose-700",
  },
  {
    icon: Megaphone,
    name: "Marketing",
    tools: ["WiziShop", "Semrush"],
    description: "Attirez et convertissez vos clients",
    gradient: "from-cyan-500 to-cyan-700",
  },
];

// ---------------------------------------------------------------------------
// Data — Services (Section 3)
// ---------------------------------------------------------------------------

interface Service {
  icon: LucideIcon;
  name: string;
  price: string;
  description: string;
  gradient: string;
}

const services: Service[] = [
  {
    icon: Bot,
    name: "Copilote Entreprise",
    price: "490\u00a0\u20ac/mois",
    description: "Un partenaire dédié au quotidien",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Megaphone,
    name: "Marketing Digital",
    price: "490\u00a0\u20ac/mois",
    description: "SEO, ads, réseaux sociaux",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: Target,
    name: "Lead Generation B2B",
    price: "790\u00a0\u20ac/mois",
    description: "Prospects qualifiés en continu",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    icon: FileText,
    name: "Business Plan",
    price: "490\u00a0\u20ac",
    description: "Convaincre banques & investisseurs",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Headphones,
    name: "Community Management",
    price: "390\u00a0\u20ac/mois",
    description: "Développez votre communauté",
    gradient: "from-pink-500 to-pink-600",
  },
  {
    icon: Globe,
    name: "Création de Site Web",
    price: "890\u00a0\u20ac",
    description: "Site pro qui convertit",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    icon: PenTool,
    name: "Stratégie de Contenu",
    price: "590\u00a0\u20ac/mois",
    description: "Articles, vidéos, podcast",
    gradient: "from-amber-500 to-amber-600",
  },
  {
    icon: GraduationCap,
    name: "Formation & Coaching",
    price: "690\u00a0\u20ac/mois",
    description: "Montez en compétences",
    gradient: "from-teal-500 to-teal-600",
  },
  {
    icon: PieChart,
    name: "Gestion Financière",
    price: "590\u00a0\u20ac/mois",
    description: "Trésorerie, budgets, prévisionnel",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: ScrollText,
    name: "Juridique & Conformité",
    price: "490\u00a0\u20ac/mois",
    description: "RGPD, contrats, formalités",
    gradient: "from-rose-500 to-rose-600",
  },
  {
    icon: UserPlus,
    name: "Recrutement & RH",
    price: "690\u00a0\u20ac/mois",
    description: "Trouvez et fidélisez vos talents",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    icon: LayoutDashboard,
    name: "Gestion de Projet",
    price: "790\u00a0\u20ac/mois",
    description: "Organisez et livrez plus vite",
    gradient: "from-sky-500 to-sky-600",
  },
];

// ---------------------------------------------------------------------------
// Data — Bundles (Section 4)
// ---------------------------------------------------------------------------

interface Bundle {
  name: string;
  price: string;
  period: string;
  services: string[];
  highlight?: boolean;
  icon: LucideIcon;
}

const bundles: Bundle[] = [
  {
    name: "Starter",
    price: "4\u00a0990\u00a0\u20ac",
    period: "3 mois",
    icon: Rocket,
    services: [
      "Copilote Entreprise",
      "Marketing Digital",
      "Suivi mensuel des KPIs",
    ],
  },
  {
    name: "Business",
    price: "14\u00a0990\u00a0\u20ac",
    period: "6 mois",
    icon: TrendingUp,
    highlight: true,
    services: [
      "Tout le pack Starter",
      "Lead Generation B2B",
      "Création de Site Web",
      "Suivi bimensuel des KPIs",
    ],
  },
  {
    name: "Growth",
    price: "29\u00a0990\u00a0\u20ac",
    period: "12 mois",
    icon: Zap,
    services: [
      "Tout le pack Business",
      "Tous les services d'accompagnement",
      "Manager dédié",
      "Reporting hebdomadaire",
      "Accès illimité à la marketplace",
    ],
  },
];

// ---------------------------------------------------------------------------
// Data — Par besoin (Section 5)
// ---------------------------------------------------------------------------

interface Need {
  emoji: string;
  title: string;
  included: string[];
}

const needs: Need[] = [
  {
    emoji: "🚀",
    title: "Je veux plus de clients",
    included: ["Lead Generation B2B", "Marketing Digital", "Création de Site Web"],
  },
  {
    emoji: "📊",
    title: "Je veux mieux gérer ma compta",
    included: ["Comptabilité", "Banque Pro", "Facturation"],
  },
  {
    emoji: "⚖️",
    title: "Je veux me protéger juridiquement",
    included: ["Juridique & Conformité", "Contrats", "Assurance"],
  },
  {
    emoji: "👥",
    title: "Je veux recruter",
    included: ["Recrutement & RH", "Formation & Coaching"],
  },
  {
    emoji: "💰",
    title: "Je veux lever des fonds",
    included: ["Business Plan", "Gestion Financière", "Réseau"],
  },
  {
    emoji: "🤖",
    title: "Je veux automatiser",
    included: ["Copilote Entreprise", "CRM & Ventes", "Outils"],
  },
];

// ---------------------------------------------------------------------------
// Data — Process (Section 6)
// ---------------------------------------------------------------------------

interface ProcessStep {
  icon: LucideIcon;
  title: string;
  description: string;
  number: string;
}

const processSteps: ProcessStep[] = [
  {
    icon: Search,
    title: "Diagnostic",
    description: "On analyse vos besoins et identifie les leviers de croissance",
    number: "01",
  },
  {
    icon: Compass,
    title: "Plan d'action",
    description: "Un programme personnalisé sur 3/6/12 mois",
    number: "02",
  },
  {
    icon: BarChart3,
    title: "Résultats",
    description: "Suivi KPIs, ajustements, reporting mensuel",
    number: "03",
  },
];

// ---------------------------------------------------------------------------
// Data — Testimonials (Section 7)
// ---------------------------------------------------------------------------

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sophie",
    role: "Gérante de e-commerce",
    quote: "Le copilote m'a permis de doubler mon CA en 6 mois.",
    rating: 5,
  },
  {
    name: "Pierre",
    role: "Consultant B2B",
    quote: "La lead gen nous apporte 15 leads qualifiés par mois.",
    rating: 5,
  },
  {
    name: "Amina",
    role: "Restauratrice",
    quote: "Le community management a transformé ma visibilité locale.",
    rating: 5,
  },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function GererMaBoitePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* ============================================================= */}
        {/* SECTION 1 — HERO                                              */}
        {/* ============================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm border border-white/20 mb-6">
                <Briefcase className="h-4 w-4" />
                Gérer ma boîte
              </span>

              {/* H1 */}
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                Accélérez la croissance de{" "}
                <span className="bg-gradient-to-r from-emerald-200 to-emerald-300 bg-clip-text text-transparent">
                  votre entreprise
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-100/90 leading-relaxed">
                Marketing, comptabilité, juridique, CRM&hellip; Accédez aux
                meilleurs outils et à un accompagnement sur-mesure pour chaque
                étape de votre développement.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#marketplace"
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-white text-emerald-700 font-bold text-base shadow-xl shadow-emerald-900/30 hover:bg-emerald-50 transition-all hover:scale-[1.02]"
                >
                  <Wrench className="h-5 w-5" />
                  Explorer les outils
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-xl border-2 border-white/30 text-white font-bold text-base hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  <Handshake className="h-5 w-5" />
                  Voir les services d&apos;accompagnement
                </a>
              </div>

              {/* Stats */}
              <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
                {[
                  {
                    label: "12 services d'accompagnement",
                    icon: Handshake,
                  },
                  {
                    label: "200+ outils comparés",
                    icon: Package,
                  },
                  {
                    label: "4,8/5 satisfaction",
                    icon: Star,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <stat.icon className="h-5 w-5 text-emerald-200" />
                    </div>
                    <span className="text-sm font-semibold text-emerald-100/90">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 2 — MARKETPLACE D'OUTILS                              */}
        {/* ============================================================= */}
        <section id="marketplace" className="bg-gray-50/80 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
                <ShoppingCart className="h-4 w-4" />
                Marketplace d&apos;outils
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Comparez les meilleurs outils pour votre entreprise
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Banque, compta, CRM, marketing&hellip; Trouvez l&apos;outil
                idéal parmi plus de 200 solutions comparées.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {toolCategories.map((category) => (
                <div
                  key={category.name}
                  className="group rounded-2xl border border-gray-200/80 bg-white p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
                >
                  {/* Icon */}
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-md`}
                  >
                    <category.icon className="h-6 w-6" />
                  </div>

                  {/* Category name */}
                  <h3 className="text-lg font-bold text-gray-900">
                    {category.name}
                  </h3>

                  {/* Tool examples */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {category.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>

                  {/* CTA */}
                  <a
                    href="/comparatifs"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group-hover:gap-2"
                  >
                    Comparer
                    <ArrowRight className="h-4 w-4 transition-all group-hover:translate-x-0.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 3 — SERVICES D'ACCOMPAGNEMENT                         */}
        {/* ============================================================= */}
        <section id="services" className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
                <Lightbulb className="h-4 w-4" />
                Services d&apos;accompagnement
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                12 services pour développer votre activité
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Des experts dédiés pour chaque dimension de votre croissance
                business.
              </p>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="group rounded-2xl border border-gray-200/80 bg-white p-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col"
                >
                  {/* Icon */}
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} text-white shadow-sm`}
                  >
                    <service.icon className="h-5 w-5" />
                  </div>

                  {/* Name */}
                  <h3 className="text-base font-bold text-gray-900">
                    {service.name}
                  </h3>

                  {/* Price */}
                  <p className="mt-1 text-sm font-semibold text-emerald-600">
                    {service.price}
                  </p>

                  {/* Description */}
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <a
                    href="/accompagnement"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group-hover:gap-2"
                  >
                    Découvrir
                    <ArrowRight className="h-4 w-4 transition-all group-hover:translate-x-0.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 4 — BUNDLES / PACKS D'ACCOMPAGNEMENT                  */}
        {/* ============================================================= */}
        <section className="bg-gray-50/80 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
                <Package className="h-4 w-4" />
                Packs d&apos;accompagnement
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Des packs pensés pour chaque étape
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Choisissez le programme adapté à votre ambition et à votre
                rythme de croissance.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {bundles.map((bundle) => (
                <div
                  key={bundle.name}
                  className={`relative rounded-2xl border bg-white p-6 flex flex-col transition-all duration-300 hover:shadow-xl ${
                    bundle.highlight
                      ? "border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/10 md:-mt-4"
                      : "border-gray-200/80"
                  }`}
                >
                  {/* Popular badge */}
                  {bundle.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                        <Star className="h-3 w-3" />
                        Populaire
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                      bundle.highlight
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <bundle.icon className="h-6 w-6" />
                  </div>

                  {/* Name & Period */}
                  <h3 className="text-xl font-bold text-gray-900">
                    {bundle.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Programme sur {bundle.period}
                  </p>

                  {/* Price */}
                  <p className="mt-4 text-3xl font-extrabold text-gray-900">
                    {bundle.price}
                  </p>

                  {/* Divider */}
                  <hr className="my-5 border-gray-100" />

                  {/* Services list */}
                  <ul className="space-y-3 flex-1">
                    {bundle.services.map((s) => (
                      <li key={s} className="flex items-start gap-2.5">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {s}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="/audit"
                    className={`mt-6 flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-bold transition-all hover:scale-[1.02] ${
                      bundle.highlight
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                        : "bg-gray-900 text-white hover:bg-gray-800 shadow-md shadow-gray-900/10"
                    }`}
                  >
                    En savoir plus
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 5 — PAR BESOIN                                        */}
        {/* ============================================================= */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
                <Compass className="h-4 w-4" />
                Par besoin
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trouvez la solution adaptée à votre situation
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Sélectionnez votre objectif et découvrez les services qu&apos;il
                vous faut.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {needs.map((need) => (
                <div
                  key={need.title}
                  className="group rounded-2xl border border-gray-200/80 bg-white p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
                >
                  {/* Emoji */}
                  <span className="text-3xl mb-3 block">{need.emoji}</span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900">
                    {need.title}
                  </h3>

                  {/* Included services */}
                  <ul className="mt-3 space-y-2">
                    {need.included.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="/audit"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group-hover:gap-2"
                  >
                    Découvrir le programme
                    <ArrowRight className="h-4 w-4 transition-all group-hover:translate-x-0.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 6 — COMMENT ÇA MARCHE                                 */}
        {/* ============================================================= */}
        <section className="bg-gray-50/80 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
                <ClipboardList className="h-4 w-4" />
                Comment ça marche
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                3 étapes pour accélérer votre croissance
              </h2>
            </div>

            <div className="relative grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              {/* Connecting line (desktop) */}
              <div className="pointer-events-none absolute top-16 left-[16.67%] right-[16.67%] hidden md:block">
                <div className="border-t-2 border-dashed border-emerald-300" />
              </div>

              {processSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step circle */}
                  <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/30">
                    <step.icon className="h-7 w-7" />
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-700 shadow-md">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>

                  {/* Mobile chevron */}
                  {idx < processSteps.length - 1 && (
                    <ChevronRight className="mt-6 h-6 w-6 text-emerald-400 md:hidden" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 7 — TÉMOIGNAGES                                       */}
        {/* ============================================================= */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
                <Star className="h-4 w-4" />
                Témoignages
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Ils ont accéléré leur croissance avec nous
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl border border-gray-200/80 bg-white p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="flex-1">
                    <Quote className="h-5 w-5 text-emerald-500/30 mb-2 block" />
                    <p className="text-sm leading-relaxed text-gray-700 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </blockquote>

                  {/* Author */}
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold text-sm shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 8 — CTA FINAL                                         */}
        {/* ============================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center lg:px-8 lg:py-28">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
              <Rocket className="h-8 w-8 text-emerald-400" />
            </div>

            {/* H2 */}
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Prêt à accélérer votre croissance ?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
              Réservez un appel découverte gratuit avec un expert et recevez
              votre plan d&apos;action personnalisé en 48h.
            </p>

            {/* Primary CTA */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/audit"
                className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-emerald-600 text-white font-bold text-base shadow-xl shadow-emerald-900/40 hover:bg-emerald-500 transition-all hover:scale-[1.02]"
              >
                <Phone className="h-5 w-5" />
                Réservez un appel découverte gratuit
              </a>
            </div>

            {/* Secondary CTA */}
            <a
              href="#marketplace"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Explorer la marketplace d&apos;outils
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
