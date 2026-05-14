"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  Edit2,
  Check,
  Loader2,
  Briefcase,
  Building2,
  Mail,
  User,
  ChevronRight,
  X,
} from "lucide-react";

// ===========================================
// Types
// ===========================================

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location?: string;
}

interface CoverLetterData {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
  signature: string;
  fullLetter: string;
}

interface CoverLetterGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  savedJobs: SavedJob[];
  selectedJobId?: string;
  userBackground?: {
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    experience?: string;
  };
  onGenerate: (jobId: string, options: GenerateOptions) => Promise<CoverLetterData>;
  language?: "fr" | "ar";
}

interface GenerateOptions {
  tone: "professional" | "enthusiastic" | "creative";
  customPoints: string[];
}

// ===========================================
// Tone Selection Component
// ===========================================

const TONES = [
  {
    value: "professional",
    label: "Professionnel",
    labelAr: "احترافي",
    description: "Formel et respectueux",
    descriptionAr: "رسمي ومحترم",
    color: "from-purple-500 to-purple-600",
  },
  {
    value: "enthusiastic",
    label: "Enthousiaste",
    labelAr: "متحمس",
    description: "Passionné et dynamique",
    descriptionAr: "شغوب وديناميكي",
    color: "from-amber-500 to-orange-500",
  },
  {
    value: "creative",
    label: "Créatif",
    labelAr: "إبداعي",
    description: "Original et mémorable",
    descriptionAr: "أصلي ولا يُنسى",
    color: "from-cyan-500 to-emerald-500",
  },
];

function ToneSelector({
  value,
  onChange,
  language,
}: {
  value: string;
  onChange: (value: string) => void;
  language: "fr" | "ar";
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TONES.map((tone) => (
        <motion.button
          key={tone.value}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(tone.value)}
          className={cn(
            "relative p-3 rounded-xl border-2 transition-all text-left",
            value === tone.value
              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
          )}
        >
          {value === tone.value && (
            <motion.div
              layoutId="tone-indicator"
              className={cn(
                "absolute inset-0 rounded-xl bg-gradient-to-br opacity-10",
                tone.color
              )}
            />
          )}
          <div
            className={cn(
              "w-8 h-8 rounded-lg mb-2 flex items-center justify-center bg-gradient-to-br text-white",
              tone.color
            )}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="font-medium text-sm">
            {language === "ar" ? tone.labelAr : tone.label}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === "ar" ? tone.descriptionAr : tone.description}
          </p>
        </motion.button>
      ))}
    </div>
  );
}

// ===========================================
// Main CoverLetterGenerator Component
// ===========================================

