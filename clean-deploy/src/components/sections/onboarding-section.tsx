"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Package,
  CheckCircle2,
  Mail,
  Loader2,
  Sparkles,
  Building2,
  Briefcase,
  GraduationCap,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

// ─── TUNNEL DATA ───────────────────────────────────────────────

const projectTypes = [
  { value: "freelance", label: "Freelance / Consulting", icon: Briefcase, desc: "Prestation de services, B2B" },
  { value: "commerce", label: "Commerce / E-commerce", icon: Building2, desc: "Vente en ligne ou boutique physique" },
  { value: "saas", label: "SaaS / Tech", icon: Zap, desc: "Application, plateforme digitale" },
  { value: "artisanat", label: "Artisanat / BTP", icon: Building2, desc: "Métier manuel, chantier" },
  { value: "restauration", label: "Restauration", icon: Building2, desc: "Restaurant, café, traiteur" },
  { value: "autre", label: "Autre projet", icon: Lightbulb, desc: "Service, formation, coaching..." },
];

const packOptions = [
  {
    value: "creer",
    name: "Créer",
    price: 9,
    oldPrice: 15,
    desc: "Statuts + immatriculation + KBIS",
    badge: null,
    color: "border-border",
    selectedColor: "border-primary bg-primary/5",
  },
  {
    value: "pro",
    name: "Pro",
    price: 29,
    oldPrice: 49,
    desc: "Tout Créer + domiciliation 3 mois + accompagnement",
    badge: "Populaire",
    color: "border-border",
    selectedColor: "border-primary bg-primary/5 shadow-lg shadow-primary/10",
  },
  {
    value: "premium",
    name: "Premium",
    price: 79,
    oldPrice: 129,
    desc: "Tout Pro + accompagnement téléphonique + BP + 12 mois",
    badge: "Complet",
    color: "border-border",
    selectedColor: "border-primary bg-primary/5",
  },
];

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

export function OnboardingSection() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedPack, setSelectedPack] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const totalSteps = 3;
  const selectedPackData = packOptions.find((p) => p.value === selectedPack);

  const canGoNext = () => {
    switch (step) {
      case 0: return selectedProject !== "";
      case 1: return selectedPack !== "";
      case 2: return email !== "" && email.includes("@");
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

  const handleSubmit = async () => {
    if (!canGoNext()) return;
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    toast.success("Demande envoyée ! Vous recevrez un email de confirmation.");
  };

  return (
    <section id="onboarding" className="py-16 sm:py-20 bg-gradient-to-b from-white via-muted/20 to-white border-t border-border/40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            3 étapes
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Lancez votre création en quelques clics
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Décrivez votre projet, choisissez votre pack et recevez votre KBIS en 48h.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Projet", "Pack", "Confirmation"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:inline ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
              {i < 2 && <div className={`w-8 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-8 shadow-sm min-h-[360px]">
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 0 — Project Type */}
            {step === 0 && (
              <motion.div
                key="step-0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">Quel est votre type de projet ?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cela nous aide à adapter les documents juridiques
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectTypes.map((pt) => (
                    <label
                      key={pt.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedProject === pt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedProject(pt.value)}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        selectedProject === pt.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        <pt.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{pt.label}</p>
                        <p className="text-xs text-muted-foreground">{pt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1 — Pack Selection */}
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">Choisissez votre pack</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Réduction de -40% pendant la période de lancement
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {packOptions.map((pack) => (
                    <label
                      key={pack.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPack === pack.value
                          ? pack.selectedColor
                          : `${pack.color} hover:border-primary/30`
                      }`}
                      onClick={() => setSelectedPack(pack.value)}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                        selectedPack === pack.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        <Package className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold">{pack.name}</p>
                          {pack.badge && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {pack.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{pack.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-2xl font-extrabold text-foreground">{pack.price}€</span>
                        <span className="block text-xs text-muted-foreground line-through">{pack.oldPrice}€</span>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Confirmation */}
            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">Confirmez votre demande</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Un expert vous contactera dans les 24h
                  </p>
                </div>

                {/* Summary */}
                <div className="rounded-xl bg-muted/50 p-4 mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Projet</span>
                    <span className="font-semibold">
                      {projectTypes.find((p) => p.value === selectedProject)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pack choisi</span>
                    <span className="font-semibold">
                      {selectedPackData?.name} — {selectedPackData?.price}€
                      {selectedPackData?.oldPrice && (
                        <span className="text-muted-foreground line-through ml-1">{selectedPackData.oldPrice}€</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      placeholder="jean@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Téléphone (optionnel)</label>
                    <Input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    En soumettant ce formulaire, vous acceptez notre{" "}
                    <a href="/politique-de-confidentialite" className="underline text-primary">
                      politique de confidentialité
                    </a>.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                className="gap-2 bg-primary hover:bg-primary/90 font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Confirmer ma demande
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
