"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PepiteCard, type Pepite, type SwipeDirection } from "./PepiteCard";
import { PepitesResults } from "./PepitesResults";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  X,
  Check,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MessageCircle,
  Users,
  Lightbulb,
  Target,
  Wrench,
  Heart,
  PenTool,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

// Sample pepites data using Lucide icons
const SAMPLE_PEPITES: Pepite[] = [
  {
    id: "1",
    name: "Communication efficace",
    description: "Capacite a transmettre clairement vos idees et a ecouter activement les autres.",
    icon: MessageCircle as LucideIcon,
    category: "communication",
    backContent: "La communication est la cle de toute relation professionnelle reussie. Developper cette competence vous aidera a mieux collaborer et a convaincre.",
  },
  {
    id: "2",
    name: "Leadership inspirant",
    description: "Capacite a motiver et guider une equipe vers un objectif commun.",
    icon: Users as LucideIcon,
    category: "leadership",
    backContent: "Un bon leader sait deleguer, motiver et inspirer. Cette pepite est essentielle pour progresser dans votre carriere.",
  },
  {
    id: "3",
    name: "Pensee creative",
    description: "Capacite a generer des idees novatrices et a resoudre des problemes de maniere originale.",
    icon: Lightbulb as LucideIcon,
    category: "creativity",
    backContent: "La creativite n'est pas reservee aux artistes. Elle est essentielle pour l'innovation et la resolution de problemes complexes.",
  },
  {
    id: "4",
    name: "Vision strategique",
    description: "Capacite a anticiper les tendances et a planifier sur le long terme.",
    icon: Target as LucideIcon,
    category: "strategy",
    backContent: "La vision strategique permet de prendre des decisions eclairees et de preparer l'avenir de votre organisation.",
  },
  {
    id: "5",
    name: "Maitrise technique",
    description: "Expertise dans votre domaine et capacite a utiliser les outils modernes.",
    icon: Wrench as LucideIcon,
    category: "technical",
    backContent: "La maitrise technique est fondamentale pour executer efficacement vos taches et rester competitif sur le marche.",
  },
  {
    id: "6",
    name: "Intelligence emotionnelle",
    description: "Capacite a comprendre et gerer vos emotions et celles des autres.",
    icon: Heart as LucideIcon,
    category: "interpersonal",
    backContent: "L'intelligence emotionnelle est cruciale pour construire des relations solides et naviguer dans les situations complexes.",
  },
  {
    id: "7",
    name: "Negociation",
    description: "Capacite a trouver des accords benefiques pour toutes les parties.",
    icon: PenTool as LucideIcon,
    category: "communication",
    backContent: "La negociation est un art qui permet de resoudre les conflits et de creer de la valeur dans les relations professionnelles.",
  },
  {
    id: "8",
    name: "Gestion de projet",
    description: "Capacite a planifier, executer et livrer des projets dans les delais et le budget.",
    icon: ClipboardList as LucideIcon,
    category: "strategy",
    backContent: "La gestion de projet est essentielle pour transformer les idees en realite de maniere structuree et efficace.",
  },
];

export interface PepiteResult {
  pepite: Pepite;
  decision: "have" | "want" | "not_priority";
}

interface PepitesGameProps {
  pepites?: Pepite[];
  onComplete?: (results: PepiteResult[]) => void;
  onRestart?: () => void;
}

export function PepitesGame({ pepites = SAMPLE_PEPITES, onComplete, onRestart }: PepitesGameProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [results, setResults] = React.useState<PepiteResult[]>([]);
  const [isComplete, setIsComplete] = React.useState(false);
  const [showInstructions, setShowInstructions] = React.useState(true);

  const currentPepite = pepites[currentIndex];
  const progress = ((pepites.length - currentIndex) / pepites.length) * 100;
  const totalAnswered = results.length;
  const totalCards = pepites.length;

  const handleSwipe = (direction: SwipeDirection) => {
    if (!currentPepite || !direction) return;

    const decisionMap: Record<string, PepiteResult["decision"]> = {
      left: "not_priority",
      right: "have",
      up: "want",
    };

    const newResult: PepiteResult = {
      pepite: currentPepite,
      decision: decisionMap[direction],
    };

    setResults((prev) => [...prev, newResult]);

    if (currentIndex < pepites.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
      onComplete?.([...results, newResult]);
    }
  };

  const handleActionButton = (decision: "have" | "want" | "not_priority") => {
    const directionMap: Record<string, SwipeDirection> = {
      not_priority: "left",
      have: "right",
      want: "up",
    };
    handleSwipe(directionMap[decision]);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setResults([]);
    setIsComplete(false);
    setShowInstructions(true);
    onRestart?.();
  };

  if (isComplete) {
    return (
      <PepitesResults
        results={results}
        onRestart={handleRestart}
        pepites={pepites}
      />
    );
  }

  return (
    <div className="relative w-full h-[100dvh] flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header with progress */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-lg mx-auto space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900 dark:text-white">
              Decouvrez vos pepites
            </span>
            <span className="text-gray-500">
              {totalAnswered + 1} / {totalCards}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Instructions overlay */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-center mb-4">Comment jouer ?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Glissez a gauche</p>
                    <p className="text-sm text-gray-500">Pas une priorite pour vous</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Glissez a droite</p>
                    <p className="text-sm text-gray-500">Vous avez deja cette competence</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <ChevronUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Glissez vers le haut</p>
                    <p className="text-sm text-gray-500">Vous voulez l'acquerir</p>
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                onClick={() => setShowInstructions(false)}
              >
                Commencer
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card stack area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Render cards in reverse order for proper stacking */}
        {pepites.slice(currentIndex).map((pepite, index) => (
          <PepiteCard
            key={pepite.id}
            pepite={pepite}
            onSwipe={handleSwipe}
            isTop={index === 0}
            index={index}
            totalCards={Math.min(3, pepites.length - currentIndex)}
            disabled={showInstructions}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div className="sticky bottom-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full border-2 border-rose-500 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
            onClick={() => handleActionButton("not_priority")}
          >
            <X className="w-6 h-6" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 rounded-full border-2 border-gray-400 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={handleRestart}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950"
            onClick={() => handleActionButton("want")}
          >
            <Sparkles className="w-6 h-6" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            onClick={() => handleActionButton("have")}
          >
            <Check className="w-6 h-6" />
          </Button>
        </div>

        {/* Labels for buttons */}
        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
          <span className="w-14 text-center">Pas priorite</span>
          <span className="w-12 text-center">Recommencer</span>
          <span className="w-14 text-center">Acquerir</span>
          <span className="w-14 text-center">J'ai</span>
        </div>
      </div>
    </div>
  );
}
