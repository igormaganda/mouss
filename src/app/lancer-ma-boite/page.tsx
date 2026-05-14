import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  ClipboardCheck,
  Package,
  FileText,
  Building2,
  Star,
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  Shield,
  Users,
  Briefcase,
  TrendingUp,
  Quote,
  Zap,
  Lock,
  Clock,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── SEO METADATA ─────────────────────────────────────────────────

export const metadata = {
  title: "Créer mon entreprise en ligne | Créa Entreprise",
  description:
    "Créez votre entreprise en ligne en 48h : du choix du statut à l'immatriculation. Comparez les statuts juridiques (auto-entrepreneur, SASU, SARL, EURL, SCI), rédigez vos statuts et recevez votre KBIS. Audit gratuit.",
  openGraph: {
    title: "Créer mon entreprise en ligne | Créa Entreprise",
    description:
      "De l'idée au KBIS en 48h. Comparez, rédigez vos statuts et recevez votre KBIS. Audit gratuit.",
    type: "website" as const,
  },
};

// ─── DATA: HOW IT WORKS (4 STEPS) ─────────────────────────────────

const steps: {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    number: "1",
    icon: ClipboardCheck,
    title: "Audit gratuit",
    description:
      "Décrivez votre projet en 3 min, on vous recommande le statut juridique idéal et les outils adaptés.",
  },
  {
    number: "2",
    icon: Package,
    title: "Choix du pack",
    description:
      "Créer 9€ / Pro 29€ / Premium 79€ — choisissez le niveau d'accompagnement selon vos besoins.",
  },
  {
    number: "3",
    icon: FileText,
    title: "Rédaction des statuts",
    description:
      "Vos statuts sont rédigés par notre IA, conformes au Code de Commerce et personnalisés à votre projet.",
  },
  {
    number: "4",
    icon: Building2,
    title: "Immatriculation",
    description:
      "Dépôt au greffe via le Guichet Unique, vous recevez votre KBIS par email sous 48h.",
  },
];

// ─── DATA: PAR STATUT JURIDIQUE (6 CARDS) ─────────────────────────

const statutCards: {
  icon: LucideIcon;
  name: string;
  description: string;
  benefits: string[];
  href: string;
  gradient: string;
}[] = [
  {
    icon: Sparkles,
    name: "Auto-entrepreneur",
    description: "Créez gratuitement, sans capital minimum",
    benefits: [
      "Aucun capital social requis",
      "Cotisations basées sur le CA",
      "Comptabilité ultra simplifiée",
    ],
    href: "/comparatifs",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Users,
    name: "SASU",
    description: "Le statut préféré des entrepreneurs",
    benefits: [
      "Un seul associé, président = dirigeant",
      "Protection sociale du dirigeant",
      "Fiscalité avantageuse à l'IS",
    ],
    href: "/comparatifs",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Briefcase,
    name: "SAS",
    description: "Pour les projets avec associés",
    benefits: [
      "Plusieurs associés possibles",
      "Grande liberté statutaire",
      "Idéal pour lever des fonds",
    ],
    href: "/comparatifs",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Shield,
    name: "SARL",
    description: "Protégez votre patrimoine personnel",
    benefits: [
      "Responsabilité limitée aux apports",
      "Régime social du gérant (TNS)",
      "Confiance des partenaires bancaires",
    ],
    href: "/comparatifs",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Users,
    name: "EURL",
    description: "SARL à associé unique",
    benefits: [
      "Un seul associé-dirigeant",
      "Responsabilité limitée au capital",
      "Fiscalité IS ou IR au choix",
    ],
    href: "/comparatifs",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: Building2,
    name: "SCI",
    description: "Gérez votre patrimoine immobilier",
    benefits: [
      "Transmission patrimoniale optimisée",
      "Gestion simplifiée entre associés",
      "Fiscalité transparente (IR)",
    ],
    href: "/comparatifs",
    gradient: "from-cyan-500 to-blue-600",
  },
];

// ─── DATA: PAR SITUATION (5 CARDS) ────────────────────────────────

