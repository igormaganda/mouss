"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Check,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Star,
  Target,
  Compass,
  Trophy,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { PepiteCard, type SwipeDirection } from "./PepiteCard";
import { 
  PEPITES_DATA, 
  METIERS_DATA, 
  APPETENCES_DATA,
  type PepiteItem,
  type MetierItem,
  type AppetenceItem 
} from "@/data/game-data";

// Types
type GameStage = 'pepites' | 'metiers' | 'appetences';
type Decision = 'have' | 'want' | 'not_priority';

interface CardItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

interface StageResult {
  itemId: string;
  decision: Decision;
}

interface AllResults {
  pepites: StageResult[];
  metiers: StageResult[];
  appetences: StageResult[];
}

interface DiscoveryGameProps {
  onComplete?: (results: AllResults) => void;
  onBack?: () => void;
}

const STAGE_CONFIG = {
  pepites: {
    title: 'Découvrez vos Super Pouvoirs',
    subtitle: 'Quelles sont vos forces et talents ?',
    description: 'Identifiez vos pépites, ces compétences et qualités qui vous définissent.',
    icon: Sparkles,
    gradient: 'from-emerald-500 to-teal-500',
    color: 'emerald',
  },
  metiers: {
    title: 'Explorez les Métiers',
    subtitle: 'Quels métiers vous attirent ?',
    description: 'Découvrez des métiers qui pourraient correspondre à votre profil.',
    icon: Target,
    gradient: 'from-amber-500 to-orange-500',
    color: 'amber',
  },
  appetences: {
    title: 'Révélez vos Aspirations',
    subtitle: 'Quels sont vos objectifs de vie ?',
    description: 'Explorez vos désirs et ambitions pour l\'avenir.',
    icon: Compass,
    gradient: 'from-purple-500 to-pink-500',
    color: 'purple',
  },
};

