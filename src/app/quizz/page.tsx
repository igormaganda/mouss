"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ClipboardCheck,
  Sparkles,
  CheckCircle2,
  Mail,
  User,
  Briefcase,
  Lightbulb,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── QUIZ OPTIONS ────────────────────────────────────────────────

interface ProfileOption {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface PhaseOption {
  value: string;
  label: string;
  description: string;
}

interface PainOption {
  value: string;
  label: string;
}

const profileOptions: ProfileOption[] = [
  {
    value: "etudiant",
    label: "Étudiant Entrepreneur",
    icon: User,
    description: "Étudier et entreprendre en parallèle",
  },
  {
    value: "salarie",
    label: "Salarié en Transition",
    icon: Briefcase,
    description: "Sécuriser le lancement avant de quitter",
  },
  {
    value: "freelance",
    label: "Freelance / Auto-entrepreneur",
    icon: Lightbulb,
    description: "Simplicité et gratuité pour démarrer",
  },
  {
    value: "tpe-pme",
    label: "TPE / PME",
    icon: Briefcase,
    description: "Gestion d'équipe et flux complexes",
  },
];

const phaseOptions: PhaseOption[] = [
  {
    value: "reflexion",
    label: "Réflexion (J1-J15)",
    description: "Je cherche mon idée ou valide mon business model",
  },
  {
    value: "creation",
    label: "Création (J31-J60)",
    description: "Je lance les démarches administratives",
  },
  {
    value: "gestion",
    label: "Gestion (J61-J80)",
    description: "J'optimise mon organisation et ma compta",
  },
  {
    value: "croissance",
    label: "Croissance (J81-J100)",
    description: "Je veux accélérer mon impact",
  },
];

const painPointOptions: PainOption[] = [
  { value: "administratif", label: "Perdu dans l'administratif" },
  { value: "frais-bancaires", label: "Frais bancaires trop élevés" },
  { value: "compta", label: "Pas le temps pour la compta" },
  { value: "juridique", label: "Risques juridiques" },
  { value: "autre", label: "Autre" },
];

// ─── ANIMATION VARIANTS ──────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

// ─── FORM DATA TYPE ──────────────────────────────────────────────

interface FormData {
  profile: string;
  phase: string;
  painPoint: string;
  firstName: string;
  lastName: string;
  email: string;
  projectName: string;
}

const initialFormData: FormData = {
  profile: "",
  phase: "",
  painPoint: "",
  firstName: "",
  lastName: "",
  email: "",
  projectName: "",
};

// ─── STEP CONFIG ─────────────────────────────────────────────────

const TOTAL_STEPS = 4;

// ─── PAGE COMPONENT ──────────────────────────────────────────────

export default function QuizzPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // ── Validation ────────────────────────────────────────────────

  const canGoNext = (): boolean => {
    switch (step) {
      case 0:
        return formData.profile !== "";
      case 1:
        return formData.phase !== "";
      case 2:
        return formData.painPoint !== "";
      case 3:
        return (
          formData.email !== "" &&
          formData.email.includes("@") &&
          formData.firstName !== ""
        );
      default:
        return false;
    }
  };

  // ── Navigation ────────────────────────────────────────────────

  const goNext = () => {
    if (step < TOTAL_STEPS - 1 && canGoNext()) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  // ── Submit ────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!canGoNext()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, consent: true }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'envoi");
      }

      setIsSubmitted(true);
      toast.success("Votre audit a été généré avec succès !");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Reset ─────────────────────────────────────────────────────

  const resetForm = () => {
    setStep(0);
    setDirection(0);
    setIsSubmitted(false);
    setFormData(initialFormData);
  };

