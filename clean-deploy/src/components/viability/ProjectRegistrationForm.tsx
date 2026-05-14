'use client';

import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  FileText,
  User,
  Briefcase,
  Target,
  Sparkles,
  Loader2,
  CheckCircle2,
  Building2,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

interface ProjectRegistrationFormProps {
  onBack?: () => void;
}

// Form Steps
const STEPS = [
  { id: 'mode', title: 'Mode de saisie', icon: User },
  { id: 'personal', title: 'Informations personnelles', icon: User },
  { id: 'background', title: 'Parcours & Compétences', icon: Briefcase },
  { id: 'project', title: 'Projet & Motivations', icon: Target },
  { id: 'needs', title: 'Besoins & Actions', icon: Sparkles },
  { id: 'review', title: 'Récapitulatif', icon: CheckCircle2 }
];

// Need categories
const NEED_CATEGORIES = [
  { id: 'financing', label: 'Financement', icon: '💰', options: ['Prêt bancaire', 'Microcrédit', 'Subvention', 'Investisseurs', 'Crowdfunding'] },
  { id: 'training', label: 'Formation', icon: '📚', options: ['Gestion', 'Marketing', 'Vente', 'Digital', 'Technique'] },
  { id: 'mentoring', label: 'Mentorat', icon: '🤝', options: ['Coach business', 'Mentor sectoriel', 'Parrain entrepreneur'] },
  { id: 'networking', label: 'Réseautage', icon: '🌐', options: ['Événements', 'Réseaux entrepreneurs', 'Partenaires'] },
  { id: 'premises', label: 'Locaux', icon: '🏢', options: ['Bureaux', 'Atelier', 'Local commercial', 'Coworking'] },
  { id: 'legal', label: 'Juridique', icon: '⚖️', options: ['Statuts', 'Contrats', 'Propriété intellectuelle', 'Réglementation'] }
];

// Support types
const SUPPORT_TYPES = [
  { id: 'individual', label: 'Accompagnement individuel', description: 'Rendez-vous personnalisés avec un conseiller' },
  { id: 'collective', label: 'Ateliers collectifs', description: 'Formations en groupe sur des thématiques clés' },
  { id: 'mentoring', label: 'Mentorat', description: 'Mise en relation avec un entrepreneur expérimenté' },
  { id: 'digital', label: 'Accompagnement digital', description: 'Outils et ressources en ligne' }
];

// Project stages
const PROJECT_STAGES = [
  { id: 'idea', label: 'Idée', description: 'J\'ai une idée mais je n\'ai pas encore commencé' },
  { id: 'concept', label: 'Concept', description: 'J\'ai commencé à structurer mon projet' },
  { id: 'business_plan', label: 'Business Plan', description: 'Je rédige mon business plan' },
  { id: 'funding', label: 'Financement', description: 'Je cherche des financements' },
  { id: 'launch', label: 'Lancement', description: 'Je suis prêt à me lancer' }
];

