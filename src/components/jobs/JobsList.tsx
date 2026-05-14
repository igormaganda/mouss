"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  X,
  Loader2,
  RefreshCw,
  Grid3X3,
  List,
  Building2,
  ChevronDown,
} from "lucide-react";
import { JobCard, type JobCardData } from "./JobCard";

// ===========================================
// Types
// ===========================================

export interface JobsFilter {
  search?: string;
  location?: string;
  sector?: string;
  minSalary?: number;
  maxSalary?: number;
  remote?: boolean;
  experienceLevel?: string;
}

export interface JobsListProps {
  jobs: JobCardData[];
  isLoading?: boolean;
  error?: string | null;
  totalJobs?: number;
  currentPage?: number;
  pageSize?: number;
  onFilterChange?: (filter: JobsFilter) => void;
  onPageChange?: (page: number) => void;
  onSaveJob?: (jobId: string) => void;
  onApplyJob?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  onRefresh?: () => void;
  language?: "fr" | "ar";
}

// ===========================================
// Constants
// ===========================================

const MOROCCAN_CITIES = [
  { value: "casablanca", label: "Casablanca", labelAr: "الدار البيضاء" },
  { value: "rabat", label: "Rabat", labelAr: "الرباط" },
  { value: "marrakech", label: "Marrakech", labelAr: "مراكش" },
  { value: "fes", label: "Fès", labelAr: "فاس" },
  { value: "tangier", label: "Tanger", labelAr: "طنجة" },
  { value: "agadir", label: "Agadir", labelAr: "أكادير" },
  { value: "meknes", label: "Meknès", labelAr: "مكناس" },
  { value: "oujda", label: "Oujda", labelAr: "وجدة" },
  { value: "remote", label: "Télétravail", labelAr: "عن بعد" },
];

const SECTORS = [
  { value: "technology", label: "Technologie", labelAr: "التكنولوجيا" },
  { value: "finance", label: "Finance", labelAr: "المالية" },
  { value: "healthcare", label: "Santé", labelAr: "الصحة" },
  { value: "education", label: "Éducation", labelAr: "التعليم" },
  { value: "retail", label: "Commerce", labelAr: "التجارة" },
  { value: "manufacturing", label: "Industrie", labelAr: "الصناعة" },
  { value: "services", label: "Services", labelAr: "الخدمات" },
  { value: "government", label: "Public", labelAr: "القطاع العام" },
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Débutant", labelAr: "مبتدئ" },
  { value: "junior", label: "Junior (1-2 ans)", labelAr: "مبتدئ (1-2 سنوات)" },
  { value: "mid", label: "Intermédiaire (3-5 ans)", labelAr: "متوسط (3-5 سنوات)" },
  { value: "senior", label: "Senior (5+ ans)", labelAr: "خبير (5+ سنوات)" },
  { value: "executive", label: "Direction", labelAr: "إدارة" },
];

const SALARY_RANGES = [
  { min: 0, max: 10000, label: "< 10 000 MAD" },
  { min: 10000, max: 20000, label: "10 000 - 20 000 MAD" },
  { min: 20000, max: 35000, label: "20 000 - 35 000 MAD" },
  { min: 35000, max: 50000, label: "35 000 - 50 000 MAD" },
  { min: 50000, max: 100000, label: "> 50 000 MAD" },
];

// ===========================================
// Demo Jobs Data
// ===========================================

const DEMO_JOBS: JobCardData[] = [
  {
    id: "demo-1",
    title: "Développeur Full Stack",
    company: "TechMaroc",
    location: "Casablanca",
    salaryMin: 25000,
    salaryMax: 35000,
    currency: "MAD",
    matchScore: 92,
    sector: "technology",
    experienceLevel: "mid",
    remote: true,
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    postedAt: "2024-01-15",
    isSaved: false,
    isApplied: false,
  },
  {
    id: "demo-2",
    title: "Product Manager",
    company: "StartupHub",
    location: "Rabat",
    salaryMin: 30000,
    salaryMax: 45000,
    currency: "MAD",
    matchScore: 85,
    sector: "technology",
    experienceLevel: "senior",
    remote: false,
    skills: ["Agile", "Scrum", "Jira", "Product Strategy"],
    postedAt: "2024-01-14",
    isSaved: true,
    isApplied: false,
  },
  {
    id: "demo-3",
    title: "Data Analyst",
    company: "DataDriven",
    location: "Marrakech",
    salaryMin: 18000,
    salaryMax: 25000,
    currency: "MAD",
    matchScore: 78,
    sector: "technology",
    experienceLevel: "junior",
    remote: true,
    skills: ["Python", "SQL", "Tableau", "Excel"],
    postedAt: "2024-01-13",
    isSaved: false,
    isApplied: true,
  },
  {
    id: "demo-4",
    title: "UX Designer",
    company: "DesignStudio",
    location: "Casablanca",
    salaryMin: 20000,
    salaryMax: 30000,
    currency: "MAD",
    matchScore: 88,
    sector: "technology",
    experienceLevel: "mid",
    remote: true,
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    postedAt: "2024-01-12",
    isSaved: false,
    isApplied: false,
  },
  {
    id: "demo-5",
    title: "DevOps Engineer",
    company: "CloudServices",
    location: "Tanger",
    salaryMin: 35000,
    salaryMax: 50000,
    currency: "MAD",
    matchScore: 72,
    sector: "technology",
    experienceLevel: "senior",
    remote: true,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    postedAt: "2024-01-11",
    isSaved: false,
    isApplied: false,
  },
  {
    id: "demo-6",
    title: "Marketing Manager",
    company: "GrowthAgency",
    location: "Casablanca",
    salaryMin: 25000,
    salaryMax: 35000,
    currency: "MAD",
    matchScore: 65,
    sector: "services",
    experienceLevel: "mid",
    remote: false,
    skills: ["Digital Marketing", "SEO", "Google Ads", "Analytics"],
    postedAt: "2024-01-10",
    isSaved: true,
    isApplied: false,
  },
];

