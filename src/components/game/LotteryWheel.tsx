"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  RotateCcw,
  Check,
  X,
  ChevronRight,
  Lightbulb,
  Heart,
  DollarSign,
  Globe,
  Users,
  Palette,
  Crown,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { 
  LOTTERY_KEYWORDS, 
  PROJECTOR_VECTORS,
  type AspirationKeyword,
  type UserVectorScore,
} from "@/data/projector-vectors";

interface LotteryWheelProps {
  onComplete: (selectedKeywords: AspirationKeyword[], vectorScores: UserVectorScore[]) => void;
  onBack?: () => void;
}

// Roue de loterie gamifiée
export function LotteryWheel({ onComplete, onBack }: LotteryWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState<AspirationKeyword | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<AspirationKeyword[]>([]);
  const [rejectedKeywords, setRejectedKeywords] = useState<Set<string>>(new Set());
  const [round, setRound] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const MAX_ROUNDS = 15; // Nombre de mots-clés à passer en revue
  const SELECTION_LIMIT = 8; // Maximum de mots-clés sélectionnables

  // Animation de rotation
  const spinWheel = () => {
    if (isSpinning || selectedKeywords.length >= SELECTION_LIMIT) return;
    
    setIsSpinning(true);
    
    // Simuler la rotation avec plusieurs mots qui défilent
    let spinCount = 0;
    const maxSpins = 10 + Math.floor(Math.random() * 5);
    
    const spinInterval = setInterval(() => {
      const availableKeywords = LOTTERY_KEYWORDS.filter(
        k => !rejectedKeywords.has(k.id) && !selectedKeywords.find(s => s.id === k.id)
      );
      
      if (availableKeywords.length === 0) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        return;
      }
      
      const randomKeyword = availableKeywords[Math.floor(Math.random() * availableKeywords.length)];
      setCurrentKeyword(randomKeyword);
      spinCount++;
      
      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setRound(prev => prev + 1);
      }
    }, 100);
  };

  const handleSelect = () => {
    if (!currentKeyword || selectedKeywords.length >= SELECTION_LIMIT) return;
    setSelectedKeywords(prev => [...prev, currentKeyword]);
    setCurrentKeyword(null);
    
    if (round >= MAX_ROUNDS || selectedKeywords.length + 1 >= SELECTION_LIMIT) {
      setShowResults(true);
    }
  };

  const handleReject = () => {
    if (!currentKeyword) return;
    setRejectedKeywords(prev => new Set([...prev, currentKeyword!.id]));
    setCurrentKeyword(null);
    
    if (round >= MAX_ROUNDS) {
      setShowResults(true);
    }
  };

  const calculateVectorScores = (): UserVectorScore[] => {
    const scores: Record<string, { total: number; count: number; keywords: string[] }> = {};
    
    PROJECTOR_VECTORS.forEach(v => {
      scores[v.id] = { total: 0, count: 0, keywords: [] };
    });
    
    selectedKeywords.forEach(keyword => {
      if (scores[keyword.vectorId]) {
        scores[keyword.vectorId].total += keyword.weight;
        scores[keyword.vectorId].count++;
        scores[keyword.vectorId].keywords.push(keyword.word);
      }
    });
    
    return PROJECTOR_VECTORS.map(v => ({
      vectorId: v.id,
      score: scores[v.id].count > 0 
        ? Math.min(100, Math.round((scores[v.id].total / (scores[v.id].count * 10)) * 100))
        : 0,
      keywords: scores[v.id].keywords,
    }));
  };

  const handleFinish = () => {
    const vectorScores = calculateVectorScores();
    onComplete(selectedKeywords, vectorScores);
  };

  // Trouver le vecteur associé au mot-clé actuel
  const getCurrentVector = () => {
    if (!currentKeyword) return null;
    return PROJECTOR_VECTORS.find(v => v.id === currentKeyword.vectorId);
  };

  const currentVector = getCurrentVector();
  const progress = (round / MAX_ROUNDS) * 100;

  // Écran de résultats intermédiaires
  if (showResults) {
    const vectorScores = calculateVectorScores();
    const topVectors = vectorScores.filter(v => v.score > 0).sort((a, b) => b.score - a.score);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-4"
      >
        <div className="max-w-lg mx-auto pt-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Vos aspirations révélées !</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Basé sur {selectedKeywords.length} mots-clés sélectionnés
            </p>
          </motion.div>

          {/* Mots-clés sélectionnés */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Mots-clés choisis :</h3>
            <div className="flex flex-wrap gap-2">
              {selectedKeywords.map((kw, i) => {
                const vector = PROJECTOR_VECTORS.find(v => v.id === kw.vectorId);
                return (
                  <motion.div
                    key={kw.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Badge
                      className={cn(
                        "px-3 py-1.5 text-sm",
                        `bg-gradient-to-r ${vector?.gradient} text-white`
                      )}
                    >
                      {kw.word}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Vecteurs dominants */}
          <div className="space-y-3 mb-8">
            <h3 className="font-semibold">Vos vecteurs projecteurs :</h3>
            {topVectors.slice(0, 5).map((vs, i) => {
              const vector = PROJECTOR_VECTORS.find(v => v.id === vs.vectorId);
              if (!vector) return null;
              const Icon = vector.icon;
              
              return (
                <motion.div
                  key={vs.vectorId}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    `bg-gradient-to-br ${vector.gradient}`
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{vector.name}</span>
                      <span className="text-sm text-gray-500">{vs.score}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${vs.score}%` }}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                        className={cn("h-full rounded-full", `bg-gradient-to-r ${vector.gradient}`)}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => {
              setShowResults(false);
              setSelectedKeywords([]);
              setRejectedKeywords(new Set());
              setRound(0);
            }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Recommencer
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              onClick={handleFinish}
            >
              Voir les métiers correspondants
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Tour {round} / {MAX_ROUNDS}
            </span>
            <Badge variant="secondary" className="text-xs">
              {selectedKeywords.length} / {SELECTION_LIMIT} sélectionnés
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Keyword display */}
        <AnimatePresence mode="wait">
          {currentKeyword && currentVector ? (
            <motion.div
              key={currentKeyword.id}
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className={cn(
                "w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl",
                `bg-gradient-to-br ${currentVector.gradient}`
              )}>
                <currentVector.icon className="w-16 h-16 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold mb-2">{currentKeyword.word}</h2>
              <Badge variant="outline" className="text-sm">
                {currentVector.name}
              </Badge>
              
              <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Ce mot-clé résonne-t-il avec vos aspirations profondes ?
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-gray-500">
                Appuyez sur la roue pour découvrir un mot-clé
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto">
          {currentKeyword ? (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="w-20 h-20 rounded-full border-2 border-rose-500 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                onClick={handleReject}
              >
                <X className="w-8 h-8" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-20 h-20 rounded-full border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                onClick={handleSelect}
                disabled={selectedKeywords.length >= SELECTION_LIMIT}
              >
                <Check className="w-8 h-8" />
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-xl"
              onClick={spinWheel}
              disabled={isSpinning || round >= MAX_ROUNDS}
            >
              {isSpinning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                </motion.div>
              ) : (
                <Sparkles className="w-6 h-6 mr-2" />
              )}
              {isSpinning ? "Rotation..." : "Tourner la roue"}
            </Button>
          )}
          
          <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
            {currentKeyword && (
              <>
                <span className="flex items-center gap-1">
                  <X className="w-3 h-3 text-rose-500" /> Passer
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" /> Garder
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
