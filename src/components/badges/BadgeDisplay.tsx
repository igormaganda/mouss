"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Medal,
  Award,
  Star,
  Crown,
  Sparkles,
  Lock,
  Check,
  type LucideIcon,
} from "lucide-react";

// Badge Types
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";
export type BadgeCategory = "exploration" | "completion" | "achievement";

export interface BadgeData {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  icon: string;
  emoji?: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  points: number;
  earned: boolean;
  earnedAt?: Date | null;
  progress?: number;
  maxProgress?: number;
}

// Rarity configuration with color schemes (NO indigo/blue)
export const RARITY_CONFIG: Record<
  BadgeRarity,
  {
    gradient: string;
    border: string;
    glow: string;
    label: string;
    icon: LucideIcon;
    stars: number;
  }
> = {
  common: {
    gradient: "from-gray-400 to-gray-500",
    border: "border-gray-300",
    glow: "shadow-gray-400/30",
    label: "Commun",
    icon: Medal,
    stars: 1,
  },
  rare: {
    gradient: "from-emerald-400 to-emerald-600",
    border: "border-emerald-400",
    glow: "shadow-emerald-500/40",
    label: "Rare",
    icon: Award,
    stars: 2,
  },
  epic: {
    gradient: "from-purple-400 to-purple-600",
    border: "border-purple-400",
    glow: "shadow-purple-500/40",
    label: "Epique",
    icon: Trophy,
    stars: 3,
  },
  legendary: {
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    border: "border-amber-400",
    glow: "shadow-amber-500/50",
    label: "Legendaire",
    icon: Crown,
    stars: 4,
  },
};

// Category configuration
export const CATEGORY_CONFIG: Record<
  BadgeCategory,
  { label: string; color: string }
> = {
  exploration: {
    label: "Exploration",
    color: "text-cyan-500",
  },
  completion: {
    label: "Completion",
    color: "text-emerald-500",
  },
  achievement: {
    label: "Accomplissement",
    color: "text-amber-500",
  },
};

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  trophy: Trophy,
  medal: Medal,
  award: Award,
  star: Star,
  crown: Crown,
  sparkles: Sparkles,
};

interface BadgeDisplayProps {
  badge: BadgeData;
  onClick?: () => void;
  showProgress?: boolean;
  isAnimating?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BadgeDisplay({
  badge,
  onClick,
  showProgress = true,
  isAnimating = false,
  size = "md",
}: BadgeDisplayProps) {
  const [showCelebration, setShowCelebration] = React.useState(isAnimating);

  React.useEffect(() => {
    if (isAnimating) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const rarityConfig = RARITY_CONFIG[badge.rarity];
  const categoryConfig = CATEGORY_CONFIG[badge.category];
  const IconComponent = ICON_MAP[badge.icon] || Trophy;

  // Size variants
  const sizeConfig = {
    sm: {
      container: "w-20 h-24",
      icon: "w-8 h-8",
      text: "text-xs",
      points: "text-[10px]",
    },
    md: {
      container: "w-28 h-36",
      icon: "w-12 h-12",
      text: "text-sm",
      points: "text-xs",
    },
    lg: {
      container: "w-36 h-44",
      icon: "w-16 h-16",
      text: "text-base",
      points: "text-sm",
    },
  };

  const config = sizeConfig[size];
  const progressPercent = badge.progress && badge.maxProgress
    ? (badge.progress / badge.maxProgress) * 100
    : 0;

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer touch-manipulation",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        badge.earned ? rarityConfig.border : "border-gray-200"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Badge Container */}
      <div
        className={cn(
          config.container,
          "rounded-2xl border-2 flex flex-col items-center justify-center p-2 relative overflow-hidden",
          badge.earned
            ? `bg-gradient-to-br ${rarityConfig.gradient} ${rarityConfig.border}`
            : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-gray-300 dark:border-gray-700"
        )}
      >
        {/* Rarity Stars */}
        {badge.earned && (
          <div className="absolute top-1 left-1 flex gap-0.5">
            {Array.from({ length: rarityConfig.stars }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="w-2.5 h-2.5 fill-white/90 text-white/90" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Locked Overlay */}
        {!badge.earned && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Lock className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </motion.div>
        )}

        {/* Icon/Emoji */}
        <motion.div
          className={cn(
            "relative flex items-center justify-center",
            badge.earned ? "text-white" : "text-gray-400"
          )}
          animate={
            badge.earned && showCelebration
              ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          {badge.emoji ? (
            <span className={cn(config.icon, "leading-none")}>
              {badge.emoji}
            </span>
          ) : (
            <IconComponent className={config.icon} />
          )}
        </motion.div>

        {/* Badge Name */}
        <span
          className={cn(
            config.text,
            "font-semibold mt-1 text-center leading-tight",
            badge.earned
              ? "text-white"
              : "text-gray-500 dark:text-gray-400"
          )}
        >
          {badge.name}
        </span>

        {/* Points */}
        <div
          className={cn(
            config.points,
            "flex items-center gap-0.5 mt-0.5",
            badge.earned
              ? "text-white/80"
              : "text-gray-400 dark:text-gray-500"
          )}
        >
          <Sparkles className="w-3 h-3" />
          <span>{badge.points} pts</span>
        </div>

        {/* Progress Bar (for unearned badges with progress) */}
        {showProgress && !badge.earned && badge.progress !== undefined && badge.maxProgress && (
          <div className="w-full mt-2 px-1">
            <Progress
              value={progressPercent}
              className="h-1 bg-gray-300 dark:bg-gray-700"
            />
            <p className="text-[10px] text-gray-500 text-center mt-0.5">
              {badge.progress}/{badge.maxProgress}
            </p>
          </div>
        )}

        {/* Earned Checkmark */}
        {badge.earned && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-lg"
          >
            <Check className="w-3 h-3 text-emerald-500" />
          </motion.div>
        )}

        {/* Celebration Particles */}
        <AnimatePresence>
          {showCelebration && badge.earned && (
            <>
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: [
                      "#fbbf24",
                      "#34d399",
                      "#a855f7",
                      "#f43f5e",
                      "#06b6d4",
                    ][i % 5],
                    top: "50%",
                    left: "50%",
                  }}
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 100],
                    y: [0, (Math.random() - 0.5) * 100 - 20],
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Glow Effect */}
      {badge.earned && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-2xl opacity-50 blur-xl -z-10",
            `bg-gradient-to-br ${rarityConfig.gradient}`
          )}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// Badge Detail Modal Content
export function BadgeDetail({ badge }: { badge: BadgeData }) {
  const rarityConfig = RARITY_CONFIG[badge.rarity];
  const categoryConfig = CATEGORY_CONFIG[badge.category];

  return (
    <div className="text-center p-4">
      <BadgeDisplay badge={badge} size="lg" showProgress={true} />

      <div className="mt-4 space-y-2">
        <p className="text-gray-600 dark:text-gray-300">{badge.description}</p>

        <div className="flex justify-center gap-2 mt-3">
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              `bg-gradient-to-r ${rarityConfig.gradient} text-white`
            )}
          >
            {rarityConfig.label}
          </span>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800",
              categoryConfig.color
            )}
          >
            {categoryConfig.label}
          </span>
        </div>

        {badge.earned && badge.earnedAt && (
          <p className="text-sm text-gray-500 mt-3">
            Obtenu le {new Date(badge.earnedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
