"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Wand2,
  Loader2,
  RefreshCw,
  Save,
  Edit3,
  Rocket,
  Heart,
  Target,
  Trophy,
  Briefcase,
} from "lucide-react";
import type { CareerIdentityCardProps } from "./CareerIdentityCard";

interface CareerIdentityGeneratorProps {
  userId?: string;
  existingPepites?: {
    have: string[];
    want: string[];
  };
  existingSkills?: string[];
  onGenerated?: (identity: CareerIdentity) => void;
  language?: "fr" | "ar";
}

interface CareerIdentity {
  superPower: string;
  mission: string;
  values: string[];
  strengths: string[];
  rawAiAnalysis?: string;
}

interface ExperienceForm {
  achievements: string;
  challenges: string;
  passions: string;
  aspirations: string;
}

const translations = {
  fr: {
    title: "Générez votre Identité de Carrière",
    description: "Décrivez vos expériences et réalisations pour révéler votre super-pouvoir professionnel",
    form: {
      achievements: {
        label: "Vos plus grandes réalisations",
        placeholder: "Quelles sont les réalisations dont vous êtes le plus fier(e) ?",
        icon: Trophy,
      },
      challenges: {
        label: "Défis surmontés",
        placeholder: "Quels défis majeurs avez-vous surmontés dans votre carrière ?",
        icon: Target,
      },
      passions: {
        label: "Ce qui vous passionne",
        placeholder: "Qu'est-ce qui vous motive vraiment dans votre travail ?",
        icon: Heart,
      },
      aspirations: {
        label: "Vos aspirations futures",
        placeholder: "Où vous voyez-vous dans 5 ans ? Quel impact voulez-vous avoir ?",
        icon: Rocket,
      },
    },
    generateButton: "Générer mon identité de carrière",
    generating: "Génération en cours...",
    generated: "Identité générée !",
    regenerate: "Régénérer",
    edit: "Modifier",
    saveToProfile: "Sauvegarder",
    saved: "Sauvegardé !",
    loadingMessages: [
      "Analyse de vos expériences...",
      "Identification de vos talents uniques...",
      "Création de votre super-pouvoir...",
      "Finalisation de votre identité...",
    ],
  },
  ar: {
    title: "أنشئ هويتك المهنية",
    description: "صف خبراتك وإنجازاتك للكشف عن قوتك الخارقة المهنية",
    form: {
      achievements: {
        label: "أعظم إنجازاتك",
        placeholder: "ما هي الإنجازات التي تفخر بها أكثر؟",
        icon: Trophy,
      },
      challenges: {
        label: "التحديات التي تغلبت عليها",
        placeholder: "ما هي التحديات الرئيسية التي تغلبت عليها في مسيرتك المهنية؟",
        icon: Target,
      },
      passions: {
        label: "ما يثير شغفك",
        placeholder: "ما الذي يحفزك حقاً في عملك؟",
        icon: Heart,
      },
      aspirations: {
        label: "تطلعاتك المستقبلية",
        placeholder: "أين ترى نفسك بعد 5 سنوات؟ ما الأثر الذي تريد أن تحدثه؟",
        icon: Rocket,
      },
    },
    generateButton: "إنشاء هويتي المهنية",
    generating: "جاري الإنشاء...",
    generated: "تم إنشاء الهوية!",
    regenerate: "إعادة الإنشاء",
    edit: "تعديل",
    saveToProfile: "حفظ",
    saved: "تم الحفظ!",
    loadingMessages: [
      "تحليل خبراتك...",
      "تحديد مواهبك الفريدة...",
      "إنشاء قوتك الخارقة...",
      "إنهاء هويتك...",
    ],
  },
};

