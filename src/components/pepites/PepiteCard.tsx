"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { CategoryBadge, type PepiteCategory, CATEGORY_CONFIG } from "./CategoryBadge";
import {
  Sparkles,
  X,
  Check,
  ArrowUp,
  type LucideIcon,
} from "lucide-react";

export interface Pepite {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: PepiteCategory;
  backContent?: string;
}

export type SwipeDirection = "left" | "right" | "up" | null;

interface PepiteCardProps {
  pepite: Pepite;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
  index: number;
  totalCards: number;
  disabled?: boolean;
}

const SWIPE_THRESHOLD = 100;
const ROTATION_RANGE = 30;

export function PepiteCard({ pepite, onSwipe, isTop, index, totalCards, disabled = false }: PepiteCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform values for visual feedback
  const rotateZ = useTransform(x, [-300, 0, 300], [-ROTATION_RANGE, 0, ROTATION_RANGE]);
  const rotateY = useTransform(x, [-300, 0, 300], [15, 0, -15]);
  const rotateX = useTransform(y, [-300, 0, 300], [15, 0, -15]);

  // Opacity for swipe indicators
  const leftOpacity = useTransform(x, [-SWIPE_THRESHOLD * 2, -SWIPE_THRESHOLD, 0], [1, 0.5, 0]);
  const rightOpacity = useTransform(x, [0, SWIPE_THRESHOLD, SWIPE_THRESHOLD * 2], [0, 0.5, 1]);
  const upOpacity = useTransform(y, [-SWIPE_THRESHOLD * 2, -SWIPE_THRESHOLD, 0], [1, 0.5, 0]);

  // Background color overlay based on swipe direction
  const backgroundColor = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      if (latestX < -SWIPE_THRESHOLD) return "rgba(239, 68, 68, 0.2)"; // rose
      if (latestX > SWIPE_THRESHOLD) return "rgba(34, 197, 94, 0.2)"; // emerald
      if (latestY < -SWIPE_THRESHOLD) return "rgba(168, 85, 247, 0.2)"; // purple
      return "rgba(255, 255, 255, 0)";
    }
  );

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const { offset, velocity } = info;

    // Determine swipe direction based on offset and velocity
    const swipe = Math.sqrt(offset.x ** 2 + offset.y ** 2);
    const swipeVelocity = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

    if (swipe > SWIPE_THRESHOLD || swipeVelocity > 500) {
      if (Math.abs(offset.x) > Math.abs(offset.y)) {
        // Horizontal swipe
        if (offset.x > 0) {
          animateCardOut("right");
        } else {
          animateCardOut("left");
        }
      } else if (offset.y < 0) {
        // Swipe up
        animateCardOut("up");
      } else {
        // Swipe down - reset position
        animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
        animate(y, 0, { type: "spring", stiffness: 500, damping: 30 });
      }
    } else {
      // Reset position
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
      animate(y, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  const animateCardOut = (direction: SwipeDirection) => {
    if (!direction) return;

    const exitX = direction === "left" ? -500 : direction === "right" ? 500 : 0;
    const exitY = direction === "up" ? -500 : 0;
    const exitRotate = direction === "left" ? -30 : direction === "right" ? 30 : 0;

    animate(x, exitX, { duration: 0.3 });
    animate(y, exitY, { duration: 0.3 });

    setTimeout(() => {
      onSwipe(direction);
      // Reset for next card
      x.set(0);
      y.set(0);
    }, 300);
  };

  const handleFlip = () => {
    if (!isDragging) {
      setIsFlipped(!isFlipped);
    }
  };

  const Icon = pepite.icon;
  const categoryConfig = CATEGORY_CONFIG[pepite.category];

  // Stack effect - cards behind are slightly smaller and offset
  const stackOffset = totalCards - index - 1;
  const scale = 1 - stackOffset * 0.02;
  const translateY = stackOffset * 8;

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          scale,
          y: translateY,
          zIndex: index,
        }}
      >
        <div
          className={cn(
            "w-[85vw] max-w-sm h-[60vh] max-h-[500px] rounded-3xl shadow-xl",
            "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
            "border border-gray-200 dark:border-gray-700"
          )}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 flex items-center justify-center touch-none"
      style={{
        x,
        y,
        rotateZ,
        rotateY: isFlipped ? 180 : rotateY,
        rotateX: isFlipped ? 180 : rotateX,
        zIndex: index,
        backgroundColor,
        perspective: 1000,
      }}
      drag={isTop && !isFlipped && !disabled}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onTap={handleFlip}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      <motion.div
        className={cn(
          "w-[85vw] max-w-sm h-[60vh] max-h-[500px] rounded-3xl shadow-2xl overflow-hidden",
          "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950",
          "border-2 border-gray-100 dark:border-gray-800",
          "relative preserve-3d"
        )}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Front face */}
        <div
          className={cn(
            "absolute inset-0 p-6 flex flex-col",
            "backface-hidden"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Category badge */}
          <div className="flex justify-between items-start">
            <CategoryBadge category={pepite.category} size="md" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-xs"
            >
              Tap to flip
            </motion.div>
          </div>

          {/* Icon */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center",
                categoryConfig.gradient,
                "shadow-lg"
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          {/* Name and description */}
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {pepite.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {pepite.description}
            </p>
          </div>

          {/* Swipe indicators */}
          <motion.div
            className="absolute top-6 right-6 bg-rose-500 text-white rounded-full p-2 shadow-lg"
            style={{ opacity: leftOpacity }}
          >
            <X className="w-6 h-6" />
          </motion.div>
          <motion.div
            className="absolute top-6 left-6 bg-emerald-500 text-white rounded-full p-2 shadow-lg"
            style={{ opacity: rightOpacity }}
          >
            <Check className="w-6 h-6" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-purple-500 text-white rounded-full p-2 shadow-lg"
            style={{ opacity: upOpacity }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Back face */}
        <div
          className={cn(
            "absolute inset-0 p-6 flex flex-col items-center justify-center",
            "bg-gradient-to-br from-gray-900 to-gray-950",
            "backface-hidden"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-center space-y-4"
          >
            <div className={cn(
              "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
              categoryConfig.gradient
            )}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white">{pepite.name}</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {pepite.backContent || "Cette pepite represente une competence cle pour votre developpement professionnel."}
            </p>
            <div className="pt-4">
              <CategoryBadge category={pepite.category} />
            </div>
            <p className="text-gray-500 text-xs pt-4">
              Tap to flip back
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Direction labels */}
      <motion.div
        className="absolute top-1/2 left-4 -translate-y-1/2 text-rose-500 font-bold text-lg"
        style={{ opacity: leftOpacity }}
      >
        <div className="flex items-center gap-1">
          <ArrowUp className="w-5 h-5 -rotate-90" />
          <span>Pas priorite</span>
        </div>
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-4 -translate-y-1/2 text-emerald-500 font-bold text-lg"
        style={{ opacity: rightOpacity }}
      >
        <div className="flex items-center gap-1">
          <span>Je l'ai</span>
          <ArrowUp className="w-5 h-5 rotate-90" />
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-purple-500 font-bold text-lg"
        style={{ opacity: upOpacity }}
      >
        <div className="flex items-center gap-1">
          <ArrowUp className="w-5 h-5" />
          <span>Je veux acquérir</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
