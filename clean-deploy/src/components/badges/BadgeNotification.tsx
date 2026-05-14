"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { type BadgeData, RARITY_CONFIG } from "./BadgeDisplay";
import {
  Sparkles,
  Trophy,
  X,
  PartyPopper,
  Star,
} from "lucide-react";

interface BadgeNotificationProps {
  badge: BadgeData | null;
  isOpen: boolean;
  onClose: () => void;
  autoDismissMs?: number;
}

// Celebration particles component
function CelebrationParticles() {
  const particles = Array.from({ length: 30 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{
            y: -20,
            x: 0,
            rotate: 0,
            scale: 0,
          }}
          animate={{
            y: [0, -100 - Math.random() * 100],
            x: [(Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 360],
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        >
          {i % 4 === 0 ? (
            <Star
              className={cn(
                "w-3 h-3",
                ["text-amber-400", "text-emerald-400", "text-purple-400", "text-rose-400"][
                  i % 4
                ]
              )}
              fill="currentColor"
            />
          ) : i % 4 === 1 ? (
            <Sparkles className="w-3 h-3 text-cyan-400" />
          ) : i % 4 === 2 ? (
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                ["bg-amber-400", "bg-emerald-400", "bg-purple-400", "bg-rose-400"][
                  i % 4
                ]
              )}
            />
          ) : (
            <PartyPopper className="w-3 h-3 text-orange-400" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Confetti burst
function ConfettiBurst() {
  const confetti = Array.from({ length: 20 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confetti.map((_, i) => {
        const angle = (i / confetti.length) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;

        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            initial={{ x: 0, y: 0, rotate: 0, scale: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              rotate: Math.random() * 720 - 360,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.02,
              ease: "easeOut",
            }}
          >
            <div
              className={cn(
                "w-3 h-1.5 rounded-sm",
                [
                  "bg-amber-400",
                  "bg-emerald-400",
                  "bg-purple-400",
                  "bg-rose-400",
                  "bg-cyan-400",
                  "bg-orange-400",
                ][i % 6]
              )}
              style={{
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export function BadgeNotification({
  badge,
  isOpen,
  onClose,
  autoDismissMs = 5000,
}: BadgeNotificationProps) {
  const [progress, setProgress] = React.useState(100);
  const [showConfetti, setShowConfetti] = React.useState(true);

  React.useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      setShowConfetti(true);
      return;
    }

    // Auto-dismiss with progress
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / autoDismissMs) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    // Hide confetti after animation
    const confettiTimer = setTimeout(() => setShowConfetti(false), 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(confettiTimer);
    };
  }, [isOpen, autoDismissMs, onClose]);

  if (!badge) return null;

  const rarityConfig = RARITY_CONFIG[badge.rarity];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-4 right-4 z-[100] max-w-sm w-full"
        >
          <div
            className={cn(
              "relative rounded-2xl p-4 shadow-2xl overflow-hidden",
              "bg-gradient-to-br",
              rarityConfig.gradient,
              "border-2",
              rarityConfig.border
            )}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/30" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/20" />
            </div>

            {/* Confetti */}
            {showConfetti && <ConfettiBurst />}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Content */}
            <div className="relative flex items-center gap-4">
              {/* Badge Icon */}
              <motion.div
                className="relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  delay: 0.1,
                }}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {badge.emoji ? (
                    <span className="text-3xl">{badge.emoji}</span>
                  ) : (
                    <Trophy className="w-8 h-8 text-white" />
                  )}
                </div>

                {/* Glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white/80 text-sm font-medium">
                    Badge Debloque !
                  </span>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-white mt-1 truncate"
                >
                  {badge.name}
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 mt-2"
                >
                  <span className="text-white/90 font-semibold">
                    +{badge.points} points
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">
                    {rarityConfig.label}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Progress bar for auto-dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3"
            >
              <Progress
                value={progress}
                className="h-1 bg-white/20"
              />
            </motion.div>

            {/* Celebration particles */}
            {showConfetti && <CelebrationParticles />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Badge Notification Manager - handles showing multiple badges
interface BadgeNotificationManagerProps {
  badges: BadgeData[];
  onComplete?: () => void;
}

export function BadgeNotificationManager({
  badges,
  onComplete,
}: BadgeNotificationManagerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(badges.length > 0);

  const currentBadge = badges[currentIndex] || null;

  const handleClose = () => {
    if (currentIndex < badges.length - 1) {
      // Show next badge
      setCurrentIndex((prev) => prev + 1);
    } else {
      // All badges shown
      setIsOpen(false);
      onComplete?.();
    }
  };

  return (
    <BadgeNotification
      badge={currentBadge}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
}

// Inline celebration component for embedding in pages
interface InlineCelebrationProps {
  badge: BadgeData;
  visible: boolean;
  onComplete?: () => void;
}

export function InlineCelebration({
  badge,
  visible,
  onComplete,
}: InlineCelebrationProps) {
  React.useEffect(() => {
    if (visible && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  const rarityConfig = RARITY_CONFIG[badge.rarity];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          className={cn(
            "relative p-6 rounded-2xl text-center overflow-hidden",
            "bg-gradient-to-br",
            rarityConfig.gradient
          )}
        >
          <ConfettiBurst />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4"
          >
            {badge.emoji ? (
              <span className="text-4xl">{badge.emoji}</span>
            ) : (
              <Trophy className="w-10 h-10 text-white" />
            )}
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-2"
          >
            {badge.name}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80"
          >
            {badge.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex justify-center gap-3"
          >
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-semibold">
              +{badge.points} points
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white">
              {rarityConfig.label}
            </span>
          </motion.div>

          <CelebrationParticles />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
