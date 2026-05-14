'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  RotateCcw,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { GlassCard } from '@/components/ui/GlassCard';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { cn } from '@/lib/utils';
import { MOTIVATIONS_DATA, BARRIERS_DATA } from '@/data/motivations-data';
import type { Motivation, Barrier } from '@/types/motivations';

// ===========================================
// Types
// ===========================================

type Step = 'intro' | 'motivations' | 'barriers' | 'results';

interface MotivationScore {
  motivation: Motivation;
  score: number;
}

interface BarrierScore {
  barrier: Barrier;
  severity: number;
}

interface MotivationsBarriersModuleProps {
  onComplete?: (results: {
    motivations: MotivationScore[];
    barriers: BarrierScore[];
    readinessScore: number;
  }) => void;
  onBack?: () => void;
}

// ===========================================
// Intro Step Component
// ===========================================

const IntroStep = memo(({ onStart }: { onStart: () => void }) => (
  <div className="max-w-2xl mx-auto text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
        <Target className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold">
        Découvrez vos
        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent"> motivations profondes</span>
      </h2>
      
      <p className="text-muted-foreground text-lg">
        Ce questionnaire vous aide à identifier ce qui vous motive vraiment et les obstacles 
        que vous pourriez rencontrer dans votre projet professionnel.
      </p>
      
      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Motivations</h3>
              <p className="text-sm text-muted-foreground">10 dimensions clés</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Freins</h3>
              <p className="text-sm text-muted-foreground">Obstacles à surmonter</p>
            </div>
          </div>
        </GlassCard>
      </div>
      
      <p className="text-sm text-muted-foreground mt-6">
        ⏱️ Durée estimée : 10-15 minutes
      </p>
      
      <Button 
        size="lg" 
        onClick={onStart}
        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white mt-4"
      >
        Commencer le questionnaire
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  </div>
));

IntroStep.displayName = 'IntroStep';

// ===========================================
// Motivation Card Component
// ===========================================

