"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Sparkles,
  Download,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Target,
  Clock,
  Brain,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Building2,
  Briefcase,
  Zap,
  Award,
} from "lucide-react";

// ===========================================
// Types
// ===========================================

interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  suggestedAnswer: string;
  tips: string[];
}

interface InterviewPrepResult {
  questions: InterviewQuestion[];
  generalTips: string[];
  companyInsights: string;
  estimatedDuration: string;
}

interface TargetJob {
  id: string;
  title: string;
  company: string;
}

interface InterviewPrepProps {
  isOpen: boolean;
  onClose: () => void;
  targetJobs: TargetJob[];
  selectedJobId?: string;
  onGenerate: (jobId: string, options: GenerateOptions) => Promise<InterviewPrepResult>;
  language?: "fr" | "ar";
}

interface GenerateOptions {
  interviewType: "technical" | "behavioral" | "case" | "general";
}

// ===========================================
// Constants
// ===========================================

const INTERVIEW_TYPES = [
  {
    value: "general",
    label: "Général",
    labelAr: "عام",
    description: "Expérience, motivations, personnalité",
    descriptionAr: "الخبرة، الدوافع، الشخصية",
    icon: MessageSquare,
    color: "from-purple-500 to-purple-600",
  },
  {
    value: "technical",
    label: "Technique",
    labelAr: "تقني",
    description: "Compétences et résolution de problèmes",
    descriptionAr: "المهارات وحل المشكلات",
    icon: Brain,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    value: "behavioral",
    label: "Comportemental",
    labelAr: "سلوكي",
    description: "Méthode STAR (Situation, Tâche, Action, Résultat)",
    descriptionAr: "طريقة STAR",
    icon: Target,
    color: "from-amber-500 to-amber-600",
  },
  {
    value: "case",
    label: "Étude de cas",
    labelAr: "دراسة حالة",
    description: "Problèmes business à résoudre",
    descriptionAr: "مشاكل تجارية للحل",
    icon: Zap,
    color: "from-rose-500 to-rose-600",
  },
];

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Facile",
    labelAr: "سهل",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  medium: {
    label: "Moyen",
    labelAr: "متوسط",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  hard: {
    label: "Difficile",
    labelAr: "صعب",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  },
};

// ===========================================
// Practice Card Component (Flip Cards)
// ===========================================

interface PracticeCardProps {
  question: InterviewQuestion;
  currentIndex: number;
  totalQuestions: number;
  onNext: () => void;
  onPrev: () => void;
  language: "fr" | "ar";
}

