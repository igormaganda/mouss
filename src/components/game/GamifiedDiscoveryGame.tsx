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
  Target,
  Compass,
  Trophy,
  ChevronRight,
  ArrowRight,
  FileText,
  Upload,
  CheckCircle,
  RotateCcw,
  Crown,
  Zap,
} from "lucide-react";
import { LotteryWheel } from "./LotteryWheel";
import { ProfileBilan } from "./ProfileBilan";
import { 
  type UserVectorScore,
  type AspirationKeyword,
  PROJECTOR_VECTORS,
} from "@/data/projector-vectors";
import {
  PEPITES_DATA,
  METIERS_DATA,
  APPETENCES_DATA,
} from "@/data/game-data";
import { PepiteCard, type SwipeDirection } from "@/components/pepites/PepiteCard";

// Types
type GamePhase = 'intro' | 'pepites' | 'lottery' | 'cv' | 'bilan';

interface GamifiedGameProps {
  onComplete?: (results: GameResults) => void;
  onBack?: () => void;
}

interface GameResults {
  pepites: { itemId: string; decision: string }[];
  lotteryKeywords: AspirationKeyword[];
  vectorScores: UserVectorScore[];
  cvAnalysis?: CVAnalysisResult;
}

interface CVAnalysisResult {
  hardSkills: string[];
  softSkills: string[];
  experience: string[];
  education: string[];
}

// Intro Screen Component
function IntroScreen({ onStart }: { onStart: () => void }) {
  const steps = [
    { icon: Sparkles, title: "Découvrez vos Pépites", desc: "Vos forces et talents cachés", color: "from-emerald-500 to-teal-500" },
    { icon: Target, title: "Loterie des Aspirations", desc: "Révélez vos désirs profonds", color: "from-purple-500 to-pink-500" },
    { icon: FileText, title: "Analyse CV", desc: "Extrayez vos compétences", color: "from-amber-500 to-orange-500" },
    { icon: Trophy, title: "Bilan Final", desc: "Votre carte mentale complète", color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-8 shadow-xl"
      >
        <Compass className="w-12 h-12 text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-4"
      >
        Parcours Découverte
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md"
      >
        Explorez vos aspirations, découvrez vos forces et trouvez les métiers qui vous correspondent vraiment.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md space-y-3 mb-8"
      >
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border"
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              `bg-gradient-to-br ${step.color}`
            )}>
              <step.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              Étape {i + 1}
            </Badge>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Button
          size="lg"
          className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl shadow-xl"
          onClick={onStart}
        >
          Commencer l'aventure
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}