export function CoverLetterGenerator({
  isOpen,
  onClose,
  savedJobs,
  selectedJobId,
  userBackground,
  onGenerate,
  language = "fr",
}: CoverLetterGeneratorProps) {
  const [step, setStep] = React.useState<"select" | "customize" | "preview">("select");
  const [selectedJob, setSelectedJob] = React.useState<string>(selectedJobId || "");
  const [tone, setTone] = React.useState<string>("professional");
  const [customPoints, setCustomPoints] = React.useState<string[]>([]);
  const [newPoint, setNewPoint] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [coverLetter, setCoverLetter] = React.useState<CoverLetterData | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedLetter, setEditedLetter] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep("select");
      setCoverLetter(null);
      setIsEditing(false);
      setCustomPoints([]);
      if (selectedJobId) {
        setSelectedJob(selectedJobId);
        setStep("customize");
      }
    }
  }, [isOpen, selectedJobId]);

  const handleGenerate = async () => {
    if (!selectedJob) return;

    setIsGenerating(true);
    try {
      const result = await onGenerate(selectedJob, {
        tone: tone as GenerateOptions["tone"],
        customPoints,
      });
      setCoverLetter(result);
      setEditedLetter(result.fullLetter);
      setStep("preview");
    } catch (error) {
      console.error("Failed to generate cover letter:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(isEditing ? editedLetter : coverLetter.fullLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!coverLetter) return;

    const content = isEditing ? editedLetter : coverLetter.fullLetter;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lettre-motivation-${selectedJob}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addCustomPoint = () => {
    if (newPoint.trim()) {
      setCustomPoints([...customPoints, newPoint.trim()]);
      setNewPoint("");
    }
  };

  const removeCustomPoint = (index: number) => {
    setCustomPoints(customPoints.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              {language === "ar" ? "مولد رسالة التقديم" : "Générateur de lettre de motivation"}
            </DialogTitle>
            <DialogDescription className="text-purple-100">
              {language === "ar"
                ? "أنشئ رسالة تقديم مخصصة في ثوانٍ"
                : "Créez une lettre de motivation personnalisée en quelques secondes"}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {["select", "customize", "preview"].map((s, i) => (
              <React.Fragment key={s}>
                <motion.div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                    step === s
                      ? "bg-white text-purple-600 font-medium"
                      : i < ["select", "customize", "preview"].indexOf(step)
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
                      : s === "customize"
                      ? language === "ar"
                        ? "خصص"
                        : "Personnaliser"
                      : language === "ar"
                      ? "معاينة"
                      : "Aperçu"}
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
              {/* Step 1: Select Job */}
              {step === "select" && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="text-base font-semibold">
                      {language === "ar" ? "اختر الوظيفة المستهدفة" : "Sélectionnez le poste ciblé"}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {language === "ar"
                        ? "اختر من الوظائف المحفوظة أو المقدم عليها"
                        : "Choisissez parmi vos offres sauvegardées ou candidatures"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {savedJobs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>
                          {language === "ar"
                            ? "لا توجد وظائف محفوظة"
                            : "Aucune offre sauvegardée"}
                        </p>
                      </div>
                    ) : (
                      savedJobs.map((job) => (
                        <motion.button
                          key={job.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedJob(job.id)}
                          className={cn(
                            "w-full p-4 rounded-xl border-2 text-left transition-all",
                            selectedJob === job.id
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-amber-100 dark:from-purple-900/50 dark:to-amber-900/50 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {job.company}
                                {job.location && ` • ${job.location}`}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      disabled={!selectedJob}
                      onClick={() => setStep("customize")}
                    >
                      {language === "ar" ? "التالي" : "Suivant"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Customize */}
              {step === "customize" && (
                <motion.div
                  key="customize"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Tone Selection */}
                  <div>
                    <Label className="text-base font-semibold">
                      {language === "ar" ? "اختر نبرة الرسالة" : "Choisissez le ton de la lettre"}
                    </Label>
                    <div className="mt-3">
                      <ToneSelector value={tone} onChange={setTone} language={language} />
                    </div>
                  </div>

                  {/* Custom Points */}
                  <div>
                    <Label className="text-base font-semibold">
                      {language === "ar" ? "نقاط إضافية لتضمينها" : "Points supplémentaires à inclure"}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {language === "ar"
                        ? "أضف نقاط محددة تريد ذكرها في الرسالة"
                        : "Ajoutez des points spécifiques que vous souhaitez mentionner"}
                    </p>

                    <div className="mt-3 space-y-3">
                      {customPoints.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="flex-1 text-sm">{point}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeCustomPoint(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      <div className="flex gap-2">
                        <Input
                          placeholder={
                            language === "ar"
                              ? "مثال: خبرة في إدارة المشاريع..."
                              : "Ex: Expérience en gestion de projet..."
                          }
                          value={newPoint}
                          onChange={(e) => setNewPoint(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCustomPoint()}
                        />
                        <Button variant="outline" onClick={addCustomPoint}>
                          {language === "ar" ? "إضافة" : "Ajouter"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* User Background (if provided) */}
                  {userBackground && (
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-purple-500" />
                        <span className="font-medium text-sm">
                          {language === "ar" ? "معلوماتك الشخصية" : "Vos informations"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {userBackground.name && (
                          <div>
                            <span className="text-gray-500">{language === "ar" ? "الاسم:" : "Nom:"}</span>
                            <span className="ml-2">{userBackground.name}</span>
                          </div>
                        )}
                        {userBackground.email && (
                          <div>
                            <span className="text-gray-500">{language === "ar" ? "البريد:" : "Email:"}</span>
                            <span className="ml-2">{userBackground.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep("select")}>
                      {language === "ar" ? "السابق" : "Précédent"}
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === "ar" ? "جاري الإنشاء..." : "Génération..."}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {language === "ar" ? "إنشاء الرسالة" : "Générer la lettre"}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preview */}
              {step === "preview" && coverLetter && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {/* Preview Card */}
                  <Card className="border-2 border-purple-100 dark:border-purple-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-500" />
                          {language === "ar" ? "رسالة التقديم" : "Lettre de motivation"}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            {language === "ar" ? "تعديل" : "Modifier"}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={editedLetter}
                          onChange={(e) => setEditedLetter(e.target.value)}
                          rows={15}
                          className="font-mono text-sm"
                        />
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="font-medium text-gray-900 dark:text-white mb-4">
                            {coverLetter.subject}
                          </p>
                          <p className="mb-3">{coverLetter.greeting}</p>
                          <div className="whitespace-pre-line">{coverLetter.body}</div>
                          <p className="mt-4">{coverLetter.closing}</p>
                          <p className="font-medium mt-2">{coverLetter.signature}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => setStep("customize")}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {language === "ar" ? "إعادة الإنشاء" : "Régénérer"}
                    </Button>
                    <Button variant="outline" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-emerald-500" />
                          {language === "ar" ? "تم النسخ" : "Copié!"}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          {language === "ar" ? "نسخ" : "Copier"}
                        </>
                      )}
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
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

export default CoverLetterGenerator;