const situationCards: {
  emoji: string;
  title: string;
  description: string;
  needs: string[];
  href: string;
}[] = [
  {
    emoji: "💻",
    title: "Freelance / Consulting",
    description: "Prestation de services B2B, mission-based",
    needs: [
      "Choisir entre micro-entreprise et société",
      "Gérer les notes de frais et la TVA",
      "Optimiser sa rémunération",
    ],
    href: "/audit",
  },
  {
    emoji: "🛒",
    title: "E-commerce",
    description: "Boutique en ligne, dropshipping, marketplace",
    needs: [
      "Règlementation CGV et mentions légales",
      "Gestion des retours et SAV",
      "Assurance RC Pro e-commerce",
    ],
    href: "/audit",
  },
  {
    emoji: "🔨",
    title: "Artisan / BTP",
    description: "Métiers manuels, chantier, construction",
    needs: [
      "Inscription à la Chambre des Métiers",
      "Assurance décennale obligatoire",
      "Qualification et carte BTP",
    ],
    href: "/metiers-reglementes/btp-artisan",
  },
  {
    emoji: "⚖️",
    title: "Profession libérale",
    description:
      "Avocat, médecin, architecte, expert-comptable...",
    needs: [
      "Inscription à l'Ordre professionnel",
      "Diplôme et autorisation d'exercice",
      "Cabinet libéral ou société d'exercice",
    ],
    href: "/metiers-reglementes",
  },
  {
    emoji: "🚀",
    title: "Reconversion",
    description: "Quittez votre CDI et lancez-vous en sécurité",
    needs: [
      "ACRE et aides à la création",
      "Maintien des ARE (demandeur d'emploi)",
      "Accompagnement pas à pas",
    ],
    href: "/audit",
  },
];

// ─── DATA: PACKS D'IMMATRICULATION ────────────────────────────────

const packs: {
  name: string;
  price: number;
  oldPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  gradient: string;
}[] = [
  {
    name: "Créer",
    price: 9,
    oldPrice: 15,
    description: "L'essentiel pour créer votre entreprise",
    features: [
      "Rédaction des statuts",
      "PV d'Assemblée Générale",
      "Formulaire Cerfa pré-rempli",
      "Dépôt au Guichet Unique",
      "Réception du KBIS",
    ],
    gradient: "from-gray-700 to-gray-900",
  },
  {
    name: "Pro",
    price: 29,
    oldPrice: 49,
    description: "Accompagnement + domiciliation",
    popular: true,
    features: [
      "Tout du pack Créer",
      "Domiciliation 3 mois offerte",
      "Accompagnement par email",
      "Attestation de non-condamnation",
      "Kit banque pro",
    ],
    gradient: "from-emerald-600 to-emerald-800",
  },
  {
    name: "Premium",
    price: 79,
    oldPrice: 129,
    description: "Accompagnement complet + business plan",
    features: [
      "Tout du pack Pro",
      "Accompagnement téléphonique",
      "Business plan personnalisé",
      "Domiciliation 12 mois offerte",
      "Suivi post-création 3 mois",
    ],
    gradient: "from-amber-500 to-amber-700",
  },
];

// ─── DATA: COMPARATEUR DE STATUTS ─────────────────────────────────

const comparisonRows: {
  label: string;
  autoEntrepreneur: string;
  sasu: string;
  sarl: string;
  eurl: string;
}[] = [
  {
    label: "Capital minimum",
    autoEntrepreneur: "Aucun",
    sasu: "1 € symbolique",
    sarl: "1 € minimum",
    eurl: "1 € minimum",
  },
  {
    label: "Nombre d'associés",
    autoEntrepreneur: "1 (unique)",
    sasu: "1 (unique)",
    sarl: "2 à 100",
    eurl: "1 (unique)",
  },
  {
    label: "Responsabilité",
    autoEntrepreneur: "Illimitée",
    sasu: "Limitée au capital",
    sarl: "Limitée aux apports",
    eurl: "Limitée aux apports",
  },
  {
    label: "Régime social",
    autoEntrepreneur: "TNS (Secure)",
    sasu: "Assimilé-salarié",
    sarl: "TNS (gérant majoritaire)",
    eurl: "TNS (gérant)",
  },
  {
    label: "Régime fiscal",
    autoEntrepreneur: "IR (micro-BIC/IS)",
    sasu: "IS (ou IR option)",
    sarl: "IR (IS option)",
    eurl: "IS ou IR au choix",
  },
  {
    label: "TVA",
    autoEntrepreneur: "Franchise de TVA",
    sasu: "TVA dès 1er €",
    sarl: "TVA dès 1er €",
    eurl: "TVA dès 1er €",
  },
  {
    label: "Avantages principaux",
    autoEntrepreneur: "Simplicité, gratuit",
    sasu: "Protection sociale, crédits impôts",
    sarl: "Confiance banques, souplesse",
    eurl: "Sécurité patrimoniale",
  },
];

