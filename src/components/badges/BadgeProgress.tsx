"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { type BadgeData, RARITY_CONFIG } from "./BadgeDisplay";
import {
  Trophy,
  Star,
  Target,
  TrendingUp,
  Zap,
  Crown,
  Award,
  Medal,
  ChevronRight,
} from "lucide-react";

// Level configuration based on points
const LEVELS = [
  { name: "Debutant", minPoints: 0, icon: Medal, color: "text-gray-500", bg: "bg-gray-100" },
  { name: "Apprenti", minPoints: 100, icon: Award, color: "text-emerald-500", bg: "bg-emerald-100" },
  { name: "Explorateur", minPoints: 300, icon: Target, color: "text-cyan-500", bg: "bg-cyan-100" },
  { name: "Aventurier", minPoints: 500, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-100" },
  { name: "Expert", minPoints: 800, icon: Trophy, color: "text-purple-500", bg: "bg-purple-100" },
  { name: "Maitre", minPoints: 1100, icon: Crown, color: "text-orange-500", bg: "bg-orange-100" },
  { name: "Legende", minPoints: 1500, icon: Crown, color: "text-rose-500", bg: "bg-rose-100" },
];

// Get current level based on points
function getCurrentLevel(points: number) {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].minPoints) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i];
    }
  }

  const currentLevelPoints = currentLevel.minPoints;
  const nextLevelPoints = nextLevel.minPoints;
  const progressInLevel = points - currentLevelPoints;
  const pointsNeededForNext = nextLevelPoints - currentLevelPoints;
  const progressPercent = nextLevel === currentLevel
    ? 100
    : Math.round((progressInLevel / pointsNeededForNext) * 100);

  return {
    current: currentLevel,
    next: nextLevel,
    progressPercent,
    pointsToNextLevel: nextLevelPoints - points,
  };
}

interface BadgeProgressProps {
  badges: BadgeData[];
  showNextBadge?: boolean;
  compact?: boolean;
}

export function BadgeProgress({
  badges,
  showNextBadge = true,
  compact = false,
}: BadgeProgressProps) {
  // Calculate stats
  const stats = React.useMemo(() => {
    const earned = badges.filter((b) => b.earned);
    const totalPoints = earned.reduce((sum, b) => sum + b.points, 0);
    const totalPossiblePoints = badges.reduce((sum, b) => sum + b.points, 0);
    const level = getCurrentLevel(totalPoints);

    // Find next badge to earn (closest to completion among unearned)
    const unearnedBadges = badges
      .filter((b) => !b.earned && b.progress !== undefined && b.maxProgress !== undefined)
      .map((b) => ({
        ...b,
        progressPercent: (b.progress! / b.maxProgress!) * 100,
      }))
      .sort((a, b) => b.progressPercent - a.progressPercent);

    const nextBadge = unearnedBadges[0] || null;

    return {
      totalBadges: badges.length,
      earnedBadges: earned.length,
      totalPoints,
      totalPossiblePoints,
      level,
      nextBadge,
      progressPercent: Math.round((earned.length / badges.length) * 100),
    };
  }, [badges]);

  const LevelIcon = stats.level.current.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", stats.level.current.bg)}>
          <LevelIcon className={cn("w-5 h-5", stats.level.current.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{stats.level.current.name}</span>
            <span className="text-xs text-gray-500">{stats.totalPoints} pts</span>
          </div>
          <Progress
            value={stats.level.progressPercent}
            className="h-1.5 mt-1"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Level Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-white" />
        </div>

        <div className="relative">
          {/* Current Level */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                stats.level.current.bg
              )}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LevelIcon className={cn("w-8 h-8", stats.level.current.color)} />
            </motion.div>

            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold"
              >
                {stats.level.current.name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400"
              >
                Niveau actuel
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-right"
            >
              <p className="text-3xl font-bold">{stats.totalPoints}</p>
              <p className="text-gray-400 text-sm">points</p>
            </motion.div>
          </div>

          {/* Progress to Next Level */}
          {stats.level.next !== stats.level.current && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Progression vers {stats.level.next.name}</span>
                <span className="font-medium">
                  {stats.level.pointsToNextLevel} pts restants
                </span>
              </div>
              <Progress
                value={stats.level.progressPercent}
                className="h-3 bg-gray-700"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Badges Earned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.earnedBadges}</p>
              <p className="text-sm text-gray-500">Badges</p>
            </div>
          </div>
        </motion.div>

        {/* Total Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalPoints}</p>
              <p className="text-sm text-gray-500">Points</p>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.progressPercent}%</p>
              <p className="text-sm text-gray-500">Progression</p>
            </div>
          </div>
        </motion.div>

        {/* Next Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-bold truncate">{stats.level.next.name}</p>
              <p className="text-sm text-gray-500">Prochain niveau</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Next Badge to Earn */}
      {showNextBadge && stats.nextBadge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Prochain badge a debloquer
              </p>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{stats.nextBadge.name}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-2">
                <Progress
                  value={stats.nextBadge.progressPercent}
                  className="h-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {stats.nextBadge.progress}/{stats.nextBadge.maxProgress} complete
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium text-white",
                  `bg-gradient-to-r ${RARITY_CONFIG[stats.nextBadge.rarity].gradient}`
                )}
              >
                +{stats.nextBadge.points} pts
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Mini progress tracker for sidebar/header
interface MiniBadgeProgressProps {
  badges: BadgeData[];
}

export function MiniBadgeProgress({ badges }: MiniBadgeProgressProps) {
  const stats = React.useMemo(() => {
    const earned = badges.filter((b) => b.earned);
    const totalPoints = earned.reduce((sum, b) => sum + b.points, 0);
    const level = getCurrentLevel(totalPoints);

    return {
      earned: earned.length,
      total: badges.length,
      totalPoints,
      level,
    };
  }, [badges]);

  const LevelIcon = stats.level.current.icon;

  return (
    <div className="flex items-center gap-3 p-2">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          stats.level.current.bg
        )}
      >
        <LevelIcon className={cn("w-4 h-4", stats.level.current.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{stats.level.current.name}</span>
          <span className="text-gray-500">{stats.totalPoints} pts</span>
        </div>
        <Progress
          value={stats.level.progressPercent}
          className="h-1 mt-1"
        />
      </div>
    </div>
  );
}
