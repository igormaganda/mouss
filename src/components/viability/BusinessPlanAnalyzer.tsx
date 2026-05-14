'use client';

import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  Briefcase,
  FileText,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  Save
} from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';
import { generateBusinessPlanPDF } from '@/lib/pdf-export';

interface BusinessPlanAnalyzerProps {
  onBack?: () => void;
}

// Zod Schema
const businessPlanSchema = z.object({
  projectName: z.string()
    .min(2, { message: 'Le nom du projet doit contenir au moins 2 caractères' })
    .nonempty({ message: 'Le nom du projet est requis' }),
  sector: z.string()
    .min(1, { message: 'Le secteur d\'activité est requis' }),
  projectType: z.string()
    .min(1, { message: 'Le type de projet est requis' }),
  description: z.string()
    .max(1000, { message: 'La description ne peut pas dépasser 1000 caractères' })
    .optional(),
  targetMarket: z.string().optional(),
  valueProposition: z.string().optional(),
  revenueModel: z.string().optional(),
  initialInvestment: z.union([
    z.string(),
    z.number()
  ]).transform((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }).refine(
    (val) => val === undefined || val > 0,
    { message: 'L\'investissement initial doit être un nombre positif' }
  ).optional(),
  monthlyRevenue: z.union([
    z.string(),
    z.number()
  ]).transform((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }).refine(
    (val) => val === undefined || val > 0,
    { message: 'Le chiffre d\'affaires mensuel doit être un nombre positif' }
  ).optional(),
  teamSize: z.string().optional(),
  competition: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
});

type BusinessPlanFormData = z.infer<typeof businessPlanSchema>;

// Sectors data
const SECTORS = [
  { value: 'tech', label: 'Technologie / Digital' },
  { value: 'commerce', label: 'Commerce / Distribution' },
  { value: 'services', label: 'Services' },
  { value: 'artisanat', label: 'Artisanat' },
  { value: 'agriculture', label: 'Agriculture / Agroalimentaire' },
  { value: 'industrie', label: 'Industrie' },
  { value: 'sante', label: 'Santé / Bien-être' },
  { value: 'education', label: 'Éducation / Formation' },
  { value: 'tourisme', label: 'Tourisme / Hôtellerie' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'finance', label: 'Finance / Assurance' },
  { value: 'autre', label: 'Autre' }
];

const PROJECT_TYPES = [
  { value: 'creation', label: 'Création d\'entreprise' },
  { value: 'reprise', label: 'Reprise d\'entreprise' },
  { value: 'franchise', label: 'Franchise' },
  { value: 'auto_enterprise', label: 'Auto-entreprise / Micro-entreprise' }
];

// Analysis Result Component
const AnalysisResult = memo(({ result, projectName, sector }: { 
  result: {
    score: number;
    grade: string;
    summary: string;
    details: {
      market: { score: number; feedback: string };
      financial: { score: number; feedback: string };
      team: { score: number; feedback: string };
      product: { score: number; feedback: string };
    };
    recommendations: string[];
    swot?: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    nextSteps?: string[];
  };
  projectName: string;
  sector: string;
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-500';
      case 'B': return 'text-teal-500';
      case 'C': return 'text-amber-500';
      case 'D': return 'text-orange-500';
      default: return 'text-red-500';
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Generate PDF on client side
      generateBusinessPlanPDF(result, projectName, sector);

      toast({
        title: 'PDF exporté',
        description: 'Votre analyse a été exportée avec succès.',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'exporter le PDF. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score Overview */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Résultat de l'analyse</h3>
          <Badge className="bg-emerald-500/20 text-emerald-600">IA</Badge>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="relative">
            <ProgressRing 
              progress={result.score} 
              size={120} 
              strokeWidth={10}
              className="text-emerald-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getGradeColor(result.grade)}`}>
                {result.grade}
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-4xl font-bold mb-2">{result.score}/100</p>
            <p className="text-muted-foreground">{result.summary}</p>
          </div>
        </div>
      </GlassCard>

      {/* Detailed Scores */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { key: 'market', label: 'Marché', icon: TrendingUp, ...result.details.market },
          { key: 'financial', label: 'Financier', icon: DollarSign, ...result.details.financial },
          { key: 'team', label: 'Équipe', icon: Users, ...result.details.team },
          { key: 'product', label: 'Produit', icon: Target, ...result.details.product }
        ].map((item) => (
          <InteractiveCard key={item.key} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold text-emerald-500">{item.score}/100</span>
                </div>
                <Progress value={item.score} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">{item.feedback}</p>
              </div>
            </div>
          </InteractiveCard>
        ))}
      </div>

      {/* Recommendations */}
      <GlassCard className="p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Recommandations
        </h4>
        <ul className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{rec}</span>
            </motion.li>
          ))}
        </ul>
      </GlassCard>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder l'analyse
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isExporting ? 'Export...' : 'Exporter en PDF'}
        </Button>
      </div>
    </motion.div>
  );
});