// CV Analysis Component
function CVAnalysisStep({ onComplete, onSkip }: { onComplete: (result: CVAnalysisResult) => void; onSkip: () => void }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [result, setResult] = useState<CVAnalysisResult | null>(null);

  const handleUpload = () => {
    setUploaded(true);
    setIsAnalyzing(true);
    
    // Simuler l'analyse
    setTimeout(() => {
      const mockResult: CVAnalysisResult = {
        hardSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Project Management'],
        softSkills: ['Leadership', 'Communication', 'Résolution de problèmes', 'Travail en équipe'],
        experience: ['Développeur Full Stack - 3 ans', 'Chef de Projet - 2 ans'],
        education: ['Master Informatique', 'Licence Mathématiques'],
      };
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-4"
      >
        <div className="max-w-lg mx-auto pt-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Analyse terminée !</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vos compétences ont été extraites
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Hard Skills détectées
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.hardSkills.map((skill, i) => (
                  <Badge key={i} className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-500" />
                Soft Skills détectées
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.softSkills.map((skill, i) => (
                  <Badge key={i} className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            onClick={() => onComplete(result)}
          >
            Voir mon bilan complet
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6"
      >
        <FileText className="w-10 h-10 text-white" />
      </motion.div>

      <h1 className="text-2xl font-bold mb-2 text-center">Analyse de votre CV</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
        Importez votre CV ou profil LinkedIn pour enrichir votre bilan avec vos compétences acquises.
      </p>

      <div className="w-full max-w-md space-y-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors",
            uploaded ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950" : "border-gray-300 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950"
          )}
          onClick={handleUpload}
        >
          {isAnalyzing ? (
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mb-4"
              />
              <p className="text-gray-600 dark:text-gray-400">Analyse en cours...</p>
            </div>
          ) : uploaded ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
              <p className="font-medium text-emerald-600">CV importé avec succès !</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="font-medium mb-1">Glissez votre CV ici</p>
              <p className="text-sm text-gray-500">PDF, DOCX ou LinkedIn PDF</p>
            </div>
          )}
        </motion.div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onSkip}>
            Passer cette étape
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            onClick={handleUpload}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyse..." : "Importer"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Gamified Game Component
export function GamifiedDiscoveryGame({ onComplete, onBack }: GamifiedGameProps) {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [results, setResults] = useState<GameResults>({
    pepites: [],
    lotteryKeywords: [],
    vectorScores: [],
  });
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [pepiteResults, setPepiteResults] = useState<{ itemId: string; decision: string }[]>([]);

  // Pépites Game Logic (simplified)
  const currentPepites = PEPITES_DATA.slice(0, 10);
  const currentPepite = currentPepites[currentCardIndex];

  const handlePepiteSwipe = (direction: SwipeDirection) => {
    if (!currentPepite || !direction) return;

    const decisionMap: Record<string, string> = {
      left: 'not_priority',
      right: 'have',
      up: 'want',
    };

    const newResult = {
      itemId: currentPepite.id,
      decision: decisionMap[direction],
    };

    setPepiteResults(prev => [...prev, newResult]);

    if (currentCardIndex < currentPepites.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Move to lottery phase
      setResults(prev => ({ ...prev, pepites: [...prev.pepites, ...pepiteResults, newResult] }));
      setPhase('lottery');
    }
  };

  const handleLotteryComplete = (keywords: AspirationKeyword[], scores: UserVectorScore[]) => {
    setResults(prev => ({
      ...prev,
      lotteryKeywords: keywords,
      vectorScores: scores,
    }));
    setPhase('cv');
  };

  const handleCVComplete = (cvResult?: CVAnalysisResult) => {
    setResults(prev => ({
      ...prev,
      cvAnalysis: cvResult,
    }));
    setPhase('bilan');
  };

  // Render based on phase
  switch (phase) {
    case 'intro':
      return <IntroScreen onStart={() => setPhase('pepites')} />;
    
    case 'pepites':
      // Simplified pepites game
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
          {/* Header */}
          <div className="p-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Pépites {currentCardIndex + 1} / {currentPepites.length}
                </span>
                <Badge className="bg-emerald-500 text-white">Étape 1/4</Badge>
              </div>
              <Progress value={((currentCardIndex + 1) / currentPepites.length) * 100} className="h-2" />
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 pt-8">
            <div className="max-w-lg mx-auto text-center">
              <p className="text-gray-500 mb-8">Fonctionnalité simplifiée - Cliquez pour continuer</p>
              <Button
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                onClick={() => {
                  if (currentCardIndex < currentPepites.length - 1) {
                    setCurrentCardIndex(prev => prev + 1);
                  } else {
                    setPhase('lottery');
                  }
                }}
              >
                {currentCardIndex < currentPepites.length - 1 ? 'Suivant' : 'Passer à la loterie'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      );
    
    case 'lottery':
      return <LotteryWheel onComplete={handleLotteryComplete} />;
    
    case 'cv':
      return (
        <CVAnalysisStep
          onComplete={(result) => handleCVComplete(result)}
          onSkip={() => handleCVComplete()}
        />
      );
    
    case 'bilan':
      return (
        <ProfileBilan
          selectedKeywords={results.lotteryKeywords}
          vectorScores={results.vectorScores}
          onRestart={() => {
            setPhase('intro');
            setCurrentCardIndex(0);
            setPepiteResults([]);
            setResults({ pepites: [], lotteryKeywords: [], vectorScores: [] });
          }}
        />
      );
    
    default:
      return null;
  }
}
