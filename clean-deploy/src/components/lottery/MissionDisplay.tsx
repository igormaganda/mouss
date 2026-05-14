"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  RefreshCw,
  Save,
  Share2,
  Edit3,
  Check,
  Copy,
  Twitter,
  Linkedin,
  Sparkles,
  Quote,
  Heart,
} from "lucide-react";
import type { Keyword } from "./KeywordSlot";
import { CATEGORY_COLORS } from "./KeywordSlot";

interface MissionDisplayProps {
  mission: string;
  keywords: Keyword[];
  onRegenerate: () => void;
  onSave: () => void;
  onShare: () => void;
}

// Mission templates based on keyword patterns
const generateMissionFromKeywords = (keywords: Keyword[]): string => {
  if (keywords.length === 0) return "";
  
  const industries = keywords.filter((k) => k.category === "industry");
  const values = keywords.filter((k) => k.category === "value");
  const impacts = keywords.filter((k) => k.category === "impact");
  const lifestyles = keywords.filter((k) => k.category === "lifestyle");

  const industry = industries[0]?.text || "mon domaine d'expertise";
  const value = values[0]?.text || "l'excellence";
  const impact = impacts[0]?.text || "positif";
  const lifestyle = lifestyles[0]?.text || "équilibré";

  const templates = [
    `Je m'engage à apporter une contribution ${impact.toLowerCase()} dans le secteur ${industry}, en plaçant ${value.toLowerCase()} au cœur de ma démarche professionnelle, avec un style de vie ${lifestyle.toLowerCase()}.`,
    
    `Ma mission: Transformer ${industry} grâce à ${value.toLowerCase()}, en créant un impact ${impact.toLowerCase()} tout en cultivant un mode de travail ${lifestyle.toLowerCase()}.`,
    
    `Je suis guidé(e) par ${value.toLowerCase()} dans ${industry}, visant un impact ${impact.toLowerCase()} sur mon environnement, avec une approche ${lifestyle.toLowerCase()} du travail.`,
    
    `Dans ${industry}, je m'engage à incarner ${value.toLowerCase()} et à générer un impact ${impact.toLowerCase()}, tout en maintenant un équilibre ${lifestyle.toLowerCase()}.`,
  ];

  // Use a hash of the keywords to pick a template consistently
  const hash = keywords.reduce((acc, k) => acc + k.id.charCodeAt(0), 0);
  return templates[hash % templates.length];
};

export function MissionDisplay({
  mission,
  keywords,
  onRegenerate,
  onSave,
  onShare,
}: MissionDisplayProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedMission, setEditedMission] = React.useState(mission);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  // Update edited mission when mission prop changes
  React.useEffect(() => {
    setEditedMission(mission);
    setIsSaved(false);
  }, [mission]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mission);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    onSave();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleEditSave = () => {
    setIsEditing(false);
    // The parent would handle the actual save with the edited content
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-rose-500/10 to-amber-500/10 rounded-3xl blur-xl" />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
        {/* Header gradient */}
        <div className="h-2 bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500" />
        
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-6 h-6 text-purple-500" />
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                Votre Mission Professionnelle
              </h2>
            </div>
          </div>

          {/* Keywords used */}
          <div className="flex flex-wrap gap-2 mb-6">
            {keywords.map((keyword) => {
              const colors = CATEGORY_COLORS[keyword.category];
              return (
                <motion.span
                  key={keyword.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * keywords.indexOf(keyword) }}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    colors.bg,
                    colors.text
                  )}
                >
                  {keyword.text}
                </motion.span>
              );
            })}
          </div>

          {/* Mission statement */}
          <motion.div
            layout
            className="relative mb-8"
          >
            {/* Quote decoration */}
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-purple-200 dark:text-purple-800 rotate-180" />
            
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <Textarea
                  value={editedMission}
                  onChange={(e) => setEditedMission(e.target.value)}
                  className="min-h-[150px] text-lg leading-relaxed bg-gray-50 dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-400 rounded-2xl p-6"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleEditSave} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
                    <Check className="w-4 h-4" />
                    Valider
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200 font-medium italic">
                  "{mission}"
                </p>
                
                {/* Heart decoration */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute bottom-4 right-4"
                >
                  <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onRegenerate}
              className="gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950"
            >
              <RefreshCw className="w-4 h-4" />
              Régénérer
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-2 border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950"
            >
              <Edit3 className="w-4 h-4" />
              Modifier
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCopy}
              className="gap-2 border-cyan-200 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-400 dark:hover:bg-cyan-950"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {isCopied ? "Copié!" : "Copier"}
            </Button>
            
            <Button
              onClick={handleSave}
              className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaved ? "Sauvegardé!" : "Sauvegarder"}
            </Button>
            
            <Button
              variant="default"
              onClick={onShare}
              className="gap-2 bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white"
            >
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
          </div>

          {/* Social share options (hidden by default, could be shown in a modal) */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">
              Partager sur les réseaux
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-cyan-100 text-cyan-600 hover:bg-cyan-200 dark:bg-cyan-900 dark:text-cyan-400"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-400"
              >
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export { generateMissionFromKeywords };
