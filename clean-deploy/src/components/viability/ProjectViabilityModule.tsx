'use client';

import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  FileText, 
  Users, 
  MapPin, 
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  Briefcase,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import BusinessPlanAnalyzer from './BusinessPlanAnalyzer';
import MarketStudyAssistant from './MarketStudyAssistant';
import ActorsDirectory from './ActorsDirectory';
import ProjectRegistrationForm from './ProjectRegistrationForm';

type ActiveView = 'main' | 'business-plan' | 'market-study' | 'actors' | 'registration';

interface ProjectViabilityModuleProps {
  onBack?: () => void;
}

// Project Overview Component
const ProjectOverview = memo(({ onNavigate }: { onNavigate: (view: ActiveView) => void }) => {
  const modules = [
    {
      id: 'registration' as const,
      icon: FileText,
      title: 'Formulaire d\'Inscription',
      description: 'Complétez votre profil entrepreneur et identifiez vos besoins',
      progress: 0,
      gradient: 'from-emerald-500 to-teal-500',
      badge: 'Recommandé',
      features: ['Profil détaillé', 'Besoins identifiés', 'Actions menées']
    },
    {
      id: 'business-plan' as const,
      icon: Briefcase,
      title: 'Business Plan',
      description: 'Analysez et structurez votre modèle économique avec l\'IA',
      progress: 0,
      gradient: 'from-purple-500 to-pink-500',
      badge: 'IA',
      features: ['Analyse IA', 'Score viabilité', 'Recommandations']
    },
    {
      id: 'market-study' as const,
      icon: TrendingUp,
      title: 'Étude de Marché',
      description: 'Explorez votre marché et analysez la concurrence',
      progress: 0,
      gradient: 'from-amber-500 to-orange-500',
      badge: 'IA',
      features: ['Taille marché', 'Concurrents', 'Tendances']
    },
    {
      id: 'actors' as const,
      icon: Building2,
      title: 'Annuaire Acteurs',
      description: 'Trouvez les structures d\'accompagnement près de chez vous',
      progress: 0,
      gradient: 'from-cyan-500 to-blue-500',
      features: ['CCI', 'Incubateurs', 'Réseaux']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Viabilité Projet</h2>
              <p className="text-sm text-muted-foreground">Évaluez et structurez votre projet entrepreneurial</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-2 text-emerald-500 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Objectif</span>
              </div>
              <p className="text-sm text-muted-foreground">Valider la viabilité de votre projet</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-2 text-purple-500 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Méthode</span>
              </div>
              <p className="text-sm text-muted-foreground">Analyse assistée par intelligence artificielle</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <Rocket className="w-4 h-4" />
                <span className="text-sm font-medium">Résultat</span>
              </div>
              <p className="text-sm text-muted-foreground">Plan d\'action personnalisé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <InteractiveCard className="h-full">
              <button
                onClick={() => onNavigate(mod.id)}
                className="w-full text-left p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center`}>
                    <mod.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex gap-2">
                    {mod.badge && (
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        {mod.badge}
                      </Badge>
                    )}
                    {mod.progress === 100 && (
                      <Badge className="bg-emerald-500 text-white">✓</Badge>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{mod.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{mod.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {mod.features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                {mod.progress > 0 && mod.progress < 100 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progression</span>
                      <span>{mod.progress}%</span>
                    </div>
                    <Progress value={mod.progress} className="h-1.5" />
                  </div>
                )}
                
                <div className="flex items-center text-sm text-emerald-500 font-medium">
                  Accéder
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            </InteractiveCard>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-500" />
          Actions rapides
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => onNavigate('registration')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Nouveau formulaire
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => onNavigate('market-study')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analyser un marché
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => onNavigate('actors')}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Trouver un accompagnement
          </Button>
        </div>
      </GlassCard>
    </div>
  );
});

ProjectOverview.displayName = 'ProjectOverview';

// Main Component
const ProjectViabilityModule = memo(({ onBack }: ProjectViabilityModuleProps) => {
  const [activeView, setActiveView] = useState<ActiveView>('main');

  const handleNavigate = useCallback((view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    setActiveView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {activeView === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="pt-24 pb-16"
          >
            <div className="container mx-auto px-4">
              {onBack && (
                <Button variant="ghost" onClick={onBack} className="mb-4">
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Retour à l\'accueil
                </Button>
              )}
              <ProjectOverview onNavigate={handleNavigate} />
            </div>
          </motion.div>
        )}

        {activeView === 'business-plan' && (
          <motion.div
            key="business-plan"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <BusinessPlanAnalyzer onBack={handleBack} />
          </motion.div>
        )}

        {activeView === 'market-study' && (
          <motion.div
            key="market-study"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <MarketStudyAssistant onBack={handleBack} />
          </motion.div>
        )}

        {activeView === 'actors' && (
          <motion.div
            key="actors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ActorsDirectory onBack={handleBack} />
          </motion.div>
        )}

        {activeView === 'registration' && (
          <motion.div
            key="registration"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ProjectRegistrationForm onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ProjectViabilityModule.displayName = 'ProjectViabilityModule';

export default ProjectViabilityModule;