AnalysisResult.displayName = 'AnalysisResult';

// Main Component
const BusinessPlanAnalyzer = memo(({ onBack }: BusinessPlanAnalyzerProps) => {
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<BusinessPlanFormData>({
    resolver: zodResolver(businessPlanSchema),
    mode: 'onChange',
    defaultValues: {
      projectName: '',
      sector: '',
      projectType: '',
      description: '',
      targetMarket: '',
      valueProposition: '',
      revenueModel: '',
      initialInvestment: '',
      monthlyRevenue: '',
      teamSize: '',
      competition: '',
      strengths: '',
      weaknesses: '',
    },
  });

  // Watch form values for display
  const formData = watch();

  const onSubmit = useCallback(async (data: BusinessPlanFormData) => {
    setIsAnalyzing(true);
    setStep('analyzing');

    try {
      // Call the real API
      const response = await fetch('/api/business-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: 'demo-project',
          projectName: data.projectName,
          sector: data.sector,
          projectType: data.projectType,
          description: data.description,
          targetMarket: data.targetMarket,
          valueProposition: data.valueProposition,
          revenueModel: data.revenueModel,
          initialInvestment: data.initialInvestment,
          monthlyRevenue: data.monthlyRevenue,
          teamSize: data.teamSize,
          competition: data.competition,
          strengths: data.strengths,
          weaknesses: data.weaknesses,
        }),
      });

      const responseData = await response.json();

      if (responseData.success && responseData.data.analysis) {
        const analysis = responseData.data.analysis;
        const result = {
          score: analysis.score,
          grade: analysis.grade,
          summary: analysis.summary,
          details: analysis.details,
          recommendations: analysis.recommendations
        };

        setAnalysisResult(result);
        setStep('result');

        toast({
          title: 'Analyse terminée',
          description: 'Votre business plan a été analysé et sauvegardé avec succès.'
        });
      } else {
        throw new Error(responseData.error || 'Erreur lors de l\'analyse');
      }
    } catch (error) {
      console.error('Error analyzing business plan:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'analyser le business plan. Veuillez réessayer.',
        variant: 'destructive'
      });
      setStep('form');
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const handleAnalyze = handleSubmit(onSubmit);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Retour
            </Button>
          )}
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Analyse Business Plan</h1>
              <p className="text-muted-foreground">Évaluez la viabilité de votre projet avec l'IA</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Form Step */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="market">Marché</TabsTrigger>
                  <TabsTrigger value="financial">Financier</TabsTrigger>
                  <TabsTrigger value="analysis">Analyse</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <GlassCard className="p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-500" />
                      Informations générales
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="projectName">Nom du projet *</Label>
                        <Input
                          id="projectName"
                          placeholder="Mon Projet"
                          {...register('projectName')}
                          className={errors.projectName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {errors.projectName && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.projectName.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Secteur d'activité *</Label>
                        <Select 
                          onValueChange={(v) => {
                            setValue('sector', v);
                            trigger('sector');
                          }}
                          value={formData.sector}
                        >
                          <SelectTrigger className={errors.sector ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                            <SelectValue placeholder="Sélectionner un secteur" />
                          </SelectTrigger>
                          <SelectContent>
                            {SECTORS.map(s => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.sector && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.sector.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Type de projet *</Label>
                      <Select 
                        onValueChange={(v) => {
                          setValue('projectType', v);
                          trigger('projectType');
                        }}
                        value={formData.projectType}
                      >
                        <SelectTrigger className={errors.projectType ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_TYPES.map(p => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.projectType && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.projectType.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Description du projet</Label>
                        <span className="text-xs text-muted-foreground">
                          {formData.description?.length || 0}/1000
                        </span>
                      </div>
                      <Textarea
                        placeholder="Décrivez votre projet en quelques phrases..."
                        className={`min-h-[120px] ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        {...register('description')}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="market" className="space-y-4">
                  <GlassCard className="p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-500" />
                      Analyse du marché
                    </h3>

                    <div className="space-y-2">
                      <Label>Marché cible</Label>
                      <Textarea
                        placeholder="Qui sont vos clients ? Quelle est votre zone géographique ?"
                        {...register('targetMarket')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Proposition de valeur</Label>
                      <Textarea
                        placeholder="Qu'est-ce qui différencie votre offre ?"
                        {...register('valueProposition')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Concurrence</Label>
                      <Textarea
                        placeholder="Qui sont vos concurrents principaux ?"
                        {...register('competition')}
                      />
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <GlassCard className="p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                      Aspects financiers
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Investissement initial estimé (€)</Label>
                        <Input
                          type="number"
                          placeholder="Ex: 50000"
                          {...register('initialInvestment')}
                          className={errors.initialInvestment ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {errors.initialInvestment && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.initialInvestment.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Chiffre d'affaires mensuel visé (€)</Label>
                        <Input
                          type="number"
                          placeholder="Ex: 10000"
                          {...register('monthlyRevenue')}
                          className={errors.monthlyRevenue ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {errors.monthlyRevenue && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.monthlyRevenue.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Modèle de revenus</Label>
                      <Textarea
                        placeholder="Comment allez-vous générer des revenus ?"
                        {...register('revenueModel')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Taille de l'équipe prévue</Label>
                      <Select 
                        onValueChange={(v) => setValue('teamSize', v)}
                        value={formData.teamSize}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Solo (1 personne)</SelectItem>
                          <SelectItem value="2-5">Petite équipe (2-5)</SelectItem>
                          <SelectItem value="6-10">Équipe moyenne (6-10)</SelectItem>
                          <SelectItem value="10+">Grande équipe (10+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <GlassCard className="p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                      Analyse SWOT (optionnel)
                    </h3>

                    <div className="space-y-2">
                      <Label>Forces</Label>
                      <Textarea
                        placeholder="Quels sont vos atouts ?"
                        {...register('strengths')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Faiblesses</Label>
                      <Textarea
                        placeholder="Quels sont vos points à améliorer ?"
                        {...register('weaknesses')}
                      />
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="button"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={handleAnalyze}
                        disabled={!isValid}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Lancer l'analyse IA
                      </Button>
                      {!isValid && (
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          Veuillez remplir tous les champs requis (nom du projet, secteur et type de projet).
                        </p>
                      )}
                    </div>
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {/* Analyzing Step */}
          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-16 h-16 text-purple-500" />
              </motion.div>
              <h2 className="text-2xl font-bold mt-6 mb-2">Analyse en cours...</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Notre IA analyse votre business plan selon plusieurs critères : marché, finances, équipe et produit.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
                {['Marché', 'Finances', 'Équipe', 'Produit'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Result Step */}
          {step === 'result' && analysisResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalysisResult 
                result={analysisResult} 
                projectName={formData.projectName}
                sector={formData.sector}
              />
              
              <div className="mt-6">
                <Button variant="outline" onClick={() => setStep('form')}>
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Modifier les informations
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

BusinessPlanAnalyzer.displayName = 'BusinessPlanAnalyzer';

export default BusinessPlanAnalyzer;
