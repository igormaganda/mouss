"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Clock,
  Headphones,
  Lock,
  Check,
  X,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── ANIMATION VARIANTS ─────────────────────────────────────────────

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
    transition: { staggerChildren: 0.08 },
  },
};

// ─── PRICING DATA ───────────────────────────────────────────────────

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline";
  highlighted: boolean;
  features: string[];
  planSlug: string;
}

const plans: PricingPlan[] = [
  {
    name: "Découverte",
    price: "0€",
    period: "/mois",
    description: "Idéal pour explorer et découvrir nos ressources",
    features: [
      "Audit gratuit de votre projet",
      "3 guides exclusifs par mois",
      "Newsletter hebdomadaire",
      "Accès communauté",
    ],
    planSlug: "decouverte",
    highlighted: false,
  },
  {
    name: "Entrepreneur",
    price: "19€",
    period: "/mois",
    description: "Pour lancer et développer votre activité",
    badge: "Populaire",
    badgeVariant: "default",
    highlighted: false,
    features: [
      "Tout du plan Découverte",
      "Guides & articles illimités",
      "Outils comparatifs avancés",
      "Support email dédié",
      "Templates business plan",
    ],
    planSlug: "entrepreneur",
  },
  {
    name: "Business",
    price: "39€",
    period: "/mois",
    description: "Pour les entreprises en croissance",
    highlighted: true,
    features: [
      "Tout du plan Entrepreneur",
      "Mentorship mensuel",
      "Documents générés par IA",
      "CRM intégré",
      "Support prioritaire",
    ],
    planSlug: "business",
  },
  {
    name: "Premium",
    price: "79€",
    period: "/mois",
    description: "Accompagnement sur mesure pour votre succès",
    badge: "Recommandé",
    badgeVariant: "default",
    highlighted: true,
    features: [
      "Tout du plan Business",
      "Consultant dédié",
      "Audit approfondi",
      "Formation complète",
      "Accès API",
    ],
    planSlug: "premium",
  },
];

// ─── COMPARISON TABLE DATA ─────────────────────────────────────────

interface ComparisonFeature {
  name: string;
  decouverte: string | boolean;
  entrepreneur: string | boolean;
  business: string | boolean;
  premium: string | boolean;
}

const comparisonFeatures: ComparisonFeature[] = [
  {
    name: "Audit gratuit",
    decouverte: true,
    entrepreneur: true,
    business: true,
    premium: "Avancé",
  },
  {
    name: "Guides & articles",
    decouverte: "3 / mois",
    entrepreneur: "Illimité",
    business: "Illimité",
    premium: "Illimité",
  },
  {
    name: "Outils comparatifs",
    decouverte: false,
    entrepreneur: "Basique",
    business: "Avancé",
    premium: "Avancé",
  },
  {
    name: "Templates Business Plan",
    decouverte: false,
    entrepreneur: true,
    business: true,
    premium: true,
  },
  {
    name: "Mentorship",
    decouverte: false,
    entrepreneur: false,
    business: "Mensuel",
    premium: "Hebdomadaire",
  },
  {
    name: "Documents IA",
    decouverte: false,
    entrepreneur: false,
    business: true,
    premium: "Illimité",
  },
  {
    name: "Support prioritaire",
    decouverte: false,
    entrepreneur: false,
    business: true,
    premium: true,
  },
  {
    name: "Consultant dédié",
    decouverte: false,
    entrepreneur: false,
    business: false,
    premium: true,
  },
  {
    name: "Formation complète",
    decouverte: false,
    entrepreneur: false,
    business: false,
    premium: true,
  },
];

// ─── TRUST ITEMS ────────────────────────────────────────────────────

const trustItems = [
  {
    icon: Shield,
    title: "Garantie satisfait",
    description: "Satisfait ou remboursé sous 30 jours",
  },
  {
    icon: Clock,
    title: "Annulation facile",
    description: "Annulez à tout moment, sans frais",
  },
  {
    icon: Headphones,
    title: "Support réactif",
    description: "Réponse en moins de 24h",
  },
  {
    icon: Lock,
    title: "Paiement sécurisé",
    description: "Chiffrement SSL de bout en bout",
  },
];

