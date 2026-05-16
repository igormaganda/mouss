"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Rocket,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Shield,
  Building2,
  TrendingUp,
  FileText,
  Users,
  ChevronRight,
} from "lucide-react";

// ─── QUIZ TYPES & DATA ──────────────────────────────────────────

interface Question {
  id: string;
  question: string;
  emoji: string;
  options: {
    value: string;
    label: string;
    description: string;
    scores: {
      micro: number;
      sasu: number;
      eurl: number;
      sarl: number;
    };
  }[];
}

const questions: Question[] = [
  {
    id: "profile",
    question: "Quel est votre profil actuel ?",
    emoji: "👤",
    options: [
      {
        value: "etudiant",
        label: "Étudiant",
        description: "En cursus universitaire ou école",
        scores: { micro: 3, sasu: 0, eurl: 0, sarl: 0 },
      },
      {
        value: "salarie",
        label: "Salarié",
        description: "En CDI, CDD ou fonction publique",
        scores: { micro: 2, sasu: 2, eurl: 1, sarl: 0 },
      },
      {
        value: "independant",
        label: "Indépendant",
        description: "Déjà freelance ou auto-entrepreneur",
        scores: { micro: 1, sasu: 1, eurl: 3, sarl: 2 },
      },
      {
        value: "sans-activite",
        label: "Sans activité",
        description: "En recherche ou en reconversion",
        scores: { micro: 2, sasu: 1, eurl: 1, sarl: 1 },
      },
    ],
  },
  {
    id: "revenue",
    question: "Quel revenu annuel visez-vous ?",
    emoji: "💰",
    options: [
      {
        value: "petit",
        label: "< 30 000 €",
        description: "Activité complémentaire ou démarrage",
        scores: { micro: 3, sasu: 0, eurl: 0, sarl: 0 },
      },
      {
        value: "moyen",
        label: "30 000 – 60 000 €",
        description: "Projet à temps plein",
        scores: { micro: 2, sasu: 2, eurl: 1, sarl: 1 },
      },
      {
        value: "grand",
        label: "60 000 – 100 000 €",
        description: "Ambition de croissance",
        scores: { micro: 0, sasu: 3, eurl: 2, sarl: 2 },
      },
      {
        value: "tres-grand",
        label: "> 100 000 €",
        description: "Business scaling-ready",
        scores: { micro: 0, sasu: 2, eurl: 1, sarl: 3 },
      },
    ],
  },
  {
    id: "frais",
    question: "Avez-vous des frais importants ?",
    emoji: "🧾",
    options: [
      {
        value: "non",
        label: "Non",
        description: "Travail sur ordi personnel, peu de dépenses",
        scores: { micro: 3, sasu: 1, eurl: 1, sarl: 1 },
      },
      {
        value: "moderes",
        label: "Oui, modérés",
        description: "Matériel, abonnements, déplacements",
        scores: { micro: 1, sasu: 2, eurl: 2, sarl: 2 },
      },
      {
        value: "eleves",
        label: "Oui, élevés",
        description: "Local, stock, salariés prévus",
        scores: { micro: 0, sasu: 1, eurl: 3, sarl: 3 },
      },
    ],
  },
  {
    id: "patrimoine",
    question: "Voulez-vous protéger votre patrimoine ?",
    emoji: "🛡️",
    options: [
      {
        value: "non",
        label: "Non",
        description: "Pas de biens immobiliers ou peu de patrimoine",
        scores: { micro: 3, sasu: 1, eurl: 0, sarl: 0 },
      },
      {
        value: "important",
        label: "Oui, c'est important",
        description: "Je possède des biens à protéger",
        scores: { micro: 0, sasu: 3, eurl: 1, sarl: 1 },
      },
      {
        value: "critique",
        label: "C'est critique",
        description: "Protection maximale indispensable",
        scores: { micro: 0, sasu: 2, eurl: 1, sarl: 3 },
      },
    ],
  },
  {
    id: "horizon",
    question: "Quel est votre horizon de projet ?",
    emoji: "🚀",
    options: [
      {
        value: "test",
        label: "Test rapide",
        description: "Je veux tester une idée sans engagement",
        scores: { micro: 3, sasu: 0, eurl: 0, sarl: 0 },
      },
      {
        value: "court",
        label: "1 – 2 ans",
        description: "Projet à moyen terme",
        scores: { micro: 2, sasu: 2, eurl: 1, sarl: 1 },
      },
      {
        value: "long",
        label: "Long terme",
        description: "Je construis une entreprise pérenne",
        scores: { micro: 0, sasu: 2, eurl: 3, sarl: 3 },
      },
      {
        value: "incertain",
        label: "Incertain",
        description: "Je ne sais pas encore",
        scores: { micro: 2, sasu: 1, eurl: 1, sarl: 1 },
      },
    ],
  },
];

