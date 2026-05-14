"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Linkedin,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  FileUp,
  RefreshCw,
} from "lucide-react";

type ImportMethod = "file" | "text" | "linkedin";

interface CvImportProps {
  onAnalysisComplete?: (result: CvAnalysisResult) => void;
  userId?: string;
  language?: "fr" | "ar";
}

interface CvAnalysisResult {
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  experience: {
    years: number;
    positions: string[];
    companies: string[];
  };
  education: {
    degrees: string[];
    institutions: string[];
  };
  suggestedCareerPaths: string[];
  strengths: string[];
  areasForDevelopment: string[];
}

const translations = {
  fr: {
    title: "Importer votre CV",
    description: "Téléchargez votre CV ou collez son contenu pour une analyse personnalisée",
    dropzone: "Glissez-déposez votre CV ici",
    or: "ou",
    browse: "Parcourir les fichiers",
    supportedFormats: "Formats supportés: PDF, DOCX (max 5MB)",
    pasteLabel: "Ou collez le contenu de votre CV",
    pastePlaceholder: "Collez ici le texte de votre CV...",
    linkedinLabel: "Ou importez depuis LinkedIn",
    linkedinPlaceholder: "https://www.linkedin.com/in/votre-profil",
    analyzeButton: "Analyser",
    analyzing: "Analyse en cours...",
    success: "Analyse terminée avec succès !",
    error: "Une erreur est survenue",
    retry: "Réessayer",
    progress: {
      uploading: "Téléchargement...",
      extracting: "Extraction des données...",
      analyzing: "Analyse IA en cours...",
      finalizing: "Finalisation...",
    },
  },
  ar: {
    title: "استيراد سيرتك الذاتية",
    description: "قم بتحميل سيرتك الذاتية أو لصق محتواها للحصول على تحليل مخصص",
    dropzone: "اسحب وأفلت سيرتك الذاتية هنا",
    or: "أو",
    browse: "تصفح الملفات",
    supportedFormats: "الصيغ المدعومة: PDF، DOCX (حد أقصى 5 ميجابايت)",
    pasteLabel: "أو الصق محتوى سيرتك الذاتية",
    pastePlaceholder: "الصق نص سيرتك الذاتية هنا...",
    linkedinLabel: "أو الاستيراد من LinkedIn",
    linkedinPlaceholder: "https://www.linkedin.com/in/your-profile",
    analyzeButton: "تحليل",
    analyzing: "جاري التحليل...",
    success: "تم التحليل بنجاح!",
    error: "حدث خطأ",
    retry: "إعادة المحاولة",
    progress: {
      uploading: "جاري التحميل...",
      extracting: "استخراج البيانات...",
      analyzing: "تحليل الذكاء الاصطناعي...",
      finalizing: "الإنهاء...",
    },
  },
};

