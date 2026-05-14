"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MapPin,
  Building2,
  Briefcase,
  Heart,
  ExternalLink,
  DollarSign,
  Clock,
  FileText,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Calendar,
  Users,
  Globe,
  Mail,
  Phone,
  ChevronRight,
  Target,
  Zap,
  Award,
} from "lucide-react";
import type { JobCardData } from "./JobCard";

// ===========================================
// Types
// ===========================================

interface JobDetailModalProps {
  job: JobCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onGenerateCoverLetter?: (jobId: string) => void;
  onPrepareInterview?: (jobId: string) => void;
  language?: "fr" | "ar";
}

// ===========================================
// Skill Gap Analysis Component
// ===========================================

interface SkillGapAnalysisProps {
  matchDetails?: JobCardData["matchDetails"];
  skills: JobCardData["skills"];
  language: "fr" | "ar";
}

function SkillGapAnalysis({ matchDetails, skills, language }: SkillGapAnalysisProps) {
  if (!matchDetails) return null;

  const matchedSkills = skills.filter((s) => s.userHas);
  const missingSkills = skills.filter((s) => !s.userHas && s.importance !== "preferred");
  const preferredMissing = skills.filter((s) => !s.userHas && s.importance === "preferred");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-purple-500" />
        <h4 className="font-semibold">
          {language === "ar" ? "تحليل فجوة المهارات" : "Analyse de l'écart de compétences"}
        </h4>
      </div>

      {/* Overall Match */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-amber-50 dark:from-purple-900/20 dark:to-amber-900/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {language === "ar" ? "نسبة التوافق الإجمالية" : "Correspondance globale"}
          </span>
          <span
            className={cn(
              "text-lg font-bold",
              (matchDetails.totalMatched / matchDetails.totalRequired) * 100 >= 70
                ? "text-emerald-600"
                : (matchDetails.totalMatched / matchDetails.totalRequired) * 100 >= 50
                ? "text-amber-600"
                : "text-rose-600"
            )}
          >
            {Math.round((matchDetails.totalMatched / matchDetails.totalRequired) * 100)}%
          </span>
        </div>
        <Progress
          value={(matchDetails.totalMatched / matchDetails.totalRequired) * 100}
          className="h-3"
        />
      </div>

      {/* Matched Skills */}
      {matchedSkills.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === "ar"
                ? `المهارات المتوفرة (${matchedSkills.length})`
                : `Compétences acquises (${matchedSkills.length})`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill) => (
              <Badge
                key={skill.id}
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {language === "ar" && skill.nameAr ? skill.nameAr : skill.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === "ar"
                ? `مهارات مطلوبة للتحسين (${missingSkills.length})`
                : `Compétences à développer (${missingSkills.length})`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((skill) => (
              <Badge
                key={skill.id}
                variant="outline"
                className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800"
              >
                <XCircle className="w-3 h-3 mr-1" />
                {language === "ar" && skill.nameAr ? skill.nameAr : skill.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Preferred Skills (Missing) */}
      {preferredMissing.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-600">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === "ar"
                ? `مهارات إضافية مفضلة (${preferredMissing.length})`
                : `Bonus : Compétences appréciées (${preferredMissing.length})`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {preferredMissing.map((skill) => (
              <Badge
                key={skill.id}
                variant="outline"
                className="bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800"
              >
                {language === "ar" && skill.nameAr ? skill.nameAr : skill.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {missingSkills.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-medium text-amber-800 dark:text-amber-200">
                {language === "ar" ? "توصية" : "Recommandation"}
              </h5>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {language === "ar"
                  ? `ركز على تطوير ${missingSkills.slice(0, 2).map((s) => s.nameAr || s.name).join(" و ")} لزيادة فرصك`
                  : `Concentrez-vous sur ${missingSkills.slice(0, 2).map((s) => s.name).join(" et ")} pour augmenter vos chances`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================
// Main JobDetailModal Component
// ===========================================

export function JobDetailModal({
  job,
  isOpen,
  onClose,
  onSave,
  onApply,
  onGenerateCoverLetter,
  onPrepareInterview,
  language = "fr",
}: JobDetailModalProps) {
  if (!job) return null;

  const formatSalary = () => {
    if (!job.salaryMin || !job.salaryMax) return null;
    const currency = job.currency || "MAD";
    const formatter = new Intl.NumberFormat(language === "ar" ? "ar-MA" : "fr-MA");
    return `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)} ${currency}`;
  };

  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (language === "ar") {
      if (diffDays === 0) return "اليوم";
      if (diffDays === 1) return "أمس";
      return `منذ ${diffDays} يوم`;
    }

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    return `Il y a ${diffDays} jours`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <DialogHeader className="relative z-10">
            <div className="flex items-start gap-4">
              {/* Company Logo */}
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8" />
              </div>

              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold text-white mb-1">
                  {language === "ar" && job.titleAr ? job.titleAr : job.title}
                </DialogTitle>
                <DialogDescription className="text-purple-100">
                  {job.company}
                </DialogDescription>
              </div>

              {/* Match Badge */}
              {job.matchPercentage !== undefined && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2"
                >
                  <Sparkles className="w-5 h-5 mb-1" />
                  <span className="text-2xl font-bold">{job.matchPercentage}%</span>
                  <span className="text-xs text-purple-100">
                    {language === "ar" ? "توافق" : "Match"}
                  </span>
                </motion.div>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{job.location}</span>
                {job.remote && (
                  <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Remote
                  </Badge>
                )}
              </div>
              {formatSalary() && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">{formatSalary()}</span>
                </div>
              )}
              {job.postedAt && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{getTimeAgo(job.postedAt)}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                {language === "ar" ? "وصف الوظيفة" : "Description du poste"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {job.description || (language === "ar" ? "لا يوجد وصف متاح" : "Aucune description disponible")}
              </p>
            </div>

            <Separator />

            {/* Required Skills */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                {language === "ar" ? "المهارات المطلوبة" : "Compétences requises"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="outline"
                    className={cn(
                      "text-sm py-1.5 px-3",
                      skill.userHas
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : skill.importance === "critical"
                        ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300"
                        : skill.importance === "required"
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
                    )}
                  >
                    {skill.userHas && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {language === "ar" && skill.nameAr ? skill.nameAr : skill.name}
                    <span className="ml-1 text-xs opacity-70">
                      ({skill.importance === "critical"
                        ? language === "ar" ? "ضروري" : "critique"
                        : skill.importance === "required"
                        ? language === "ar" ? "مطلوب" : "requis"
                        : language === "ar" ? "مفضل" : "préféré"})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Skill Gap Analysis */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="skill-gap" className="border rounded-xl px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold">
                      {language === "ar" ? "تحليل فجوة المهارات" : "Analyse de l'écart de compétences"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <SkillGapAnalysis
                    matchDetails={job.matchDetails}
                    skills={job.skills}
                    language={language}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator />

            {/* Company Info */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-500" />
                {language === "ar" ? "معلومات الشركة" : "Informations sur l'entreprise"}
              </h3>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{job.company}</span>
                </div>
                {job.source && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "المصدر:" : "Source:"} {job.source}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t p-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-1">
              <Button
                variant="outline"
                className={cn(
                  "flex-1",
                  job.isSaved && "text-rose-500 border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                )}
                onClick={() => onSave?.(job.id)}
              >
                <Heart
                  className="w-4 h-4 mr-2"
                  fill={job.isSaved ? "currentColor" : "none"}
                />
                {job.isSaved
                  ? language === "ar"
                    ? "محفوظ"
                    : "Sauvegardé"
                  : language === "ar"
                  ? "حفظ"
                  : "Sauvegarder"}
              </Button>

              {job.url && (
                <Button variant="outline" asChild>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {language === "ar" ? "المصدر" : "Source"}
                  </a>
                </Button>
              )}
            </div>

            <div className="flex gap-2 flex-1 sm:flex-none">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/50"
                onClick={() => {
                  onGenerateCoverLetter?.(job.id);
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                {language === "ar" ? "رسالة التقديم" : "Lettre"}
              </Button>

              <Button
                variant="outline"
                className="flex-1 sm:flex-none border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/50"
                onClick={() => {
                  onPrepareInterview?.(job.id);
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {language === "ar" ? "التحضير" : "Préparer"}
              </Button>

              <Button
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                onClick={() => onApply?.(job.id)}
                disabled={job.isApplied}
              >
                {job.isApplied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {language === "ar" ? "تم التقديم" : "Candidature envoyée"}
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4 mr-2" />
                    {language === "ar" ? "تقديم" : "Postuler"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default JobDetailModal;