// Card component for Metiers and Appetences (simplified version)
function GameCard({ 
  item, 
  onSwipe, 
  isTop, 
  index, 
  totalCards, 
  disabled,
  stageColor 
}: { 
  item: CardItem; 
  onSwipe: (direction: SwipeDirection) => void; 
  isTop: boolean; 
  index: number; 
  totalCards: number;
  disabled: boolean;
  stageColor: string;
}) {
  const [isDragging, setIsDragging] = React.useState(false);
  const x = React.useRef(0);
  const y = React.useRef(0);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

  const handleDragStart = () => {
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDrag = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || disabled) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - x.current;
    const deltaY = clientY - y.current;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (disabled) return;
    
    const threshold = 100;
    
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? 'right' : 'left');
    } else if (dragOffset.y < -threshold) {
      onSwipe('up');
    }
    
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleActionButton = (decision: Decision) => {
    const directionMap: Record<Decision, SwipeDirection> = {
      not_priority: 'left',
      have: 'right',
      want: 'up',
    };
    onSwipe(directionMap[decision]);
  };

  const stackOffset = totalCards - index - 1;
  const scale = 1 - stackOffset * 0.02;
  const translateY = stackOffset * 8;

  const rotation = dragOffset.x * 0.05;
  const opacity = Math.min(Math.abs(dragOffset.x) / 100, 1);

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

  const Icon = item.icon;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center touch-none"
      style={{
        x: dragOffset.x,
        y: dragOffset.y,
        rotate: rotation,
        zIndex: index,
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0, x: dragOffset.x > 0 ? 500 : dragOffset.x < 0 ? -500 : 0, y: dragOffset.y < 0 ? -500 : 0 }}
      drag={!disabled}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          "w-[85vw] max-w-sm h-[60vh] max-h-[500px] rounded-3xl shadow-2xl overflow-hidden",
          "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950",
          "border-2 border-gray-100 dark:border-gray-800",
          "relative p-6 flex flex-col"
        )}
      >
        {/* Swipe indicators */}
        <motion.div
          className="absolute top-6 right-6 bg-rose-500 text-white rounded-full p-2 shadow-lg"
          animate={{ opacity: dragOffset.x < -50 ? opacity : 0 }}
        >
          <X className="w-6 h-6" />
        </motion.div>
        <motion.div
          className="absolute top-6 left-6 bg-emerald-500 text-white rounded-full p-2 shadow-lg"
          animate={{ opacity: dragOffset.x > 50 ? opacity : 0 }}
        >
          <Check className="w-6 h-6" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-purple-500 text-white rounded-full p-2 shadow-lg"
          animate={{ opacity: dragOffset.y < -50 ? opacity : 0 }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>

        {/* Category badge */}
        <Badge 
          variant="outline" 
          className={cn("self-start mb-4", {
            'border-emerald-500 text-emerald-600': stageColor === 'emerald',
            'border-amber-500 text-amber-600': stageColor === 'amber',
            'border-purple-500 text-purple-600': stageColor === 'purple',
          })}
        >
          {item.category}
        </Badge>

        {/* Icon */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center",
              `bg-gradient-to-br ${stageColor === 'emerald' ? 'from-emerald-400 to-teal-500' : stageColor === 'amber' ? 'from-amber-400 to-orange-500' : 'from-purple-400 to-pink-500'}`,
              "shadow-lg"
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        {/* Name and description */}
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {item.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Results Summary Component
function ResultsSummary({ 
  results, 
  onRestart, 
  onComplete 
}: { 
  results: AllResults; 
  onRestart: () => void;
  onComplete: () => void;
}) {
  const havePepites = results.pepites.filter(r => r.decision === 'have').length;
  const wantPepites = results.pepites.filter(r => r.decision === 'want').length;
  const interestedMetiers = results.metiers.filter(r => r.decision === 'want' || r.decision === 'have').length;
  const topAppetences = results.appetences.filter(r => r.decision === 'want').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[80vh] p-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6"
      >
        <Trophy className="w-12 h-12 text-white" />
      </motion.div>

      <h2 className="text-3xl font-bold text-center mb-2">
        Félicitations !
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Vous avez terminé l'ensemble du parcours de découverte
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
        {/* Pépites Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-4 text-center"
        >
          <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Super Pouvoirs</h3>
          <p className="text-2xl font-bold text-emerald-500">{havePepites + wantPepites}</p>
          <p className="text-xs text-gray-500">identifiés</p>
        </motion.div>

        {/* Metiers Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 dark:bg-amber-950 rounded-2xl p-4 text-center"
        >
          <Target className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Métiers</h3>
          <p className="text-2xl font-bold text-amber-500">{interestedMetiers}</p>
          <p className="text-xs text-gray-500">retenus</p>
        </motion.div>

        {/* Appetences Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-purple-50 dark:bg-purple-950 rounded-2xl p-4 text-center"
        >
          <Compass className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Aspirations</h3>
          <p className="text-2xl font-bold text-purple-500">{topAppetences}</p>
          <p className="text-xs text-gray-500">révélées</p>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Recommencer
        </Button>
        <Button 
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          onClick={onComplete}
        >
          Voir mes résultats
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

// Main Discovery Game Component
export function DiscoveryGame({ onComplete, onBack }: DiscoveryGameProps) {
  const [currentStage, setCurrentStage] = useState<GameStage>('pepites');
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<AllResults>({
    pepites: [],
    metiers: [],
    appetences: [],
  });
  
  // Get items for current stage
  const getItemsForStage = (stage: GameStage): CardItem[] => {
    switch (stage) {
      case 'pepites':
        return PEPITES_DATA.slice(0, 15);
      case 'metiers':
        return METIERS_DATA.slice(0, 15);
      case 'appetences':
        return APPETENCES_DATA.slice(0, 15);
      default:
        return [];
    }
  };

  const currentItems = getItemsForStage(currentStage);
  const currentItem = currentItems[currentIndex];
  const stageConfig = STAGE_CONFIG[currentStage];
  const progress = ((currentItems.length - currentIndex) / currentItems.length) * 100;
  const totalAnswered = results[currentStage].length;
  const totalCards = currentItems.length;

  const handleSwipe = (direction: SwipeDirection) => {
    if (!currentItem || !direction) return;

    const decisionMap: Record<string, Decision> = {
      left: 'not_priority',
      right: 'have',
      up: 'want',
    };

    const newResult: StageResult = {
      itemId: currentItem.id,
      decision: decisionMap[direction],
    };

    setResults(prev => ({
      ...prev,
      [currentStage]: [...prev[currentStage], newResult],
    }));

    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Stage complete, move to next stage
      const stages: GameStage[] = ['pepites', 'metiers', 'appetences'];
      const currentStageIndex = stages.indexOf(currentStage);
      
      if (currentStageIndex < stages.length - 1) {
        // Move to next stage
        setTimeout(() => {
          setCurrentStage(stages[currentStageIndex + 1]);
          setCurrentIndex(0);
          setShowInstructions(true);
        }, 300);
      }
      // All stages complete - show results
    }
  };

  const handleActionButton = (decision: Decision) => {
    const directionMap: Record<Decision, SwipeDirection> = {
      not_priority: 'left',
      have: 'right',
      want: 'up',
    };
    handleSwipe(directionMap[decision]);
  };

  const handleRestart = () => {
    setCurrentStage('pepites');
    setCurrentIndex(0);
    setShowInstructions(true);
    setResults({ pepites: [], metiers: [], appetences: [] });
  };

  // Check if all stages are complete
  const allStagesComplete = 
    results.pepites.length >= getItemsForStage('pepites').length &&
    results.metiers.length >= getItemsForStage('metiers').length &&
    results.appetences.length >= getItemsForStage('appetences').length;

  if (allStagesComplete) {
    return (
      <ResultsSummary 
        results={results} 
        onRestart={handleRestart}
        onComplete={() => onComplete?.(results)}
      />
    );
  }

  const StageIcon = stageConfig.icon;
  const stages: GameStage[] = ['pepites', 'metiers', 'appetences'];

  return (
    <div className="relative w-full h-[100dvh] flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header with progress */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-lg mx-auto space-y-2">
          {/* Stage Progress */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {stages.map((stage, i) => {
              const isCompleted = results[stage].length >= getItemsForStage(stage).length;
              const isCurrent = stage === currentStage;
              const config = STAGE_CONFIG[stage];
              const Icon = config.icon;
              
              return (
                <React.Fragment key={stage}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors",
                      isCurrent && `bg-gradient-to-r ${config.gradient} text-white`,
                      isCompleted && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400",
                      !isCurrent && !isCompleted && "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    )}
                    animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Icon className="w-3 h-3" />
                    )}
                    <span className="hidden sm:inline">
                      {i === 0 ? 'Pépites' : i === 1 ? 'Métiers' : 'Aspirations'}
                    </span>
                  </motion.div>
                  {i < 2 && (
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900 dark:text-white">
              {stageConfig.title}
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
              <div className={cn(
                "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                `bg-gradient-to-br ${stageConfig.gradient}`
              )}>
                <StageIcon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-center mb-2">{stageConfig.title}</h3>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                {stageConfig.description}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Glissez à gauche</p>
                    <p className="text-sm text-gray-500">Pas une priorité pour vous</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Glissez à droite</p>
                    <p className="text-sm text-gray-500">{currentStage === 'metiers' ? 'Ce métier m\'intéresse' : 'Je l\'ai déjà'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <ChevronUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Glissez vers le haut</p>
                    <p className="text-sm text-gray-500">{currentStage === 'metiers' ? 'Ce métier me passionne' : 'Je veux l\'acquérir'}</p>
                  </div>
                </div>
              </div>
              
              <Button
                className={cn(
                  "w-full text-white",
                  `bg-gradient-to-r ${stageConfig.gradient}`
                )}
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
        {currentItems.slice(currentIndex).map((item, index) => (
          <GameCard
            key={item.id}
            item={item}
            onSwipe={handleSwipe}
            isTop={index === 0}
            index={index}
            totalCards={Math.min(3, currentItems.length - currentIndex)}
            disabled={showInstructions}
            stageColor={stageConfig.color}
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
            onClick={() => handleActionButton('not_priority')}
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
            onClick={() => handleActionButton('want')}
          >
            <Sparkles className="w-6 h-6" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            onClick={() => handleActionButton('have')}
          >
            <Check className="w-6 h-6" />
          </Button>
        </div>

        {/* Labels for buttons */}
        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
          <span className="w-14 text-center">Pas priorité</span>
          <span className="w-12 text-center">Recommencer</span>
          <span className="w-14 text-center">Je veux</span>
          <span className="w-14 text-center">{currentStage === 'metiers' ? 'J\'aime' : 'J\'ai'}</span>
        </div>
      </div>
    </div>
  );
}
