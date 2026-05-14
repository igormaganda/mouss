"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BadgeDisplay, BadgeDetail, type BadgeData, type BadgeCategory, CATEGORY_CONFIG } from "./BadgeDisplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Filter,
  Trophy,
  Lock,
  Unlock,
  Grid3X3,
  LayoutList,
  type LucideIcon,
} from "lucide-react";

// Filter options
type FilterType = "all" | "earned" | "locked";

interface BadgeGridProps {
  badges: BadgeData[];
  onBadgeClick?: (badge: BadgeData) => void;
  showFilters?: boolean;
  showProgressSummary?: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 17,
    },
  },
};

export function BadgeGrid({
  badges,
  onBadgeClick,
  showFilters = true,
  showProgressSummary = true,
}: BadgeGridProps) {
  const [selectedFilter, setSelectedFilter] = React.useState<FilterType>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<BadgeCategory | "all">("all");
  const [selectedBadge, setSelectedBadge] = React.useState<BadgeData | null>(null);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Calculate stats
  const stats = React.useMemo(() => {
    const earned = badges.filter((b) => b.earned);
    const totalPoints = earned.reduce((sum, b) => sum + b.points, 0);
    const totalPossiblePoints = badges.reduce((sum, b) => sum + b.points, 0);

    return {
      total: badges.length,
      earned: earned.length,
      totalPoints,
      totalPossiblePoints,
      progress: Math.round((earned.length / badges.length) * 100),
    };
  }, [badges]);

  // Filter badges
  const filteredBadges = React.useMemo(() => {
    let result = badges;

    // Apply earned/locked filter
    if (selectedFilter === "earned") {
      result = result.filter((b) => b.earned);
    } else if (selectedFilter === "locked") {
      result = result.filter((b) => !b.earned);
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    return result;
  }, [badges, selectedFilter, selectedCategory]);

  // Group badges by category
  const groupedBadges = React.useMemo(() => {
    const groups: Record<BadgeCategory, BadgeData[]> = {
      exploration: [],
      completion: [],
      achievement: [],
    };

    filteredBadges.forEach((badge) => {
      groups[badge.category].push(badge);
    });

    return groups;
  }, [filteredBadges]);

  const handleBadgeClick = (badge: BadgeData) => {
    setSelectedBadge(badge);
    onBadgeClick?.(badge);
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      {showProgressSummary && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Collection de Badges</h3>
                <p className="text-white/80 text-sm">
                  {stats.earned} sur {stats.total} debloques
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{stats.totalPoints}</p>
              <p className="text-white/80 text-sm">points</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{stats.progress}%</span>
            </div>
            <Progress
              value={stats.progress}
              className="h-3 bg-white/20"
            />
          </div>
        </motion.div>
      )}

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 items-center justify-between"
        >
          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { value: "all" as FilterType, label: "Tous", icon: Grid3X3 },
                { value: "earned" as FilterType, label: "Obtenus", icon: Unlock },
                { value: "locked" as FilterType, label: "Verrouilles", icon: Lock },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSelectedFilter(value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    selectedFilter === value
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  selectedCategory === "all"
                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Toutes categories
              </button>
              {(Object.keys(CATEGORY_CONFIG) as BadgeCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all hidden sm:block",
                    selectedCategory === category
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {CATEGORY_CONFIG[category].label}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "text-gray-400"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === "list"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "text-gray-400"
              )}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Badge Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              "grid gap-4",
              "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            )}
          >
            {filteredBadges.map((badge) => (
              <motion.div key={badge.id} variants={itemVariants}>
                <BadgeDisplay
                  badge={badge}
                  onClick={() => handleBadgeClick(badge)}
                  showProgress={true}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-3"
          >
            {filteredBadges.map((badge) => (
              <motion.div
                key={badge.id}
                variants={itemVariants}
                onClick={() => handleBadgeClick(badge)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl cursor-pointer",
                  "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
                  "hover:shadow-lg hover:scale-[1.01] transition-all"
                )}
              >
                <BadgeDisplay badge={badge} size="sm" showProgress={false} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{badge.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {badge.description}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        badge.earned
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      )}
                    >
                      {badge.earned ? "Obtenu" : "Verrouille"}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        CATEGORY_CONFIG[badge.category].color,
                        "bg-gray-100 dark:bg-gray-800"
                      )}
                    >
                      {CATEGORY_CONFIG[badge.category].label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{badge.points}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Aucun badge trouve
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Essayez de modifier vos filtres
          </p>
        </motion.div>
      )}

      {/* Badge Detail Dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Details du Badge</DialogTitle>
          </DialogHeader>
          {selectedBadge && <BadgeDetail badge={selectedBadge} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Category Grouped View
export function BadgeGridGrouped({
  badges,
  onBadgeClick,
}: BadgeGridProps) {
  const [selectedBadge, setSelectedBadge] = React.useState<BadgeData | null>(null);

  const groupedBadges = React.useMemo(() => {
    const groups: Record<BadgeCategory, BadgeData[]> = {
      exploration: [],
      completion: [],
      achievement: [],
    };

    badges.forEach((badge) => {
      groups[badge.category].push(badge);
    });

    return groups;
  }, [badges]);

  const handleBadgeClick = (badge: BadgeData) => {
    setSelectedBadge(badge);
    onBadgeClick?.(badge);
  };

  return (
    <div className="space-y-8">
      {(Object.keys(CATEGORY_CONFIG) as BadgeCategory[]).map((category) => {
        const categoryBadges = groupedBadges[category];
        if (categoryBadges.length === 0) return null;

        const earnedCount = categoryBadges.filter((b) => b.earned).length;

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-lg font-semibold",
                  CATEGORY_CONFIG[category].color
                )}
              >
                {CATEGORY_CONFIG[category].label}
              </h3>
              <span className="text-sm text-gray-500">
                {earnedCount}/{categoryBadges.length} obtenus
              </span>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {categoryBadges.map((badge) => (
                <motion.div key={badge.id} variants={itemVariants}>
                  <BadgeDisplay
                    badge={badge}
                    onClick={() => handleBadgeClick(badge)}
                    showProgress={true}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Badge Detail Dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Details du Badge</DialogTitle>
          </DialogHeader>
          {selectedBadge && <BadgeDetail badge={selectedBadge} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