// Step Navigation Component
const StepNavigation = memo(({ 
  currentStep, 
  onStepClick 
}: { 
  currentStep: number; 
  onStepClick: (index: number) => void;
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-2">
      {STEPS.map((step, index) => (
        <button
          key={step.id}
          onClick={() => onStepClick(index)}
          className={`flex flex-col items-center ${index <= currentStep ? 'text-emerald-500' : 'text-muted-foreground'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-colors ${
            index < currentStep 
              ? 'bg-emerald-500 text-white' 
              : index === currentStep 
                ? 'bg-emerald-500/20 border-2 border-emerald-500' 
                : 'bg-muted'
          }`}>
            {index < currentStep ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          <span className="text-xs hidden sm:block">{step.title}</span>
        </button>
      ))}
    </div>
    <Progress value={(currentStep / (STEPS.length - 1)) * 100} className="h-1" />
  </div>
));

StepNavigation.displayName = 'StepNavigation';

// Mode Selection Component
const ModeSelection = memo(({ 
  mode, 
  onModeChange 
}: { 
  mode: 'candidate' | 'counselor' | null;
  onModeChange: (mode: 'candidate' | 'counselor') => void;
}) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h2 className="text-xl font-bold mb-2">Comment souhaitez-vous remplir ce formulaire ?</h2>
      <p className="text-muted-foreground">Vous pouvez le remplir vous-même ou vous faire aider par un conseiller</p>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <InteractiveCard 
        className={`cursor-pointer ${mode === 'candidate' ? 'ring-2 ring-emerald-500' : ''}`}
        onClick={() => onModeChange('candidate')}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="font-semibold mb-2">Je le remplis moi-même</h3>
          <p className="text-sm text-muted-foreground">
            Remplissez le formulaire à votre rythme. Vous pourrez le modifier ultérieurement.
          </p>
        </div>
      </InteractiveCard>

      <InteractiveCard 
        className={`cursor-pointer ${mode === 'counselor' ? 'ring-2 ring-emerald-500' : ''}`}
        onClick={() => onModeChange('counselor')}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="font-semibold mb-2">Assisté par un conseiller</h3>
          <p className="text-sm text-muted-foreground">
            Un conseiller vous accompagne pour identifier vos besoins et construire votre projet.
          </p>
        </div>
      </InteractiveCard>
    </div>
  </div>
));

ModeSelection.displayName = 'ModeSelection';

// Personal Info Step
const PersonalInfoStep = memo(({ 
  data, 
  onChange 
}: { 
  data: any;
  onChange: (field: string, value: any) => void;
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
    
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom *</Label>
        <Input
          id="firstName"
          value={data.firstName || ''}
          onChange={(e) => onChange('firstName', e.target.value)}
          placeholder="Votre prénom"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom *</Label>
        <Input
          id="lastName"
          value={data.lastName || ''}
          onChange={(e) => onChange('lastName', e.target.value)}
          placeholder="Votre nom"
        />
      </div>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={data.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="votre@email.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={data.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="06 XX XX XX XX"
        />
      </div>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Ville</Label>
        <Input
          value={data.city || ''}
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="Votre ville"
        />
      </div>
      <div className="space-y-2">
        <Label>Situation actuelle</Label>
        <Select onValueChange={(v) => onChange('situation', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employed">En emploi</SelectItem>
            <SelectItem value="unemployed">Demandeur d'emploi</SelectItem>
            <SelectItem value="student">Étudiant</SelectItem>
            <SelectItem value="retired">Retraité</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
));

PersonalInfoStep.displayName = 'PersonalInfoStep';

// Background Step
const BackgroundStep = memo(({ 
  data, 
  onChange 
}: { 
  data: any;
  onChange: (field: string, value: any) => void;
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold mb-4">Parcours & Compétences</h2>

    <div className="space-y-2">
      <Label>Niveau d'études</Label>
      <Select onValueChange={(v) => onChange('educationLevel', v)}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sans diplôme</SelectItem>
          <SelectItem value="cap">CAP/BEP</SelectItem>
          <SelectItem value="bac">Bac</SelectItem>
          <SelectItem value="bac2">Bac+2</SelectItem>
          <SelectItem value="bac3">Bac+3</SelectItem>
          <SelectItem value="bac4">Bac+4</SelectItem>
          <SelectItem value="bac5">Bac+5 et plus</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Domaine de formation principal</Label>
      <Input
        value={data.educationField || ''}
        onChange={(e) => onChange('educationField', e.target.value)}
        placeholder="Ex: Commerce, Informatique, Santé..."
      />
    </div>

    <div className="space-y-2">
      <Label>Expérience professionnelle</Label>
      <Select onValueChange={(v) => onChange('experienceYears', v)}>
        <SelectTrigger>
          <SelectValue placeholder="Années d'expérience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Moins d'1 an</SelectItem>
          <SelectItem value="1-3">1 à 3 ans</SelectItem>
          <SelectItem value="3-5">3 à 5 ans</SelectItem>
          <SelectItem value="5-10">5 à 10 ans</SelectItem>
          <SelectItem value="10+">Plus de 10 ans</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Compétences principales</Label>
      <Textarea
        value={data.skills || ''}
        onChange={(e) => onChange('skills', e.target.value)}
        placeholder="Listez vos compétences techniques et relationnelles..."
        className="min-h-[100px]"
      />
    </div>

    <div className="space-y-2">
      <Label>Avez-vous déjà créé ou repris une entreprise ?</Label>
      <RadioGroup 
        value={data.previousBusiness || ''} 
        onValueChange={(v) => onChange('previousBusiness', v)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes-success" id="yes-success" />
          <Label htmlFor="yes-success">Oui, avec succès</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes-closed" id="yes-closed" />
          <Label htmlFor="yes-closed">Oui, mais l'activité a cessé</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="no" />
          <Label htmlFor="no">Non, c'est mon premier projet</Label>
        </div>
      </RadioGroup>
    </div>
  </div>
));

BackgroundStep.displayName = 'BackgroundStep';

// Project & Motivations Step
const ProjectMotivationsStep = memo(({ 
  data, 
  onChange 
}: { 
  data: any;
  onChange: (field: string, value: any) => void;
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold mb-4">Projet & Motivations</h2>

    <div className="space-y-2">
      <Label>Nom de votre projet</Label>
      <Input
        value={data.projectName || ''}
        onChange={(e) => onChange('projectName', e.target.value)}
        placeholder="Donnez un nom à votre projet"
      />
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Secteur d'activité</Label>
        <Select onValueChange={(v) => onChange('projectSector', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">Tech / Digital</SelectItem>
            <SelectItem value="commerce">Commerce</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="artisanat">Artisanat</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="sante">Santé / Bien-être</SelectItem>
            <SelectItem value="education">Éducation / Formation</SelectItem>
            <SelectItem value="tourisme">Tourisme</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Type de projet</Label>
        <Select onValueChange={(v) => onChange('projectType', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="creation">Création d'entreprise</SelectItem>
            <SelectItem value="reprise">Reprise d'entreprise</SelectItem>
            <SelectItem value="franchise">Franchise</SelectItem>
            <SelectItem value="auto">Auto-entreprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-2">
      <Label>Description du projet</Label>
      <Textarea
        value={data.projectDescription || ''}
        onChange={(e) => onChange('projectDescription', e.target.value)}
        placeholder="Décrivez votre projet en quelques phrases..."
        className="min-h-[120px]"
      />
    </div>

    <div className="space-y-3">
      <Label>Où en êtes-vous dans votre projet ?</Label>
      <RadioGroup 
        value={data.projectStage || ''} 
        onValueChange={(v) => onChange('projectStage', v)}
        className="space-y-2"
      >
        {PROJECT_STAGES.map((stage) => (
          <div 
            key={stage.id} 
            className={`flex items-start space-x-3 p-3 rounded-lg border ${
              data.projectStage === stage.id ? 'border-emerald-500 bg-emerald-500/5' : ''
            }`}
          >
            <RadioGroupItem value={stage.id} id={stage.id} className="mt-1" />
            <div>
              <Label htmlFor={stage.id} className="font-medium">{stage.label}</Label>
              <p className="text-sm text-muted-foreground">{stage.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>

    <div className="space-y-2">
      <Label>Vos motivations entrepreneuriales</Label>
      <Textarea
        value={data.motivations || ''}
        onChange={(e) => onChange('motivations', e.target.value)}
        placeholder="Qu'est-ce qui vous pousse à créer votre entreprise ?"
        className="min-h-[100px]"
      />
    </div>
  </div>
));

ProjectMotivationsStep.displayName = 'ProjectMotivationsStep';

// Needs & Actions Step
const NeedsActionsStep = memo(({ 
  data, 
  onChange 
}: { 
  data: any;
  onChange: (field: string, value: any) => void;
}) => {
  const selectedNeeds = data.needs || [];

  const toggleNeed = (needId: string) => {
    const newNeeds = selectedNeeds.includes(needId)
      ? selectedNeeds.filter((n: string) => n !== needId)
      : [...selectedNeeds, needId];
    onChange('needs', newNeeds);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Besoins & Actions</h2>

      <div className="space-y-4">
        <Label>Quels sont vos besoins prioritaires ?</Label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NEED_CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => toggleNeed(category.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedNeeds.includes(category.id)
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'hover:border-muted-foreground/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
                {selectedNeeds.includes(category.id) && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Type d'accompagnement souhaité</Label>
        <div className="grid sm:grid-cols-2 gap-3">
          {SUPPORT_TYPES.map((support) => (
            <div
              key={support.id}
              onClick={() => onChange('supportType', support.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                data.supportType === support.id
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'hover:border-muted-foreground/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{support.label}</span>
                {data.supportType === support.id && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{support.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Actions déjà menées</Label>
        <Textarea
          value={data.actionsTaken || ''}
          onChange={(e) => onChange('actionsTaken', e.target.value)}
          placeholder="Listez les actions que vous avez déjà réalisées pour votre projet (formations, rencontres, recherches...)"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Ressources disponibles</Label>
        <Textarea
          value={data.resources || ''}
          onChange={(e) => onChange('resources', e.target.value)}
          placeholder="Quelles ressources avez-vous ? (financières, matériel, réseau, compétences...)"
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Commentaires supplémentaires</Label>
        <Textarea
          value={data.comments || ''}
          onChange={(e) => onChange('comments', e.target.value)}
          placeholder="Autres informations que vous souhaitez partager..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
});

NeedsActionsStep.displayName = 'NeedsActionsStep';

// Review Step
const ReviewStep = memo(({ 
  data,
  onEdit
}: { 
  data: any;
  onEdit: (step: number) => void;
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold mb-4">Récapitulatif de votre inscription</h2>

    {/* Personal Info */}
    <GlassCard className="p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold">Informations personnelles</h3>
        <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
          <Edit3 className="w-4 h-4 mr-1" />
          Modifier
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Nom:</span> {data.firstName} {data.lastName}</div>
        <div><span className="text-muted-foreground">Email:</span> {data.email}</div>
        <div><span className="text-muted-foreground">Téléphone:</span> {data.phone || 'Non renseigné'}</div>
        <div><span className="text-muted-foreground">Ville:</span> {data.city || 'Non renseigné'}</div>
        <div><span className="text-muted-foreground">Situation:</span> {data.situation || 'Non renseigné'}</div>
      </div>
    </GlassCard>

    {/* Background */}
    <GlassCard className="p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold">Parcours</h3>
        <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
          <Edit3 className="w-4 h-4 mr-1" />
          Modifier
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Niveau d'études:</span> {data.educationLevel || 'Non renseigné'}</div>
        <div><span className="text-muted-foreground">Domaine:</span> {data.educationField || 'Non renseigné'}</div>
        <div><span className="text-muted-foreground">Expérience:</span> {data.experienceYears || 'Non renseigné'}</div>
      </div>
      {data.skills && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Compétences:</span> {data.skills}
        </div>
      )}
    </GlassCard>

    {/* Project */}
    <GlassCard className="p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold">Projet</h3>
        <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
          <Edit3 className="w-4 h-4 mr-1" />
          Modifier
        </Button>
      </div>
      <div className="space-y-2 text-sm">
        <div><span className="text-muted-foreground">Nom du projet:</span> {data.projectName || 'Non renseigné'}</div>
        <div><span className="text-muted-foreground">Secteur:</span> {data.projectSector || 'Non renseigné'}</div>
        <div><span className="text-muted-foreground">Type:</span> {data.projectType || 'Non renseigné'}</div>
        <div><span className="text-muted-foreground">Stade:</span> {data.projectStage || 'Non renseigné'}</div>
        {data.projectDescription && (
          <div className="mt-2">
            <span className="text-muted-foreground">Description:</span>
            <p className="mt-1">{data.projectDescription}</p>
          </div>
        )}
      </div>
    </GlassCard>

    {/* Needs */}
    <GlassCard className="p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold">Besoins & Accompagnement</h3>
        <Button variant="ghost" size="sm" onClick={() => onEdit(4)}>
          <Edit3 className="w-4 h-4 mr-1" />
          Modifier
        </Button>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {(data.needs || []).map((need: string) => (
            <Badge key={need} variant="secondary">
              {NEED_CATEGORIES.find(c => c.id === need)?.label || need}
            </Badge>
          ))}
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Type d'accompagnement:</span>{' '}
          {SUPPORT_TYPES.find(s => s.id === data.supportType)?.label || 'Non renseigné'}
        </div>
      </div>
    </GlassCard>
  </div>
));

ReviewStep.displayName = 'ReviewStep';

// Success Component
const SuccessView = memo(({ onNewForm }: { onNewForm: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12"
  >
    <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
    </div>
    <h2 className="text-2xl font-bold mb-2">Inscription envoyée !</h2>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      Votre formulaire a été soumis avec succès. Un conseiller vous contactera dans les meilleurs délais pour poursuivre votre accompagnement.
    </p>
    <div className="flex gap-3 justify-center">
      <Button onClick={onNewForm} variant="outline">
        Nouvelle inscription
      </Button>
      <Button className="bg-emerald-500 hover:bg-emerald-600">
        Retour au module
      </Button>
    </div>
  </motion.div>
));

SuccessView.displayName = 'SuccessView';

// Main Component
const ProjectRegistrationForm = memo(({ onBack }: ProjectRegistrationFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    mode: null as 'candidate' | 'counselor' | null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    situation: '',
    educationLevel: '',
    educationField: '',
    experienceYears: '',
    skills: '',
    previousBusiness: '',
    projectName: '',
    projectSector: '',
    projectType: '',
    projectDescription: '',
    projectStage: '',
    motivations: '',
    needs: [] as string[],
    supportType: '',
    actionsTaken: '',
    resources: '',
    comments: ''
  });

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Call the real API
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: 'demo-project',
          mode: formData.mode,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          situation: formData.situation,
          educationLevel: formData.educationLevel,
          educationField: formData.educationField,
          experienceYears: formData.experienceYears,
          skills: formData.skills,
          previousBusiness: formData.previousBusiness,
          projectName: formData.projectName,
          projectSector: formData.projectSector,
          projectType: formData.projectType,
          projectDescription: formData.projectDescription,
          projectStage: formData.projectStage,
          motivations: formData.motivations,
          needs: formData.needs,
          supportType: formData.supportType,
          actionsTaken: formData.actionsTaken,
          resources: formData.resources,
          comments: formData.comments,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        toast({
          title: 'Formulaire soumis',
          description: 'Votre inscription a été enregistrée avec succès.'
        });
      } else {
        throw new Error(data.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer votre inscription. Veuillez réessayer.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, toast]);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 0:
        return formData.mode !== null;
      case 1:
        return formData.firstName && formData.lastName && formData.email;
      case 4:
        return true; // Review step
      default:
        return true;
    }
  }, [currentStep, formData]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ModeSelection 
            mode={formData.mode} 
            onModeChange={(mode) => updateFormData('mode', mode)} 
          />
        );
      case 1:
        return <PersonalInfoStep data={formData} onChange={updateFormData} />;
      case 2:
        return <BackgroundStep data={formData} onChange={updateFormData} />;
      case 3:
        return <ProjectMotivationsStep data={formData} onChange={updateFormData} />;
      case 4:
        return <NeedsActionsStep data={formData} onChange={updateFormData} />;
      case 5:
        return <ReviewStep data={formData} onEdit={setCurrentStep} />;
      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Retour
            </Button>
          )}
          <GlassCard className="p-8">
            <SuccessView onNewForm={() => {
              setIsSuccess(false);
              setCurrentStep(0);
              setFormData({
                mode: null,
                firstName: '', lastName: '', email: '', phone: '', city: '', situation: '',
                educationLevel: '', educationField: '', experienceYears: '', skills: '', previousBusiness: '',
                projectName: '', projectSector: '', projectType: '', projectDescription: '', projectStage: '',
                motivations: '', needs: [], supportType: '', actionsTaken: '', resources: '', comments: ''
              });
            }} />
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Formulaire d'Inscription</h1>
              <p className="text-muted-foreground">Complétez votre profil entrepreneur en quelques étapes</p>
            </div>
          </div>
        </motion.div>

        {/* Step Navigation */}
        <StepNavigation 
          currentStep={currentStep} 
          onStepClick={setCurrentStep} 
        />

        {/* Form Content */}
        <GlassCard className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            {currentStep === STEPS.length - 1 ? (
              <Button
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Soumettre le formulaire
                  </>
                )}
              </Button>
            ) : (
              <Button
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </GlassCard>

        {/* Save Draft Info */}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          <Save className="w-4 h-4 inline mr-1" />
          Vos données sont automatiquement sauvegardées
        </div>
      </div>
    </div>
  );
});

ProjectRegistrationForm.displayName = 'ProjectRegistrationForm';

export default ProjectRegistrationForm;
