// ===========================================
// Pathfinder IA - Motivations & Freins Types
// ===========================================

// Motivation Categories
export type MotivationCategory = 
  | 'autonomy'
  | 'income'
  | 'social_impact'
  | 'recognition'
  | 'learning'
  | 'creativity'
  | 'security'
  | 'work_life_balance'
  | 'leadership'
  | 'challenge';

// Barrier Categories
export type BarrierCategory = 
  | 'financial'
  | 'psychological'
  | 'skill_gap'
  | 'family_support'
  | 'market_knowledge'
  | 'network'
  | 'time'
  | 'age'
  | 'qualification'
  | 'geographic';

// Motivation Item
export interface Motivation {
  id: string;
  category: MotivationCategory;
  name: {
    fr: string;
    ar: string;
  };
  description: {
    fr: string;
    ar: string;
  };
  icon: string;
  weight: number; // Default importance weight
}

// Barrier Item
export interface Barrier {
  id: string;
  category: BarrierCategory;
  name: {
    fr: string;
    ar: string;
  };
  description: {
    fr: string;
    ar: string;
  };
  icon: string;
  severity: 'low' | 'medium' | 'high';
  solutions?: {
    fr: string[];
    ar: string[];
  };
}

// User's Motivation Assessment
export interface MotivationAssessment {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Top motivations ranked by user
  rankedMotivations: {
    motivationId: string;
    rank: number;
    score: number; // 1-10
    notes?: string;
  }[];
  
  // Identified barriers
  identifiedBarriers: {
    barrierId: string;
    severity: 'low' | 'medium' | 'high';
    impact: number; // 1-10
    solutions_considered: string[];
    notes?: string;
  }[];
  
  // Overall scores
  motivationScore: number; // 0-100
  barrierScore: number; // 0-100 (lower is better)
  readinessScore: number; // 0-100 (combination)
  
  // AI-generated insights
  insights?: {
    strengths: string[];
    challenges: string[];
    recommendations: string[];
  };
}

// Question for the questionnaire
export interface MotivationQuestion {
  id: string;
  type: 'scale' | 'choice' | 'ranking' | 'open';
  category: MotivationCategory | BarrierCategory;
  question: {
    fr: string;
    ar: string;
  };
  helpText?: {
    fr: string;
    ar: string;
  };
  options?: {
    value: string;
    label: {
      fr: string;
      ar: string;
    };
  }[];
  required: boolean;
}

// Questionnaire Session
export interface QuestionnaireSession {
  id: string;
  userId: string;
  type: 'motivations' | 'barriers' | 'full';
  status: 'not_started' | 'in_progress' | 'completed';
  currentStep: number;
  totalSteps: number;
  responses: {
    questionId: string;
    value: string | number | string[];
    timestamp: Date;
  }[];
  startedAt?: Date;
  completedAt?: Date;
}
