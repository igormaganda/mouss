"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";

export type KeywordCategory = "industry" | "value" | "impact" | "lifestyle";

export interface Keyword {
  id: string;
  text: string;
  category: KeywordCategory;
  emoji?: string;
}

interface KeywordSlotProps {
  keywords: Keyword[];
  isSpinning: boolean;
  isStopped: boolean;
  selectedKeyword: Keyword | null;
  onStartSpin: () => void;
  onKeep: (keyword: Keyword) => void;
  onDiscard: () => void;
  slotIndex: number;
}

const CATEGORY_COLORS: Record<KeywordCategory, { bg: string; text: string; border: string; gradient: string }> = {
  industry: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-700",
    gradient: "from-emerald-500 to-emerald-600",
  },
  value: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-700",
    gradient: "from-amber-500 to-amber-600",
  },
  impact: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-700",
    gradient: "from-purple-500 to-purple-600",
  },
  lifestyle: {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-700",
    gradient: "from-rose-500 to-rose-600",
  },
};

const CATEGORY_LABELS: Record<KeywordCategory, string> = {
  industry: "Industrie",
  value: "Valeur",
  impact: "Impact",
  lifestyle: "Style de vie",
};

export function KeywordSlot({
  keywords,
  isSpinning,
  isStopped,
  selectedKeyword,
  onKeep,
  onDiscard,
  slotIndex,
}: KeywordSlotProps) {
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [spinSpeed, setSpinSpeed] = React.useState(50);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Spinning effect
  React.useEffect(() => {
    if (isSpinning && keywords.length > 0) {
      let speed = 50;
      const speedUp = () => {
        speed = Math.max(20, speed - 5);
        setSpinSpeed(speed);
      };
      
      intervalRef.current = setInterval(() => {
        setDisplayIndex((prev) => (prev + 1) % keywords.length);
        speedUp();
      }, speed);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isSpinning, keywords.length]);

  // Stopping effect - slow down and land on selected
  React.useEffect(() => {
    if (isStopped && selectedKeyword) {
      const targetIndex = keywords.findIndex((k) => k.id === selectedKeyword.id);
      
      // Slow down animation
      let delay = 100;
      let currentIndex = displayIndex;
      
      const slowDown = () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        const animate = () => {
          if (currentIndex !== targetIndex) {
            currentIndex = (currentIndex + 1) % keywords.length;
            setDisplayIndex(currentIndex);
            delay += 50;
            intervalRef.current = setTimeout(animate, delay);
          }
        };
        animate();
      };
      
      slowDown();
    }
  }, [isStopped, selectedKeyword, keywords, displayIndex]);

  const currentKeyword = keywords[displayIndex] || keywords[0];
  const categoryColor = currentKeyword ? CATEGORY_COLORS[currentKeyword.category] : CATEGORY_COLORS.industry;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: slotIndex * 0.15 }}
    >
      {/* Slot machine frame */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg">
        {/* Top shine effect */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/50 to-transparent dark:from-white/10 pointer-events-none z-10" />
        
        {/* Slot window */}
        <div className="relative h-24 flex items-center justify-center overflow-hidden">
          {/* Spinning keywords */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isSpinning ? displayIndex : selectedKeyword?.id || "stopped"}
              initial={isSpinning ? { y: -60, opacity: 0 } : { scale: 0.8, opacity: 0 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={isSpinning ? { y: 60, opacity: 0 } : { scale: 0.8, opacity: 0 }}
              transition={
                isSpinning
                  ? { duration: 0.05 }
                  : { type: "spring", stiffness: 300, damping: 20 }
              }
              className="absolute inset-0 flex items-center justify-center"
            >
              {currentKeyword && (
                <div className="flex flex-col items-center gap-1">
                  <span className={cn(
                    "text-2xl font-bold px-6 py-2 rounded-xl border-2",
                    categoryColor.bg,
                    categoryColor.text,
                    categoryColor.border
                  )}>
                    {currentKeyword.emoji && <span className="mr-2">{currentKeyword.emoji}</span>}
                    {currentKeyword.text}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {CATEGORY_LABELS[currentKeyword.category]}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Spinning blur effect overlay */}
          {isSpinning && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/30 to-transparent dark:via-gray-800/30 pointer-events-none"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          )}
        </div>

        {/* Slot machine lights */}
        <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col justify-around py-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                isSpinning ? "bg-amber-400" : isStopped && selectedKeyword ? "bg-emerald-400" : "bg-gray-300 dark:bg-gray-600"
              )}
              animate={
                isSpinning
                  ? { opacity: [0.3, 1, 0.3] }
                  : isStopped && selectedKeyword
                  ? { scale: [1, 1.2, 1] }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: isSpinning ? Infinity : 0,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-2 flex flex-col justify-around py-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                isSpinning ? "bg-amber-400" : isStopped && selectedKeyword ? "bg-emerald-400" : "bg-gray-300 dark:bg-gray-600"
              )}
              animate={
                isSpinning
                  ? { opacity: [1, 0.3, 1] }
                  : isStopped && selectedKeyword
                  ? { scale: [1, 1.2, 1] }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: isSpinning ? Infinity : 0,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Keep/Discard buttons */}
      <AnimatePresence>
        {isStopped && selectedKeyword && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex justify-center gap-3 mt-4"
          >
            <Button
              onClick={() => onKeep(selectedKeyword)}
              variant="default"
              className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shadow-lg shadow-emerald-500/30"
            >
              <Check className="w-4 h-4" />
              Garder
            </Button>
            <Button
              onClick={onDiscard}
              variant="outline"
              className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-950 gap-2"
            >
              <X className="w-4 h-4" />
              Rejeter
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { CATEGORY_COLORS, CATEGORY_LABELS };