function PracticeCard({
  question,
  currentIndex,
  totalQuestions,
  onNext,
  onPrev,
  language,
}: PracticeCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const difficultyConfig = DIFFICULTY_CONFIG[question.difficulty];

  return (
    <div className="relative w-full h-[400px] perspective-1000">
      <motion.div
        className="absolute inset-0"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front - Question */}
        <Card
          className="absolute inset-0 backface-hidden border-2 border-purple-200 dark:border-purple-800"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Badge className={difficultyConfig.color}>
                {language === "ar" ? difficultyConfig.labelAr : difficultyConfig.label}
              </Badge>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} / {totalQuestions}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant="outline" className="mb-2">
              {question.category}
            </Badge>
            <h3 className="text-lg font-semibold leading-relaxed">
              {question.question}
            </h3>
            <div className="absolute bottom-6 left-6 right-6">
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600"
                onClick={() => setIsFlipped(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {language === "ar" ? "عرض الإجابة" : "Voir la réponse"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back - Answer */}
        <Card
          className="absolute inset-0 backface-hidden border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {language === "ar" ? "الإجابة المقترحة" : "Réponse suggérée"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFlipped(false)}
              >
                <EyeOff className="w-4 h-4 mr-1" />
                {language === "ar" ? "إخفاء" : "Masquer"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[200px]">
              <p className="text-sm leading-relaxed">{question.suggestedAnswer}</p>
            </ScrollArea>

            {/* Tips */}
            {question.tips.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {language === "ar" ? "نصائح" : "Conseils"}
                  </span>
                </div>
                <ul className="space-y-1">
                  {question.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2"
                    >
                      <span className="text-amber-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onPrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {language === "ar" ? "السابق" : "Précédent"}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600"
                onClick={onNext}
              >
                {language === "ar" ? "التالي" : "Suivant"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ===========================================
// Main InterviewPrep Component
// ===========================================

export function InterviewPrep({
  isOpen,
  onClose,
  targetJobs,
  selectedJobId,
  onGenerate,
  language = "ar",
}: InterviewPrepProps) {
  const [step, setStep] = React.useState<"select" | "generate" | "practice" | "review">("select");
  const [selectedJob, setSelectedJob] = React.useState<string>(selectedJobId || "");
  const [interviewType, setInterviewType] = React.useState<string>("general");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [prepResult, setPrepResult] = React.useState<InterviewPrepResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [viewMode, setViewMode] = React.useState<"cards" | "list">("cards");

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep("select");
      setPrepResult(null);
      setCurrentQuestionIndex(0);
      if (selectedJobId) {
        setSelectedJob(selectedJobId);
      }
    }
  }, [isOpen, selectedJobId]);

  const handleGenerate = async () => {
    if (!selectedJob) return;

    setIsGenerating(true);
    try {
      const result = await onGenerate(selectedJob, {
        interviewType: interviewType as GenerateOptions["interviewType"],
      });
      setPrepResult(result);
      setStep("practice");
    } catch (error) {
      console.error("Failed to generate interview prep:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!prepResult) return;

    let content = `=== ${language === "ar" ? "دليل التحضير للمقابلة" : "Guide de préparation à l'entretien"} ===\n\n`;

    content += `${language === "ar" ? "المدة المقدرة" : "Durée estimée"}: ${prepResult.estimatedDuration}\n\n`;

    content += `=== ${language === "ar" ? "الأسئلة" : "Questions"} ===\n\n`;
    prepResult.questions.forEach((q, i) => {
      content += `${i + 1}. [${q.category}] (${q.difficulty})\n`;
      content += `   Q: ${q.question}\n`;
      content += `   R: ${q.suggestedAnswer}\n`;
      if (q.tips.length > 0) {
        content += `   Tips: ${q.tips.join(" | ")}\n`;
      }
      content += "\n";
    });

    content += `=== ${language === "ar" ? "نصائح عامة" : "Conseils généraux"} ===\n\n`;
    prepResult.generalTips.forEach((tip) => {
      content += `• ${tip}\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `preparation-entretien-${selectedJob}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const nextQuestion = () => {
    if (prepResult && currentQuestionIndex < prepResult.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              {language === "ar" ? "التحضير للمقابلة" : "Préparation à l'entretien"}
            </DialogTitle>
            <DialogDescription className="text-amber-100">
              {language === "ar"
                ? "تدرب على الأسئلة المحتملة مع إجابات مخصصة"
                : "Entraînez-vous avec des questions probables et des réponses personnalisées"}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {["select", "practice", "review"].map((s, i) => (
              <React.Fragment key={s}>
                <motion.div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                    step === s
                      ? "bg-white text-amber-600 font-medium"
                      : i < ["select", "practice", "review"].indexOf(step)
                      ? "bg-white/30"
                      : "bg-white/10"
                  )}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">
                    {s === "select"
                      ? language === "ar"
                        ? "اختر"
                        : "Sélection"
                      : s === "practice"
                      ? language === "ar"
                        ? "تدرب"
                        : "Pratique"
                      : language === "ar"
                      ? "مراجعة"
                      : "Révision"}
                  </span>
                </motion.div>
                {i < 2 && <ChevronRight className="w-4 h-4 opacity-50" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-200px)]">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Select Job & Type */}
              {step === "select" && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Job Selection */}
                  <div>
                    <h3 className="font-semibold mb-3">
                      {language === "ar" ? "اختر الوظيفة المستهدفة" : "Sélectionnez le poste ciblé"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {targetJobs.map((job) => (
                        <motion.button
                          key={job.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedJob(job.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            selectedJob === job.id
                              ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-amber-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-gray-500">{job.company}</p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Interview Type */}
                  <div>
                    <h3 className="font-semibold mb-3">
                      {language === "ar" ? "نوع المقابلة" : "Type d'entretien"}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {INTERVIEW_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                          <motion.button
                            key={type.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setInterviewType(type.value)}
                            className={cn(
                              "p-4 rounded-xl border-2 text-left transition-all",
                              interviewType === type.value
                                ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-amber-300"
                            )}
                          >
                            <div
                              className={cn(
                                "w-10 h-10 rounded-lg mb-2 flex items-center justify-center bg-gradient-to-br text-white",
                                type.color
                              )}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <p className="font-medium">
                              {language === "ar" ? type.labelAr : type.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              {language === "ar" ? type.descriptionAr : type.description}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={!selectedJob || isGenerating}
                      onClick={handleGenerate}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === "ar" ? "جاري الإنشاء..." : "Génération..."}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {language === "ar" ? "إنشاء الأسئلة" : "Générer les questions"}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Practice Mode */}
              {step === "practice" && prepResult && (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {/* Info Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-sm">
                          {prepResult.estimatedDuration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">
                          {prepResult.questions.length} {language === "ar" ? "أسئلة" : "questions"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        {viewMode === "cards"
                          ? language === "ar"
                            ? "قائمة"
                            : "Liste"
                          : language === "ar"
                          ? "بطاقات"
                          : "Cartes"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStep("review")}
                      >
                        <Award className="w-4 h-4 mr-1" />
                        {language === "ar" ? "نصائح" : "Conseils"}
                      </Button>
                    </div>
                  </div>

                  {/* Practice Cards */}
                  {viewMode === "cards" && (
                    <PracticeCard
                      question={prepResult.questions[currentQuestionIndex]}
                      currentIndex={currentQuestionIndex}
                      totalQuestions={prepResult.questions.length}
                      onNext={nextQuestion}
                      onPrev={prevQuestion}
                      language={language}
                    />
                  )}

                  {/* List View */}
                  {viewMode === "list" && (
                    <div className="space-y-4">
                      {prepResult.questions.map((q, i) => (
                        <Card key={i} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <Badge className={DIFFICULTY_CONFIG[q.difficulty].color}>
                                {language === "ar"
                                  ? DIFFICULTY_CONFIG[q.difficulty].labelAr
                                  : DIFFICULTY_CONFIG[q.difficulty].label}
                              </Badge>
                              <Badge variant="outline">{q.category}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <h4 className="font-medium">{q.question}</h4>
                            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                              <p className="text-sm">{q.suggestedAnswer}</p>
                            </div>
                            {q.tips.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {q.tips.map((tip, ti) => (
                                  <Badge
                                    key={ti}
                                    variant="outline"
                                    className="text-xs bg-amber-50 dark:bg-amber-900/20"
                                  >
                                    <Lightbulb className="w-3 h-3 mr-1" />
                                    {tip}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep("select")}>
                      {language === "ar" ? "رجوع" : "Retour"}
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-amber-500 to-orange-500"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {language === "ar" ? "تحميل PDF" : "Télécharger"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Tips */}
              {step === "review" && prepResult && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Company Insights */}
                  {prepResult.companyInsights && (
                    <Card className="border-amber-200 dark:border-amber-800">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-amber-500" />
                          {language === "ar" ? "رؤى عن الشركة" : "Insights sur l'entreprise"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-400">
                          {prepResult.companyInsights}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* General Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        {language === "ar" ? "نصائح عامة" : "Conseils généraux"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {prepResult.generalTips.map((tip, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                          >
                            <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                {i + 1}
                              </span>
                            </div>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep("practice")}>
                      {language === "ar" ? "رجوع للتدريب" : "Retour à la pratique"}
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-amber-500 to-orange-500"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {language === "ar" ? "تحميل PDF" : "Télécharger"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default InterviewPrep;
