"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Trophy,
  Target,
  Briefcase,
  TrendingUp,
  DollarSign,
  MapPin,
  Building,
  Star,
  ChevronRight,
  Download,
  Share2,
  RotateCcw,
  Award,
  CheckCircle,
  Lightbulb,
  Heart,
  Globe,
  Users,
  Palette,
  Crown,
  Leaf,
  Brain,
  Rocket,
} from "lucide-react";
import { 
  PROJECTOR_VECTORS, 
  JOBS_WITH_VECTORS,
  getTopJobMatches,
  generateFinalObjective,
  type UserVectorScore,
  type AspirationKeyword,
  type JobWithVectors,
} from "@/data/projector-vectors";

interface ProfileBilanProps {
  selectedKeywords: AspirationKeyword[];
  vectorScores: UserVectorScore[];
  onRestart?: () => void;
}

// Spider Web Chart Component
function SpiderWebChart({ scores }: { scores: UserVectorScore[] }) {
  const size = 300;
  const center = size / 2;
  const maxRadius = 120;
  const levels = 5;

  // Calculer les points pour chaque vecteur
  const points = scores.map((score, index) => {
    const angle = (index * 2 * Math.PI) / scores.length - Math.PI / 2;
    const radius = (score.score / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
      vector: PROJECTOR_VECTORS.find(v => v.id === score.vectorId),
      score: score.score,
    };
  });

  // Points pour les niveaux de grille
  const gridLevels = Array.from({ length: levels }, (_, levelIndex) => {
    const radius = ((levelIndex + 1) / levels) * maxRadius;
    return scores.map((_, index) => {
      const angle = (index * 2 * Math.PI) / scores.length - Math.PI / 2;
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
      };
    });
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grille de fond */}
        {gridLevels.map((level, levelIndex) => (
          <path
            key={levelIndex}
            d={level.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            className="text-gray-400"
          />
        ))}

        {/* Axes */}
        {scores.map((_, index) => {
          const angle = (index * 2 * Math.PI) / scores.length - Math.PI / 2;
          const endX = center + maxRadius * Math.cos(angle);
          const endY = center + maxRadius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="currentColor"
              strokeOpacity={0.1}
              className="text-gray-400"
            />
          );
        })}

        {/* Zone remplie */}
        <motion.path
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 0.8 }}
          d={pathD}
          fill="url(#spiderGradient)"
          stroke="url(#spiderGradient)"
          strokeWidth={2}
        />

        {/* Points sur les axes */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05, type: "spring" }}
            cx={point.x}
            cy={point.y}
            r={6}
            fill={point.vector?.color || '#10B981'}
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="spiderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels autour */}
      <div className="absolute inset-0">
        {points.map((point, index) => {
          const vector = point.vector;
          if (!vector || point.score === 0) return null;
          const Icon = vector.icon;
          
          // Positionner le label
          const angle = (index * 2 * Math.PI) / scores.length - Math.PI / 2;
          const labelRadius = maxRadius + 30;
          const labelX = center + labelRadius * Math.cos(angle);
          const labelY = center + labelRadius * Math.sin(angle);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: labelX, top: labelY }}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1",
                `bg-gradient-to-br ${vector.gradient}`
              )}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {vector.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Job Match Card Component
function JobMatchCard({ job, matchScore, index }: { job: JobWithVectors; matchScore: number; index: number }) {
  const Icon = job.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className={cn(
          "h-1",
          matchScore >= 80 ? "bg-emerald-500" : matchScore >= 60 ? "bg-amber-500" : "bg-gray-300"
        )} />
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold truncate">{job.title}</h3>
                <Badge variant="secondary" className="ml-2 shrink-0">
                  {matchScore}%
                </Badge>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                {job.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {(job.salaryMin / 1000)}k-{(job.salaryMax / 1000)}k€
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{job.growthRate}%
                </span>
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {job.sector}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main Profile Bilan Component
export function ProfileBilan({ selectedKeywords, vectorScores, onRestart }: ProfileBilanProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Calculer les meilleurs métiers
  const topJobs = getTopJobMatches(vectorScores, 6);
  
  // Générer la phrase d'objectif
  const objectiveSentence = generateFinalObjective(vectorScores, selectedKeywords.map(k => k.word));
  
  // Top vecteurs
  const topVectors = vectorScores
    .filter(v => v.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  useEffect(() => {
    // Trigger confetti on mount
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white py-12 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_50%)]" />
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-bold mb-2"
          >
            Votre Bilan Découverte
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/90"
          >
            Une carte mentale de vos aspirations profondes
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Objective Sentence Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-xl border-0 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wider">
                    Votre Objectif Final
                  </h3>
                  <p className="text-lg font-medium leading-relaxed">
                    "{objectiveSentence}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Spider Web & Keywords */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Spider Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  Carte Mentale
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <SpiderWebChart scores={vectorScores} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Keywords & Vectors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Vos Vecteurs Projecteurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVectors.map((vs, i) => {
                    const vector = PROJECTOR_VECTORS.find(v => v.id === vs.vectorId);
                    if (!vector) return null;
                    const Icon = vector.icon;
                    
                    return (
                      <div key={vs.vectorId} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            `bg-gradient-to-br ${vector.gradient}`
                          )}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{vector.name}</span>
                          <span className="ml-auto text-sm text-gray-500">{vs.score}%</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {vs.keywords.slice(0, 4).map((kw, j) => (
                            <Badge key={j} variant="outline" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Job Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-500" />
                Métiers Correspondants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {topJobs.map((match, index) => {
                  const job = JOBS_WITH_VECTORS.find(j => j.id === match.jobId);
                  if (!job) return null;
                  return (
                    <JobMatchCard
                      key={match.jobId}
                      job={job}
                      matchScore={match.matchScore}
                      index={index}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button variant="outline" className="flex-1" onClick={onRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Recommencer le parcours
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Télécharger le bilan PDF
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Partager mon profil
          </Button>
        </motion.div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                position: "absolute",
                top: -20,
                left: `${Math.random() * 100}%`,
                width: 10,
                height: 10,
                backgroundColor: ['#10B981', '#06B6D4', '#F59E0B', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 5)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
              animate={{
                y: [0, window.innerHeight + 100],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