interface QuizResult {
  structure: string;
  confidence: number;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  advantages: string[];
  precautions: string[];
}

function computeResult(
  answers: Record<string, string>
): QuizResult | null {
  const scores = { micro: 0, sasu: 0, eurl: 0, sarl: 0 };

  for (const question of questions) {
    const selected = answers[question.id];
    if (!selected) return null;
    const option = question.options.find((o) => o.value === selected);
    if (!option) return null;
    scores.micro += option.scores.micro;
    scores.sasu += option.scores.sasu;
    scores.eurl += option.scores.eurl;
    scores.sarl += option.scores.sarl;
  }

  const total = scores.micro + scores.sasu + scores.eurl + scores.sarl;
  if (total === 0) return null;

  const results: { key: string; score: number }[] = [
    { key: "micro", score: scores.micro },
    { key: "sasu", score: scores.sasu },
    { key: "eurl", score: scores.eurl },
    { key: "sarl", score: scores.sarl },
  ];

  results.sort((a, b) => b.score - a.score);
  const best = results[0];
  const confidence = Math.round((best.score / total) * 100);

  const structureData: Record<string, Omit<QuizResult, "confidence">> = {
    micro: {
      structure: "Micro-entreprise",
      description:
        "La micro-entreprise est parfaite pour votre profil ! Elle offre une simplicité de gestion incomparable avec peu de charges et de paperasse. Idéale pour démarrer rapidement et tester votre projet sans risque.",
      color: "text-emerald-700 dark:text-emerald-300",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800/50",
      icon: "⚡",
      advantages: [
        "Création gratuite et rapide en ligne",
        "Pas de capital social minimum requis",
        "Comptabilité simplifiée (déclaration de chiffre d'affaires)",
        "Franchise de TVA jusqu'à certains seuils",
        "Flexibilité totale pour tester une idée",
      ],
      precautions: [
        "Responsabilité illimitée sur le patrimoine personnel",
        "Plafonds de chiffre d'affaires à respecter",
        "Pas de déduction des frais réels",
        "Difficulté à obtenir des financements bancaires",
      ],
    },
    sasu: {
      structure: "SASU",
      description:
        "La SASU vous offre une excellente protection de patrimoine et des avantages fiscaux attractifs via les dividendes. C'est le choix idéal pour les projets ambitieux avec un horizon de croissance.",
      color: "text-violet-700 dark:text-violet-300",
      bgColor: "bg-violet-50 dark:bg-violet-900/20",
      borderColor: "border-violet-200 dark:border-violet-800/50",
      icon: "🏢",
      advantages: [
        "Protection totale du patrimoine personnel",
        "Statut non dirigeant : pas de charges sociales sur les dividendes",
        "Grande crédibilité auprès des investisseurs",
        "Possibilité d'accueillir facilement de nouveaux associés",
        "Flexibilité dans la rédaction des statuts",
      ],
      precautions: [
        "Frais de création plus élevés (rédaction de statuts)",
        "Charges sociales sur le salaire du dirigeant",
        "Obligation de passer par un expert-comptable recommandé",
        "Formalités comptables plus lourdes",
      ],
    },
    eurl: {
      structure: "EURL",
      description:
        "L'EURL vous convient parfaitement si vous visez des revenus élevés avec une gestion souple. Le statut TNS permet de déduire vos charges réelles et d'optimiser votre imposition.",
      color: "text-amber-700 dark:text-amber-300",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800/50",
      icon: "📋",
      advantages: [
        "Protection du patrimoine personnel",
        "Déduction des frais réels (charges, amortissements)",
        "Gérance unique avec contrôle total",
        "Choix entre l'impôt sur les sociétés et l'impôt sur le revenu",
        "Crédibilité renforcée auprès des banques",
      ],
      precautions: [
        "Statut de travailleur non salarié (TNS) : cotisations sociales élevées",
        "Pas de protection chômage du dirigeant",
        "Frais de création et de gestion plus importants",
        "Formalités comptables obligatoires",
      ],
    },
    sarl: {
      structure: "SARL",
      description:
        "La SARL est recommandée si vous prévoyez de vous associer ou de recruter. Elle offre une protection optimale du patrimoine et une grande crédibilité auprès des partenaires bancaires.",
      color: "text-teal-700 dark:text-teal-300",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      borderColor: "border-teal-200 dark:border-teal-800/50",
      icon: "🤝",
      advantages: [
        "Protection du patrimoine de tous les associés",
        "Statut juridique rassurant pour les partenaires",
        "Possibilité de rémunérer les associés via dividendes ou salaires",
        "Adaptée aux projets à plusieurs fondateurs",
        "Facilité d'accès au crédit bancaire",
      ],
      precautions: [
        "Minimum 2 associés (ou 1 pour une EURL)",
        "Rédaction obligatoire de statuts par acte notarié possible",
        "Assemblées générales obligatoires",
        "Gestion administrative plus lourde",
      ],
    },
  };

  const data = structureData[best.key];
  if (!data) return null;

  return { ...data, confidence };
}

