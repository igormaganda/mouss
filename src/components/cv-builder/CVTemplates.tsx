"use client";

import * as React from "react";

// Types for CV data
export interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
}

// Template types
export type CVTemplateId = 'modern' | 'classic' | 'creative' | 'minimal' | 'executive';

export interface CVTemplate {
  id: CVTemplateId;
  name: string;
  description: string;
  preview: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  layout: 'single-column' | 'two-column' | 'header-sidebar';
  features: string[];
}

// Available templates
export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Design épuré avec une touche contemporaine, idéal pour les secteurs tech et startups',
    preview: '/templates/modern-preview.png',
    colorScheme: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#ffffff',
    },
    layout: 'two-column',
    features: ['Sidebar colorée', 'Icônes modernes', 'Compétences visuelles'],
  },
  {
    id: 'classic',
    name: 'Classique',
    description: 'Style traditionnel et professionnel, parfait pour les environnements corporate',
    preview: '/templates/classic-preview.png',
    colorScheme: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#4b5563',
      text: '#111827',
      background: '#ffffff',
    },
    layout: 'single-column',
    features: ['Format standard', 'Police élégante', 'Sections claires'],
  },
  {
    id: 'creative',
    name: 'Créatif',
    description: 'Design audacieux pour les profils créatifs et artistiques',
    preview: '/templates/creative-preview.png',
    colorScheme: {
      primary: '#7c3aed',
      secondary: '#5b21b6',
      accent: '#a78bfa',
      text: '#1f2937',
      background: '#faf5ff',
    },
    layout: 'header-sidebar',
    features: ['En-tête artistique', 'Couleurs vibrantes', 'Mise en page unique'],
  },
  {
    id: 'minimal',
    name: 'Minimaliste',
    description: 'Sobriété et élégance pour un impact immédiat',
    preview: '/templates/minimal-preview.png',
    colorScheme: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#64748b',
      text: '#0f172a',
      background: '#ffffff',
    },
    layout: 'single-column',
    features: ['Espaces épurés', 'Typographie soignée', 'Lisibilité maximale'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Prestigieux et affirmé pour les postes de direction',
    preview: '/templates/executive-preview.png',
    colorScheme: {
      primary: '#0d9488',
      secondary: '#0f766e',
      accent: '#14b8a6',
      text: '#134e4a',
      background: '#f0fdfa',
    },
    layout: 'two-column',
    features: ['Style premium', 'Focus résultats', 'Leadership mis en avant'],
  },
];

// Default empty CV data
export const DEFAULT_CV_DATA: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
};

// Helper to generate unique ID
export const generateId = () => Math.random().toString(36).substring(2, 9);

// Skill levels display
export const SKILL_LEVELS = {
  beginner: { label: 'Débutant', value: 25 },
  intermediate: { label: 'Intermédiaire', value: 50 },
  advanced: { label: 'Avancé', value: 75 },
  expert: { label: 'Expert', value: 100 },
};

// Common skill categories
export const SKILL_CATEGORIES = [
  'Technique',
  'Management',
  'Communication',
  'Leadership',
  'Analyse',
  'Créativité',
  'Commercial',
  'Finance',
  'Marketing',
  'Juridique',
  'Autre',
];

// Language levels
export const LANGUAGE_LEVELS = [
  'Natif',
  'Courant (C2)',
  'Avancé (C1)',
  'Intermédiaire (B2)',
  'Intermédiaire (B1)',
  'Élémentaire (A2)',
  'Débutant (A1)',
];