// ─── FAQ DATA ───────────────────────────────────────────────────────

const faqItems = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer:
      "Oui, absolument ! Vous pouvez passer à un plan supérieur à tout moment. Le changement est immédiat et la facturation sera ajustée au prorata. Si vous souhaitez passer à un plan inférieur, le changement prendra effet au début de votre prochain cycle de facturation.",
  },
  {
    question: "Y a-t-il une période d'essai gratuite ?",
    answer:
      "Tous nos plans payants incluent une période d'essai de 14 jours. Vous pouvez explorer toutes les fonctionnalités sans engagement et sans fournir vos informations de paiement. À la fin de la période d'essai, vous pouvez choisir de continuer ou d'annuler.",
  },
  {
    question: "Comment fonctionne l'annulation ?",
    answer:
      "Vous pouvez annuler votre abonnement en un clic depuis votre espace personnel. L'annulation prend effet immédiatement et vous conservez l'accès à vos fonctionnalités jusqu'à la fin de votre période de facturation en cours. Aucun frais d'annulation ne sera appliqué.",
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal et les virements bancaires pour les plans annuels. Tous les paiements sont sécurisés par un chiffrement SSL 256 bits. Les factures sont disponibles dans votre espace client.",
  },
  {
    question: "Le plan Découverte est-il vraiment gratuit ?",
    answer:
      "Oui, le plan Découverte est 100% gratuit et le restera. Aucune carte bancaire n'est requise. C'est notre façon de vous permettre de découvrir la valeur de notre plateforme. Vous pouvez y rester aussi longtemps que vous le souhaitez, sans aucune limitation de durée.",
  },
  {
    question: "Puis-je obtenir un remboursement ?",
    answer:
      "Nous offrons une garantie satisfait ou remboursé de 30 jours sur tous nos plans payants. Si vous n'êtes pas entièrement satisfait, contactez notre support et nous traiterons votre remboursement sous 5 jours ouvrés, sans question posée.",
  },
];

// ─── HELPER: Cell Value Renderer ────────────────────────────────────

function FeatureCell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <Check className="h-5 w-5 text-primary mx-auto" strokeWidth={2.5} />
    );
  }
  if (value === false) {
    return (
      <X className="h-5 w-5 text-muted-foreground/40 mx-auto" strokeWidth={2} />
    );
  }
  return (
    <span className="text-sm font-medium text-foreground">{value}</span>
  );
}

// ─── SECTION: Hero Banner ───────────────────────────────────────────

function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.845_0.143_164.978/0.3),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_oklch(0.828_0.189_84.429/0.2),_transparent_60%)]" />

      {/* Decorative dots */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/15 text-white border-white/20 hover:bg-white/20">
              <Sparkles className="h-4 w-4 mr-1.5" />
              Tarifs transparents
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Nos Tarifs
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Investissez dans votre succès entrepreneurial. Choisissez le plan qui
            correspond à vos ambitions et accédez aux outils, guides et
            accompagnement dont vous avez besoin pour réussir.
          </motion.p>

          <motion.div
            className="mt-8 flex items-center justify-center gap-2 text-white/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Shield className="h-4 w-4" />
            <span>Garantie 30 jours satisfait ou remboursé</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 60V30C360 0 720 0 1080 30C1260 45 1350 52.5 1440 60H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}

// ─── SECTION: Pricing Cards ─────────────────────────────────────────