// ===========================================
// Filter Panel Component
// ===========================================

interface FilterPanelProps {
  filter: JobsFilter;
  onFilterChange: (filter: JobsFilter) => void;
  language: "fr" | "ar";
}

function FilterPanel({ filter, onFilterChange, language }: FilterPanelProps) {
  const [localFilter, setLocalFilter] = React.useState<JobsFilter>(filter);

  const handleApplyFilters = () => {
    onFilterChange(localFilter);
  };

  const handleReset = () => {
    const resetFilter: JobsFilter = {};
    setLocalFilter(resetFilter);
    onFilterChange(resetFilter);
  };

  const activeFiltersCount = Object.values(filter).filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          {language === "ar" ? "فلترة" : "Filtres"}
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-purple-500 text-white text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">
              {language === "ar" ? "فلترة النتائج" : "Filtrer les résultats"}
            </h4>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="w-4 h-4 mr-1" />
                {language === "ar" ? "إعادة تعيين" : "Réinitialiser"}
              </Button>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === "ar" ? "الموقع" : "Localisation"}
            </label>
            <Select
              value={localFilter.location || ""}
              onValueChange={(value) =>
                setLocalFilter({ ...localFilter, location: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={language === "ar" ? "اختر المدينة" : "Sélectionner une ville"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les villes</SelectItem>
                {MOROCCAN_CITIES.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {language === "ar" ? city.labelAr : city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === "ar" ? "القطاع" : "Secteur"}
            </label>
            <Select
              value={localFilter.sector || ""}
              onValueChange={(value) =>
                setLocalFilter({ ...localFilter, sector: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={language === "ar" ? "اختر القطاع" : "Sélectionner un secteur"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les secteurs</SelectItem>
                {SECTORS.map((sector) => (
                  <SelectItem key={sector.value} value={sector.value}>
                    {language === "ar" ? sector.labelAr : sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === "ar" ? "مستوى الخبرة" : "Niveau d'expérience"}
            </label>
            <Select
              value={localFilter.experienceLevel || ""}
              onValueChange={(value) =>
                setLocalFilter({ ...localFilter, experienceLevel: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={language === "ar" ? "اختر المستوى" : "Sélectionner un niveau"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les niveaux</SelectItem>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {language === "ar" ? level.labelAr : level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === "ar" ? "نطاق الراتب (MAD)" : "Salaire (MAD)"}
            </label>
            <div className="pt-2 px-1">
              <Slider
                value={[localFilter.minSalary || 0, localFilter.maxSalary || 100000]}
                min={0}
                max={100000}
                step={5000}
                onValueChange={([min, max]) =>
                  setLocalFilter({ ...localFilter, minSalary: min, maxSalary: max })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{(localFilter.minSalary || 0).toLocaleString()}</span>
                <span>{(localFilter.maxSalary || 100000).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Remote Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {language === "ar" ? "العمل عن بعد" : "Télétravail"}
            </label>
            <Button
              variant={localFilter.remote ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setLocalFilter({ ...localFilter, remote: !localFilter.remote })
              }
              className={cn(
                localFilter.remote && "bg-emerald-500 hover:bg-emerald-600"
              )}
            >
              {localFilter.remote
                ? language === "ar"
                  ? "نعم"
                  : "Oui"
                : language === "ar"
                ? "لا"
                : "Non"}
            </Button>
          </div>

          {/* Apply Button */}
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            onClick={handleApplyFilters}
          >
            {language === "ar" ? "تطبيق الفلترة" : "Appliquer les filtres"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ===========================================
// Active Filter Tags
// ===========================================

interface ActiveFilterTagsProps {
  filter: JobsFilter;
  onRemoveFilter: (key: keyof JobsFilter) => void;
  language: "fr" | "ar";
}

function ActiveFilterTags({ filter, onRemoveFilter, language }: ActiveFilterTagsProps) {
  const tags: { key: keyof JobsFilter; label: string }[] = [];

  if (filter.location) {
    const city = MOROCCAN_CITIES.find((c) => c.value === filter.location);
    tags.push({
      key: "location",
      label: language === "ar" ? city?.labelAr || filter.location : city?.label || filter.location,
    });
  }

  if (filter.sector) {
    const sector = SECTORS.find((s) => s.value === filter.sector);
    tags.push({
      key: "sector",
      label: language === "ar" ? sector?.labelAr || filter.sector : sector?.label || filter.sector,
    });
  }

  if (filter.experienceLevel) {
    const level = EXPERIENCE_LEVELS.find((l) => l.value === filter.experienceLevel);
    tags.push({
      key: "experienceLevel",
      label: language === "ar" ? level?.labelAr || filter.experienceLevel : level?.label || filter.experienceLevel,
    });
  }

  if (filter.remote) {
    tags.push({
      key: "remote",
      label: language === "ar" ? "عن بعد" : "Télétravail",
    });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.key}
          variant="secondary"
          className="gap-1 pr-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
        >
          {tag.label}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-purple-200 dark:hover:bg-purple-800"
            onClick={() => onRemoveFilter(tag.key)}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
}

// ===========================================
// Main JobsList Component
// ===========================================

export function JobsList({
  jobs: externalJobs,
  isLoading = false,
  error = null,
  totalJobs: externalTotalJobs,
  currentPage = 1,
  pageSize = 10,
  onFilterChange,
  onPageChange,
  onSaveJob,
  onApplyJob,
  onViewDetails,
  onRefresh,
  language = "fr",
}: JobsListProps) {
  // Use demo jobs if no jobs provided
  const jobs = externalJobs ?? DEMO_JOBS;
  const totalJobs = externalTotalJobs ?? jobs.length;
  
  const [filter, setFilter] = React.useState<JobsFilter>({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange({ ...filter, search: searchQuery || undefined });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filter]);

  const handleFilterChange = (newFilter: JobsFilter) => {
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const handleRemoveFilter = (key: keyof JobsFilter) => {
    const newFilter = { ...filter };
    delete newFilter[key];
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const totalPages = Math.ceil(totalJobs / pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === "ar" ? "فرص العمل" : "Offres d'emploi"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalJobs} {language === "ar" ? "نتيجة" : "résultats"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
          </Button>
          {onRefresh && (
            <Button variant="outline" size="icon" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            ref={searchInputRef}
            placeholder={
              language === "ar"
                ? "ابحث بالعنوان، الشركة، الكلمات المفتاحية..."
                : "Rechercher par titre, entreprise, mots-clés..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <FilterPanel
          filter={filter}
          onFilterChange={handleFilterChange}
          language={language}
        />
      </div>

      {/* Active Filter Tags */}
      <ActiveFilterTags
        filter={filter}
        onRemoveFilter={handleRemoveFilter}
        language={language}
      />

      {/* Error State */}
      {error && (
        <Card className="bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800">
          <CardContent className="flex items-center gap-3 p-4">
            <X className="w-5 h-5 text-rose-500" />
            <p className="text-rose-700 dark:text-rose-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && jobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {language === "ar" ? "لم يتم العثور على نتائج" : "Aucun résultat trouvé"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {language === "ar"
              ? "جرب تعديل معايير البحث أو الفلترة للعثور على المزيد من الفرص"
              : "Essayez de modifier vos critères de recherche ou de filtrage pour trouver plus d'opportunités"}
          </p>
        </motion.div>
      )}

      {/* Jobs Grid/List */}
      {!isLoading && !error && jobs.length > 0 && (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "flex flex-col gap-4"
          )}
        >
          <AnimatePresence mode="popLayout">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <JobCard
                  job={job}
                  onSave={onSaveJob}
                  onApply={onApplyJob}
                  onViewDetails={onViewDetails}
                  language={language}
                  isCompact={viewMode === "grid"}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => onPageChange?.(pageNum)}
                      isActive={currentPage === pageNum}
                      className={cn(
                        currentPage === pageNum &&
                          "bg-purple-500 text-white hover:bg-purple-600"
                      )}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                  className={cn(
                    currentPage === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default JobsList;
