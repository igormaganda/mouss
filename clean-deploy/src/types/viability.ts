// ===========================================
// Viabilité Projet - TypeScript Types
// ===========================================

// ===========================================
// Project Types
// ===========================================

export type ProjectSector = 
  | 'tech'
  | 'commerce'
  | 'services'
  | 'artisanat'
  | 'agriculture'
  | 'industrie'
  | 'sante'
  | 'education'
  | 'tourisme'
  | 'immobilier'
  | 'finance'
  | 'autre';

export type ProjectType = 
  | 'creation'
  | 'reprise'
  | 'franchise'
  | 'auto_enterprise'
  | 'association';

export type ProjectStatus = 
  | 'idea'
  | 'concept'
  | 'development'
  | 'launch'
  | 'operating';

export interface EntrepreneurProject {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  sector: ProjectSector | null;
  subSector: string | null;
  projectType: ProjectType | null;
  status: ProjectStatus;
  advancementLevel: number;
  businessModel: BusinessModel | null;
  targetMarket: string | null;
  valueProposition: string | null;
  revenueStreams: RevenueStream[] | null;
  costStructure: CostItem[] | null;
  aiAnalysis: AIAnalysis | null;
  viabilityScore: number | null;
  startDate: Date | null;
  launchDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessModel {
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valuePropositions: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: CostItem[];
  revenueStreams: RevenueStream[];
}

export interface RevenueStream {
  name: string;
  type: 'transaction' | 'recurring';
  pricing: 'fixed' | 'dynamic' | 'negotiated';
  estimatedAmount: number;
}

export interface CostItem {
  name: string;
  type: 'fixed' | 'variable';
  category: 'infrastructure' | 'operations' | 'marketing' | 'hr' | 'other';
  estimatedAmount: number;
}

export interface AIAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
  scoreBreakdown: {
    market: number;
    financial: number;
    team: number;
    product: number;
    overall: number;
  };
}

// ===========================================
// Market Study Types
// ===========================================

export type MarketStudyStatus = 'draft' | 'in_progress' | 'completed';

