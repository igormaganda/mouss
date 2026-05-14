"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mail,
  User,
  Briefcase,
  Lightbulb,
  Loader2,
  ShieldCheck,
  Search,
  FileText,
  Building2,
  Zap,
  AlertTriangle,
  Star,
  ExternalLink,
  Eye,
  EyeOff,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import type { AuditResult, ToolRecommendation } from "@/lib/audit-engine";
import { SECTORS } from "@/lib/audit-engine";

// ─── PROFILE OPTIONS ──────────────────────────────────────────

const profileOptions = [
  { value: "etudiant", label: "Étudiant Entrepreneur", icon: User, description: "Étudier et entreprendre en parallèle" },
  { value: "salarie", label: "Salarié en Transition", icon: Briefcase, description: "Sécuriser le lancement avant de quitter" },
  { value: "freelance", label: "Freelance / Auto-entrepreneur", icon: Lightbulb, description: "Simplicité et gratuité pour démarrer" },
  { value: "tpe-pme", label: "TPE / PME", icon: Building2, description: "Gestion d'équipe et flux complexes" },
];

// ─── PHASE OPTIONS ────────────────────────────────────────────

const phaseOptions = [
  { value: "reflexion", label: "Réflexion (J1–J15)", description: "Je cherche mon idée ou valide mon business model", icon: Search },
  { value: "creation", label: "Création (J31–J60)", description: "Je lance les démarches administratives", icon: Zap },
  { value: "gestion", label: "Gestion (J61–J80)", description: "J'optimise mon organisation et ma compta", icon: ClipboardCheck },
  { value: "croissance", label: "Croissance (J81–J100)", description: "Je veux accélérer mon impact", icon: Star },
];

// ─── PAIN POINT OPTIONS ───────────────────────────────────────

