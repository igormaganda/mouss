'use client';

import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  TrendingUp,
  MapPin,
  Target,
  Users,
  Building2,
  BarChart3,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';

interface MarketStudyAssistantProps {
  onBack?: () => void;
}

// French regions
const REGIONS = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  'Provence-Alpes-Côte d\'Azur'
];

// Market Insight Card
const MarketInsightCard = memo(({ 
  title, 
  value, 
  description, 
  trend,
  icon: Icon
}: { 
  title: string; 
  value: string; 
  description: string; 
  trend?: 'up' | 'down' | 'stable';
  icon: React.ElementType;
}) => (
  <InteractiveCard className="p-4">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-emerald-500" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground">{title}</span>
          {trend && (
            <Badge variant="outline" className={
              trend === 'up' ? 'border-emerald-500 text-emerald-500' :
              trend === 'down' ? 'border-red-500 text-red-500' :
              'border-amber-500 text-amber-500'
            }>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </InteractiveCard>
));

MarketInsightCard.displayName = 'MarketInsightCard';

// Competitor Card
const CompetitorCard = memo(({ 
  competitor 
}: { 
  competitor: { 
    name: string; 
    marketShare: number; 
    strengths: string[]; 
    weaknesses: string[];
    positioning: string;
  };
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <InteractiveCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h4 className="font-medium">{competitor.name}</h4>
            <p className="text-xs text-muted-foreground">Part de marché: {competitor.marketShare}%</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{competitor.positioning}</p>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <div>
              <h5 className="text-xs font-medium text-muted-foreground mb-1">Forces</h5>
              <div className="flex flex-wrap gap-1">
                {competitor.strengths.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-emerald-500/10 border-emerald-500/20">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-medium text-muted-foreground mb-1">Faiblesses</h5>
              <div className="flex flex-wrap gap-1">
                {competitor.weaknesses.map((w, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-red-500/10 border-red-500/20">
                    {w}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </InteractiveCard>
  );
});

CompetitorCard.displayName = 'CompetitorCard';

// Trend Card
const TrendCard = memo(({ 
  trend 
}: { 
  trend: { 
    name: string; 
    description: string; 
    impact: 'positive' | 'negative' | 'neutral';
    importance: 'high' | 'medium' | 'low';
  };
}) => {
  const getImpactStyles = () => {
    switch (trend.impact) {
      case 'positive': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'negative': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-amber-500/10 border-amber-500/20';
    }
  };

  const getImpactIcon = () => {
    switch (trend.impact) {
      case 'positive': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'negative': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getImpactStyles()}`}>
      <div className="flex items-start gap-3">
        {getImpactIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm">{trend.name}</h4>
            <Badge variant="outline" className="text-xs">
              {trend.importance === 'high' ? 'Élevé' : trend.importance === 'medium' ? 'Moyen' : 'Faible'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{trend.description}</p>
        </div>
      </div>
    </div>
  );
});

TrendCard.displayName = 'TrendCard';

// Main Component
const MarketStudyAssistant = memo(({ onBack }: MarketStudyAssistantProps) => {
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    sector: '',
    subSector: '',
    location: '',
    targetAudience: '',
    priceRange: '',
    competitors: ''
  });

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    setStep('analyzing');

    try {
      // Call the real API
      const response = await fetch('/api/market-studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: 'demo-project',
          sector: formData.sector,
          subSector: formData.subSector,
          location: formData.location,
          targetAudience: formData.targetAudience,
          competitors: formData.competitors,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const study = data.data;
        // Transform API response to match component format
        const transformedData = {
          marketSize: study.marketSize || {
            tam: study.marketSize?.tam || 1500000000,
            sam: study.marketSize?.sam || 250000000,
            som: study.marketSize?.som || 15000000,
            growthRate: study.marketSize?.growthRate || 8.5,
            currency: 'EUR'
          },
          insights: {
            marketGrowth: { value: `+${study.marketSize?.growthRate || 8.5}%`, trend: 'up' as const },
            averagePrice: { value: '45-85€', trend: 'stable' as const },
            competitionLevel: { value: 'Moyen', trend: 'down' as const },
            customerAcquisition: { value: '35€', trend: 'up' as const }
          },
          competitors: study.competitors || [],
          trends: study.trends || [],
          recommendations: study.recommendations || [],
          targetSegments: study.targetAudience || []
        };

        setMarketData(transformedData);
        setStep('result');

        toast({
          title: 'Étude terminée',
          description: 'Votre analyse de marché a été générée et sauvegardée avec succès.'
        });
      } else {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }
    } catch (error) {
      console.error('Error generating market study:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer l\'étude de marché. Veuillez réessayer.',
        variant: 'destructive'
      });
      setStep('form');
    } finally {
      setIsAnalyzing(false);
    }
  }, [formData, toast]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} Md€`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)} M€`;
    }
    return `${value.toLocaleString('fr-FR')}€`;
  };

  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Étude de Marché</h1>
              <p className="text-muted-foreground">Analysez votre marché avec l'intelligence artificielle</p>
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
              className="space-y-6"
            >
              <GlassCard className="p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  Paramètres de l'étude
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Secteur d'activité *</Label>
                    <Select onValueChange={(v) => updateFormData('sector', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technologie / Digital</SelectItem>
                        <SelectItem value="commerce">Commerce / Distribution</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="artisanat">Artisanat</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="sante">Santé / Bien-être</SelectItem>
                        <SelectItem value="education">Éducation / Formation</SelectItem>
                        <SelectItem value="tourisme">Tourisme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sous-secteur (optionnel)</Label>
                    <Input
                      placeholder="Ex: E-commerce mode"
                      value={formData.subSector}
                      onChange={(e) => updateFormData('subSector', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Zone géographique *</Label>
                  <Select onValueChange={(v) => updateFormData('location', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une région" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                      <SelectItem value="national">National (France entière)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Public cible</Label>
                  <Textarea
                    placeholder="Décrivez votre clientèle cible (âge, CSP, comportements...)"
                    value={formData.targetAudience}
                    onChange={(e) => updateFormData('targetAudience', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Concurrents connus (optionnel)</Label>
                  <Textarea
                    placeholder="Listez les concurrents que vous connaissez déjà..."
                    value={formData.competitors}
                    onChange={(e) => updateFormData('competitors', e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    onClick={handleAnalyze}
                    disabled={!formData.sector || !formData.location}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Lancer l'étude de marché
                  </Button>
                </div>
              </GlassCard>
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
                <Loader2 className="w-16 h-16 text-amber-500" />
              </motion.div>
              <h2 className="text-2xl font-bold mt-6 mb-2">Analyse du marché...</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Notre IA collecte et analyse les données de votre marché : taille, tendances, concurrence...
              </p>
              
              <div className="mt-8 w-full max-w-md">
                <div className="space-y-3">
                  {[
                    { label: 'Taille du marché', progress: 100 },
                    { label: 'Analyse concurrentielle', progress: 75 },
                    { label: 'Tendances', progress: 50 },
                    { label: 'Segments cibles', progress: 25 }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Result Step */}
          {step === 'result' && marketData && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Market Size */}
              <GlassCard className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  Taille du marché
                </h3>
                
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-500/10 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Marché total (TAM)</p>
                    <p className="text-2xl font-bold text-emerald-500">
                      {formatCurrency(marketData.marketSize.tam)}
                    </p>
                  </div>
                  <div className="bg-teal-500/10 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Marché adressable (SAM)</p>
                    <p className="text-2xl font-bold text-teal-500">
                      {formatCurrency(marketData.marketSize.sam)}
                    </p>
                  </div>
                  <div className="bg-cyan-500/10 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Marché obtenable (SOM)</p>
                    <p className="text-2xl font-bold text-cyan-500">
                      {formatCurrency(marketData.marketSize.som)}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MarketInsightCard
                    title="Croissance"
                    value={`+${marketData.marketSize.growthRate}%`}
                    description="Taux de croissance annuel"
                    trend="up"
                    icon={TrendingUp}
                  />
                  <MarketInsightCard
                    title="Prix moyen"
                    value={marketData.insights.averagePrice.value}
                    description="Fourchette de prix du marché"
                    trend="stable"
                    icon={Target}
                  />
                  <MarketInsightCard
                    title="Concurrence"
                    value={marketData.insights.competitionLevel.value}
                    description="Niveau de compétition"
                    trend="down"
                    icon={Building2}
                  />
                  <MarketInsightCard
                    title="Acquisition client"
                    value={marketData.insights.customerAcquisition.value}
                    description="Coût moyen d'acquisition"
                    trend="up"
                    icon={Users}
                  />
                </div>
              </GlassCard>

              {/* Target Segments */}
              <GlassCard className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  Segments de clientèle
                </h3>
                
                <div className="space-y-4">
                  {marketData.targetSegments.map((segment: any, i: number) => (
                    <InteractiveCard key={i} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{segment.name}</h4>
                        <Badge variant="outline">{segment.size} du marché</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {segment.characteristics.map((c: string, j: number) => (
                          <Badge key={j} variant="secondary" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Pain points:</span> {segment.painPoints.join(', ')}
                      </div>
                    </InteractiveCard>
                  ))}
                </div>
              </GlassCard>

              {/* Competitors */}
              <GlassCard className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-500" />
                  Analyse concurrentielle
                </h3>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketData.competitors.map((competitor: any, i: number) => (
                    <CompetitorCard key={i} competitor={competitor} />
                  ))}
                </div>
              </GlassCard>

              {/* Trends */}
              <GlassCard className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  Tendances du marché
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {marketData.trends.map((trend: any, i: number) => (
                    <TrendCard key={i} trend={trend} />
                  ))}
                </div>
              </GlassCard>

              {/* Recommendations */}
              <GlassCard className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  Recommandations
                </h3>
                
                <ul className="space-y-3">
                  {marketData.recommendations.map((rec: string, i: number) => (
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
                <Button variant="outline" onClick={() => setStep('form')}>
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Nouvelle étude
                </Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  Sauvegarder l'étude
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

MarketStudyAssistant.displayName = 'MarketStudyAssistant';

export default MarketStudyAssistant;