// ─── TIPS DATA ──────────────────────────────────────────────────

const tips = [
  {
    icon: Building2,
    title: "Comparez les structures juridiques",
    description:
      "Chaque statut a ses avantages et inconvénients. Prenez le temps de comparer la micro-entreprise, la SASU, l'EURL et la SARL en fonction de votre activité, vos revenus espérés et vos objectifs de croissance.",
  },
  {
    icon: FileText,
    title: "Rédigez un business plan solide",
    description:
      "Un business plan bien structuré vous aide à clarifier votre vision, anticiper les difficultés et convaincre les partenaires financiers. Incluez une étude de marché, des prévisions financières et une stratégie claire.",
  },
  {
    icon: Shield,
    title: "Protégez votre patrimoine personnel",
    description:
      "Si vous avez des biens immobiliers ou un patrimoine important, privilégiez une structure à responsabilité limitée (SASU, EURL, SARL) pour séparer votre patrimoine professionnel et personnel.",
  },
  {
    icon: TrendingUp,
    title: "Anticipez la fiscalité",
    description:
      "Le choix de votre statut influence directement votre imposition. Micro-entreprise (IR), SASU (IS ou option IR), EURL et SARL (choix IS/IR) : chaque option a des conséquences sur vos revenus nets.",
  },
  {
    icon: Users,
    title: "Pensez à l'évolution de votre structure",
    description:
      "Votre statut doit pouvoir évoluer avec votre activité. Il est possible de transformer une micro-entreprise en société, ou de changer de forme juridique quand votre projet grandit.",
  },
  {
    icon: Lightbulb,
    title: "Entourez-vous de professionnels",
    description:
      "Un expert-comptable, un avocat spécialisé en droit des affaires et un conseiller en création d'entreprise peuvent vous faire gagner un temps précieux et éviter des erreurs coûteuses.",
  },
];

const faqItems = [
  {
    question: "Quelle est la différence entre une SASU et une EURL ?",
    answer:
      "La SASU (Société par Actions Simplifiée Unipersonnelle) et l'EURL (Entreprise Unipersonnelle à Responsabilité Limitée) sont toutes deux des sociétés à associé unique. La principale différence réside dans le statut social du dirigeant : en SASU, le dirigeant est assimilé salarié et cotise sur son salaire (pas sur les dividendes), tandis qu'en EURL, le gérant est travailleur non salarié (TNS) et cotise dès le premier euro de revenu.",
  },
  {
    question: "Puis-je changer de statut juridique en cours d'activité ?",
    answer:
      "Oui, il est possible de changer de statut juridique. La transformation d'une micro-entreprise en société est un processus courant. Le changement d'une forme sociétaire à une autre (par exemple d'EURL en SASU) est également possible, bien que plus complexe et coûteux. Nous vous recommandons de consulter un professionnel pour évaluer les implications fiscales et sociales de ce changement.",
  },
  {
    question: "Combien coûte la création d'une entreprise en France ?",
    answer:
      "Les coûts varient selon le statut choisi. La micro-entreprise est gratuite à créer. Pour une société (SASU, EURL, SARL), comptez entre 150 € et 500 € de frais de greffe, auxquels s'ajoutent les honoraires pour la rédaction des statuts (300 à 1 500 € si vous passez par un professionnel). L'immatriculation se fait désormais entièrement en ligne via le guichet unique des formalités d'entreprises.",
  },
  {
    question: "Quel capital social dois-je apporter pour créer une SASU ou EURL ?",
    answer:
      "Il n'y a pas de capital minimum obligatoire pour créer une SASU ou une EURL. Vous pouvez créer votre société avec 1 € de capital social. Cependant, un capital plus élevé peut renforcer la crédibilité de votre entreprise auprès des banques et partenaires. Le capital social est déposé sur un compte bancaire bloqué au moment de la création.",
  },
];

// ─── ANIMATION VARIANTS ─────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

// ─── COMPONENT ──────────────────────────────────────────────────

