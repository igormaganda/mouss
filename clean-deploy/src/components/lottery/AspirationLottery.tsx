"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Target,
  Lightbulb,
  Rocket,
  Dices,
  Trophy,
  Stars,
} from "lucide-react";
import { KeywordSlot, type Keyword, type KeywordCategory } from "./KeywordSlot";
import { SelectedKeywords } from "./SelectedKeywords";
import { MissionDisplay, generateMissionFromKeywords } from "./MissionDisplay";

// Sample keywords by category
const KEYWORDS_DATABASE: Record<KeywordCategory, Keyword[]> = {
  industry: [
    { id: "tech", text: "Tech", category: "industry", emoji: "💻" },
    { id: "sante", text: "Santé", category: "industry", emoji: "🏥" },
    { id: "finance", text: "Finance", category: "industry", emoji: "💰" },
    { id: "education", text: "Éducation", category: "industry", emoji: "📚" },
    { id: "art", text: "Art", category: "industry", emoji: "🎨" },
    { id: "environnement", text: "Environnement", category: "industry", emoji: "🌿" },
    { id: "social", text: "Social", category: "industry", emoji: "🤝" },
    { id: "commerce", text: "Commerce", category: "industry", emoji: "🛒" },
    { id: "media", text: "Médias", category: "industry", emoji: "📺" },
    { id: "immobilier", text: "Immobilier", category: "industry", emoji: "🏠" },
  ],
  value: [
    { id: "innovation", text: "Innovation", category: "value", emoji: "💡" },
    { id: "impact", text: "Impact", category: "value", emoji: "🎯" },
    { id: "liberte", text: "Liberté", category: "value", emoji: "🦋" },
    { id: "equilibre", text: "Équilibre", category: "value", emoji: "⚖️" },
    { id: "croissance", text: "Croissance", category: "value", emoji: "📈" },
    { id: "excellence", text: "Excellence", category: "value", emoji: "🏆" },
    { id: "creativite", text: "Créativité", category: "value", emoji: "✨" },
    { id: "authenticite", text: "Authenticité", category: "value", emoji: "💎" },
    { id: "collaboration", text: "Collaboration", category: "value", emoji: "🤲" },
    { id: "integrite", text: "Intégrité", category: "value", emoji: "🛡️" },
  ],
  impact: [
    { id: "global", text: "Global", category: "impact", emoji: "🌍" },
    { id: "local", text: "Local", category: "impact", emoji: "🏘️" },
    { id: "social-impact", text: "Social", category: "impact", emoji: "👥" },
    { id: "environnemental", text: "Environnemental", category: "impact", emoji: "🌱" },
    { id: "economique", text: "Économique", category: "impact", emoji: "💵" },
    { id: "culturel", text: "Culturel", category: "impact", emoji: "🎭" },
    { id: "scientifique", text: "Scientifique", category: "impact", emoji: "🔬" },
    { id: "educatif", text: "Éducatif", category: "impact", emoji: "🎓" },
  ],
  lifestyle: [
    { id: "remote", text: "Remote", category: "lifestyle", emoji: "🏝️" },
    { id: "voyage", text: "Voyage", category: "lifestyle", emoji: "✈️" },
    { id: "flexibilite", text: "Flexibilité", category: "lifestyle", emoji: "🔄" },
    { id: "leadership", text: "Leadership", category: "lifestyle", emoji: "👑" },
    { id: "autonomie", text: "Autonomie", category: "lifestyle", emoji: "🎯" },
    { id: "collaboration-life", text: "Collaboration", category: "lifestyle", emoji: "👥" },
    { id: "entrepreneuriat", text: "Entrepreneuriat", category: "lifestyle", emoji: "🚀" },
    { id: "stabilite", text: "Stabilité", category: "lifestyle", emoji: "🏛️" },
  ],
};

type LotteryState = "idle" | "spinning" | "revealing" | "selecting" | "mission";

interface AspirationLotteryProps {
  onSaveMission?: (mission: string, keywords: Keyword[]) => void;
  initialKeywords?: Keyword[];
}

