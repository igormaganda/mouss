"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Briefcase,
  Coins,
  UserCircle,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Copy,
  Download,
  Loader2,
  Shield,
  Users,
  User,
  Pencil,
  ChevronRight,
  Scale,
  HeartHandshake,
  Lock,
  Ban,
  Eye,
  Home,
  Building,
  Coffee,
  Sprout,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProfileData {
  profile?: string;
  phase?: string;
  painPoint?: string;
}

type CompanyType =
  | "SASU"
  | "SAS"
  | "SARL"
  | "EURL"
  | "Micro-entreprise"
  | "Auto-entrepreneur";

type DomiciliationType =
  | "personnelle"
  | "bureau"
  | "coworking"
  | "pepiniere";

interface Associate {
  id: string;
  name: string;
  email: string;
  parts: number;
}

interface FormData {
  companyType: CompanyType | null;
  companyName: string;
  tradeName: string;
  acronym: string;
  address: string;
  postalCodeCity: string;
  domiciliationType: DomiciliationType | null;
  businessActivity: string;
  capital: number;
  capitalSuggestion: string;
  shareCount: number;
  nominalValue: number;
  associates: Associate[];
  directorName: string;
  directorBirthDate: string;
  directorAddress: string;
  directorNationality: string;
  directorRole: string;
  isFounder: boolean;
  clauses: {
    agreement: boolean;
    preemption: boolean;
    inalienability: boolean;
    exclusion: boolean;
    confidentiality: boolean;
  };
  customClauses: string;
}

const STORAGE_KEY = "statut-chatbot-formdata";

const DEFAULT_FORM_DATA: FormData = {
  companyType: null,
  companyName: "",
  tradeName: "",
  acronym: "",
  address: "",
  postalCodeCity: "",
  domiciliationType: null,
  businessActivity: "",
  capital: 1000,
  capitalSuggestion: "1000",
  shareCount: 100,
  nominalValue: 10,
  associates: [],
  directorName: "",
  directorBirthDate: "",
  directorAddress: "",
  directorNationality: "Française",
  directorRole: "",
  isFounder: true,
  clauses: {
    agreement: false,
    preemption: false,
    inalienability: false,
    exclusion: false,
    confidentiality: false,
  },
  customClauses: "",
};

const TOTAL_STEPS = 8;

// ---------------------------------------------------------------------------
// Company type definitions
// ---------------------------------------------------------------------------

interface CompanyTypeOption {
  type: CompanyType;
  name: string;
  description: string;
  associates: string;
  icon: LucideIcon;
  color: string;
}