const MotivationCard = memo(({ 
  motivation, 
  score, 
  onScoreChange 
}: { 
  motivation: Motivation; 
  score: number; 
  onScoreChange: (score: number) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="mb-6"
  >
    <Card className="border-l-4 border-l-emerald-500">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{motivation.icon}</span>
          <div>
            <CardTitle className="text-lg">{motivation.name.fr}</CardTitle>
            <CardDescription>{motivation.description.fr}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-20">Pas important</span>
          <Slider
            value={[score]}
            onValueChange={([value]) => onScoreChange(value)}
            max={10}
            min={1}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-20 text-right">Très important</span>
        </div>
        <div className="text-center mt-2">
          <Badge variant={score >= 7 ? 'default' : score >= 4 ? 'secondary' : 'outline'}>
            Score: {score}/10
          </Badge>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

MotivationCard.displayName = 'MotivationCard';

// ===========================================
// Barrier Card Component
// ===========================================

const BarrierCard = memo(({ 
  barrier, 
  severity, 
  onSeverityChange 
}: { 
  barrier: Barrier; 
  severity: number; 
  onSeverityChange: (severity: number) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="mb-6"
  >
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{barrier.icon}</span>
          <div>
            <CardTitle className="text-lg">{barrier.name.fr}</CardTitle>
            <CardDescription>{barrier.description.fr}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-20">Pas un frein</span>
          <Slider
            value={[severity]}
            onValueChange={([value]) => onSeverityChange(value)}
            max={10}
            min={1}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-20 text-right">Frein majeur</span>
        </div>
        <div className="text-center mt-2">
          <Badge 
            variant={severity >= 7 ? 'destructive' : severity >= 4 ? 'secondary' : 'outline'}
          >
            Impact: {severity}/10
          </Badge>
        </div>
        
        {severity >= 7 && barrier.solutions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-emerald-500" />
              <span className="font-medium text-sm">Solutions suggérées :</span>
            </div>
            <ul className="text-sm space-y-1">
              {barrier.solutions.fr.slice(0, 3).map((solution, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </CardContent>
    </Card>
  </motion.div>
));

BarrierCard.displayName = 'BarrierCard';

// ===========================================
// Results Step Component
// ===========================================

const ResultsStep = memo(({ 
  motivationScores, 
  barrierScores, 
  onRestart,
  onComplete 
}: { 
  motivationScores: MotivationScore[];
  barrierScores: BarrierScore[];
  onRestart: () => void;
  onComplete: () => void;
}) => {
  const avgMotivation = motivationScores.reduce((sum, m) => sum + m.score, 0) / motivationScores.length;
  const avgBarrier = barrierScores.reduce((sum, b) => sum + b.severity, 0) / barrierScores.length;
  const readinessScore = Math.round((avgMotivation * 10) - (avgBarrier * 5));
  const clampedScore = Math.max(0, Math.min(100, readinessScore));
  
  const topMotivations = [...motivationScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  const topBarriers = [...barrierScores]
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3);
  
  const getReadinessLabel = (score: number) => {
    if (score >= 70) return { label: 'Prêt à vous lancer', color: 'text-emerald-500' };
    if (score >= 50) return { label: 'Quelques points à travailler', color: 'text-amber-500' };
    return { label: 'Travail préparatoire nécessaire', color: 'text-red-500' };
  };
  
  const readiness = getReadinessLabel(clampedScore);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <Card className="text-center p-8">
        <h2 className="text-2xl font-bold mb-6">Votre score de préparation</h2>
        
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              className={cn(
                clampedScore >= 70 ? 'text-emerald-500' : 
                clampedScore >= 50 ? 'text-amber-500' : 'text-red-500'
              )}
              initial={{ strokeDasharray: '0 440' }}
              animate={{ strokeDasharray: `${clampedScore * 4.4} 440` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <div className={cn('text-4xl font-bold', readiness.color)}>{clampedScore}%</div>
              <div className="text-sm text-muted-foreground">{readiness.label}</div>
            </div>
          </div>
        </div>
      </Card>
      
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Vos principales motivations
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {topMotivations.map((m, i) => (
            <motion.div
              key={m.motivation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <InteractiveCard className="h-full">
                <div className="p-4 text-center">
                  <div className="text-3xl mb-2">{m.motivation.icon}</div>
                  <h4 className="font-semibold">{m.motivation.name.fr}</h4>
                  <div className="mt-2">
                    <Badge className="bg-emerald-500">{m.score}/10</Badge>
                  </div>
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Obstacles à travailler
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {topBarriers.map((b, i) => (
            <motion.div
              key={b.barrier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <InteractiveCard className="h-full">
                <div className="p-4 text-center">
                  <div className="text-3xl mb-2">{b.barrier.icon}</div>
                  <h4 className="font-semibold">{b.barrier.name.fr}</h4>
                  <div className="mt-2">
                    <Badge variant={b.severity >= 7 ? 'destructive' : 'secondary'}>
                      Impact: {b.severity}/10
                    </Badge>
                  </div>
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </div>
      
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <h3 className="text-xl font-bold">Recommandations</h3>
        </div>
        <ul className="space-y-3">
          {topBarriers.flatMap(b => b.barrier.solutions?.fr || []).slice(0, 5).map((solution, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2"
            >
              <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <span>{solution}</span>
            </motion.li>
          ))}
        </ul>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Recommencer
        </Button>
        <Button onClick={onComplete}>
          <Download className="w-4 h-4 mr-2" />
          Exporter les résultats
        </Button>
      </div>
    </motion.div>
  );
});

ResultsStep.displayName = 'ResultsStep';

// ===========================================
// Main Component
// ===========================================

function MotivationsBarriersModule({ onComplete, onBack }: MotivationsBarriersModuleProps) {
  const [step, setStep] = useState<Step>('intro');
  const [currentMotivationIndex, setCurrentMotivationIndex] = useState(0);
  const [currentBarrierIndex, setCurrentBarrierIndex] = useState(0);
  const [motivationScores, setMotivationScores] = useState<MotivationScore[]>(
    MOTIVATIONS_DATA.map(m => ({ motivation: m, score: 5 }))
  );
  const [barrierScores, setBarrierScores] = useState<BarrierScore[]>(
    BARRIERS_DATA.map(b => ({ barrier: b, severity: 5 }))
  );
  
  const progress = useMemo(() => {
    switch (step) {
      case 'intro': return 0;
      case 'motivations': return (currentMotivationIndex / MOTIVATIONS_DATA.length) * 33 + 1;
      case 'barriers': return (currentBarrierIndex / BARRIERS_DATA.length) * 33 + 34;
      case 'results': return 100;
      default: return 0;
    }
  }, [step, currentMotivationIndex, currentBarrierIndex]);
  
  const handleMotivationScoreChange = useCallback((index: number, score: number) => {
    setMotivationScores(prev => {
      const newScores = [...prev];
      newScores[index] = { ...newScores[index], score };
      return newScores;
    });
  }, []);
  
  const handleBarrierSeverityChange = useCallback((index: number, severity: number) => {
    setBarrierScores(prev => {
      const newScores = [...prev];
      newScores[index] = { ...newScores[index], severity };
      return newScores;
    });
  }, []);
  
  const handleNextMotivation = useCallback(() => {
    if (currentMotivationIndex < MOTIVATIONS_DATA.length - 1) {
      setCurrentMotivationIndex(prev => prev + 1);
    } else {
      setStep('barriers');
      setCurrentBarrierIndex(0);
    }
  }, [currentMotivationIndex]);
  
  const handlePrevMotivation = useCallback(() => {
    if (currentMotivationIndex > 0) {
      setCurrentMotivationIndex(prev => prev - 1);
    } else {
      setStep('intro');
    }
  }, [currentMotivationIndex]);
  
  const handleNextBarrier = useCallback(() => {
    if (currentBarrierIndex < BARRIERS_DATA.length - 1) {
      setCurrentBarrierIndex(prev => prev + 1);
    } else {
      setStep('results');
    }
  }, [currentBarrierIndex]);
  
  const handlePrevBarrier = useCallback(() => {
    if (currentBarrierIndex > 0) {
      setCurrentBarrierIndex(prev => prev - 1);
    } else {
      setStep('motivations');
    }
  }, [currentBarrierIndex]);
  
  const handleComplete = useCallback(() => {
    const avgMotivation = motivationScores.reduce((sum, m) => sum + m.score, 0) / motivationScores.length;
    const avgBarrier = barrierScores.reduce((sum, b) => sum + b.severity, 0) / barrierScores.length;
    const readinessScore = Math.round((avgMotivation * 10) - (avgBarrier * 5));
    
    onComplete?.({
      motivations: motivationScores,
      barriers: barrierScores,
      readinessScore: Math.max(0, Math.min(100, readinessScore))
    });
  }, [motivationScores, barrierScores, onComplete]);
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {step !== 'intro' && step !== 'results' && (
          <div className="mb-8">
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            
            <div className="flex items-center gap-4 mb-4">
              <Progress value={progress} className="flex-1" />
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div key="intro">
              <IntroStep onStart={() => setStep('motivations')} />
            </motion.div>
          )}
          
          {step === 'motivations' && (
            <motion.div key="motivations" className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">
                Vos motivations
                <span className="text-emerald-500 ml-2">({currentMotivationIndex + 1}/{MOTIVATIONS_DATA.length})</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Évaluez l'importance de chaque motivation pour vous
              </p>
              
              <AnimatePresence mode="wait">
                <MotivationCard
                  key={currentMotivationIndex}
                  motivation={motivationScores[currentMotivationIndex].motivation}
                  score={motivationScores[currentMotivationIndex].score}
                  onScoreChange={(score) => handleMotivationScoreChange(currentMotivationIndex, score)}
                />
              </AnimatePresence>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevMotivation}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>
                <Button 
                  onClick={handleNextMotivation}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                >
                  {currentMotivationIndex < MOTIVATIONS_DATA.length - 1 ? 'Suivant' : 'Continuer vers les freins'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {step === 'barriers' && (
            <motion.div key="barriers" className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">
                Vos freins potentiels
                <span className="text-amber-500 ml-2">({currentBarrierIndex + 1}/{BARRIERS_DATA.length})</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Évaluez l'impact de chaque frein sur votre projet
              </p>
              
              <AnimatePresence mode="wait">
                <BarrierCard
                  key={currentBarrierIndex}
                  barrier={barrierScores[currentBarrierIndex].barrier}
                  severity={barrierScores[currentBarrierIndex].severity}
                  onSeverityChange={(severity) => handleBarrierSeverityChange(currentBarrierIndex, severity)}
                />
              </AnimatePresence>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevBarrier}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>
                <Button 
                  onClick={handleNextBarrier}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                >
                  {currentBarrierIndex < BARRIERS_DATA.length - 1 ? 'Suivant' : 'Voir les résultats'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {step === 'results' && (
            <motion.div key="results">
              <ResultsStep
                motivationScores={motivationScores}
                barrierScores={barrierScores}
                onRestart={() => {
                  setStep('intro');
                  setCurrentMotivationIndex(0);
                  setCurrentBarrierIndex(0);
                  setMotivationScores(MOTIVATIONS_DATA.map(m => ({ motivation: m, score: 5 })));
                  setBarrierScores(BARRIERS_DATA.map(b => ({ barrier: b, severity: 5 })));
                }}
                onComplete={handleComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(MotivationsBarriersModule);
