'use client';

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft,
  Play,
  Pause,
  MessageSquare,
  FileText,
  AlertCircle,
  Lightbulb,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  ClipboardList,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { INTERVIEW_STEPS, INTERVIEW_TEMPLATE } from '@/data/interview-data';
import type { InterviewPhase } from '@/types/interview';

// Types
interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
}

interface InterviewFrameworkProps {
  onComplete?: (session: {
    duration: number;
    completedSteps: string[];
    notes: string;
  }) => void;
  onBack?: () => void;
}

// Phase Icons & Colors
const phaseIcons: Record<InterviewPhase, React.ElementType> = {
  welcome: Users,
  profile: FileText,
  project: Target,
  market: TrendingUp,
  financial: DollarSign,
  synthesis: ClipboardList,
  conclusion: Flag
};

const phaseColors: Record<InterviewPhase, string> = {
  welcome: 'from-emerald-500 to-teal-500',
  profile: 'from-blue-500 to-indigo-500',
  project: 'from-purple-500 to-pink-500',
  market: 'from-amber-500 to-orange-500',
  financial: 'from-green-500 to-emerald-500',
  synthesis: 'from-cyan-500 to-blue-500',
  conclusion: 'from-rose-500 to-red-500'
};

// Timer Component
const Timer = memo(({ 
  duration, 
  isRunning, 
  onPause, 
  onResume 
}: { 
  duration: number;
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg',
        isRunning ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
      )}>
        <Clock className="w-5 h-5" />
        <span>{formatTime(duration)}</span>
      </div>
      <Button variant="outline" size="icon" onClick={isRunning ? onPause : onResume}>
        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
    </div>
  );
});

Timer.displayName = 'Timer';

// Checklist Component
const Checklist = memo(({ 
  items, 
  onToggle 
}: { 
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}) => {
  const completedCount = items.filter(i => i.checked).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Checklist</span>
        <Badge variant="secondary">{completedCount}/{items.length}</Badge>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="space-y-2 mt-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={cn(
              'flex items-start gap-3 w-full text-left p-2 rounded-lg transition-colors hover:bg-muted/50',
              item.checked && 'text-muted-foreground'
            )}
          >
            {item.checked ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <span className={cn('text-sm', item.required && !item.checked && 'font-medium')}>
              {item.label}
              {item.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});

Checklist.displayName = 'Checklist';

// Tips Panel Component
const TipsPanel = memo(({ tips }: { tips: string[] }) => (
  <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <CardTitle className="text-sm">Conseils</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <ul className="text-sm space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-amber-500 mt-1">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
));

TipsPanel.displayName = 'TipsPanel';