export function CvImport({ onAnalysisComplete, userId, language = "fr" }: CvImportProps) {
  const t = translations[language];
  const [activeMethod, setActiveMethod] = React.useState<ImportMethod>("file");
  const [file, setFile] = React.useState<File | null>(null);
  const [cvText, setCvText] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [progressStep, setProgressStep] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
      setActiveMethod("file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
      setActiveMethod("file");
    }
  };

  const isValidFile = (file: File): boolean => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For PDF and DOCX, we'll send the file content as base64
    // In a real app, you'd use a proper file parser
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // For demo purposes, we'll just use the file name
        // In production, you'd parse the actual content
        resolve(`CV Content from: ${file.name}`);
      };
      reader.readAsText(file);
    });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    setIsSuccess(false);
    setProgress(0);

    try {
      // Step 1: Uploading
      setProgressStep(t.progress.uploading);
      setProgress(10);
      await sleep(500);

      // Get CV text based on active method
      let textToAnalyze = "";
      if (activeMethod === "file" && file) {
        setProgressStep(t.progress.extracting);
        setProgress(25);
        textToAnalyze = await extractTextFromFile(file);
      } else if (activeMethod === "text" && cvText) {
        textToAnalyze = cvText;
      } else if (activeMethod === "linkedin" && linkedinUrl) {
        // For LinkedIn, we'd typically scrape the profile
        textToAnalyze = `LinkedIn Profile: ${linkedinUrl}`;
      }

      if (!textToAnalyze || textToAnalyze.length < 50) {
        throw new Error(language === "fr" ? "Le texte du CV est trop court" : "نص السيرة الذاتية قصير جداً");
      }

      // Step 2: AI Analysis
      setProgressStep(t.progress.analyzing);
      setProgress(50);

      const response = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: textToAnalyze,
          userId,
          language,
        }),
      });

      setProgress(80);
      setProgressStep(t.progress.finalizing);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t.error);
      }

      const data = await response.json();
      setProgress(100);
      setIsSuccess(true);

      if (onAnalysisComplete && data.data?.analysis) {
        onAnalysisComplete(data.data.analysis);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleRetry = () => {
    setError(null);
    setIsSuccess(false);
    setProgress(0);
    setProgressStep("");
  };

  const canAnalyze = React.useMemo(() => {
    if (activeMethod === "file") return !!file;
    if (activeMethod === "text") return cvText.length >= 50;
    if (activeMethod === "linkedin") return linkedinUrl.includes("linkedin.com");
    return false;
  }, [activeMethod, file, cvText, linkedinUrl]);

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
          {t.title}
        </CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <motion.div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 min-h-[180px]",
            "flex flex-col items-center justify-center gap-4",
            isDragOver && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
            !isDragOver && "border-gray-300 dark:border-gray-700 hover:border-emerald-400",
            activeMethod === "file" && file && "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  <X className="w-4 h-4 mr-1" />
                  {language === "fr" ? "Supprimer" : "حذف"}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="file-upload"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                  isDragOver ? "bg-emerald-200 dark:bg-emerald-800/50" : "bg-gray-100 dark:bg-gray-800"
                )}>
                  <Upload className={cn(
                    "w-8 h-8 transition-colors",
                    isDragOver ? "text-emerald-600" : "text-gray-400"
                  )} />
                </div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {t.dropzone}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-px w-12 bg-gray-300 dark:bg-gray-700" />
                  <span className="text-sm text-gray-500">{t.or}</span>
                  <div className="h-px w-12 bg-gray-300 dark:bg-gray-700" />
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 min-h-[44px]"
                >
                  <FileUp className="w-4 h-4" />
                  {t.browse}
                </Button>
                <p className="text-xs text-gray-400">{t.supportedFormats}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Text Paste Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            {t.pasteLabel}
          </label>
          <Textarea
            value={cvText}
            onChange={(e) => {
              setCvText(e.target.value);
              if (e.target.value.length > 50) setActiveMethod("text");
            }}
            placeholder={t.pastePlaceholder}
            className={cn(
              "min-h-[120px] resize-none transition-all",
              activeMethod === "text" && cvText.length >= 50 && "border-amber-500 focus-visible:ring-amber-500/50"
            )}
          />
        </div>

        {/* LinkedIn URL Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-cyan-500" />
            {t.linkedinLabel}
          </label>
          <Input
            type="url"
            value={linkedinUrl}
            onChange={(e) => {
              setLinkedinUrl(e.target.value);
              if (e.target.value.includes("linkedin.com")) setActiveMethod("linkedin");
            }}
            placeholder={t.linkedinPlaceholder}
            className={cn(
              "transition-all",
              activeMethod === "linkedin" && linkedinUrl.includes("linkedin.com") && "border-cyan-500 focus-visible:ring-cyan-500/50"
            )}
          />
        </div>

        {/* Progress Bar */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{progressStep}</span>
                <span className="font-medium text-emerald-600">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-cyan-500" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800"
            >
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <p className="text-sm text-rose-700 dark:text-rose-400 flex-1">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/50 min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {t.retry}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400">{t.success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className={cn(
            "w-full min-h-[52px] text-lg font-semibold gap-2 transition-all",
            "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.analyzing}
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {t.analyzeButton}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default CvImport;