export function CareerIdentityGenerator({
  userId,
  existingPepites,
  existingSkills,
  onGenerated,
  language = "fr",
}: CareerIdentityGeneratorProps) {
  const t = translations[language];
  const [formData, setFormData] = React.useState<ExperienceForm>({
    achievements: "",
    challenges: "",
    passions: "",
    aspirations: "",
  });
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = React.useState(0);
  const [generatedIdentity, setGeneratedIdentity] = React.useState<CareerIdentity | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  // Animate loading messages
  React.useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % t.loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, t.loadingMessages.length]);

  const handleInputChange = (field: keyof ExperienceForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = React.useMemo(() => {
    return Object.values(formData).some((v) => v.trim().length > 0) ||
      (existingPepites?.have?.length ?? 0) > 0 ||
      (existingPepites?.want?.length ?? 0) > 0 ||
      (existingSkills?.length ?? 0) > 0;
  }, [formData, existingPepites, existingSkills]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedIdentity(null);

    try {
      const response = await fetch("/api/career-identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          pepitesHave: existingPepites?.have || [],
          pepitesWant: existingPepites?.want || [],
          skills: existingSkills || [],
          experience: `${formData.achievements}\n${formData.challenges}\n${formData.passions}`,
          aspirations: formData.aspirations ? [formData.aspirations] : [],
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate career identity");
      }

      const data = await response.json();
      setGeneratedIdentity(data.data);
      setIsEditing(false);
      onGenerated?.(data.data);
    } catch (error) {
      console.error("Error generating career identity:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedIdentity || !userId) return;
    setIsSaving(true);

    try {
      // In a real app, this would call an API to save to the user's profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error("Error saving career identity:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const FormField = ({
    field,
    icon: Icon,
    label,
    placeholder,
  }: {
    field: keyof ExperienceForm;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    placeholder: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Object.keys(formData).indexOf(field) * 0.1 }}
      className="space-y-2"
    >
      <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <Icon className="w-4 h-4 text-amber-500" />
        {label}
      </Label>
      <Textarea
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] resize-none focus-visible:ring-amber-500/50"
      />
    </motion.div>
  );

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      <CardHeader className="text-center pb-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 via-amber-500 to-rose-500 flex items-center justify-center"
        >
          <Wand2 className="w-8 h-8 text-white" />
        </motion.div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
          {t.title}
        </CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {!generatedIdentity || isEditing ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {Object.entries(t.form).map(([field, config]) => (
                <FormField
                  key={field}
                  field={field as keyof ExperienceForm}
                  icon={config.icon}
                  label={config.label}
                  placeholder={config.placeholder}
                />
              ))}

              {/* Generate Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleGenerate}
                  disabled={!isFormValid || isGenerating}
                  className={cn(
                    "w-full min-h-[52px] text-lg font-semibold gap-2",
                    "bg-gradient-to-r from-purple-500 via-amber-500 to-rose-500",
                    "hover:from-purple-600 hover:via-amber-600 hover:to-rose-600",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.generating}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      {t.generateButton}
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Generated Identity Display */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-amber-50 to-rose-50 dark:from-purple-950/30 dark:via-amber-950/30 dark:to-rose-950/30 border border-purple-200 dark:border-purple-800">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-amber-500 text-white px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t.generated}
                  </Badge>
                </div>

                <div className="mt-4 space-y-4">
                  {/* Super Power */}
                  <div className="text-center">
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                      {language === "fr" ? "Votre Super-Pouvoir" : "قوتك الخارقة"}
                    </p>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
                      {generatedIdentity.superPower}
                    </h3>
                  </div>

                  {/* Mission */}
                  <div className="text-center">
                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">
                      {language === "fr" ? "Votre Mission" : "مهمتك"}
                    </p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {generatedIdentity.mission}
                    </p>
                  </div>

                  {/* Values */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {generatedIdentity.values.map((value, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300"
                      >
                        {value}
                      </motion.span>
                    ))}
                  </div>

                  {/* Strengths */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {generatedIdentity.strengths.map((strength, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                      >
                        {strength}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="min-h-[44px] gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  {t.edit}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  className="min-h-[44px] gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t.regenerate}
                </Button>
                {userId && (
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || isSaved}
                    className={cn(
                      "min-h-[44px] gap-2",
                      "bg-gradient-to-r from-emerald-500 to-cyan-500",
                      "hover:from-emerald-600 hover:to-cyan-600"
                    )}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isSaved ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {t.saved}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {t.saveToProfile}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-10"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 via-amber-500 to-rose-500 flex items-center justify-center"
                >
                  <Wand2 className="w-10 h-10 text-white" />
                </motion.div>
                <motion.p
                  key={loadingMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-medium text-gray-700 dark:text-gray-300"
                >
                  {t.loadingMessages[loadingMessageIndex]}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default CareerIdentityGenerator;