export function AuditPageClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  const result = useMemo(() => computeResult(answers), [answers]);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
  };

  const isCurrentAnswered = answers[currentQuestion.id] !== undefined;

  const goNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <motion.div {...fadeInUp}>
              <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-white/20 text-white border-white/30">
                <Brain className="h-3.5 w-3.5 mr-1.5" />
                Quiz personnalisé gratuit
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
            >
              Quel{" "}
              <span className="text-amber-300">statut entrepreneurial</span>{" "}
              est fait pour vous ?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 max-w-2xl text-lg text-white/80 sm:text-xl leading-relaxed"
            >
              Répondez à 5 questions et découvrez la structure juridique qui
              correspond le mieux à votre profil.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-violet-200 dark:border-violet-800/50">
              <CardHeader className="pb-2">
                {!showResult && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Question {currentStep + 1} / {questions.length}
                      </span>
                      <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2 [&_[data-slot=progress-indicator]]:bg-violet-500" />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait" custom={1}>
                  {!showResult ? (
                    <motion.div
                      key={currentStep}
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-6"
                    >
                      {/* Question */}
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                          <span className="mr-2">{currentQuestion.emoji}</span>
                          {currentQuestion.question}
                        </h2>
                      </div>

                      {/* Options */}
                      <RadioGroup
                        value={answers[currentQuestion.id] || ""}
                        onValueChange={handleAnswer}
                        className="space-y-3"
                      >
                        {currentQuestion.options.map((option) => (
                          <Label
                            key={option.value}
                            htmlFor={`quiz-${option.value}`}
                            className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                              answers[currentQuestion.id] === option.value
                                ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20 dark:border-violet-600 shadow-sm"
                                : "border-border bg-card hover:border-violet-200 dark:hover:border-violet-800"
                            }`}
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={`quiz-${option.value}`}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground">
                                {option.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {option.description}
                              </p>
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>

                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-2">
                        <Button
                          variant="ghost"
                          onClick={goBack}
                          disabled={currentStep === 0}
                          className="gap-1"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Précédent
                        </Button>

                        <Button
                          onClick={goNext}
                          disabled={!isCurrentAnswered}
                          className="gap-1 bg-violet-600 hover:bg-violet-700 text-white"
                        >
                          {currentStep === questions.length - 1
                            ? "Voir le résultat"
                            : "Suivant"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="text-center space-y-6"
                    >
                      {result && (
                        <>
                          <div className="space-y-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                delay: 0.2,
                              }}
                            >
                              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                            </motion.div>

                            <div>
                              <span className="text-4xl">{result.icon}</span>
                              <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                                <span className={result.color}>
                                  {result.structure}
                                </span>
                              </h2>
                              <p className="text-muted-foreground mt-1">
                                est le statut recommandé pour vous
                              </p>
                            </div>

                            {/* Confidence */}
                            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
                              <Sparkles className="h-4 w-4 text-amber-500" />
                              <span className="text-sm font-semibold">
                                Confiance : {result.confidence}%
                              </span>
                            </div>

                            {/* Description Card */}
                            <div
                              className={`rounded-lg border p-6 text-left ${result.bgColor} ${result.borderColor}`}
                            >
                              <p className="text-sm leading-relaxed">
                                {result.description}
                              </p>
                            </div>

                            {/* Advantages & Precautions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                              <Card className="border-emerald-200 dark:border-emerald-800/50">
                                <CardHeader className="pb-2 pt-4 px-4">
                                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Avantages
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                  <ul className="space-y-2">
                                    {result.advantages.map((adv) => (
                                      <li key={adv} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <span className="text-emerald-500 mt-1">✓</span>
                                        {adv}
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                              <Card className="border-amber-200 dark:border-amber-800/50">
                                <CardHeader className="pb-2 pt-4 px-4">
                                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-300">
                                    <Lightbulb className="h-4 w-4" />
                                    Points de vigilance
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                  <ul className="space-y-2">
                                    {result.precautions.map((prec) => (
                                      <li key={prec} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <span className="text-amber-500 mt-1">!</span>
                                        {prec}
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                              <Link href="/">
                                <Button
                                  size="lg"
                                  className="gap-2 bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
                                >
                                  <Rocket className="h-5 w-5" />
                                  Obtenir mon audit personnalisé
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                onClick={restart}
                                className="gap-2 text-muted-foreground"
                              >
                                <RotateCcw className="h-4 w-4" />
                                Refaire le quiz
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            {...fadeInUp}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary">
              <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
              Conseils d'experts
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Nos conseils pour bien choisir votre{" "}
              <span className="text-primary">structure juridique</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Avant de vous lancer, prenez le temps de considérer ces éléments essentiels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <tip.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            {...fadeInUp}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Questions fréquentes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Les réponses aux questions les plus courantes sur le choix de statut entrepreneurial.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-base mb-3 flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Prêt à lancer votre entreprise ?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Retrouvez tous nos guides, comparatifs et outils pour concrétiser
              votre projet entrepreneurial.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/#plan-action">
                <Button
                  size="lg"
                  className="gap-2 bg-white text-primary hover:bg-white/90 font-semibold w-full sm:w-auto"
                >
                  <Rocket className="h-5 w-5" />
                  Découvrir le plan d'action
                </Button>
              </Link>
              <Link href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/40 text-white bg-transparent hover:bg-white/10 w-full sm:w-auto"
                >
                  Retour à l&apos;accueil
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
