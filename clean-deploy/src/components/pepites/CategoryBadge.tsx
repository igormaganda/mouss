"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Users,
  Lightbulb,
  Target,
  Wrench,
  Heart,
  type LucideIcon,
} from "lucide-react";

export type PepiteCategory =
  | "communication"
  | "leadership"
  | "creativity"
  | "strategy"
  | "technical"
  | "interpersonal";

interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  gradient: string;
  textColor: string;
  borderColor: string;
}

const CATEGORY_CONFIG: Record<PepiteCategory, CategoryConfig> = {
  communication: {
    label: "Communication",
    icon: MessageCircle,
    gradient: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    textColor: "text-white",
    borderColor: "border-emerald-400",
  },
  leadership: {
    label: "Leadership",
    icon: Users,
    gradient: "bg-gradient-to-r from-amber-500 to-amber-600",
    textColor: "text-white",
    borderColor: "border-amber-400",
  },
  creativity: {
    label: "Creativite",
    icon: Lightbulb,
    gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
    textColor: "text-white",
    borderColor: "border-purple-400",
  },
  strategy: {
    label: "Strategie",
    icon: Target,
    gradient: "bg-gradient-to-r from-rose-500 to-rose-600",
    textColor: "text-white",
    borderColor: "border-rose-400",
  },
  technical: {
    label: "Technique",
    icon: Wrench,
    gradient: "bg-gradient-to-r from-cyan-500 to-cyan-600",
    textColor: "text-white",
    borderColor: "border-cyan-400",
  },
  interpersonal: {
    label: "Interpersonnel",
    icon: Heart,
    gradient: "bg-gradient-to-r from-orange-500 to-orange-600",
    textColor: "text-white",
    borderColor: "border-orange-400",
  },
};

interface CategoryBadgeProps {
  category: PepiteCategory;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CategoryBadge({
  category,
  className,
  showIcon = true,
  size = "md",
}: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconSizes = {
    sm: "size-3",
    md: "size-3.5",
    lg: "size-4",
  };

  return (
    <Badge
      className={cn(
        config.gradient,
        config.textColor,
        config.borderColor,
        "border shadow-sm font-medium gap-1.5",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  );
}

export { CATEGORY_CONFIG };
