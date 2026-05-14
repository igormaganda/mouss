"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Code,
  Brain,
  Globe,
  Star,
  X,
  Plus,
  Check,
  Zap,
  Users,
  MessageCircle,
  Target,
  Lightbulb,
  TrendingUp,
  Shield,
  Award,
} from "lucide-react";

type SkillCategory = "technical" | "soft" | "languages";

interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
  category: SkillCategory;
}

interface SkillExtractorProps {
  initialSkills?: {
    technicalSkills: string[];
    softSkills: string[];
    languages: string[];
  };
  onConfirm?: (skills: Skill[]) => void;
  language?: "fr" | "ar";
}

const categoryConfig = {
  technical: {
    label: { fr: "Compétences Techniques", ar: "المهارات التقنية" },
    icon: Code,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  soft: {
    label: { fr: "Compétences Douces", ar: "المهارات الناعمة" },
    icon: Brain,
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-400",
  },
  languages: {
    label: { fr: "Langues", ar: "اللغات" },
    icon: Globe,
    color: "cyan",
    gradient: "from-cyan-500 to-purple-500",
    bgLight: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-cyan-800",
    text: "text-cyan-700 dark:text-cyan-400",
  },
};

const levelLabels = {
  fr: ["Débutant", "Intermédiaire", "Confirmé", "Expert", "Maître"],
  ar: ["مبتدئ", "متوسط", "متقدم", "خبير", "معلم"],
};

const translations = {
  fr: {
    title: "Vos Compétences Extraites",
    description: "Vérifiez et ajustez les compétences détectées dans votre CV",
    confirm: "Confirmer",
    addSkill: "Ajouter une compétence",
    skillPlaceholder: "Nouvelle compétence...",
    removeSkill: "Supprimer",
    levelLabel: "Niveau",
  },
  ar: {
    title: "مهاراتك المستخرجة",
    description: "تحقق من مهاراتك المكتشفة في سيرتك الذاتية وقم بتعديلها",
    confirm: "تأكيد",
    addSkill: "إضافة مهارة",
    skillPlaceholder: "مهارة جديدة...",
    removeSkill: "حذف",
    levelLabel: "المستوى",
  },
};

const softSkillIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  communication: MessageCircle,
  leadership: Users,
  "problem-solving": Target,
  creativity: Lightbulb,
  adaptability: TrendingUp,
  teamwork: Users,
  organization: Shield,
  default: Zap,
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function SkillExtractor({
  initialSkills,
  onConfirm,
  language = "fr",
}: SkillExtractorProps) {
  const t = translations[language];
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [newSkillInputs, setNewSkillInputs] = React.useState<Record<SkillCategory, string>>({
    technical: "",
    soft: "",
    languages: "",
  });

  // Initialize skills from props
  React.useEffect(() => {
    if (initialSkills) {
      const allSkills: Skill[] = [
        ...(initialSkills.technicalSkills || []).map((name) => ({
          id: generateId(),
          name,
          level: 3,
          category: "technical" as SkillCategory,
        })),
        ...(initialSkills.softSkills || []).map((name) => ({
          id: generateId(),
          name,
          level: 3,
          category: "soft" as SkillCategory,
        })),
        ...(initialSkills.languages || []).map((name) => ({
          id: generateId(),
          name,
          level: 3,
          category: "languages" as SkillCategory,
        })),
      ];
      setSkills(allSkills);
    }
  }, [initialSkills]);

  const getSkillsByCategory = (category: SkillCategory): Skill[] => {
    return skills.filter((s) => s.category === category);
  };

  const updateSkillLevel = (id: string, level: number) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, level: Math.min(5, Math.max(1, level)) } : s))
    );
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const addSkill = (category: SkillCategory) => {
    const name = newSkillInputs[category].trim();
    if (name && !skills.some((s) => s.name.toLowerCase() === name.toLowerCase() && s.category === category)) {
      setSkills((prev) => [
        ...prev,
        { id: generateId(), name, level: 3, category },
      ]);
      setNewSkillInputs((prev) => ({ ...prev, [category]: "" }));
    }
  };

  const handleConfirm = () => {
    onConfirm?.(skills);
  };

  const SkillLevelIndicator = ({ skill }: { skill: Skill }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => updateSkillLevel(skill.id, level)}
            className={cn(
              "w-6 h-6 rounded-full transition-all duration-200 flex items-center justify-center",
              "hover:scale-110 active:scale-95 min-w-[24px] min-h-[24px]",
              level <= skill.level
                ? `bg-gradient-to-r ${categoryConfig[skill.category].gradient} text-white shadow-md`
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            )}
            title={levelLabels[language][level - 1]}
          >
            {level <= skill.level && <Star className="w-3 h-3 fill-current" />}
          </button>
        ))}
      </div>
    );
  };

  const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
    const config = categoryConfig[skill.category];
    const Icon = skill.category === "soft" 
      ? softSkillIcons[skill.name.toLowerCase()] || softSkillIcons.default
      : config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          "group relative flex items-center gap-3 p-3 rounded-xl border transition-all",
          "hover:shadow-md",
          config.bgLight,
          config.border
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
          `bg-gradient-to-br ${config.gradient}`
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">{skill.name}</p>
          <p className="text-xs text-gray-500">
            {t.levelLabel}: {levelLabels[language][skill.level - 1]}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SkillLevelIndicator skill={skill} />
          <button
            onClick={() => removeSkill(skill.id)}
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "w-8 h-8 rounded-full flex items-center justify-center",
              "text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50",
              "min-w-[32px] min-h-[32px]"
            )}
            title={t.removeSkill}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  const CategorySection = ({ category }: { category: SkillCategory }) => {
    const config = categoryConfig[category];
    const Icon = config.icon;
    const categorySkills = getSkillsByCategory(category);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              `bg-gradient-to-br ${config.gradient}`
            )}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <h3 className={cn("font-semibold", config.text)}>
              {config.label[language]}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {categorySkills.length}
            </Badge>
          </div>
        </div>

        <div className="grid gap-2">
          <AnimatePresence mode="popLayout">
            {categorySkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </AnimatePresence>

          {/* Add Skill Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 mt-2"
          >
            <Input
              value={newSkillInputs[category]}
              onChange={(e) =>
                setNewSkillInputs((prev) => ({ ...prev, [category]: e.target.value }))
              }
              placeholder={t.skillPlaceholder}
              className={cn(
                "flex-1 min-h-[44px]",
                `focus-visible:ring-${config.color}-500/50`
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(category);
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => addSkill(category)}
              disabled={!newSkillInputs[category].trim()}
              className={cn(
                "min-w-[44px] min-h-[44px] px-3",
                `hover:bg-${config.color}-50 dark:hover:bg-${config.color}-950/50`,
                `hover:text-${config.color}-600 dark:hover:text-${config.color}-400`
              )}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-amber-500 to-purple-600 bg-clip-text text-transparent">
          {t.title}
        </CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {(["technical", "soft", "languages"] as SkillCategory[]).map((category) => (
          <CategorySection key={category} category={category} />
        ))}

        {/* Confirm Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleConfirm}
            disabled={skills.length === 0}
            className={cn(
              "w-full min-h-[52px] text-lg font-semibold gap-2",
              "bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500",
              "hover:from-emerald-600 hover:via-amber-600 hover:to-purple-600",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Check className="w-5 h-5" />
            {t.confirm}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export default SkillExtractor;
