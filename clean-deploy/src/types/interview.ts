// ===========================================
// Pathfinder IA - Interview Framework Types
// ===========================================

// Interview Phase
export type InterviewPhase = 
  | 'welcome'
  | 'profile'
  | 'project'
  | 'market'
  | 'financial'
  | 'synthesis'
  | 'conclusion';

// Interview Step
export interface InterviewStep {
  id: string;
  phase: InterviewPhase;
  title: {
    fr: string;
    ar: string;
  };
  description: {
    fr: string;
    ar: string;
  };
  duration: number; // in minutes
  checklist: {
    id: string;
    label: {
      fr: string;
      ar: string;
    };
    required: boolean;
  }[];
  questions: {
    id: string;
    question: {
      fr: string;
      ar: string;
    };
    type: 'open' | 'choice' | 'scale';
    options?: string[];
  }[];
  tips: {
    fr: string[];
    ar: string[];
  };
}

// Interview Session
export interface InterviewSession {
  id: string;
  userId: string;
  counselorId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  
  // Progress
  currentPhase: InterviewPhase;
  currentStep: string;
  completedSteps: string[];
  
  // Notes
  notes: {
    stepId: string;
    content: string;
    timestamp: Date;
  }[];
  
  // Checklists
  checklistProgress: {
    stepId: string;
    itemId: string;
    checked: boolean;
  }[];
  
  // Time tracking
  timeSpent: {
    phase: InterviewPhase;
    duration: number; // in seconds
  }[];
}

// Interview Template
export interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  totalDuration: number; // in minutes
  phases: InterviewPhase[];
  steps: InterviewStep[];
}

// Counselor Notes
export interface CounselorNote {
  id: string;
  sessionId: string;
  timestamp: Date;
  category: 'observation' | 'strength' | 'challenge' | 'recommendation' | 'action';
  content: string;
  important: boolean;
}

// Synthesis
export interface InterviewSynthesis {
  id: string;
  sessionId: string;
  generatedAt: Date;
  
  // Summary
  summary: string;
  
  // Key findings
  strengths: string[];
  challenges: string[];
  opportunities: string[];
  risks: string[];
  
  // Recommendations
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    timeline: string;
    resources: string[];
  }[];
  
  // Next steps
  nextSteps: {
    action: string;
    deadline: Date;
    responsible: 'user' | 'counselor' | 'both';
  }[];
  
  // AI-generated insights
  aiInsights?: string;
}