export interface MarketStudy {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  marketSize: MarketSize | null;
  targetAudience: TargetSegment[] | null;
  competitors: Competitor[] | null;
  trends: MarketTrend[] | null;
  swot: SWOT | null;
  aiInsights: AIInsight[] | null;
  recommendations: string[] | null;
  status: MarketStudyStatus;
  completionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketSize {
  estimated: number;       // Marché total (TAM)
  addressable: number;     // Marché adressable (SAM)
  obtainable: number;      // Marché obtenable (SOM)
  growthRate: number;
  currency: string;
}

export interface TargetSegment {
  id: string;
  name: string;
  description: string;
  size: number;
  characteristics: string[];
  painPoints: string[];
  buyingBehavior: string;
}

export interface Competitor {
  id: string;
  name: string;
  description: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  positioning: string;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface MarketTrend {
  id: string;
  name: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  importance: 'high' | 'medium' | 'low';
  timeline: 'short' | 'medium' | 'long';
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AIInsight {
  type: 'opportunity' | 'risk' | 'recommendation' | 'trend';
  title: string;
  description: string;
  confidence: number; // 0-100
  source: string;
}

// ===========================================
// Business Plan Types
// ===========================================

export type BusinessPlanStatus = 'draft' | 'review' | 'completed';

export interface BusinessPlan {
  id: string;
  projectId: string;
  executiveSummary: string | null;
  presentation: PresentationSection | null;
  team: TeamSection | null;
  products: ProductsSection | null;
  marketAnalysis: MarketAnalysisSection | null;
  strategy: StrategySection | null;
  operations: OperationsSection | null;
  financials: FinancialsSection | null;
  documents: Document[] | null;
  aiAnalysis: BusinessPlanAIAnalysis | null;
  improvements: ImprovementSuggestion[] | null;
  score: number | null;
  status: BusinessPlanStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PresentationSection {
  projectName: string;
  logo?: string;
  elevatorPitch: string;
  vision: string;
  mission: string;
  values: string[];
}

export interface TeamSection {
  members: TeamMember[];
  legalStatus: 'sa' | 'sas' | 'sarl' | 'eurl' | 'auto_entreprise' | 'association' | 'other';
  shareholding: Shareholder[];
  advisors: Advisor[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  linkedin?: string;
  experience: string;
  equity: number;
}

export interface Shareholder {
  name: string;
  percentage: number;
  type: 'founder' | 'investor' | 'employee';
}

export interface Advisor {
  name: string;
  role: string;
  company: string;
}

export interface ProductsSection {
  products: Product[];
  pricing: Pricing[];
  roadmap: RoadmapItem[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  differentiation: string;
  developmentStage: 'concept' | 'prototype' | 'mvp' | 'production' | 'scaling';
}

export interface Pricing {
  productId: string;
  model: 'one_time' | 'subscription' | 'freemium' | 'usage_based';
  basePrice: number;
  currency: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface MarketAnalysisSection {
  marketSize: MarketSize;
  targetSegments: TargetSegment[];
  competitors: Competitor[];
  positioning: string;
  competitiveAdvantage: string;
}

export interface StrategySection {
  marketingStrategy: string;
  salesStrategy: string;
  distributionChannels: string[];
  partnerships: string[];
  growthPlan: string;
}

export interface OperationsSection {
  location: string;
  facilities: string;
  equipment: string[];
  suppliers: Supplier[];
  team: string[];
  processes: string[];
}

export interface Supplier {
  name: string;
  product: string;
  terms: string;
}

export interface FinancialsSection {
  startupCosts: CostItem[];
  monthlyCosts: CostItem[];
  revenueProjections: RevenueProjection[];
  breakEvenPoint: number;
  fundingNeeded: number;
  fundingSources: FundingSource[];
}

export interface RevenueProjection {
  year: number;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
}

export interface FundingSource {
  type: 'personal' | 'loan' | 'investment' | 'grant' | 'crowdfunding';
  amount: number;
  status: 'planned' | 'secured' | 'pending';
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
}

export interface BusinessPlanAIAnalysis {
  overallScore: number;
  sectionScores: {
    presentation: number;
    team: number;
    products: number;
    market: number;
    strategy: number;
    operations: number;
    financials: number;
  };
  feedback: string;
  strengths: string[];
  weaknesses: string[];
}

export interface ImprovementSuggestion {
  section: string;
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  example?: string;
}

// ===========================================
// Registration Form Types
// ===========================================

export type RegistrationStatus = 'draft' | 'submitted' | 'reviewed' | 'validated';
export type FilledBy = 'candidate' | 'counselor' | 'mixed';
export type CurrentStage = 'idea' | 'concept' | 'business_plan' | 'funding' | 'launch';

export interface ProjectRegistration {
  id: string;
  projectId: string;
  filledBy: FilledBy;
  counselorId: string | null;
  personalInfo: PersonalInfo | null;
  background: Background | null;
  skills: SkillAssessment | null;
  motivations: Motivation[] | null;
  needs: Need[] | null;
  priorityNeeds: string[] | null;
  currentStage: CurrentStage | null;
  actionsTaken: ActionTaken[] | null;
  resources: Resource[] | null;
  supportType: SupportType[] | null;
  preferredActor: string | null;
  counselorNotes: string | null;
  status: RegistrationStatus;
  submittedAt: Date | null;
  validatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  birthDate: Date;
  nationality: string;
  situation: 'employed' | 'unemployed' | 'student' | 'retired';
}

export interface Background {
  education: Education[];
  experience: Experience[];
  entrepreneurHistory: EntrepreneurHistory[];
}

export interface Education {
  diploma: string;
  institution: string;
  year: number;
  field: string;
}

export interface Experience {
  position: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  skills: string[];
}

export interface EntrepreneurHistory {
  projectName: string;
  description: string;
  role: string;
  outcome: 'success' | 'closed' | 'ongoing';
  lessons: string;
}

export interface SkillAssessment {
  technicalSkills: Skill[];
  softSkills: Skill[];
  skillsToDevelop: string[];
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  source: 'experience' | 'education' | 'training' | 'self_taught';
}

export interface Motivation {
  type: 'independence' | 'passion' | 'opportunity' | 'necessity' | 'impact' | 'financial';
  description: string;
  importance: 'primary' | 'secondary';
}

export interface Need {
  id: string;
  category: NeedCategory;
  description: string;
  urgency: 'immediate' | 'short_term' | 'medium_term';
}

export type NeedCategory = 
  | 'financing'
  | 'training'
  | 'mentoring'
  | 'networking'
  | 'premises'
  | 'legal'
  | 'marketing'
  | 'technical'
  | 'hr'
  | 'other';

export interface ActionTaken {
  id: string;
  action: string;
  date: Date;
  result: string;
}

export interface Resource {
  id: string;
  type: 'financial' | 'equipment' | 'network' | 'knowledge' | 'other';
  description: string;
  value: string;
}

export interface SupportType {
  type: string;
  frequency: string;
  preferredMode: 'in_person' | 'remote' | 'hybrid';
}

// ===========================================
// Actor Directory Types
// ===========================================

export type ActorType = 
  | 'cci'
  | 'cma'
  | 'incubateur'
  | 'accelerateur'
  | 'banque'
  | 'association'
  | 'reseaux'
  | 'mission_locale'
  | 'pole_emploi'
  | 'cap_emploi'
  | 'bge'
  | 'adie'
  | 'initiative'
  | 'reseau_entreprendre'
  | 'other';

export type ActorCategory = 
  | 'accompagnement'
  | 'financement'
  | 'formation'
  | 'networking'
  | 'juridique'
  | 'co_working';

export interface EntrepreneurActor {
  id: string;
  name: string;
  shortName: string | null;
  description: string | null;
  logo: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  type: ActorType;
  category: ActorCategory | null;
  address: string | null;
  city: string;
  postalCode: string | null;
  region: string | null;
  department: string | null;
  geoZone: GeoZone | null;
  services: Service[] | null;
  targetAudience: string[] | null;
  eligibility: EligibilityCriteria | null;
  openingHours: string | null;
  languages: string[];
  projectsSupported: number;
  successRate: number | null;
  isActive: boolean;
  isVerified: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeoZone {
  regions: string[];
  departments: string[];
  cities: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  cost: 'free' | 'paid' | 'variable';
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface EligibilityCriteria {
  ageMin?: number;
  ageMax?: number;
  status: string[];
  sectors: string[];
  projectStage: string[];
  other: string[];
}

// ===========================================
// Entrepreneur Network Types
// ===========================================

export type NetworkType = 'local' | 'sector' | 'national' | 'online';

export interface EntrepreneurNetwork {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  type: NetworkType;
  sector: string | null;
  regions: string[];
  cities: string[];
  memberCount: number;
  events: NetworkEvent[] | null;
  services: NetworkService[] | null;
  contactEmail: string | null;
  contactPhone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NetworkEvent {
  id: string;
  name: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  description: string;
}

export interface NetworkService {
  id: string;
  name: string;
  description: string;
}

// ===========================================
// API Response Types
// ===========================================

export interface ViabilityAnalysisResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  summary: string;
  details: {
    market: {
      score: number;
      feedback: string;
    };
    financial: {
      score: number;
      feedback: string;
    };
    team: {
      score: number;
      feedback: string;
    };
    product: {
      score: number;
      feedback: string;
    };
  };
  recommendations: string[];
  nextSteps: string[];
}

export interface MarketAnalysisRequest {
  sector: string;
  subSector?: string;
  location: string;
  targetAudience?: string;
  competitors?: string[];
}

export interface MarketAnalysisResult {
  marketSize: MarketSize;
  trends: MarketTrend[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
}