// Questions Panel Component
const QuestionsPanel = memo(({ questions }: { questions: { id: string; question: { fr: string; ar: string }; type: string }[] }) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-500" />
        <CardTitle className="text-sm">Questions suggérées</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">Q{i + 1}</Badge>
              {q.type === 'scale' && <Badge variant="secondary" className="text-xs">Échelle</Badge>}
              {q.type === 'choice' && <Badge variant="secondary" className="text-xs">Choix</Badge>}
            </div>
            <p className="text-sm">{q.question.fr}</p>
            {q.type === 'open' && (
              <Textarea className="mt-2" placeholder="Notez la réponse..." />
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

QuestionsPanel.displayName = 'QuestionsPanel';

// Main Component
function InterviewFramework({ onComplete, onBack }: InterviewFrameworkProps) {
  // Initialize checklists with useMemo
  const initialChecklists = useMemo(() => {
    const checklists: Record<string, ChecklistItem[]> = {};
    INTERVIEW_STEPS.forEach(step => {
      checklists[step.id] = step.checklist.map(item => ({
        id: item.id,
        label: item.label.fr,
        checked: false,
        required: item.required
      }));
    });
    return checklists;
  }, []);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [stepTime, setStepTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [checklists, setChecklists] = useState<Record<string, ChecklistItem[]>>(initialChecklists);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentStep = INTERVIEW_STEPS[currentStepIndex];
  const currentPhase = currentStep.phase;
  
  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setStepTime(prev => prev + 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);
  
  const progress = useMemo(() => ((currentStepIndex + 1) / INTERVIEW_STEPS.length) * 100, [currentStepIndex]);
  
  const handleChecklistToggle = useCallback((itemId: string) => {
    setChecklists(prev => ({
      ...prev,
      [currentStep.id]: prev[currentStep.id].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  }, [currentStep.id]);
  
  const handleNoteChange = useCallback((note: string) => {
    setNotes(prev => ({ ...prev, [currentStep.id]: note }));
  }, [currentStep.id]);
  
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < INTERVIEW_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setStepTime(0);
    }
  }, [currentStepIndex]);
  
  const handlePrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setStepTime(0);
    }
  }, [currentStepIndex]);
  
  const handleComplete = useCallback(() => {
    const completedSteps = INTERVIEW_STEPS
      .filter(step => {
        const checklist = checklists[step.id] || [];
        return checklist.filter(i => i.required).every(i => i.checked);
      })
      .map(s => s.id);
    
    onComplete?.({
      duration: totalTime,
      completedSteps,
      notes: Object.entries(notes).map(([stepId, content]) => 
        `## ${INTERVIEW_STEPS.find(s => s.id === stepId)?.title.fr}\n${content}`
      ).join('\n\n')
    });
  }, [checklists, notes, totalTime, onComplete]);
  
  const currentChecklist = checklists[currentStep.id] || [];
  const PhaseIcon = phaseIcons[currentPhase];
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Trame d&apos;Entretien</h1>
              <p className="text-muted-foreground">Session de 3 heures</p>
            </div>
            <Timer 
              duration={totalTime} 
              isRunning={isTimerRunning}
              onPause={() => setIsTimerRunning(false)}
              onResume={() => setIsTimerRunning(true)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progression globale</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        {/* Phase Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {INTERVIEW_TEMPLATE.phases.map((phase) => {
            const isActive = phase === currentPhase;
            const isCompleted = INTERVIEW_STEPS.findIndex(s => s.phase === phase) < currentStepIndex;
            const Icon = phaseIcons[phase];
            
            return (
              <Button
                key={phase}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'shrink-0',
                  isActive && `bg-gradient-to-r ${phaseColors[phase]} text-white`,
                  isCompleted && 'border-emerald-500 text-emerald-600'
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {phase.charAt(0).toUpperCase() + phase.slice(1)}
                {isCompleted && <CheckCircle2 className="w-4 h-4 ml-2" />}
              </Button>
            );
          })}
        </div>
        
        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className={`bg-gradient-to-r ${phaseColors[currentPhase]} mb-2`}>
                        Étape {currentStepIndex + 1}/{INTERVIEW_STEPS.length}
                      </Badge>
                      <CardTitle className="text-xl">{currentStep.title.fr}</CardTitle>
                      <CardDescription>{currentStep.description.fr}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-muted-foreground">{currentStep.duration} min</div>
                      <div className="text-sm text-muted-foreground">durée estimée</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span>Temps écoulé: {Math.floor(stepTime / 60)}:{(stepTime % 60).toString().padStart(2, '0')}</span>
                    </div>
                    {stepTime > currentStep.duration * 60 && (
                      <div className="flex items-center gap-2 text-amber-500">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Dépassement</span>
                      </div>
                    )}
                  </div>
                  
                  <Checklist items={currentChecklist} onToggle={handleChecklistToggle} />
                  <QuestionsPanel questions={currentStep.questions} />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Notes du conseiller</span>
                    </div>
                    <Textarea
                      value={notes[currentStep.id] || ''}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      placeholder="Notez vos observations ici..."
                      className="min-h-[150px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep} disabled={currentStepIndex === 0}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Étape précédente
              </Button>
              
              {currentStepIndex === INTERVIEW_STEPS.length - 1 ? (
                <Button onClick={handleComplete} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  Terminer l&apos;entretien
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNextStep} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  Étape suivante
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <TipsPanel tips={currentStep.tips.fr} />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Vue d&apos;ensemble</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {INTERVIEW_STEPS.map((step, i) => {
                      const isActive = i === currentStepIndex;
                      const isCompleted = i < currentStepIndex;
                      const checklist = checklists[step.id] || [];
                      const isComplete = checklist.filter(item => item.required).every(item => item.checked);
                      
                      return (
                        <button
                          key={step.id}
                          onClick={() => setCurrentStepIndex(i)}
                          className={cn(
                            'w-full text-left p-3 rounded-lg transition-colors',
                            isActive ? 'bg-primary text-primary-foreground' :
                            isCompleted ? 'bg-emerald-500/10 text-emerald-600' :
                            'hover:bg-muted'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{step.title.fr}</span>
                            {isComplete && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div className="text-xs opacity-70">{step.duration} min</div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(InterviewFramework);