// ─── DATA: FAQ ────────────────────────────────────────────────────

const faqs: { question: string; answer: string }[] = [
  {
    question: "Combien coûte la création d'une entreprise ?",
    answer:
      "Le coût dépend du statut choisi. L'auto-entrepreneur est gratuit. Pour une SASU, SARL ou EURL, nos packs commencent à 9€ (statuts + immatriculation). Les frais de greffe (formalités d'immatriculation) sont inclus dans nos packs. Ajoutez la domiciliation si vous n'avez pas d'adresse professionnelle. Avec le pack Créer à 9€, tout est inclus : rédaction des statuts, Cerfa, dépôt et KBIS.",
  },
  {
    question: "Quel statut choisir pour mon projet ?",
    answer:
      "Cela dépend de votre situation. L'auto-entrepreneur est idéal pour tester une activité à faible risque. La SASU convient aux entrepreneurs solo souhaitant protéger leur patrimoine et bénéficier d'un régime social favorable. La SARL est recommandée pour les projets à plusieurs associés. L'EURL combine les avantages de la SARL en version unipersonnelle. Notre audit gratuit de 3 minutes vous guide vers le statut idéal.",
  },
  {
    question: "Combien de temps pour recevoir mon KBIS ?",
    answer:
      "En moyenne 24 à 48h après le dépôt au Guichet Unique. Le décret de création est généralement émis sous 24h par le greffe, et le KBIS vous est envoyé par email dès l'immatriculation effective. En période de forte activité, le délai peut atteindre 72h. Nos packs incluent un suivi jusqu'à réception du KBIS.",
  },
  {
    question: "Dois-je avoir un capital minimum ?",
    answer:
      "Non, depuis les réformes récentes, il n'y a plus de capital minimum légal pour créer une SASU, SARL ou EURL. Un euro symbolique suffit. Cependant, le montant du capital social a un impact sur la crédibilité de votre entreprise auprès des banques et partenaires. Nous vous accompagnons dans le choix du capital optimal selon votre activité.",
  },
  {
    question: "Puis-je créer mon entreprise seul ?",
    answer:
      "Oui, c'est tout à fait possible ! L'auto-entrepreneur, la SASU et l'EURL sont des formes juridiques conçues pour les créateurs solos. Notre plateforme vous accompagne de A à Z : audit de votre projet, rédaction des statuts, dépôt au Guichet Unique. Aucun avocat ni expert-comptable n'est obligatoire pour immatriculer votre entreprise.",
  },
  {
    question: "Quelle est la différence entre SASU et EURL ?",
    answer:
      "La principale différence concerne le régime social du dirigeant. En SASU, le président est assimilé-salarié (cotisations ~45% de la rémunération brute) mais bénéficie d'une meilleure protection sociale (chômage, retraite). En EURL, le gérant est travailleur non salarié (TNS) avec des cotisations plus faibles (~25% du revenu net) mais moins de couverture sociale. La SASU offre aussi plus de souplesse statutaire. Notre comparateur détaillé vous aide à choisir.",
  },
];

// ─── DATA: TÉMOIGNAGES ────────────────────────────────────────────

const testimonials: {
  name: string;
  role: string;
  quote: string;
  pack: string;
  initials: string;
}[] = [
  {
    name: "Thomas",
    role: "Freelance développeur",
    quote:
      "En 48h j'avais mon KBIS. Le pack Pro a tout simplifié : statuts, domiciliation, suivi. Je recommande à 100%.",
    pack: "Pack Pro",
    initials: "TD",
  },
  {
    name: "Sarah",
    role: "Reconversion en coaching",
    quote:
      "L'audit m'a convaincue que l'EURL était le bon choix pour moi. L'accompagnement téléphonique du pack Premium m'a rassurée pendant toute la création.",
    pack: "Pack Premium",
    initials: "SC",
  },
  {
    name: "Marc",
    role: "Startup SaaS",
    quote:
      "Le business plan du pack Premium nous a aidés à lever 50K€. L'équipe nous a accompagnés de la SAS à l'immatriculation en moins d'une semaine.",
    pack: "Pack Premium",
    initials: "ML",
  },
];