function PricingCards() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={fadeInUp}
              custom={index}
              className={plan.highlighted ? "lg:scale-105 lg:z-10" : ""}
            >
              <PricingCard plan={plan} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <Card
      className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-xl ${
        plan.highlighted
          ? "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20"
          : "hover:-translate-y-1"
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge
            variant={plan.badgeVariant ?? "default"}
            className="px-3 py-1 text-xs font-semibold shadow-md"
          >
            <Star className="h-3 w-3 mr-1" />
            {plan.badge}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-sm mt-1">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span
              className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
                plan.highlighted ? "text-primary" : "text-foreground"
              }`}
            >
              {plan.price}
            </span>
            {plan.price !== "0€" && (
              <span className="text-muted-foreground text-sm font-medium">
                {plan.period}
              </span>
            )}
          </div>
          {plan.price === "0€" && (
            <span className="text-muted-foreground text-sm font-medium">
              Pour toujours
            </span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <Check
                  className={`h-4 w-4 ${
                    plan.highlighted
                      ? "text-primary"
                      : "text-emerald-500"
                  }`}
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-sm text-muted-foreground leading-snug">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          asChild
          className={`w-full ${
            plan.highlighted
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              : ""
          }`}
          variant={plan.highlighted ? "default" : "outline"}
          size="lg"
        >
          <Link href={`/checkout?plan=${plan.planSlug}`}>
            Choisir ce plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// ─── SECTION: Trust ─────────────────────────────────────────────────

function TrustSection() {
  return (
    <section className="py-16 sm:py-20 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              custom={index}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">
                {item.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── SECTION: Comparison Table ──────────────────────────────────────

function ComparisonTable() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
          >
            Comparaison
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Comparez les plans
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Un aperçu détaillé de chaque fonctionnalité selon votre plan.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border bg-card shadow-sm overflow-hidden"
        >
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[200px] text-sm font-semibold py-4">
                    Fonctionnalités
                  </TableHead>
                  <TableHead className="text-center text-sm font-semibold py-4">
                    Découverte
                  </TableHead>
                  <TableHead className="text-center text-sm font-semibold py-4">
                    Entrepreneur
                  </TableHead>
                  <TableHead className="text-center text-sm font-semibold bg-primary/5 py-4">
                    Business
                  </TableHead>
                  <TableHead className="text-center text-sm font-semibold bg-primary/5 py-4">
                    Premium
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonFeatures.map((feature, index) => (
                  <TableRow
                    key={feature.name}
                    className={index % 2 === 0 ? "" : "bg-muted/20"}
                  >
                    <TableCell className="font-medium text-sm py-3.5">
                      {feature.name}
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      <FeatureCell value={feature.decouverte} />
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      <FeatureCell value={feature.entrepreneur} />
                    </TableCell>
                    <TableCell className="text-center bg-primary/5 py-3.5">
                      <FeatureCell value={feature.business} />
                    </TableCell>
                    <TableCell className="text-center bg-primary/5 py-3.5">
                      <FeatureCell value={feature.premium} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile accordion-style cards */}
          <div className="md:hidden divide-y">
            {comparisonFeatures.map((feature) => (
              <div key={feature.name} className="p-4">
                <h4 className="font-medium text-sm mb-3">{feature.name}</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {(
                    [
                      ["Découverte", feature.decouverte],
                      ["Entrepreneur", feature.entrepreneur],
                      ["Business", feature.business],
                      ["Premium", feature.premium],
                    ] as [string, string | boolean][]
                  ).map(([planName, value]) => (
                    <div key={planName} className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {planName}
                      </p>
                      <FeatureCell value={value} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SECTION: FAQ ───────────────────────────────────────────────────

function FAQSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
          >
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tout ce que vous devez savoir sur nos plans et services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="px-6"
                  >
                    <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline py-5">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SECTION: Final CTA ─────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl hero-gradient p-10 sm:p-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight gradient-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Prêt à démarrer ?
            </motion.h2>

            <motion.p
              className="mt-4 text-lg sm:text-xl text-white/80 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Lancez votre audit gratuit en 2 minutes et découvrez comment
              accélérer la création de votre entreprise.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold px-8 h-12 text-base"
              >
                <Link href="/audit">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Commencer mon audit gratuit
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium px-8 h-12 text-base"
              >
                <Link href="#">
                  Voir tous les plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE CLIENT COMPONENT ─────────────────────────────────────

export function TarifsPageClient() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroBanner />
        <PricingCards />
        <TrustSection />
        <ComparisonTable />
        <FAQSection />
        <FinalCTA />
      </main>
    </div>
  );
}
