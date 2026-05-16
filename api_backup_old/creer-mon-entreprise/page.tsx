"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Users,
  FileText,
  ClipboardList,
  Coins,
  PenTool,
  Building2,
  ArrowRight,
  MessageSquare,
  Download,
  Lock,
  Clock,
  RefreshCcw,
  Headphones,
  X,
  Check,
  ChevronRight,
  Zap,
  Star,
  CreditCard,
  BadgePercent,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StatutChatbot } from "@/components/statuts/statut-chatbot";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

function FadeInWhenVisible({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
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
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const features = [
  {
    icon: FileText,
    title: "Statuts personnalisés",
    description: "Statuts juridiques adaptés à votre forme sociale et votre projet",
  },
  {
    icon: Users,
    title: "PV d'Assemblée Générale",
    description: "Procès-verbal de constitution prêt à signer",
  },
  {
    icon: ShieldCheck,
    title: "Attestation de non-condamnation",
    description: "Document légal requis pour le dirigeant",
  },
  {
    icon: FileText,
    title: "Formulaire Cerfa pré-rempli",
    description: "Formulaire M0 complété avec vos informations",
  },
  {
    icon: Coins,
    title: "Détermination du capital",
    description: "Aide au choix du capital social optimal",
  },
  {
    icon: PenTool,
    title: "Rédaction de l'objet social",
    description: "Optimisation IA de votre objet social pour plus de souplesse",
  },
  {
    icon: Building2,
    title: "Kit banque pro",
    description: "Documents nécessaires pour l'ouverture de votre compte bancaire",
  },
  {
    icon: CheckCircle,
    title: "Checklist création pas-à-pas",
    description: "Guide complet pour finaliser votre immatriculation",
  },
];

const steps = [
  {
    number: "01",
    title: "Répondez au quiz",
    description:
      "Répondez à quelques questions simples sur votre projet : forme juridique, capital, associés, activité...",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Notre IA rédige vos statuts",
    description:
      "Le chatbot juridique IA rédige en quelques minutes des statuts conformes et personnalisés pour votre société.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Téléchargez vos documents",
    description:
      "Recevez vos statuts, PV d'AG, Cerfa et tous les documents prêts à être déposés au Guichet Unique.",
    icon: Download,
  },
];

const comparisonRows = [
  {
    label: "Prix",
    nous: "9 €",
    avocatEnLigne: "150 – 300 €",
    avocatClassique: "500 – 1 500 €",
  },
  {
    label: "Délai",
    nous: "15 minutes",
    avocatEnLigne: "3 – 7 jours",
    avocatClassique: "1 – 3 semaines",
  },
  {
    label: "Statuts personnalisés",
    nous: true,
    avocatEnLigne: true,
    avocatClassique: true,
  },
  {
    label: "PV d'AG",
    nous: true,
    avocatEnLigne: true,
    avocatClassique: true,
  },
  {
    label: "Formulaire Cerfa",
    nous: true,
    avocatEnLigne: false,
    avocatClassique: false,
  },
  {
    label: "Modifications illimitées",
    nous: true,
    avocatEnLigne: false,
    avocatClassique: false,
  },
  {
    label: "Support réactif",
    nous: true,
    avocatEnLigne: true,
    avocatClassique: true,
  },
];

const faqs = [
  {
    question: "Les statuts générés sont-ils juridiquement valides ?",
    answer:
      "Oui. Nos statuts sont générés en conformité avec le Code de commerce français et les dispositions légales en vigueur pour chaque forme sociale (SAS, SASU, SARL, EURL). Chaque document est structuré selon les obligations légales et rédigé avec un vocabulaire juridique approprié. Nous vous recommandons toutefois une relecture attentive avant signature.",
  },
  {
    question: "Puis-je modifier les statuts après génération ?",
    answer:
      "Absolument ! Vous pouvez modifier chaque section de vos statuts directement dans le chatbot. Répondez aux questions à nouveau ou éditez le texte généré. Aucune limite de modifications — vous générez jusqu'à ce que vous soyez entièrement satisfait.",
  },
  {
    question: "Quels types de société sont supportés ?",
    answer:
      "Le Pack Création d'Entreprise supporte les formes juridiques les plus courantes en France : SASU (Société par Actions Simplifiée Unipersonnelle), SAS (Société par Actions Simplifiée), SARL (Société à Responsabilité Limitée), EURL (Entreprise Unipersonnelle à Responsabilité Limitée), Micro-entreprise et Auto-entrepreneur.",
  },
  {
    question: "Comment déposer mes statuts au Guichet Unique ?",
    answer:
      "Le Guichet Unique (formalites.entreprises.gouv.fr) est la plateforme officielle pour immatriculer votre entreprise. Après avoir généré vos statuts et le PV d'AG, connectez-vous au Guichet Unique, remplissez le formulaire Cerfa (que nous pré-remplissons pour vous) et joignez vos documents PDF. Notre checklist pas-à-pas incluse dans le pack vous guide à chaque étape.",
  },
  {
    question: "Puis-je obtenir un remboursement ?",
    answer:
      "Oui, nous proposons une garantie « satisfait ou remboursé » de 14 jours. Si les documents générés ne correspondent pas à vos attentes ou si vous rencontrez un problème, contactez notre support et nous vous rembourserons intégralement, sans condition.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "La sécurité de vos données est notre priorité. Vos informations sont chiffrées en transit (SSL) et au repos. Elles ne sont jamais partagées avec des tiers et sont utilisées uniquement pour la génération de vos documents juridiques. Conformément au RGPD, vous pouvez demander la suppression de vos données à tout moment.",
  },
];

// ---------------------------------------------------------------------------
// Trust badges for hero
// ---------------------------------------------------------------------------

const trustBadges = [
  { icon: Users, label: "1 000+ entrepreneurs" },
  { icon: ShieldCheck, label: "Documents conformes" },
  { icon: Star, label: "Garantie satisfait" },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function CreerMonEntreprisePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* ============================================================= */}
        {/* 1. HERO SECTION                                               */}
        {/* ============================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left column */}
              <div className="space-y-8 text-center lg:text-left">
                <FadeInWhenVisible delay={0}>
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm px-4 py-1.5 text-sm gap-2">
                    <BadgePercent className="h-4 w-4" />
                    Offre limitée — 9 € au lieu de 150 €
                  </Badge>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.1}>
                  <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Créez votre entreprise{" "}
                    <span className="bg-gradient-to-r from-emerald-200 to-emerald-300 bg-clip-text text-transparent">
                      en 15&nbsp;minutes
                    </span>{" "}
                    grâce à l&apos;IA
                  </h1>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.2}>
                  <p className="mx-auto max-w-xl text-lg text-emerald-100/90 lg:mx-0">
                    Générez vos statuts, PV d&apos;assemblée et tous les
                    documents de création avec notre chatbot juridique IA.
                    Simple, rapide et conforme au droit français.
                  </p>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.3}>
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <a href="#chatbot-section">
                      <Button
                        size="lg"
                        className="h-14 px-8 text-base font-bold bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl shadow-emerald-900/30 gap-2.5 transition-all hover:scale-[1.02]"
                      >
                        <Sparkles className="h-5 w-5" />
                        Générer mes statuts — 9 €
                      </Button>
                    </a>
                  </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.4}>
                  <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-start">
                    {trustBadges.map((badge) => (
                      <div
                        key={badge.label}
                        className="flex items-center gap-2 text-sm text-emerald-100/80"
                      >
                        <badge.icon className="h-4 w-4 text-emerald-300" />
                        {badge.label}
                      </div>
                    ))}
                  </div>
                </FadeInWhenVisible>
              </div>

              {/* Right column — Mockup */}
              <FadeInWhenVisible delay={0.3} direction="right">
                <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                  {/* Chat bubble mockup */}
                  <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Assistant IA
                        </p>
                        <p className="text-xs text-emerald-200/70">
                          En ligne
                        </p>
                      </div>
                      <div className="ml-auto flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Bot message */}
                      <div className="rounded-xl rounded-tl-sm bg-white/15 px-4 py-3 text-sm text-white">
                        <p>Bonjour ! Je vais vous aider à créer votre entreprise.</p>
                        <p className="mt-1.5 text-emerald-200/80">
                          Quelle forme juridique souhaitez-vous ?
                        </p>
                      </div>

                      {/* User message */}
                      <div className="ml-8 rounded-xl rounded-tr-sm bg-white/90 px-4 py-3 text-sm text-emerald-800 shadow-sm">
                        Je voudrais créer une SASU pour mon activité de consulting.
                      </div>

                      {/* Bot message */}
                      <div className="rounded-xl rounded-tl-sm bg-white/15 px-4 py-3 text-sm text-white">
                        <p>Excellent choix ! La SASU est idéale pour le consulting solo.</p>
                        <p className="mt-1.5 text-emerald-200/80">
                          Quel est le nom de votre entreprise ?
                        </p>
                      </div>

                      {/* Typing indicator */}
                      <div className="flex items-center gap-1.5 ml-4 mt-1">
                        <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:0ms]" />
                        <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>

                  {/* Floating badges */}
                  <motion.div
                    className="absolute -top-4 -right-4 rounded-lg border border-white/20 bg-white/90 backdrop-blur-sm px-3 py-2 shadow-lg"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                      <CheckCircle className="h-4 w-4" />
                      SASU
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-4 -left-4 rounded-lg border border-white/20 bg-white/90 backdrop-blur-sm px-3 py-2 shadow-lg"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                      <Clock className="h-4 w-4" />
                      ~15 min
                    </div>
                  </motion.div>
                </div>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* 2. WHAT'S INCLUDED SECTION                                     */}
        {/* ============================================================= */}
        <section className="bg-gray-50/80 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible className="text-center mb-12">
              <Badge
                variant="secondary"
                className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              >
                Tout inclus
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Tout ce qu&apos;il vous faut pour créer votre société
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Un pack complet pour vous accompagner de A à Z dans la création
                de votre entreprise.
              </p>
            </FadeInWhenVisible>

            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <motion.div key={feature.title} variants={staggerChild}>
                  <Card className="h-full border-gray-200/80 bg-white hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
                    <CardHeader>
                      <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ============================================================= */}
        {/* 3. HOW IT WORKS SECTION                                       */}
        {/* ============================================================= */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible className="text-center mb-16">
              <Badge
                variant="secondary"
                className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              >
                Comment ça marche
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                3 étapes simples
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                De la réponse au quiz au téléchargement de vos documents,
                tout se fait en quelques minutes.
              </p>
            </FadeInWhenVisible>

            <div className="relative grid gap-8 md:grid-cols-3">
              {/* Connecting line (desktop) */}
              <div className="pointer-events-none absolute top-16 left-[16.67%] right-[16.67%] hidden md:block">
                <div className="border-t-2 border-dashed border-emerald-300" />
              </div>

              {steps.map((step, idx) => (
                <FadeInWhenVisible key={step.number} delay={idx * 0.15}>
                  <div className="relative flex flex-col items-center text-center">
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

                    {idx < steps.length - 1 && (
                      <ChevronRight className="mt-6 h-6 w-6 text-emerald-400 md:hidden" />
                    )}
                  </div>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* 4. CHATBOT PREVIEW SECTION                                    */}
        {/* ============================================================= */}
        <section
          id="chatbot-section"
          className="bg-gray-50/80 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible className="text-center mb-12">
              <Badge
                variant="secondary"
                className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              >
                Démonstration
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Essayez le chatbot de rédaction
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Répondez à quelques questions et laissez l&apos;IA faire le
                reste.
              </p>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.15}>
              <div className="mx-auto max-w-3xl">
                <Card className="border-gray-200 shadow-xl overflow-hidden">
                  <CardContent className="p-0">
                    <StatutChatbot />
                  </CardContent>
                </Card>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* ============================================================= */}
        {/* 5. COMPARISON TABLE                                           */}
        {/* ============================================================= */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible className="text-center mb-12">
              <Badge
                variant="secondary"
                className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              >
                Comparaison
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Pourquoi choisir Créa Entreprise ?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Comparez notre offre avec les alternatives du marché.
              </p>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.15}>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-500 w-1/4">
                        Critères
                      </th>
                      <th className="p-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                          <span className="text-sm font-bold text-emerald-700">
                            Créa Entreprise
                          </span>
                          <span className="text-lg font-extrabold text-emerald-600">
                            9 €
                          </span>
                        </div>
                      </th>
                      <th className="p-4 text-center w-1/4">
                        <div className="inline-flex flex-col items-center gap-1 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                          <span className="text-sm font-bold text-gray-700">
                            Avocat en ligne
                          </span>
                          <span className="text-lg font-extrabold text-gray-600">
                            150 – 300 €
                          </span>
                        </div>
                      </th>
                      <th className="p-4 text-center w-1/4">
                        <div className="inline-flex flex-col items-center gap-1 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                          <span className="text-sm font-bold text-gray-700">
                            Avocat classique
                          </span>
                          <span className="text-lg font-extrabold text-gray-600">
                            500 – 1 500 €
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, idx) => {
                      const isLast = idx === comparisonRows.length - 1;
                      const isBoolean = typeof row.nous === "boolean";

                      return (
                        <tr
                          key={row.label}
                          className={cn(
                            "border-t border-gray-100",
                            !isLast && "border-b"
                          )}
                        >
                          <td className="p-4 font-medium text-gray-700">
                            {row.label}
                          </td>

                          {/* Créa Entreprise column */}
                          <td className="p-4 text-center">
                            <Cell value={row.nous} isBoolean={isBoolean} highlight />
                          </td>

                          {/* Avocat en ligne */}
                          <td className="p-4 text-center">
                            <Cell
                              value={row.avocatEnLigne}
                              isBoolean={isBoolean}
                            />
                          </td>

                          {/* Avocat classique */}
                          <td className="p-4 text-center">
                            <Cell
                              value={row.avocatClassique}
                              isBoolean={isBoolean}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* ============================================================= */}
        {/* 6. FAQ SECTION                                                */}
        {/* ============================================================= */}
        <section className="bg-gray-50/80 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible className="text-center mb-12">
              <Badge
                variant="secondary"
                className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              >
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Questions fréquentes
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Tout ce que vous devez savoir avant de commencer.
              </p>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.1}>
              <Card className="border-gray-200 bg-white">
                <CardContent className="p-2 sm:p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, idx) => (
                      <AccordionItem
                        key={idx}
                        value={`faq-${idx}`}
                        className="px-2 sm:px-4"
                      >
                        <AccordionTrigger className="text-left text-base font-semibold text-gray-900 hover:text-emerald-700 hover:no-underline">
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

        {/* ============================================================= */}
        {/* 7. FINAL CTA SECTION                                          */}
        {/* ============================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center lg:px-8 lg:py-28">
            <FadeInWhenVisible>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
                <Sparkles className="h-8 w-8 text-emerald-400" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Prêt à créer votre entreprise ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
                Rejoignez plus de 1 000 entrepreneurs qui ont déjà créé leur
                société avec notre assistant IA.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#chatbot-section">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-xl shadow-emerald-900/40 gap-2.5 transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="h-5 w-5" />
                    Commencer maintenant — 9 €
                  </Button>
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-400/70" />
                  Paiement sécurisé
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-400/70" />
                  Accès immédiat
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4 text-emerald-400/70" />
                  Sans engagement
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

// ---------------------------------------------------------------------------
// Cell component for comparison table
// ---------------------------------------------------------------------------

function Cell({
  value,
  isBoolean,
  highlight,
}: {
  value: string | boolean;
  isBoolean: boolean;
  highlight?: boolean;
}) {
  if (isBoolean) {
    return value ? (
      <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-full", highlight ? "bg-emerald-100" : "bg-gray-100")}>
        <Check className={cn("h-4 w-4", highlight ? "text-emerald-600" : "text-gray-500")} />
      </span>
    ) : (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
        <X className="h-4 w-4 text-gray-400" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "text-sm font-semibold",
        highlight ? "text-emerald-700" : "text-gray-600"
      )}
    >
      {String(value)}
    </span>
  );
}