// ─── DATA: MÉTIERS RÉGLEMENTÉS (10 MÉTIERS) ──────────────────────

const metiersPreview: {
  name: string;
  href: string;
  icon: string;
}[] = [
  { name: "Médecin", href: "/metiers-reglementes/medecin", icon: "🏥" },
  { name: "Avocat", href: "/metiers-reglementes/avocat", icon: "⚖️" },
  { name: "Restaurateur", href: "/metiers-reglementes/restaurateur", icon: "🍽️" },
  { name: "Agent immobilier", href: "/metiers-reglementes/agent-immobilier", icon: "🏠" },
  { name: "Taxi / VTC", href: "/metiers-reglementes/taxi-vtc", icon: "🚗" },
  { name: "Infirmier", href: "/metiers-reglementes/infirmier", icon: "❤️" },
  { name: "Expert-comptable", href: "/metiers-reglementes/expert-comptable", icon: "🧮" },
  { name: "BTP Artisan", href: "/metiers-reglementes/btp-artisan", icon: "🏗️" },
  { name: "Coiffeur", href: "/metiers-reglementes/coiffeur", icon: "✂️" },
  { name: "Coach sportif", href: "/metiers-reglementes/coach-sportif", icon: "💪" },
];

// ─── HELPER: SECTION BADGE ────────────────────────────────────────

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
      {children}
    </span>
  );
}

// ─── HELPER: FAQ ITEM (native details/summary for server component) ─

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-border last:border-b-0">
      <summary className="flex cursor-pointer items-center justify-between py-5 px-1 text-left text-base font-semibold text-foreground transition-colors hover:text-primary list-none [&::-webkit-details-marker]:hidden">
        <span className="pr-4">{question}</span>
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted transition-colors group-open:bg-primary group-open:text-primary-foreground">
          <svg
            className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="pb-5 px-1 text-sm leading-relaxed text-muted-foreground">
        {answer}
      </div>
    </details>
  );
}

// ══════════════════════════════════════════════════════════════════
// PAGE COMPONENT (SERVER COMPONENT — no "use client")
// ══════════════════════════════════════════════════════════════════