  // ── Keyboard ──────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && step < TOTAL_STEPS - 1 && canGoNext()) {
      goNext();
    }
    if (e.key === "Enter" && step === TOTAL_STEPS - 1 && canGoNext()) {
      handleSubmit();
    }
  };

  // ── Helpers ───────────────────────────────────────────────────

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const getStepLabel = (): string => {
    switch (step) {
      case 0:
        return "Quel est votre profil ?";
      case 1:
        return "Où en êtes-vous ?";
      case 2:
        return "Quelle est votre plus grande difficulté ?";
      case 3:
        return "Recevez vos résultats";
      default:
        return "";
    }
  };

  const getStepIcon = (): LucideIcon => {
    switch (step) {
      case 0:
        return User;
      case 1:
        return Lightbulb;
      case 2:
        return ClipboardCheck;
      case 3:
        return Mail;
      default:
        return ClipboardCheck;
    }
  };

  // ── RENDER ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Retour à l&apos;accueil
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-5 px-4 py-1.5 text-sm font-medium bg-white/15 text-white border-white/20 hover:bg-white/20">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Gratuit &amp; Personnalisé
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Quiz Entrepreneur
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Découvrez votre profil et recevez des recommandations
              personnalisées pour lancer et développer votre activité.
            </p>
          </div>
        </div>
      </section>

      {/* ── Feature Highlights ────────────────────────────────── */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: ClipboardCheck,
                title: "Analyse personnalisée",
                desc: "Basée sur votre profil entrepreneur",
              },
              {
                icon: Sparkles,
                title: "Recommandations ciblées",
                desc: "Banque + Compta + Assurance",
              },
              {
                icon: Mail,
                title: "Résultats par email",
                desc: "Audit complet avec plan d'action",
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-3 sm:flex-col sm:text-center"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <feat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{feat.title}</p>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quiz Form ────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait" custom={direction}>
            {!isSubmitted ? (
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onKeyDown={handleKeyDown}
                tabIndex={0}
              >
                <Card className="rounded-2xl overflow-hidden shadow-lg border-border/60 gap-0 py-0">
                  {/* ── Progress Bar ──────────────────────────── */}
                  <div className="bg-muted/60 px-6 pt-6 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Question {step + 1} sur {TOTAL_STEPS}
                      </span>
                      <span className="text-xs font-semibold text-primary">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    {/* Step dots */}
                    <div className="flex justify-center gap-2 mt-3">
                      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === step
                              ? "w-8 bg-primary"
                              : i < step
                                ? "w-1.5 bg-primary/50"
                                : "w-1.5 bg-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* ── Step Content ──────────────────────────── */}
                  <CardContent className="px-6 py-6">
                    {/* Step 1: Profile */}
                    {step === 0 && (
                      <div className="space-y-5">
                        <div className="text-center mb-2">
                          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
                            <User className="h-7 w-7 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold">
                            Quel est votre profil ?
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Cela nous aide à adapter nos recommandations
                          </p>
                        </div>
                        <RadioGroup
                          value={formData.profile}
                          onValueChange={(val) =>
                            setFormData({ ...formData, profile: val })
                          }
                          className="space-y-3"
                        >
                          {profileOptions.map((opt) => {
                            const OptIcon = opt.icon;
                            return (
                              <label
                                key={opt.value}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  formData.profile === opt.value
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                                }`}
                              >
                                <RadioGroupItem value={opt.value} />
                                <OptIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                                <div>
                                  <p className="text-sm font-semibold">
                                    {opt.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {opt.description}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </RadioGroup>
                      </div>
                    )}

                    {/* Step 2: Phase */}
                    {step === 1 && (
                      <div className="space-y-5">
                        <div className="text-center mb-2">
                          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
                            <Lightbulb className="h-7 w-7 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold">
                            Où en êtes-vous dans votre projet ?
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Sélectionnez la phase qui correspond le mieux
                          </p>
                        </div>
                        <RadioGroup
                          value={formData.phase}
                          onValueChange={(val) =>
                            setFormData({ ...formData, phase: val })
                          }
                          className="space-y-3"
                        >
                          {phaseOptions.map((opt) => (
                            <label
                              key={opt.value}
                              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                formData.phase === opt.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/30 hover:bg-muted/50"
                              }`}
                            >
                              <RadioGroupItem
                                value={opt.value}
                                className="mt-0.5"
                              />
                              <div>
                                <p className="text-sm font-semibold">
                                  {opt.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {opt.description}
                                </p>
                              </div>
                            </label>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {/* Step 3: Pain Point */}
                    {step === 2 && (
                      <div className="space-y-5">
                        <div className="text-center mb-2">
                          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
                            <ClipboardCheck className="h-7 w-7 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold">
                            Quelle est votre plus grande difficulté ?
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Nous ciblerons nos recommandations en conséquence
                          </p>
                        </div>
                        <RadioGroup
                          value={formData.painPoint}
                          onValueChange={(val) =>
                            setFormData({ ...formData, painPoint: val })
                          }
                          className="space-y-3"
                        >
                          {painPointOptions.map((opt) => (
                            <label
                              key={opt.value}
                              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                formData.painPoint === opt.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/30 hover:bg-muted/50"
                              }`}
                            >
                              <RadioGroupItem value={opt.value} />
                              <p className="text-sm font-medium">{opt.label}</p>
                            </label>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {/* Step 4: Contact Info */}
                    {step === 3 && (
                      <div className="space-y-5">
                        <div className="text-center mb-2">
                          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
                            <Mail className="h-7 w-7 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold">
                            Recevez vos résultats
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Entrez vos coordonnées pour recevoir vos
                            recommandations personnalisées
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="quiz-firstName">
                                Prénom <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="quiz-firstName"
                                placeholder="Jean"
                                value={formData.firstName}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    firstName: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="quiz-lastName">Nom</Label>
                              <Input
                                id="quiz-lastName"
                                placeholder="Dupont"
                                value={formData.lastName}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    lastName: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="quiz-email">
                              Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="quiz-email"
                              type="email"
                              placeholder="jean@exemple.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="quiz-projectName">
                              Nom du projet{" "}
                              <span className="text-muted-foreground font-normal">
                                (optionnel)
                              </span>
                            </Label>
                            <Input
                              id="quiz-projectName"
                              placeholder="Mon projet de..."
                              value={formData.projectName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  projectName: e.target.value,
                                })
                              }
                            />
                          </div>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            En soumettant ce formulaire, vous acceptez de
                            recevoir nos recommandations personnalisées par
                            email. Vos données sont protégées et ne seront
                            jamais partagées.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  {/* ── Navigation Buttons ──────────────────────── */}
                  <div className="flex justify-between items-center px-6 pb-6">
                    {step > 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={goPrev}
                        className="gap-1"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Précédent
                      </Button>
                    ) : (
                      <div />
                    )}

                    {step < TOTAL_STEPS - 1 ? (
                      <Button
                        type="button"
                        onClick={goNext}
                        disabled={!canGoNext()}
                        className="gap-1"
                      >
                        Suivant
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canGoNext() || isSubmitting}
                        className="gap-2 bg-primary hover:bg-primary/90"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Analyse en cours...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Recevoir mon audit
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              /* ── Success State ─────────────────────────────── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-2xl shadow-lg border-border/60 gap-0 py-0">
                  <CardContent className="px-6 py-12 text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      Audit généré avec succès !
                    </h3>
                    <p className="text-muted-foreground mb-1">
                      Votre audit personnalisé est en cours de préparation.
                    </p>
                    <p className="text-sm text-muted-foreground mb-8">
                      Vous le recevrez à l&apos;adresse{" "}
                      <strong className="text-foreground">
                        {formData.email}
                      </strong>{" "}
                      dans les prochaines minutes.
                    </p>

                    {/* Profile summary badges */}
                    <div className="bg-muted/50 rounded-xl p-5 mb-8 text-left max-w-md mx-auto">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Votre profil
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {profileOptions.find(
                            (p) => p.value === formData.profile
                          )?.label ?? formData.profile}
                        </Badge>
                        <Badge variant="secondary">
                          {phaseOptions.find(
                            (p) => p.value === formData.phase
                          )?.label ?? formData.phase}
                        </Badge>
                        <Badge variant="secondary">
                          {painPointOptions.find(
                            (p) => p.value === formData.painPoint
                          )?.label ?? formData.painPoint}
                        </Badge>
                      </div>
                    </div>

                    {/* What's next */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left max-w-lg mx-auto">
                      {[
                        {
                          icon: ClipboardCheck,
                          label: "Vérifiez votre email",
                          desc: "L'audit arrive dans quelques minutes",
                        },
                        {
                          icon: Lightbulb,
                          label: "Consultez le plan",
                          desc: "Étapes recommandées personnalisées",
                        },
                        {
                          icon: Mail,
                          label: "Suivi gratuit",
                          desc: "Conseils réguliers par email",
                        },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <item.icon className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={resetForm} variant="outline">
                        Refaire le quiz
                      </Button>
                      <Button asChild>
                        <Link href="/">Retour à l&apos;accueil</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
