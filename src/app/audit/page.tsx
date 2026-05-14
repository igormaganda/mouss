"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { AuditSection } from "@/components/sections/audit-section";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sparkles,
  ClipboardCheck,
  Target,
  Mail,
  ShieldCheck,
  User,
  Lightbulb,
  ArrowRight,
  Home,
  ChevronRight,
  Zap,
  Clock,
  Lock,
  FileText,
  CheckCircle2,
} from "lucide-react";

/* ─── Animation Helpers ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      custom={delay}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Benefits Data ─────────────────────────────────────────── */
const benefits = [
  {
    icon: ClipboardCheck,
    title: "Analyse personnalisée",
    description:
      "Basée sur votre profil entrepreneurial (étudiant, salarié, freelance, TPE/PME) et votre phase de projet.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    icon: Target,
    title: "Recommandations ciblées",
    description:
      "Un pack personnalisé Banque + Compta + Assurance adapté à vos besoins réels.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    icon: FileText,
    title: "Résultats par email",
    description:
      "Recevez un audit complet avec un rapport PDF détaillé et des recommandations actionnables.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    icon: ShieldCheck,
    title: "Gratuit et sans engagement",
    description:
      "Aucun frais caché, aucune obligation. Prenez les meilleures décisions pour votre entreprise.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
];

/* ─── How It Works Steps ────────────────────────────────────── */
const steps = [
  {
    number: 1,
    icon: User,
    title: "Décrivez votre profil",
    description:
      "Étudiant, salarié, freelance ou TPE/PME — chaque profil a des besoins différents.",
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    number: 2,
    icon: Lightbulb,
    title: "Indiquez votre phase",
    description:
      "Réflexion, création, gestion ou croissance — nous adaptons nos conseils.",
    color: "bg-amber-500",
    lightBg: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    number: 3,
    icon: ClipboardCheck,
    title: "Partagez vos difficultés",
    description:
      "Administratif, bancaire, compta, juridique — nous ciblons vos pain points.",
    color: "bg-rose-500",
    lightBg: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    number: 4,
    icon: Mail,
    title: "Recevez vos recommandations",
    description:
      "Un pack personnalisé par email avec des offres adaptées à votre profil.",
    color: "bg-violet-500",
    lightBg: "bg-violet-50",
    textColor: "text-violet-600",
  },
];

/* ─── FAQ Data ──────────────────────────────────────────────── */
const faqItems = [
  {
    question: "Combien de temps dure l'audit ?",
    answer:
      "Moins de 2 minutes pour répondre aux 4 questions. Votre audit personnalisé est généré automatiquement et envoyé par email dans les minutes qui suivent.",
  },
  {
    question: "L'audit est-il vraiment gratuit ?",
    answer:
      "Oui, 100% gratuit et sans engagement. Il n'y a aucun frais caché ni obligation d'acheter quoi que ce soit. Notre objectif est de vous aider à faire les bons choix.",
  },
  {
    question: "Quelles recommandations vais-je recevoir ?",
    answer:
      "Un pack personnalisé Banque + Compta + Assurance adapté à votre profil et à votre phase de projet. Chaque recommandation est expliquée et justifiée.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Vos données sont protégées conformément au RGPD et ne sont jamais partagées avec des tiers. Vous pouvez demander leur suppression à tout moment.",
  },
  {
    question: "Puis-je refaire l'audit avec un autre profil ?",
    answer:
      "Absolument ! Vous pouvez refaire l'audit autant de fois que vous le souhaitez pour comparer les résultats selon différents profils ou phases de projet.",
  },
];

/* ─── Page Component ────────────────────────────────────────── */
export default function AuditPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero Section ─────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-background to-amber-50">
          {/* Decorative blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-rose-500/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="flex items-center gap-1">
                      <Home className="h-3.5 w-3.5" />
                      Accueil
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Audit Gratuit</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>

            {/* Title */}
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Gratuit & Personnalisé
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                Audit de Lancement{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                  Gratuit
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
              >
                En 2 minutes, découvrez les meilleures solutions bancaires,
                comptables et d&apos;assurance adaptées à votre profil
                entrepreneurial. Recevez un rapport personnalisé par email.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-wrap justify-center gap-4"
              >
                <a href="#audit-wizard">
                  <Button
                    size="lg"
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 font-semibold text-base px-8 h-13 shadow-lg shadow-emerald-600/20"
                  >
                    <ClipboardCheck className="h-5 w-5" />
                    Commencer mon audit gratuit
                  </Button>
                </a>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10"
              >
                {[
                  { icon: Clock, label: "2 minutes", desc: "pour répondre" },
                  { icon: Zap, label: "100%", desc: "gratuit" },
                  { icon: Lock, label: "RGPD", desc: "données sécurisées" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm border">
                      <stat.icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{stat.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Benefits Section ─────────────────────────────── */}
        <section className="py-10 sm:py-14 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
              <Badge
                variant="outline"
                className="mb-4 px-3 py-1 text-xs font-medium border-amber-200 text-amber-700"
              >
                Pourquoi cet audit ?
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ce que vous obtenez
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Un audit complet et personnalisé pour prendre les meilleures
                décisions au lancement de votre entreprise.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, i) => (
                <AnimatedSection key={benefit.title} delay={i}>
                  <Card className="h-full border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${benefit.bg} mb-5 group-hover:scale-110 transition-transform`}
                      >
                        <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works Section ──────────────────────────── */}
        <section className="py-10 sm:py-14 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
              <Badge
                variant="outline"
                className="mb-4 px-3 py-1 text-xs font-medium border-rose-200 text-rose-700"
              >
                Comment ça marche ?
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                4 étapes simples
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Répondez à 4 questions et recevez vos recommandations
                personnalisées en quelques minutes.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <AnimatedSection key={step.number} delay={i}>
                  <div className="relative">
                    {/* Connector line (hidden on mobile) */}
                    {i < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 -right-3 w-6 z-10">
                        <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                    )}

                    <Card className="h-full border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                      <CardContent className="p-6">
                        {/* Step number + icon */}
                        <div className="flex items-center gap-4 mb-5">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.lightBg} group-hover:scale-110 transition-transform`}
                          >
                            <step.icon className={`h-6 w-6 ${step.textColor}`} />
                          </div>
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step.color} text-white`}
                          >
                            {step.number}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* CTA below steps */}
            <AnimatedSection delay={1} className="mt-12 text-center">
              <a href="#audit-wizard">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 font-semibold text-base border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  Passer à l&apos;audit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </AnimatedSection>
          </div>
        </section>

        {/* ─── Audit Wizard Section ──────────────────────────── */}
        <div id="audit-wizard">
          <AuditSection />
        </div>

        {/* ─── FAQ Section ──────────────────────────────────── */}
        <section className="py-10 sm:py-14 bg-background">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 px-3 py-1 text-xs font-medium border-violet-200 text-violet-700"
              >
                Questions fréquentes
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Tout savoir sur l&apos;audit
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Retrouvez les réponses aux questions les plus courantes.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={1}>
              <Card className="border shadow-sm">
                <CardContent className="p-2 sm:p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, i) => (
                      <AccordionItem key={i} value={`faq-${i}`}>
                        <AccordionTrigger className="text-left text-base font-medium px-4 hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 text-muted-foreground leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Still have questions CTA */}
            <AnimatedSection delay={2} className="mt-12 text-center">
              <Card className="border-dashed border-2">
                <CardContent className="py-8 px-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                      <Sparkles className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-base font-semibold">
                        Prêt à découvrir votre audit ?
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        C&apos;est gratuit, rapide et personnalisé.
                      </p>
                    </div>
                    <a href="#audit-wizard">
                      <Button className="gap-2 bg-amber-600 hover:bg-amber-700 font-semibold whitespace-nowrap">
                        <CheckCircle2 className="h-4 w-4" />
                        Commencer maintenant
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