export default function LancerMaBoitePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">

        {/* ═══════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left column */}
              <div className="space-y-8 text-center lg:text-left">
                <div>
                  <SectionBadge>
                    <TrendingUp className="h-3.5 w-3.5" />
                    Guide complet création d&apos;entreprise
                  </SectionBadge>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                  Créez votre entreprise en ligne{" "}
                  <span className="bg-gradient-to-r from-emerald-200 to-emerald-300 bg-clip-text text-transparent">
                    — De l&apos;idée au KBIS en 48h
                  </span>
                </h1>

                <p className="mx-auto max-w-xl text-lg text-emerald-100/90 lg:mx-0 leading-relaxed">
                  Guidé pas à pas, du choix du statut à l&apos;immatriculation.
                  Comparez, rédigez vos statuts et recevez votre KBIS.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <a
                    href="/audit"
                    className="inline-flex items-center gap-2.5 h-14 px-8 text-base font-bold bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl shadow-xl shadow-emerald-900/30 transition-all hover:scale-[1.02]"
                  >
                    <ClipboardCheck className="h-5 w-5" />
                    Commencer mon audit gratuit
                  </a>
                  <a
                    href="#packs"
                    className="inline-flex items-center gap-2.5 h-14 px-8 text-base font-semibold border-2 border-white/30 text-white hover:bg-white/10 rounded-xl transition-all"
                  >
                    <Package className="h-5 w-5" />
                    Voir les packs d&apos;immatriculation
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-start pt-2">
                  <div className="flex items-center gap-2 text-sm text-emerald-100/80">
                    <Building2 className="h-4 w-4 text-emerald-300" />
                    300+ entreprises créées
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-100/80">
                    <Star className="h-4 w-4 text-emerald-300" />
                    4.8/5 satisfaction
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-100/80">
                    <Clock className="h-4 w-4 text-emerald-300" />
                    KBIS en 48h
                  </div>
                </div>
              </div>

              {/* Right column — Visual mockup */}
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
                  {/* Mock dashboard header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Mon espace création</p>
                      <p className="text-xs text-emerald-200/70">Progression de votre dossier</p>
                    </div>
                  </div>

                  {/* Progress steps mockup */}
                  <div className="space-y-3">
                    {[
                      { step: "Audit", status: "done" as const, label: "Statut recommandé : SASU" },
                      { step: "Statuts", status: "done" as const, label: "Rédigés et validés" },
                      { step: "Dépôt", status: "active" as const, label: "En cours d'immatriculation..." },
                      { step: "KBIS", status: "pending" as const, label: "Réception sous 48h" },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                          item.status === "active"
                            ? "bg-white/15 border border-white/20"
                            : item.status === "done"
                              ? "bg-white/5"
                              : "bg-white/5 opacity-50"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                            item.status === "done"
                              ? "bg-emerald-400 text-white"
                              : item.status === "active"
                                ? "bg-white text-emerald-700 animate-pulse"
                                : "bg-white/20 text-white/50"
                          }`}
                        >
                          {item.status === "done" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            item.step.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{item.step}</p>
                          <p className="text-xs text-emerald-200/70 truncate">{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 rounded-lg border border-white/20 bg-white/90 backdrop-blur-sm px-3 py-2 shadow-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <Check className="h-4 w-4" />
                    KBIS sous 48h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2 — COMMENT ÇA MARCHE (4 STEPS)
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBadge>
                <Zap className="h-3.5 w-3.5" />
                Comment ça marche
              </SectionBadge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                4 étapes pour lancer votre entreprise
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Un processus simple et guidé, de l&apos;idée à l&apos;immatriculation.
              </p>
            </div>

            <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Connecting line (desktop) */}
              <div className="pointer-events-none absolute top-16 left-[12.5%] right-[12.5%] hidden lg:block">
                <div className="border-t-2 border-dashed border-emerald-300" />
              </div>

              {steps.map((step) => (
                <div key={step.number} className="relative flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/30">
                    <step.icon className="h-7 w-7" />
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-700 shadow-md">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3 — PAR STATUT JURIDIQUE (6 CARDS)
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-muted/30 border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBadge>
                <Briefcase className="h-3.5 w-3.5" />
                Par statut juridique
              </SectionBadge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Quel statut pour votre projet ?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Chaque forme juridique a ses avantages. Découvrez celle qui correspond le mieux à vos besoins.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {statutCards.map((statut) => (
                <div
                  key={statut.name}
                  className="group flex flex-col rounded-2xl border border-border/60 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${statut.gradient} shadow-sm`}
                  >
                    <statut.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {statut.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{statut.description}</p>

                  <ul className="mt-4 flex-1 space-y-2">
                    {statut.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={statut.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    En savoir plus
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 4 — PAR SITUATION (5 CARDS)
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-white border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBadge>
                <Users className="h-3.5 w-3.5" />
                Par situation
              </SectionBadge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Votre profil, votre parcours
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Freelance, e-commerce, artisan, libéral ou en reconversion : un accompagnement sur mesure.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {situationCards.map((situation, idx) => (
                <div
                  key={situation.title}
                  className={`group flex flex-col rounded-2xl border border-border/60 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    idx === 4 ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <span className="text-4xl mb-4">{situation.emoji}</span>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {situation.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{situation.description}</p>

                  <ul className="mt-4 flex-1 space-y-2">
                    {situation.needs.map((need) => (
                      <li key={need} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        {need}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={situation.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Mon audit personnalisé
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 5 — PACKS D'IMMATRICULATION
        ═══════════════════════════════════════════════════════════ */}
        <section id="packs" className="py-16 sm:py-24 bg-gradient-to-b from-muted/30 to-white border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBadge>
                <Package className="h-3.5 w-3.5" />
                Packs d&apos;immatriculation
              </SectionBadge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Choisissez votre formule
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Du pack essentiel à l&apos;accompagnement complet, choisissez la formule adaptée à votre projet.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
              {packs.map((pack) => (
                <div
                  key={pack.name}
                  className={`relative flex flex-col rounded-2xl bg-white border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    pack.popular
                      ? "border-2 border-emerald-500 shadow-lg shadow-emerald-500/10"
                      : "border-border/60"
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                        <Star className="h-3 w-3" />
                        POPULAIRE
                      </span>
                    </div>
                  )}

                  <div className={`rounded-t-2xl bg-gradient-to-br ${pack.gradient} px-6 pt-8 pb-6 text-center`}>
                    <h3 className="text-xl font-bold text-white">{pack.name}</h3>
                    <p className="mt-1 text-sm text-white/80">{pack.description}</p>
                    <div className="mt-4 flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-extrabold text-white">{pack.price}€</span>
                      <span className="text-base text-white/60 line-through">{pack.oldPrice}€</span>
                    </div>
                  </div>

                  <div className="flex-1 px-6 pt-6 pb-4">
                    <ul className="space-y-3">
                      {pack.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="px-6 pb-6">
                    <a
                      href="/audit"
                      className={`block w-full text-center rounded-xl py-3 px-6 text-sm font-bold transition-all hover:scale-[1.02] ${
                        pack.popular
                          ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                          : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      Choisir {pack.name} {pack.price}€
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 6 — COMPARATEUR DE STATUTS
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-white border-t hidden md:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBadge>
                <TrendingUp className="h-3.5 w-3.5" />
                Comparateur
              </SectionBadge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Comparez les statuts juridiques
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Un tableau comparatif pour choisir en toute connaissance de cause.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border/60 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-semibold text-muted-foreground w-[20%]">
                      Critère
                    </th>
                    <th className="p-4 text-center font-semibold text-emerald-700">
                      Auto-entrepreneur
                    </th>
                    <th className="p-4 text-center font-semibold text-blue-700">
                      SASU
                    </th>
                    <th className="p-4 text-center font-semibold text-amber-700">
                      SARL
                    </th>
                    <th className="p-4 text-center font-semibold text-rose-700">
                      EURL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr
                      key={row.label}
                      className={`border-t border-border/40 ${idx % 2 === 0 ? "bg-white" : "bg-muted/20"} hover:bg-muted/40 transition-colors`}
                    >
                      <td className="p-4 font-medium text-foreground whitespace-nowrap">
                        {row.label}
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {row.autoEntrepreneur}
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {row.sasu}
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {row.sarl}
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {row.eurl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/comparatifs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Voir le comparatif détaillé
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 7 — FAQ
        ═══════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-16 sm:py-24 bg-muted/30 border-t">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBadge>
                <ClipboardCheck className="h-3.5 w-3.5" />
                FAQ
              </SectionBadge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Questions fréquentes
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Tout ce que vous devez savoir avant de créer votre entreprise.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-white px-6 py-2 shadow-sm">
              {faqs.map((faq, idx) => (
                <FaqItem key={idx} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 8 — AUDIT CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center lg:px-8 lg:py-28">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Générez votre audit de lancement personnalisé
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100/90">
              En 3 minutes, recevez le statut idéal + les outils adaptés à votre profil.
            </p>

            <div className="mt-8">
              <a
                href="/audit"
                className="inline-flex items-center gap-2.5 h-14 px-10 text-base font-bold bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl shadow-xl shadow-emerald-900/40 transition-all hover:scale-[1.02]"
              >
                Commencer mon audit gratuit
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-200/80">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Sans engagement
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Résultat immédiat
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                100% gratuit
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 9 — TÉMOIGNAGES
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-white border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBadge>
                <Star className="h-3.5 w-3.5" />
                Témoignages
              </SectionBadge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ils ont créé leur entreprise avec nous
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez les retours de nos entrepreneurs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="flex flex-col rounded-2xl border border-border/60 bg-white p-6 transition-all duration-300 hover:shadow-lg"
                >
                  <Quote className="h-8 w-8 text-emerald-200 mb-4" />

                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-sm font-bold shrink-0">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} &middot; {testimonial.pack}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 10 — MÉTIERS RÉGLEMENTÉS (PREVIEW)
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 border-t bg-gradient-to-b from-white via-rose-50/20 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionBadge>
                <GraduationCap className="h-3.5 w-3.5" />
                Secteurs réglementés
              </SectionBadge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Votre métier est réglementé ?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Diplômes, autorisations, obligations spécifiques... Découvrez les démarches pour 25 métiers réglementés.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {metiersPreview.map((profession) => (
                <a
                  key={profession.name}
                  href={profession.href}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-white p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-center"
                >
                  <span className="text-3xl">{profession.icon}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-rose-600 transition-colors">
                    {profession.name}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="/metiers-reglementes"
                className="inline-flex items-center gap-2 text-base font-semibold text-rose-600 hover:text-rose-700 transition-colors"
              >
                Découvrir les 25 métiers réglementés →
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
