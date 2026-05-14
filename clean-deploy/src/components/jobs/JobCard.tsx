"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  Building2,
  Briefcase,
  Heart,
  ExternalLink,
  Star,
  Clock,
  DollarSign,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ===========================================
// Types
// ===========================================

export interface JobSkill {
  id: string;
  name: string;
  nameAr?: string;
  category?: string;
  required: boolean;
  importance: "preferred" | "required" | "critical";
  userHas?: boolean;
}

export interface JobCardData {
  id: string;
  title: string;
  titleAr?: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  description?: string;
  skills: JobSkill[];
  matchPercentage?: number;
  matchDetails?: {
    matchedSkills: string[];
    missingSkills: string[];
    totalRequired: number;
    totalMatched: number;
  };
  postedAt?: string;
  expiresAt?: string;
  url?: string;
  source?: string;
  isSaved?: boolean;
  isApplied?: boolean;
  remote?: boolean;
}

interface JobCardProps {
  job: JobCardData;
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  language?: "fr" | "ar";
  isCompact?: boolean;
}

// ===========================================
// Match Percentage Colors
// ===========================================

const getMatchColor = (percentage: number): string => {
  if (percentage >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (percentage >= 60) return "text-amber-600 dark:text-amber-400";
  if (percentage >= 40) return "text-orange-600 dark:text-orange-400";
  return "text-rose-600 dark:text-rose-400";
};

const getMatchBgColor = (percentage: number): string => {
  if (percentage >= 80) return "bg-emerald-100 dark:bg-emerald-900/30";
  if (percentage >= 60) return "bg-amber-100 dark:bg-amber-900/30";
  if (percentage >= 40) return "bg-orange-100 dark:bg-orange-900/30";
  return "bg-rose-100 dark:bg-rose-900/30";
};

const getMatchGradient = (percentage: number): string => {
  if (percentage >= 80) return "from-emerald-500 to-emerald-600";
  if (percentage >= 60) return "from-amber-500 to-amber-600";
  if (percentage >= 40) return "from-orange-500 to-orange-600";
  return "from-rose-500 to-rose-600";
};

// ===========================================
// Skill Badge Component
// ===========================================

interface SkillBadgeProps {
  skill: JobSkill;
  language: "fr" | "ar";
}

function SkillBadge({ skill, language }: SkillBadgeProps) {
  const importanceColors = {
    critical: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    required: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    preferred: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium transition-all hover:scale-105",
              importanceColors[skill.importance],
              skill.userHas && "ring-2 ring-emerald-400 dark:ring-emerald-500"
            )}
          >
            {skill.userHas && (
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
            )}
            {language === "ar" && skill.nameAr ? skill.nameAr : skill.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p>
            {skill.importance === "critical"
              ? language === "ar"
                ? "مطلوب بشدة"
                : "Critique"
              : skill.importance === "required"
              ? language === "ar"
                ? "مطلوب"
                : "Requis"
              : language === "ar"
              ? "مفضل"
              : "Préférable"}
          </p>
          {skill.userHas && (
            <p className="text-emerald-500">
              {language === "ar" ? "لديك هذه المهارة" : "Vous avez cette compétence"}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ===========================================
// Main JobCard Component
// ===========================================

export function JobCard({
  job,
  onSave,
  onApply,
  onViewDetails,
  language = "fr",
  isCompact = false,
}: JobCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.2 }}
      className="touch-none"
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer",
          "hover:shadow-xl hover:shadow-purple-500/5",
          "border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800",
          isHovered && "bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20"
        )}
        onClick={() => onViewDetails?.(job.id)}
      >
        {/* Match Percentage Badge */}
        {job.matchPercentage !== undefined && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute -top-1 -right-1 z-10",
              "rounded-bl-2xl rounded-tr-xl px-3 py-1.5",
              "bg-gradient-to-br",
              getMatchGradient(job.matchPercentage),
              "shadow-lg"
            )}
          >
            <div className="flex items-center gap-1 text-white">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold text-sm">{job.matchPercentage}%</span>
            </div>
          </motion.div>
        )}

        <CardContent className={cn("p-4 sm:p-6", isCompact && "p-3 sm:p-4")}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Company Logo/Avatar */}
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ rotate: 5 }}
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center",
                  "bg-gradient-to-br from-purple-100 to-amber-100 dark:from-purple-900/50 dark:to-amber-900/50",
                  "border-2 border-purple-200 dark:border-purple-700"
                )}
              >
                <Building2 className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {language === "ar" && job.titleAr ? job.titleAr : job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{job.company}</span>
                    {job.remote && (
                      <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        Remote
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "rounded-full transition-all",
                          job.isSaved
                            ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                            : "text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSave?.(job.id);
                        }}
                      >
                        <motion.div
                          animate={job.isSaved ? { scale: [1, 1.3, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            className="w-5 h-5"
                            fill={job.isSaved ? "currentColor" : "none"}
                          />
                        </motion.div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {job.isSaved
                        ? language === "ar"
                          ? "إزالة من المحفوظة"
                          : "Retirer des favoris"
                        : language === "ar"
                        ? "حفظ الوظيفة"
                        : "Sauvegarder"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Location & Salary */}
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{job.location}</span>
                </div>
                {formatSalary() && (
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">{formatSalary()}</span>
                  </div>
                )}
                {job.postedAt && (
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeAgo(job.postedAt)}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              {!isCompact && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {job.skills.slice(0, 5).map((skill) => (
                    <SkillBadge key={skill.id} skill={skill} language={language} />
                  ))}
                  {job.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      +{job.skills.length - 5} {language === "ar" ? "أخرى" : "autres"}
                    </Badge>
                  )}
                </div>
              )}

              {/* Match Progress */}
              {job.matchDetails && !isCompact && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "توافق المهارات" : "Correspondance des compétences"}
                    </span>
                    <span className={cn("font-medium", getMatchColor(job.matchPercentage || 0))}>
                      {job.matchDetails.totalMatched}/{job.matchDetails.totalRequired}
                    </span>
                  </div>
                  <Progress
                    value={job.matchPercentage || 0}
                    className={cn("h-2", getMatchBgColor(job.matchPercentage || 0))}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-3">
                <Button
                  className={cn(
                    "flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-purple-600",
                    "hover:from-purple-600 hover:to-purple-700",
                    "text-white shadow-lg shadow-purple-500/25"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply?.(job.id);
                  }}
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

                {job.url && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(job.url, "_blank");
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default JobCard;