export function AspirationLottery({
  onSaveMission,
  initialKeywords = [],
}: AspirationLotteryProps) {
  const [state, setState] = React.useState<LotteryState>("idle");
  const [selectedKeywords, setSelectedKeywords] = React.useState<Keyword[]>(initialKeywords);
  const [currentSlots, setCurrentSlots] = React.useState<Keyword[]>([]);
  const [slotStates, setSlotStates] = React.useState<{
    isSpinning: boolean;
    isStopped: boolean;
    selectedKeyword: Keyword | null;
  }[]>([]);
  const [generatedMission, setGeneratedMission] = React.useState<string>("");
  const [soundEnabled, setSoundEnabled] = React.useState(false);
  const [spinsCompleted, setSpinsCompleted] = React.useState(0);
  
  // Audio refs for sound effects
  const spinSoundRef = React.useRef<HTMLAudioElement | null>(null);
  const stopSoundRef = React.useRef<HTMLAudioElement | null>(null);
  const winSoundRef = React.useRef<HTMLAudioElement | null>(null);

  // Number of slots to show
  const NUM_SLOTS = 5;

  // Initialize slots
  const initializeSlots = () => {
    const slots: Keyword[] = [];
    const categories: KeywordCategory[] = ["industry", "value", "impact", "lifestyle"];
    
    for (let i = 0; i < NUM_SLOTS; i++) {
      const category = categories[i % categories.length];
      const categoryKeywords = KEYWORDS_DATABASE[category];
      const randomKeyword = categoryKeywords[Math.floor(Math.random() * categoryKeywords.length)];
      slots.push(randomKeyword);
    }
    
    return slots;
  };

  // Spin animation
  const handleSpin = () => {
    setState("spinning");
    
    // Initialize slots with random keywords
    const newSlots = initializeSlots();
    setCurrentSlots(newSlots);
    
    // Initialize slot states
    const newSlotStates = newSlots.map(() => ({
      isSpinning: true,
      isStopped: false,
      selectedKeyword: null,
    }));
    setSlotStates(newSlotStates);
    
    // Play spin sound
    if (soundEnabled && spinSoundRef.current) {
      spinSoundRef.current.play().catch(() => {});
    }
    
    // Stagger the stopping of each slot
    newSlots.forEach((_, index) => {
      const delay = 1500 + index * 600; // Base delay + staggered delay
      
      setTimeout(() => {
        // Get a random keyword for this slot
        const categories: KeywordCategory[] = ["industry", "value", "impact", "lifestyle"];
        const category = categories[index % categories.length];
        const categoryKeywords = KEYWORDS_DATABASE[category];
        const selectedKeyword = categoryKeywords[Math.floor(Math.random() * categoryKeywords.length)];
        
        // Update slot state
        setSlotStates((prev) => {
          const updated = [...prev];
          updated[index] = {
            isSpinning: false,
            isStopped: true,
            selectedKeyword,
          };
          return updated;
        });
        
        // Play stop sound
        if (soundEnabled && stopSoundRef.current) {
          stopSoundRef.current.currentTime = 0;
          stopSoundRef.current.play().catch(() => {});
        }
        
        // Update current slots with selected keyword
        setCurrentSlots((prev) => {
          const updated = [...prev];
          updated[index] = selectedKeyword;
          return updated;
        });
        
        // Check if all slots have stopped
        if (index === newSlots.length - 1) {
          setTimeout(() => {
            setState("selecting");
            if (soundEnabled && winSoundRef.current) {
              winSoundRef.current.play().catch(() => {});
            }
          }, 800);
        }
      }, delay);
    });
    
    setSpinsCompleted((prev) => prev + 1);
  };

  // Handle keeping a keyword
  const handleKeepKeyword = (keyword: Keyword) => {
    if (selectedKeywords.length < 5) {
      setSelectedKeywords((prev) => [...prev, keyword]);
    }
    
    // Mark this slot as done
    const slotIndex = currentSlots.findIndex((k) => k.id === keyword.id);
    if (slotIndex !== -1) {
      setSlotStates((prev) => {
        const updated = [...prev];
        updated[slotIndex] = { ...updated[slotIndex], selectedKeyword: null };
        return updated;
      });
    }
    
    // Check if all slots are done
    const remainingSlots = slotStates.filter((s) => s.selectedKeyword !== null).length;
    if (remainingSlots <= 1) {
      // All selections done, check if we can generate mission
      setTimeout(() => {
        if (selectedKeywords.length + 1 >= 3) {
          // Enough keywords to generate mission
        }
      }, 500);
    }
  };

  // Handle discarding a keyword
  const handleDiscardKeyword = () => {
    // Just mark the slot as done without adding the keyword
    const activeSlotIndex = slotStates.findIndex((s) => s.selectedKeyword !== null);
    if (activeSlotIndex !== -1) {
      setSlotStates((prev) => {
        const updated = [...prev];
        updated[activeSlotIndex] = { ...updated[activeSlotIndex], selectedKeyword: null };
        return updated;
      });
    }
  };

  // Handle keyword reordering
  const handleReorderKeywords = (keywords: Keyword[]) => {
    setSelectedKeywords(keywords);
  };

  // Handle keyword removal
  const handleRemoveKeyword = (keywordId: string) => {
    setSelectedKeywords((prev) => prev.filter((k) => k.id !== keywordId));
  };

  // Generate mission
  const handleGenerateMission = () => {
    const mission = generateMissionFromKeywords(selectedKeywords);
    setGeneratedMission(mission);
    setState("mission");
  };

  // Reset lottery
  const handleReset = () => {
    setState("idle");
    setSelectedKeywords([]);
    setCurrentSlots([]);
    setSlotStates([]);
    setGeneratedMission("");
  };

  // Save mission
  const handleSaveMission = () => {
    onSaveMission?.(generatedMission, selectedKeywords);
  };

  // Share mission
  const handleShareMission = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ma Mission Professionnelle",
          text: generatedMission,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  // Calculate progress
  const progressPercentage = state === "idle" ? 0 : 
    state === "spinning" ? 20 :
    state === "revealing" ? 40 :
    state === "selecting" ? 60 :
    state === "mission" ? 100 : 0;

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-rose-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-emerald-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <Card className="relative overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
        {/* Header */}
        <CardHeader className="text-center pb-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity }}
            >
              <Dices className="w-8 h-8 text-purple-500" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
              Loterie des Aspirations
            </CardTitle>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Stars className="w-8 h-8 text-amber-500" />
            </motion.div>
          </motion.div>
          
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Découvrez votre mission professionnelle par le hasard!
          </p>

          {/* Progress bar */}
          <div className="mt-4 max-w-md mx-auto">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Sound toggle */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="rounded-full"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-gray-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </Button>
          </div>

          {/* Idle state - Start button */}
          {state === "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
              >
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-500 via-rose-500 to-amber-500 p-1 shadow-2xl shadow-purple-500/30">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <Target className="w-16 h-16 text-purple-500" />
                  </div>
                </div>
              </motion.div>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Prêt à découvrir votre mission?
              </h3>
              
              <Button
                onClick={handleSpin}
                size="lg"
                className="bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 hover:from-purple-600 hover:via-rose-600 hover:to-amber-600 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-rose-500/40 transition-all duration-300 gap-3 px-12 py-6 text-xl"
              >
                <Play className="w-6 h-6" />
                LANCER LA LOTERIE
              </Button>
              
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-6">
                5 mots-clés seront tirés au hasard • Sélectionnez vos favoris
              </p>
            </motion.div>
          )}

          {/* Spinning/Selecting state - Slot machines */}
          {(state === "spinning" || state === "selecting") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Slot machine visual */}
              <div className="relative">
                {/* Lottery machine frame */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-100/50 to-amber-200/30 dark:from-amber-900/20 dark:to-amber-800/10 rounded-3xl pointer-events-none" />
                
                {/* Decorative lights */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-4">
                  {["purple", "rose", "amber", "emerald", "cyan"].map((color, i) => (
                    <motion.div
                      key={color}
                      className={cn(
                        "w-3 h-3 rounded-full",
                        `bg-${color}-400`
                      )}
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        duration: 0.5, 
                        repeat: Infinity, 
                        delay: i * 0.1 
                      }}
                    />
                  ))}
                </div>
                
                {/* Slots grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
                  {currentSlots.map((keyword, index) => (
                    <KeywordSlot
                      key={index}
                      keywords={KEYWORDS_DATABASE[keyword.category]}
                      isSpinning={slotStates[index]?.isSpinning || false}
                      isStopped={slotStates[index]?.isStopped || false}
                      selectedKeyword={slotStates[index]?.selectedKeyword || null}
                      onStartSpin={() => {}}
                      onKeep={handleKeepKeyword}
                      onDiscard={handleDiscardKeyword}
                      slotIndex={index}
                    />
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  {state === "spinning" 
                    ? "Les roulettes tournent..." 
                    : "Gardez ou rejetez chaque mot-clé"}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Selected Keywords section */}
          {selectedKeywords.length > 0 && state !== "mission" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <SelectedKeywords
                keywords={selectedKeywords}
                onReorder={handleReorderKeywords}
                onRemove={handleRemoveKeyword}
                onGenerateMission={handleGenerateMission}
              />
            </motion.div>
          )}

          {/* Mission display */}
          {state === "mission" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <MissionDisplay
                mission={generatedMission}
                keywords={selectedKeywords}
                onRegenerate={() => {
                  const newMission = generateMissionFromKeywords(selectedKeywords);
                  setGeneratedMission(newMission);
                }}
                onSave={handleSaveMission}
                onShare={handleShareMission}
              />
              
              {/* Start over */}
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Recommencer la loterie
                </Button>
              </div>
            </motion.div>
          )}

          {/* Stats footer */}
          {spinsCompleted > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="text-center">
                <Trophy className="w-5 h-5 mx-auto text-amber-500" />
                <p className="text-xs text-gray-500 mt-1">{spinsCompleted} tirage{spinsCompleted > 1 ? "s" : ""}</p>
              </div>
              <div className="text-center">
                <Rocket className="w-5 h-5 mx-auto text-purple-500" />
                <p className="text-xs text-gray-500 mt-1">{selectedKeywords.length} mot{selectedKeywords.length > 1 ? "s" : ""}-clé</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Hidden audio elements for sound effects */}
      {/* These would need actual audio files to work */}
      <audio ref={spinSoundRef} src="/sounds/spin.mp3" preload="auto" />
      <audio ref={stopSoundRef} src="/sounds/stop.mp3" preload="auto" />
      <audio ref={winSoundRef} src="/sounds/win.mp3" preload="auto" />
    </div>
  );
}
