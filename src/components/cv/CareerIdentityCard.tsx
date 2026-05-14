"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Share2,
  Download,
  Edit3,
  Target,
  Heart,
  Zap,
  Star,
  Crown,
  Shield,
  Flame,
  Compass,
} from "lucide-react";

export interface CareerIdentityCardProps {
  superPower: string;
  mission: string;
  values: string[];
  strengths: string[];
  language?: "fr" | "ar";
  onEdit?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  className?: string;
}

const valueIcons = [Heart, Shield, Flame, Compass, Star, Crown, Zap, Target];

const translations = {
  fr: {
    superPower: "Super-Pouvoir",
    mission: "Mission",
    values: "Valeurs",
    strengths: "Forces",
    share: "Partager",
    download: "Télécharger",
    edit: "Modifier",
    tagline: "Votre identité professionnelle unique",
  },
  ar: {
    superPower: "القوة الخارقة",
    mission: "المهمة",
    values: "القيم",
    strengths: "نقاط القوة",
    share: "مشاركة",
    download: "تحميل",
    edit: "تعديل",
    tagline: "هويتك المهنية الفريدة",
  },
};

export function CareerIdentityCard({
  superPower,
  mission,
  values,
  strengths,
  language = "fr",
  onEdit,
  onShare,
  onDownload,
  className,
}: CareerIdentityCardProps) {
  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full max-w-lg mx-auto", className)}
    >
      <Card className="relative overflow-hidden rounded-3xl border-0 shadow-2xl">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-amber-500 to-rose-500" />
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%),
                radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 30%)
              `,
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Header Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            className="flex justify-center mb-6"
          >
            <Badge className="bg-white/20 text-white border border-white/30 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1.5" />
              {t.tagline}
            </Badge>
          </motion.div>

          {/* Super Power */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <p className="text-white/70 text-sm font-medium mb-2 uppercase tracking-wide">
              {t.superPower}
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative inline-block"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
                {superPower}
              </h2>
              <motion.div
                className="absolute -inset-4 -z-10 rounded-2xl bg-white/10 blur-xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <p className="text-white/70 text-sm font-medium mb-2 uppercase tracking-wide flex items-center justify-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              {t.mission}
            </p>
            <p className="text-lg text-white/90 font-medium leading-relaxed max-w-sm mx-auto">
              {mission}
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <p className="text-white/70 text-xs font-medium mb-3 uppercase tracking-wide text-center">
              {t.values}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {values.slice(0, 5).map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-white/15 text-white border border-white/20 px-3 py-1.5 text-sm backdrop-blur-sm"
                    >
                      <Icon className="w-3 h-3 mr-1.5" />
                      {value}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <p className="text-white/70 text-xs font-medium mb-3 uppercase tracking-wide text-center">
              {t.strengths}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {strengths.slice(0, 5).map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border border-white/30 px-3 py-1 text-sm backdrop-blur-sm"
                  >
                    <Zap className="w-3 h-3 mr-1.5" />
                    {strength}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onEdit}
                className="bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm min-h-[44px] min-w-[44px]"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {t.edit}
              </Button>
            )}
            {onShare && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onShare}
                className="bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm min-h-[44px] min-w-[44px]"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t.share}
              </Button>
            )}
            {onDownload && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onDownload}
                className="bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm min-h-[44px] min-w-[44px]"
              >
                <Download className="w-4 h-4 mr-2" />
                {t.download}
              </Button>
            )}
          </motion.div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </Card>
    </motion.div>
  );
}

// A more compact version for embedding
export function CareerIdentityCardCompact({
  superPower,
  mission,
  values,
  strengths,
  language = "fr",
  onEdit,
  className,
}: CareerIdentityCardProps) {
  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("w-full", className)}
    >
      <Card className="relative overflow-hidden rounded-2xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-amber-50 to-rose-50 dark:from-purple-950/30 dark:via-amber-950/30 dark:to-rose-950/30">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  {t.superPower}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                {superPower}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {mission}
              </p>
            </div>
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="shrink-0 h-10 w-10 text-purple-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/50"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {values.slice(0, 3).map((value, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300"
              >
                {value}
              </Badge>
            ))}
            {strengths.slice(0, 2).map((strength, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
              >
                {strength}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default CareerIdentityCard;