const COMPANY_TYPES: CompanyTypeOption[] = [
  {
    type: "SASU",
    name: "SASU",
    description:
      "Société par Actions Simplifiée Unipersonnelle — idéal pour un créateur solo avec une grande souplesse de fonctionnement.",
    associates: "1 associé unique",
    icon: User,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    type: "SAS",
    name: "SAS",
    description:
      "Société par Actions Simplifiée — très flexible, adaptée aux projets innovants et aux startups.",
    associates: "2+ associés",
    icon: Users,
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    type: "SARL",
    name: "SARL",
    description:
      "Société à Responsabilité Limitée — structure classique et sécurisée pour les petits projets à plusieurs.",
    associates: "2-100 associés",
    icon: Shield,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    type: "EURL",
    name: "EURL",
    description:
      "Entreprise Unipersonnelle à Responsabilité Limitée — SARL à associé unique, statuts encadrés.",
    associates: "1 associé unique",
    icon: UserCircle,
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    type: "Micro-entreprise",
    name: "Micro-entreprise",
    description:
      "Régime simplifié sans création de personne morale — idéal pour tester une activité à faible risque.",
    associates: "1 personne",
    icon: Sparkles,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    type: "Auto-entrepreneur",
    name: "Auto-entrepreneur",
    description:
      "Régime micro-social simplifié — cotisations calculées sur le chiffre d'affaires réel.",
    associates: "1 personne",
    icon: HeartHandshake,
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

// ---------------------------------------------------------------------------
// Domiciliation options
// ---------------------------------------------------------------------------

interface DomiciliationOption {
  value: DomiciliationType;
  label: string;
  description: string;
  icon: LucideIcon;
}

const DOMICILIATION_OPTIONS: DomiciliationOption[] = [
  {
    value: "personnelle",
    label: "Domiciliation personnelle",
    description: "Votre résidence principale (jusqu'à 5 ans pour les auto-entrepreneurs)",
    icon: Home,
  },
  {
    value: "bureau",
    label: "Bureau / Local commercial",
    description: "Local professionnel dédié à votre activité",
    icon: Building,
  },
  {
    value: "coworking",
    label: "Espace de coworking",
    description: "Adresse de coworking avec contrat de domiciliation",
    icon: Coffee,
  },
  {
    value: "pepiniere",
    label: "Pépinière / Incubateur",
    description: "Structure d'accompagnement pour startups et entrepreneurs",
    icon: Sprout,
  },
];

// ---------------------------------------------------------------------------
// Step meta (labels + icons for progress)
// ---------------------------------------------------------------------------

const STEP_META: { label: string; icon: LucideIcon }[] = [
  { label: "Bienvenue", icon: HeartHandshake },
  { label: "Forme juridique", icon: Building2 },
  { label: "Dénomination", icon: FileText },
  { label: "Siège social", icon: MapPin },
  { label: "Objet social", icon: Briefcase },
  { label: "Capital", icon: Coins },
  { label: "Dirigeant", icon: UserCircle },
  { label: "Clauses", icon: Scale },
  { label: "Génération", icon: Sparkles },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StatutChatbot({
  profileData,
}: {
  profileData?: ProfileData;
}) {
  // ---- state ----------------------------------------------------------------
  const [currentStep, setCurrentStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>(() => {
    if (typeof window === "undefined") return DEFAULT_FORM_DATA;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormData>;
        return { ...DEFAULT_FORM_DATA, ...parsed };
      }
    } catch {
      /* ignore */
    }
    return DEFAULT_FORM_DATA;
  });
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedText, setGeneratedText] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [aiLoadingObjetSocial, setAiLoadingObjetSocial] =
    React.useState(false);

  // ---- persist to localStorage -----------------------------------------------
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      /* ignore quota errors */
    }
  }, [formData]);

  // ---- helpers ---------------------------------------------------------------
  const update = React.useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) =>
      setFormData((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const isMultiAssociate = (formData.companyType === "SAS" || formData.companyType === "SARL");

  const isActions =
    formData.companyType === "SAS" || formData.companyType === "SASU";

  const hasShareSection =
    !(
      formData.companyType === "Micro-entreprise" ||
      formData.companyType === "Auto-entrepreneur"
    );

  const progressValue =
    currentStep === 0 ? 0 : ((currentStep) / TOTAL_STEPS) * 100;

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return formData.companyType !== null;
      case 2:
        return formData.companyName.trim().length > 0;
      case 3:
        return (
          formData.address.trim().length > 0 &&
          formData.postalCodeCity.trim().length > 0 &&
          formData.domiciliationType !== null
        );
      case 4:
        return formData.businessActivity.trim().length > 0;
      case 5:
        if (!hasShareSection) return true;
        return formData.capital > 0 && formData.shareCount > 0;
      case 6:
        return (
          formData.directorName.trim().length > 0 &&
          formData.directorBirthDate.trim().length > 0 &&
          formData.directorNationality.trim().length > 0
        );
      case 7:
        return true;
      case 8:
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS && canProceed()) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const addAssociate = () => {
    const newAssociate: Associate = {
      id: crypto.randomUUID(),
      name: "",
      email: "",
      parts: 0,
    };
    update("associates", [...formData.associates, newAssociate]);
  };

  const updateAssociate = (id: string, field: keyof Associate, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      associates: prev.associates.map((a) =>
        a.id === id ? { ...a, [field]: value } : a,
      ),
    }));
  };

  const removeAssociate = (id: string) => {
    update(
      "associates",
      formData.associates.filter((a) => a.id !== id),
    );
  };

  // ---- AI objet social helper ------------------------------------------------
  const generateObjetSocial = async () => {
    if (formData.businessActivity.trim().length < 10) return;
    setAiLoadingObjetSocial(true);
    try {
      const res = await fetch("/api/statuts/refine-objet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.businessActivity,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.refined) {
          update("businessActivity", data.refined);
        }
      }
    } catch {
      /* silent fail */
    } finally {
      setAiLoadingObjetSocial(false);
    }
  };

  // ---- Generate statutes -----------------------------------------------------
  const generateStatuts = async () => {
    setIsGenerating(true);
    setGeneratedText("");
    try {
      const res = await fetch("/api/statuts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedText(data.statuts || "Erreur lors de la génération.");
      } else {
        setGeneratedText(
          "Une erreur est survenue lors de la génération des statuts. Veuillez réessayer.",
        );
      }
    } catch {
      setGeneratedText(
        "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statuts-${formData.companyName || "entreprise"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---- Capital suggestion helpers -------------------------------------------
  const handleCapitalSuggestion = (amount: number, label: string) => {
    update("capital", amount);
    update("capitalSuggestion", label);
  };

  // Recompute nominal value when capital or share count changes
  React.useEffect(() => {
    if (hasShareSection && formData.shareCount > 0 && formData.capital > 0) {
      const nv = Math.round((formData.capital / formData.shareCount) * 100) / 100;
      update("nominalValue", nv);
    }
  }, [formData.capital, formData.shareCount, hasShareSection]);

  // ---- Recommended company type from profile ---------------------------------
  const recommendedType = React.useMemo((): CompanyType | null => {
    if (!profileData?.profile && !profileData?.phase) return null;
    const p = profileData?.profile?.toLowerCase() || "";
    const phase = profileData?.phase?.toLowerCase() || "";
    if (p.includes("solo") || p.includes("seul") || phase.includes("validation"))
      return "SASU";
    if (p.includes("startup") || p.includes("innovation") || phase.includes("croissance"))
      return "SAS";
    if (p.includes("artisan") || p.includes("commerce") || phase.includes("lancement"))
      return "SARL";
    if (p.includes("test") || phase.includes("idée"))
      return "Micro-entreprise";
    return "SASU";
  }, [profileData]);

  // =========================================================================
  // STEP RENDERERS
  // =========================================================================

  // ---- Step 0: Welcome -----------------------------------------------------
  const renderWelcome = () => (
    <div className="space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg">
        <Scale className="h-8 w-8 text-white" />
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Créez vos statuts en quelques minutes
        </h2>
        <p className="mx-auto max-w-md text-muted-foreground">
          Notre assistant intelligent vous guide étape par étape pour rédiger
          des statuts juridiques adaptés à votre projet d&apos;entreprise.
        </p>
      </div>

      {recommendedType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="flex items-start gap-3 pt-6">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-900">
                  D&apos;après votre profil, nous recommandons
                </p>
                <Badge className="mt-1 bg-emerald-600 text-white hover:bg-emerald-700">
                  {recommendedType}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Shield, label: "Conforme au droit français" },
          { icon: Zap, label: "Génération en < 2 min" },
          { icon: CheckCircle2, label: "100% personnalisable" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 rounded-lg border bg-white p-3 text-sm text-muted-foreground"
          >
            <item.icon className="h-4 w-4 text-emerald-500" />
            {item.label}
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button
          size="lg"
          className="bg-emerald-600 text-white hover:bg-emerald-700 gap-2 px-8"
          onClick={goNext}
        >
          Commencer la rédaction
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // ---- Step 1: Company Type ------------------------------------------------
  const renderCompanyType = () => (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">
          Choisissez votre forme juridique
        </h2>
        <p className="text-sm text-muted-foreground">
          Sélectionnez la structure la plus adaptée à votre projet.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COMPANY_TYPES.map((ct) => {
          const isSelected = formData.companyType === ct.type;
          const isRec = recommendedType === ct.type;
          const Icon = ct.icon;
          return (
            <motion.button
              key={ct.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => update("companyType", ct.type)}
              className={cn(
                "relative flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all",
                isSelected
                  ? "border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20"
                  : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm",
              )}
            >
              {isRec && !isSelected && (
                <Badge className="absolute -top-2 right-2 bg-emerald-600 text-white text-[10px] px-1.5 py-0">
                  Recommandé
                </Badge>
              )}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  ct.color,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{ct.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                  {ct.description}
                </p>
              </div>
              <p className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {ct.associates}
              </p>
              {isSelected && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-emerald-600" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  // ---- Step 2: Company Name ------------------------------------------------
  const renderCompanyName = () => (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">
          Nom de votre entreprise
        </h2>
        <p className="text-sm text-muted-foreground">
          Choisissez un nom unique qui sera inscrit sur vos statuts et vos
          documents officiels.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">
            Dénomination sociale <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            placeholder="Ex : Dupont Consulting SAS"
            value={formData.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Nom officiel de la société, mentionné dans les statuts et au RCS.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tradeName">Nom commercial (optionnel)</Label>
          <Input
            id="tradeName"
            placeholder="Ex : Dupont & Co"
            value={formData.tradeName}
            onChange={(e) => update("tradeName", e.target.value)}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Nom sous lequel vous communiquez avec vos clients.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="acronym">Sigle (optionnel)</Label>
          <Input
            id="acronym"
            placeholder="Ex : DC"
            value={formData.acronym}
            onChange={(e) => update("acronym", e.target.value.toUpperCase())}
            maxLength={10}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Abréviation de la dénomination sociale.
          </p>
        </div>
      </div>
    </div>
  );

  // ---- Step 3: Registered Office -------------------------------------------
  const renderRegisteredOffice = () => (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Siège social</h2>
        <p className="text-sm text-muted-foreground">
          L&apos;adresse officielle de votre entreprise, qui figurera dans les
          statuts et au RCS.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">
            Adresse <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            placeholder="Ex : 15 rue de la Paix"
            value={formData.address}
            onChange={(e) => update("address", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCodeCity">
            Code postal & Ville <span className="text-red-500">*</span>
          </Label>
          <Input
            id="postalCodeCity"
            placeholder="Ex : 75002 Paris"
            value={formData.postalCodeCity}
            onChange={(e) => update("postalCodeCity", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label>Type de domiciliation</Label>
          <RadioGroup
            value={formData.domiciliationType || ""}
            onValueChange={(v) =>
              update("domiciliationType", v as DomiciliationType)
            }
            className="grid gap-2 sm:grid-cols-2"
          >
            {DOMICILIATION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <Label
                  key={opt.value}
                  htmlFor={`dom-${opt.value}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all",
                    formData.domiciliationType === opt.value
                      ? "border-emerald-500 bg-emerald-50/60"
                      : "border-gray-200 hover:border-emerald-300",
                  )}
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={`dom-${opt.value}`}
                  />
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium leading-tight">
                      {opt.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {opt.description}
                    </p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </div>
      </div>
    </div>
  );

  // ---- Step 4: Business Activity -------------------------------------------
  const renderBusinessActivity = () => (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Objet social</h2>
        <p className="text-sm text-muted-foreground">
          Décrivez précisément les activités de votre entreprise. Ce texte
          sera intégré dans vos statuts.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="businessActivity">
            Description de l&apos;activité <span className="text-red-500">*</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
            disabled={
              formData.businessActivity.trim().length < 10 || aiLoadingObjetSocial
            }
            onClick={generateObjetSocial}
          >
            {aiLoadingObjetSocial ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {aiLoadingObjetSocial ? "Optimisation..." : "Générer avec l'IA"}
          </Button>
        </div>
        <Textarea
          id="businessActivity"
          placeholder="Ex : La société a pour objet social : le conseil et la formation en management, l'édition de logiciels, la prestation de services informatiques, et plus généralement toutes opérations commerciales, industrielles ou financières, mobilières ou immobilières, se rapportant directement ou indirectement à l'objet social ou pouvant en faciliter l'extension ou le développement."
          value={formData.businessActivity}
          onChange={(e) => update("businessActivity", e.target.value)}
          className="min-h-[140px] resize-y"
        />
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <Eye className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Conseil :</strong> Soyez suffisamment large pour couvrir
            vos activités futures, mais assez précis pour être clair. Incluez
            une clause générale si nécessaire : &quot;et plus généralement,
            toutes opérations commerciales, industrielles, mobilières ou
            immobilières se rapportant à l&apos;objet social.&quot;
          </p>
        </div>
      </div>
    </div>
  );

  // ---- Step 5: Capital & Shares --------------------------------------------
  const renderCapital = () => {
    const capitalSuggestions = [
      { amount: 1000, label: "1 000 €" },
      { amount: 3000, label: "3 000 €" },
      { amount: 10000, label: "10 000 €" },
      { amount: 0, label: "Autre" },
    ];

    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">
            Capital social {isActions ? "& Actions" : "& Parts sociales"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {hasShareSection
              ? "Définissez le capital de départ et la répartition des titres."
              : "Pour votre forme juridique, il n'y a pas de capital social à définir. Passez à l'étape suivante."}
          </p>
        </div>

        {hasShareSection ? (
          <>
            {/* Capital amount */}
            <div className="space-y-3">
              <Label>Montant du capital social</Label>
              <div className="flex flex-wrap gap-2">
                {capitalSuggestions.map((s) => (
                  <Button
                    key={s.label}
                    type="button"
                    variant={
                      formData.capitalSuggestion === s.label && s.amount > 0
                        ? "default"
                        : "outline"
                    }
                    className={
                      formData.capitalSuggestion === s.label && s.amount > 0
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : ""
                    }
                    onClick={() => handleCapitalSuggestion(s.amount, s.label)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                min={1}
                placeholder="Montant en euros"
                value={
                  formData.capitalSuggestion === "Autre"
                    ? formData.capital || ""
                    : formData.capital
                }
                onChange={(e) => {
                  const val = Number(e.target.value);
                  update("capital", val > 0 ? val : 0);
                  if (
                    !capitalSuggestions.some(
                      (s) => s.amount === val && val > 0,
                    )
                  ) {
                    update("capitalSuggestion", "Autre");
                  }
                }}
                className="h-11 max-w-xs"
              />
            </div>

            <Separator />

            {/* Shares / Parts */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shareCount">
                  Nombre d&apos;{isActions ? "actions" : "parts sociales"}
                </Label>
                <Input
                  id="shareCount"
                  type="number"
                  min={1}
                  value={formData.shareCount || ""}
                  onChange={(e) =>
                    update("shareCount", Math.max(1, Number(e.target.value)))
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nominalValue">
                  Valeur nominale unitaire (€)
                </Label>
                <Input
                  id="nominalValue"
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={formData.nominalValue || ""}
                  readOnly
                  className="h-11 bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Calculé automatiquement
                </p>
              </div>
            </div>

            {/* Multi-associate section */}
            {isMultiAssociate && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Répartition des {isActions ? "actions" : "parts"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Ajoutez les associés et répartissez les{" "}
                        {isActions ? "actions" : "parts"} sociales.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      onClick={addAssociate}
                    >
                      <Users className="h-3.5 w-3.5" />
                      Ajouter un associé
                    </Button>
                  </div>

                  {formData.associates.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-muted-foreground">
                      Aucun associé supplémentaire ajouté.
                      <br />
                      Cliquez sur &quot;Ajouter un associé&quot; pour commencer.
                    </div>
                  ) : (
                    <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                      {formData.associates.map((assoc, idx) => (
                        <motion.div
                          key={assoc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-col gap-2 rounded-lg border bg-white p-3 sm:flex-row sm:items-end sm:gap-2"
                        >
                          <div className="flex-1 space-y-1">
                            <Label className="text-xs">
                              Nom de l&apos;associé {idx + 1}
                            </Label>
                            <Input
                              placeholder="Nom complet"
                              value={assoc.name}
                              onChange={(e) =>
                                updateAssociate(
                                  assoc.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Label className="text-xs">Email</Label>
                            <Input
                              type="email"
                              placeholder="email@exemple.fr"
                              value={assoc.email}
                              onChange={(e) =>
                                updateAssociate(
                                  assoc.id,
                                  "email",
                                  e.target.value,
                                )
                              }
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="w-full space-y-1 sm:w-24">
                            <Label className="text-xs">
                              {isActions ? "Actions" : "Parts"}
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              value={assoc.parts || ""}
                              onChange={(e) =>
                                updateAssociate(
                                  assoc.id,
                                  "parts",
                                  Number(e.target.value),
                                )
                              }
                              className="h-9 text-sm"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeAssociate(assoc.id)}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-emerald-500" />
            <p className="mt-2 font-medium text-emerald-900">
              Pas de capital social requis
            </p>
            <p className="mt-1 text-sm text-emerald-700/80">
              Le régime {formData.companyType} ne nécessite pas de définition
              de capital social dans les statuts.
            </p>
          </div>
        )}
      </div>
    );
  };

  // ---- Step 6: Director ----------------------------------------------------
  const renderDirector = () => {
    const isSASLike =
      formData.companyType === "SAS" || formData.companyType === "SASU";
    const isSARLLike =
      formData.companyType === "SARL" || formData.companyType === "EURL";

    const defaultRole = isSASLike
      ? "Président"
      : isSARLLike
        ? "Gérant"
        : "Dirigeant";

    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">
            Dirigeant{isMultiAssociate ? "s" : ""}
          </h2>
          <p className="text-sm text-muted-foreground">
            Informations sur le{isMultiAssociate ? "s" : ""} dirigeant{isMultiAssociate ? "s" : ""} de la société.
          </p>
        </div>

        <div className="space-y-4">
          {/* Role selection for SAS */}
          {isSASLike && (
            <div className="space-y-2">
              <Label>Fonction du dirigeant</Label>
              <RadioGroup
                value={formData.directorRole || defaultRole}
                onValueChange={(v) => update("directorRole", v)}
                className="flex gap-2"
              >
                <Label
                  htmlFor="role-president"
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2.5 transition-all",
                    formData.directorRole === "Président" ||
                      (!formData.directorRole && defaultRole === "Président")
                      ? "border-emerald-500 bg-emerald-50/60"
                      : "border-gray-200 hover:border-emerald-300",
                  )}
                >
                  <RadioGroupItem value="Président" id="role-president" />
                  <span className="text-sm font-medium">Président</span>
                </Label>
                <Label
                  htmlFor="role-dg"
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2.5 transition-all",
                    formData.directorRole === "Directeur Général"
                      ? "border-emerald-500 bg-emerald-50/60"
                      : "border-gray-200 hover:border-emerald-300",
                  )}
                >
                  <RadioGroupItem
                    value="Directeur Général"
                    id="role-dg"
                  />
                  <span className="text-sm font-medium">Directeur Général</span>
                </Label>
              </RadioGroup>
            </div>
          )}

          {isSARLLike && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-2.5">
              <Shield className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900">
                Pour votre {formData.companyType}, le dirigeant porte le titre
                de <strong>Gérant</strong>.
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="directorName">
                Nom complet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="directorName"
                placeholder="Prénom Nom"
                value={formData.directorName}
                onChange={(e) => update("directorName", e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="directorBirthDate">
                Date de naissance <span className="text-red-500">*</span>
              </Label>
              <Input
                id="directorBirthDate"
                type="date"
                value={formData.directorBirthDate}
                onChange={(e) =>
                  update("directorBirthDate", e.target.value)
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="directorNationality">
                Nationalité <span className="text-red-500">*</span>
              </Label>
              <Input
                id="directorNationality"
                placeholder="Ex : Française"
                value={formData.directorNationality}
                onChange={(e) =>
                  update("directorNationality", e.target.value)
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="directorAddress">Adresse personnelle</Label>
              <Input
                id="directorAddress"
                placeholder="Adresse du dirigeant"
                value={formData.directorAddress}
                onChange={(e) => update("directorAddress", e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isFounder"
              checked={formData.isFounder}
              onCheckedChange={(checked) =>
                update("isFounder", checked === true)
              }
              className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
            />
            <Label htmlFor="isFounder" className="cursor-pointer text-sm">
              Je suis également le fondateur de l&apos;entreprise
            </Label>
          </div>
        </div>
      </div>
    );
  };

  // ---- Step 7: Special Clauses ---------------------------------------------
  const renderClauses = () => {
    const clauseOptions = [
      {
        key: "agreement" as const,
        label: "Agrément des cessions de parts/actions",
        description:
          "Toute cession de titres doit être approuvée par les associés.",
        icon: CheckCircle2,
      },
      {
        key: "preemption" as const,
        label: "Clause de préemption",
        description:
          "Les associés prioritaires pour acheter les parts cédées.",
        icon: ArrowRight,
      },
      {
        key: "inalienability" as const,
        label: "Inaliénabilité temporaire",
        description:
          "Blocage temporaire de la cession des titres pendant une durée définie.",
        icon: Lock,
      },
      {
        key: "exclusion" as const,
        label: "Exclusion des associés",
        description:
          "Possibilité d'exclure un associé dans des conditions définies.",
        icon: Ban,
      },
      {
        key: "confidentiality" as const,
        label: "Engagement de confidentialité",
        description:
          "Les associés s'engagent à garder confidentielles les informations de la société.",
        icon: Eye,
      },
    ];

    const selectedCount = Object.values(formData.clauses).filter(Boolean).length;

    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">
            Clauses particulières
          </h2>
          <p className="text-sm text-muted-foreground">
            Ajoutez des clauses spécifiques pour protéger votre société.
            Ces clauses sont optionnelles.
            {selectedCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-emerald-100 text-emerald-800"
              >
                {selectedCount} sélectionnée{selectedCount > 1 ? "s" : ""}
              </Badge>
            )}
          </p>
        </div>

        <div className="space-y-2">
          {clauseOptions.map((clause) => {
            const Icon = clause.icon;
            const isChecked = formData.clauses[clause.key];
            return (
              <motion.div
                key={clause.key}
                whileTap={{ scale: 0.995 }}
              >
                <Label
                  htmlFor={`clause-${clause.key}`}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-all",
                    isChecked
                      ? "border-emerald-500 bg-emerald-50/60"
                      : "border-gray-200 hover:border-emerald-300",
                  )}
                >
                  <Checkbox
                    id={`clause-${clause.key}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        clauses: {
                          ...prev.clauses,
                          [clause.key]: checked === true,
                        },
                      }))
                    }
                    className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />
                  <Icon
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      isChecked ? "text-emerald-600" : "text-muted-foreground",
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium leading-tight text-gray-900">
                      {clause.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {clause.description}
                    </p>
                  </div>
                </Label>
              </motion.div>
            );
          })}
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="customClauses">
            Clauses personnalisées (optionnel)
          </Label>
          <Textarea
            id="customClauses"
            placeholder="Ajoutez vos propres clauses spécifiques ici..."
            value={formData.customClauses}
            onChange={(e) => update("customClauses", e.target.value)}
            className="min-h-[100px] resize-y"
          />
        </div>
      </div>
    );
  };

  // ---- Step 8: Review & Generate -------------------------------------------
  const renderReview = () => {
    const summarySections: {
      key: string;
      step: number;
      label: string;
      icon: LucideIcon;
      content: React.ReactNode;
    }[] = [
      {
        key: "companyType",
        step: 1,
        label: "Forme juridique",
        icon: Building2,
        content: formData.companyType ? (
          <Badge className="bg-emerald-600 text-white">
            {formData.companyType}
          </Badge>
        ) : (
          <span className="text-muted-foreground">Non défini</span>
        ),
      },
      {
        key: "names",
        step: 2,
        label: "Dénomination",
        icon: FileText,
        content: (
          <div className="space-y-1">
            <p className="font-medium">
              {formData.companyName || "—"}
            </p>
            {formData.tradeName && (
              <p className="text-sm text-muted-foreground">
                Nom commercial : {formData.tradeName}
              </p>
            )}
            {formData.acronym && (
              <p className="text-sm text-muted-foreground">
                Sigle : {formData.acronym}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "siege",
        step: 3,
        label: "Siège social",
        icon: MapPin,
        content: (
          <div className="space-y-1">
            <p className="font-medium">
              {formData.address}, {formData.postalCodeCity}
            </p>
            {formData.domiciliationType && (
              <p className="text-sm text-muted-foreground capitalize">
                {formData.domiciliationType === "personnelle"
                  ? "Domiciliation personnelle"
                  : formData.domiciliationType === "bureau"
                    ? "Bureau / Local commercial"
                    : formData.domiciliationType === "coworking"
                      ? "Espace de coworking"
                      : "Pépinière / Incubateur"}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "objet",
        step: 4,
        label: "Objet social",
        icon: Briefcase,
        content: (
          <p className="text-sm leading-relaxed line-clamp-3">
            {formData.businessActivity || "—"}
          </p>
        ),
      },
      ...(hasShareSection
        ? [
            {
              key: "capital",
              step: 5,
              label: "Capital social",
              icon: Coins,
              content: (
                <div className="space-y-1">
                  <p className="font-medium">
                    {formData.capital.toLocaleString("fr-FR")} €
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formData.shareCount} {isActions ? "actions" : "parts"} à{" "}
                    {formData.nominalValue.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    €
                  </p>
                  {formData.associates.length > 0 && (
                    <p className="text-sm text-emerald-700">
                      {formData.associates.length} associé
                      {formData.associates.length > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              ),
            },
          ]
        : []),
      {
        key: "director",
        step: 6,
        label: "Dirigeant",
        icon: UserCircle,
        content: (
          <div className="space-y-1">
            <p className="font-medium">{formData.directorName || "—"}</p>
            {formData.directorBirthDate && (
              <p className="text-sm text-muted-foreground">
                Né(e) le{" "}
                {new Date(formData.directorBirthDate).toLocaleDateString(
                  "fr-FR",
                )}
              </p>
            )}
            {formData.directorNationality && (
              <p className="text-sm text-muted-foreground">
                Nationalité : {formData.directorNationality}
              </p>
            )}
            {formData.directorRole && (
              <Badge variant="secondary">{formData.directorRole}</Badge>
            )}
          </div>
        ),
      },
      {
        key: "clauses",
        step: 7,
        label: "Clauses particulières",
        icon: Scale,
        content: (() => {
          const selected = Object.entries(formData.clauses)
            .filter(([, v]) => v)
            .map(([k]) => k);
          return selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((k) => (
                <Badge key={k} variant="outline" className="text-xs">
                  {k === "agreement" && "Agrément"}
                  {k === "preemption" && "Préemption"}
                  {k === "inalienability" && "Inaliénabilité"}
                  {k === "exclusion" && "Exclusion"}
                  {k === "confidentiality" && "Confidentialité"}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              Aucune clause supplémentaire
            </span>
          );
        })(),
      },
    ];

    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">
            Récapitulatif
          </h2>
          <p className="text-sm text-muted-foreground">
            Vérifiez les informations avant de générer vos statuts.
          </p>
        </div>

        {isGenerating ? (
          <div className="space-y-4 py-8">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Loader2 className="h-12 w-12 text-emerald-600" />
              </motion.div>
              <div className="space-y-1 text-center">
                <p className="font-semibold text-gray-900">
                  Rédaction de vos statuts en cours...
                </p>
                <p className="text-sm text-muted-foreground">
                  Notre IA analyse vos informations et génère un document
                  conforme au droit français.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
          </div>
        ) : generatedText ? (
          /* Success state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900">
                Vos statuts ont été générés avec succès !
              </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Statuts — {formData.companyName}
                </h3>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-xs"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? "Copié" : "Copier"}
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-1 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                    onClick={handleDownload}
                  >
                    <Download className="h-3 w-3" />
                    Télécharger
                  </Button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto rounded-md border bg-gray-50 p-4 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                {generatedText}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-1"
              onClick={() => {
                setGeneratedText("");
              }}
            >
              <Pencil className="h-4 w-4" />
              Modifier les informations et régénérer
            </Button>
          </motion.div>
        ) : (
          /* Summary view */
          <>
            <div className="space-y-2">
              {summarySections.map((section) => {
                const Icon = section.icon;
                return (
                  <div
                    key={section.key}
                    className="group flex items-start gap-3 rounded-lg border bg-white p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      <Icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {section.label}
                      </p>
                      <div className="mt-0.5">{section.content}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => goToStep(section.step)}
                    >
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <Separator />

            <Button
              size="lg"
              className="w-full gap-2 bg-emerald-600 py-6 text-base font-semibold text-white hover:bg-emerald-700"
              onClick={generateStatuts}
            >
              <Sparkles className="h-5 w-5" />
              Générer mes statuts avec l&apos;IA
            </Button>
          </>
        )}
      </div>
    );
  };

  // =========================================================================
  // MAIN RENDER
  // =========================================================================

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderWelcome();
      case 1:
        return renderCompanyType();
      case 2:
        return renderCompanyName();
      case 3:
        return renderRegisteredOffice();
      case 4:
        return renderBusinessActivity();
      case 5:
        return renderCapital();
      case 6:
        return renderDirector();
      case 7:
        return renderClauses();
      case 8:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress section */}
      {currentStep > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 1}
              className={cn(
                "flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-gray-900",
                currentStep === 1 && "pointer-events-none opacity-0",
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
            <span className="text-xs font-medium text-muted-foreground">
              Étape {currentStep} sur {TOTAL_STEPS}
            </span>
          </div>

          <Progress
            value={progressValue}
            className="h-2 [&>[data-slot=progress-indicator]]:bg-emerald-600"
          />

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {STEP_META.slice(1).map((step, idx) => {
              const stepNum = idx + 1;
              const StepIcon = step.icon;
              const isActive = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              return (
                <button
                  key={stepNum}
                  type="button"
                  onClick={() => goToStep(stepNum)}
                  className="group flex flex-col items-center gap-1"
                  aria-label={`Aller à l'étape ${step.label}`}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full transition-all",
                      isActive
                        ? "bg-emerald-600 text-white shadow-md"
                        : isCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-400 group-hover:bg-gray-200",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <StepIcon className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden text-[10px] leading-tight sm:block",
                      isActive
                        ? "font-semibold text-emerald-700"
                        : isCompleted
                          ? "text-emerald-600"
                          : "text-gray-400",
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step content */}
      <Card className="border-gray-200/80 shadow-lg overflow-hidden">
        <CardContent className="p-5 sm:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        {/* Footer nav */}
        {currentStep > 0 && currentStep < TOTAL_STEPS && (
          <CardFooter className="flex justify-between border-t bg-gray-50/50 px-5 py-4 sm:px-8">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>
            <Button
              type="button"
              onClick={goNext}
              disabled={!canProceed()}
              className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {currentStep === TOTAL_STEPS - 1
                ? "Voir le récapitulatif"
                : "Suivant"}
              {currentStep === TOTAL_STEPS - 1 ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        )}

        {currentStep === TOTAL_STEPS && !generatedText && !isGenerating && (
          <CardFooter className="border-t bg-gray-50/50 px-5 py-4 sm:px-8">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="w-full gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Modifier les informations
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Trust bar */}
      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Données chiffrées
          </span>
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Conforme droit français
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            RGPD
          </span>
        </div>
      </div>
    </div>
  );
}
