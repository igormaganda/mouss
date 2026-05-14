"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Rocket,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

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
  icon: string;
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

  const total =
    scores.micro + scores.sasu + scores.eurl + scores.sarl;
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
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50",
      icon: "⚡",
    },
    sasu: {
      structure: "SASU",
      description:
        "La SASU vous offre une excellente protection de patrimoine et des avantages fiscaux attractifs via les dividendes. C'est le choix idéal pour les projets ambitieux avec un horizon de croissance.",
      color: "text-violet-700 dark:text-violet-300",
      bgColor: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/50",
      icon: "🏢",
    },
    eurl: {
      structure: "EURL",
      description:
        "L'EURL vous convient parfaitement si vous visez des revenus élevés avec une gestion souple. Le statut TNS permet de déduire vos charges réelles et d'optimiser votre imposition.",
      color: "text-amber-700 dark:text-amber-300",
      bgColor: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50",
      icon: "📋",
    },
    sarl: {
      structure: "SARL",
      description:
        "La SARL est recommandée si vous prévoyez de vous associer ou de recruter. Elle offre une protection optimale du patrimoine et une grande crédibilité auprès des partenaires bancaires.",
      color: "text-teal-700 dark:text-teal-300",
      bgColor: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50",
      icon: "🤝",
    },
  };

  const data = structureData[best.key];
  if (!data) return null;

  return { ...data, confidence };
}

export function QuizSection() {
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

  return (
    <section id="quiz" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge
            variant="secondary"
            className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
          >
            <Brain className="h-3.5 w-3.5 mr-1" />
            Quiz personnalisé
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Quel{" "}
            <span className="text-violet-600 dark:text-violet-400">
              statut entrepreneurial
            </span>{" "}
            est fait pour vous ?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
            Répondez à 5 questions et découvrez la structure juridique qui
            correspond le mieux à votre profil.
          </p>
        </motion.div>

        {/* Quiz Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        <span className="mr-2">{currentQuestion.emoji}</span>
                        {currentQuestion.question}
                      </h3>
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
                    {/* Result */}
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
                            <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                              <span className={result.color}>
                                {result.structure}
                              </span>
                            </h3>
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
                            className={`rounded-lg border p-6 text-left ${result.bgColor}`}
                          >
                            <p className="text-sm leading-relaxed">
                              {result.description}
                            </p>
                          </div>

                          {/* CTA */}
                          <a href="#audit">
                            <Button
                              size="lg"
                              className="gap-2 bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
                            >
                              <Rocket className="h-5 w-5" />
                              Obtenir mon audit personnalisé
                            </Button>
                          </a>

                          <Button
                            variant="ghost"
                            onClick={restart}
                            className="gap-2 text-muted-foreground"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Refaire le quiz
                          </Button>
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
  );
}