const painPointOptions = [
  { value: "administratif", label: "Perdu dans l'administratif", icon: FileText },
  { value: "frais-bancaires", label: "Frais bancaires trop élevés", icon: Building2 },
  { value: "compta", label: "Pas le temps pour la compta", icon: ClipboardCheck },
  { value: "juridique", label: "Risques juridiques", icon: ShieldCheck },
  { value: "risques", label: "Couverture assurance insuffisante", icon: ShieldCheck },
  { value: "visibilite", label: "Manque de visibilité / clients", icon: Star },
  { value: "financement", label: "Besoin de financement", icon: Zap },
  { value: "autre", label: "Autre préoccupation", icon: Lightbulb },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

// ─── MAIN COMPONENT ───────────────────────────────────────────

export function AuditSection() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    profile: "",
    sector: "",
    phase: "",
    painPoints: [] as string[],
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    projectName: "",
    password: "",
    consent: true,
  });

  const totalSteps = 5;

  const selectedSector = SECTORS.find((s) => s.value === formData.sector);
  const isRegulated = selectedSector?.regulated || false;

  const canGoNext = () => {
    switch (step) {
      case 0: return formData.profile !== "";
      case 1: return formData.sector !== "";
      case 2: return formData.phase !== "";
      case 3: return formData.painPoints.length > 0;
      case 4: return formData.email !== "" && formData.email.includes("@") && formData.firstName !== "";
      default: return false;
    }
  };

  const goNext = () => {
    if (step < totalSteps - 1 && canGoNext()) {
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

  const togglePainPoint = (value: string) => {
    setFormData((prev) => {
      const updated = prev.painPoints.includes(value)
        ? prev.painPoints.filter((p) => p !== value)
        : [...prev.painPoints, value];
      return { ...prev, painPoints: updated };
    });
  };

  const handleSubmit = async () => {
    if (!canGoNext()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erreur lors de l'envoi");
      }

      const data = await res.json();
      setAuditResult(data.auditResult);
      toast.success("Audit généré avec succès !");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canGoNext() && step < totalSteps - 1) goNext();
    if (e.key === "Enter" && step === totalSteps - 1 && canGoNext()) handleSubmit();
  };

  const resetForm = () => {
    setStep(0);
    setAuditResult(null);
    setFormData({
      profile: "",
      sector: "",
      phase: "",
      painPoints: [],
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      projectName: "",
      password: "",
      consent: true,
    });
    setOpen(false);
  };

  const handleToolClick = (tool: ToolRecommendation) => {
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolSlug: tool.slug }),
    }).catch(() => {});
    window.open(tool.affiliateUrl || tool.website, "_blank");
  };

  // ─── STEP LABELS ──────────────────────────────────────────

  const stepLabels = ["Profil", "Secteur", "Phase", "Besoins", "Contact"];

  return (
    <section id="audit" className="py-10 sm:py-14 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Gratuit & Personnalisé
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Générez votre Audit de Lancement Gratuit
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed">
            En 2 minutes, recevez des recommandations personnalisées avec
            des outils cliquables adaptés à votre profil et votre secteur.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12">
          {[
            { icon: ClipboardCheck, title: "Analyse personnalisée", desc: "Profil + secteur réglementé" },
            { icon: Sparkles, title: "Outils affiliés cliquables", desc: "Banque + Compta + Assurance" },
            { icon: Mail, title: "Rapport PDF complet", desc: "Recevez votre audit par email" },
          ].map((feat) => (
            <div key={feat.title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{feat.title}</p>
                <p className="text-xs text-muted-foreground">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Dialog */}
        <div className="flex justify-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 font-semibold text-base px-10 h-14 shadow-lg shadow-primary/20"
              >
                <ClipboardCheck className="h-5 w-5" />
                Commencer mon audit gratuit
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh]">
              <DialogHeader className="sr-only">
                <DialogTitle>Audit de Lancement Personnalisé</DialogTitle>
                <DialogDescription>Répondez à 5 questions pour recevoir votre audit complet avec recommandations</DialogDescription>
              </DialogHeader>

              <AnimatePresence mode="wait" custom={direction}>
                {!auditResult ? (
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    onKeyDown={handleKeyDown}
                    className="overflow-y-auto max-h-[85vh]"
                  >
                    {/* Progress */}
                    <div className="bg-muted px-6 pt-5 pb-3 sticky top-0 z-10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {stepLabels[step]}
                        </span>
                        <span className="text-xs font-medium text-primary">
                          {Math.round(((step + 1) / totalSteps) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    <div className="p-6">
                      {/* STEP 0 — Profile */}
                      {step === 0 && (
                        <div className="space-y-4">
                          <div className="text-center mb-6">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
                              <User className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Quel est votre profil ?</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Cela nous aide à adapter nos recommandations
                            </p>
                          </div>
                          <RadioGroup
                            value={formData.profile}
                            onValueChange={(val) => setFormData({ ...formData, profile: val })}
                            className="space-y-3"
                          >
                            {profileOptions.map((opt) => (
                              <label
                                key={opt.value}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  formData.profile === opt.value
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                                }`}
                              >
                                <RadioGroupItem value={opt.value} />
                                <opt.icon className="h-5 w-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold">{opt.label}</p>
                                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                                </div>
                              </label>
                            ))}
                          </RadioGroup>
                        </div>
                      )}

                      {/* STEP 1 — Sector */}
                      {step === 1 && (
                        <div className="space-y-4">
                          <div className="text-center mb-6">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
                              <Building2 className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Quel est votre secteur d&apos;activité ?</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Certains secteurs nécessitent des démarches spécifiques
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {SECTORS.map((sector) => (
                              <label
                                key={sector.value}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                  formData.sector === sector.value
                                    ? "border-primary bg-primary/5"
                                    : sector.regulated
                                      ? "border-rose-200 hover:border-rose-300 hover:bg-rose-50/50"
                                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                                }`}
                              >
                                <RadioGroupItem value={sector.value} />
                                <span className="text-xl">{sector.icon}</span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold leading-tight">{sector.label}</p>
                                  {sector.regulated && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 mt-0.5 border-rose-300 text-rose-600">
                                      Réglementé
                                    </Badge>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>

                          {/* Régulated warning */}
                          {isRegulated && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4"
                            >
                              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-rose-700">Secteur réglementé</p>
                                <p className="text-xs text-rose-600 mt-1">
                                  Ce secteur nécessite des diplômes, autorisations ou assurances spécifiques.
                                  Votre audit inclura les démarches obligatoires et les outils adaptés.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* STEP 2 — Phase */}
                      {step === 2 && (
                        <div className="space-y-4">
                          <div className="text-center mb-6">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
                              <Zap className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Où en êtes-vous dans votre projet ?</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Sélectionnez la phase qui correspond le mieux
                            </p>
                          </div>
                          <RadioGroup
                            value={formData.phase}
                            onValueChange={(val) => setFormData({ ...formData, phase: val })}
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
                                <RadioGroupItem value={opt.value} className="mt-0.5" />
                                <div>
                                  <p className="text-sm font-semibold">{opt.label}</p>
                                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                                </div>
                              </label>
                            ))}
                          </RadioGroup>
                        </div>
                      )}

                      {/* STEP 3 — Pain Points (multi-select) */}
                      {step === 3 && (
                        <div className="space-y-4">
                          <div className="text-center mb-6">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
                              <ClipboardCheck className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Vos plus grandes difficultés ?</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Choisissez tous les sujets qui vous concernent
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {painPointOptions.map((opt) => (
                              <label
                                key={opt.value}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                  formData.painPoints.includes(opt.value)
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                                }`}
                              >
                                <Checkbox
                                  checked={formData.painPoints.includes(opt.value)}
                                  onCheckedChange={() => togglePainPoint(opt.value)}
                                />
                                <opt.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                                <p className="text-xs font-medium">{opt.label}</p>
                              </label>
                            ))}
                          </div>
                          <p className="text-xs text-center text-muted-foreground">
                            {formData.painPoints.length} sélectionné{formData.painPoints.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      )}

                      {/* STEP 4 — Contact + Optional Account Creation */}
                      {step === 4 && (
                        <div className="space-y-5">
                          <div className="text-center mb-6">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
                              <Mail className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Recevez votre audit personnalisé</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Rapport PDF avec outils cliquables et recommandations
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom *</Label>
                                <Input
                                  id="firstName"
                                  placeholder="Jean"
                                  value={formData.firstName}
                                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input
                                  id="lastName"
                                  placeholder="Dupont"
                                  value={formData.lastName}
                                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="jean@exemple.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phone">Téléphone (optionnel)</Label>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="06 12 34 56 78"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="projectName">Nom de votre projet (optionnel)</Label>
                              <Input
                                id="projectName"
                                placeholder="Mon projet de..."
                                value={formData.projectName}
                                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                              />
                            </div>

                            {/* Frictionless account creation */}
                            <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-4 w-4 text-primary" />
                                <Label htmlFor="password" className="text-sm font-semibold">
                                  Créer votre compte gratuitement
                                </Label>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3">
                                Ajoutez un mot de passe pour suivre votre audit dans votre espace personnel.
                                Sans mot de passe, vous recevrez uniquement votre rapport par email.
                              </p>
                              <div className="relative">
                                <Input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Mot de passe (optionnel)"
                                  value={formData.password}
                                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                  className="pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground leading-relaxed">
                              En soumettant ce formulaire, vous acceptez de recevoir vos recommandations personnalisées.
                              Vos données sont protégées conformément à notre{' '}
                              <a href="/politique-de-confidentialite" className="underline text-primary">politique de confidentialité</a>.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between mt-8 pt-4 border-t">
                        {step > 0 ? (
                          <Button variant="ghost" onClick={goPrev} className="gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            Précédent
                          </Button>
                        ) : (
                          <div />
                        )}

                        {step < totalSteps - 1 ? (
                          <Button onClick={goNext} disabled={!canGoNext()} className="gap-1">
                            Suivant
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
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
                    </div>
                  </motion.div>
                ) : (
                  /* ─── AUDIT RESULT SCREEN ─── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 overflow-y-auto max-h-[85vh]"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-3">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">Audit généré avec succès !</h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Rapport envoyé à <strong className="text-foreground">{formData.email}</strong>
                      </p>
                    </div>

                    {/* Score */}
                    <div className="flex justify-center mb-6">
                      <div className="text-center">
                        <div className={`text-5xl font-bold ${
                          auditResult.scoreColor === "emerald" ? "text-emerald-500" :
                          auditResult.scoreColor === "amber" ? "text-amber-500" :
                          auditResult.scoreColor === "orange" ? "text-orange-500" : "text-rose-500"
                        }`}>
                          {auditResult.score}/100
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{auditResult.scoreLabel}</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 justify-center mb-6">
                      <Badge variant="secondary">
                        {profileOptions.find((p) => p.value === formData.profile)?.label}
                      </Badge>
                      <Badge variant="secondary">{selectedSector?.label}</Badge>
                      {isRegulated && (
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Réglementé
                        </Badge>
                      )}
                      <Badge variant="secondary">
                        {phaseOptions.find((p) => p.value === formData.phase)?.label}
                      </Badge>
                    </div>

                    {/* Savings */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-center">
                      <p className="text-sm font-semibold text-emerald-700">
                        💰 Économies estimées : {auditResult.estimatedSavings}
                      </p>
                    </div>

                    {/* Regulatory Warning */}
                    {auditResult.isRegulated && auditResult.regulatedWarning && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-rose-500" />
                          <p className="text-sm font-semibold text-rose-700">
                            {auditResult.regulatedWarning.profession} — Secteur réglementé
                          </p>
                        </div>
                        <ul className="text-xs text-rose-600 space-y-1">
                          {auditResult.regulatedWarning.requirements.slice(0, 3).map((req, i) => (
                            <li key={i}>✓ {req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Priority Recommendations */}
                    {auditResult.recommendations.prioritaires.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm font-bold mb-3 text-rose-600">
                          🔴 Recommandations prioritaires
                        </p>
                        <div className="space-y-2">
                          {auditResult.recommendations.prioritaires.slice(0, 3).map((tool) => (
                            <button
                              key={tool.slug}
                              onClick={() => handleToolClick(tool)}
                              className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 transition-colors text-left"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{tool.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{tool.pricing}</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-rose-400 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Essential Recommendations */}
                    {auditResult.recommendations.essentielles.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm font-bold mb-3 text-primary">
                          🟢 Outils essentiels
                        </p>
                        <div className="space-y-2">
                          {auditResult.recommendations.essentielles.slice(0, 3).map((tool) => (
                            <button
                              key={tool.slug}
                              onClick={() => handleToolClick(tool)}
                              className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-white hover:bg-muted/50 transition-colors text-left"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{tool.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{tool.pricing}</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2 mt-6 pt-4 border-t">
                      {formData.password && (
                        <Button
                          className="w-full gap-2 bg-primary hover:bg-primary/90"
                          onClick={() => {
                            resetForm();
                            window.location.href = "/dashboard/audit";
                          }}
                        >
                          <ClipboardCheck className="h-4 w-4" />
                          Voir le rapport complet dans mon espace
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => {
                          fetch("/api/audit/pdf", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: formData.email }),
                          }).then((res) => {
                            if (res.ok) return res.text();
                            throw new Error();
                          }).then((html) => {
                            const win = window.open("", "_blank");
                            if (win) {
                              win.document.write(html);
                              win.document.close();
                              toast.success("Rapport ouvert ! Utilisez Ctrl+P pour sauvegarder en PDF.");
                            }
                          }).catch(() => {
                            toast.error("Erreur lors de la génération du rapport");
                          });
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Télécharger le rapport (PDF)
                      </Button>
                      <Button variant="ghost" className="w-full" onClick={resetForm}>
                        Fermer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
