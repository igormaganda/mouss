import { z } from 'zod';

// ============================================
// User Validation Schemas
// ============================================

export const userSchema = z.object({
  email: z.string()
    .email('Email invalide')
    .max(255, 'Email trop long'),
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom est trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nom invalide')
    .optional(),
  persona: z.enum(['Explorateur', 'Lanceur', 'Pivot', 'Ambitieux']).optional(),
  language: z.enum(['fr', 'ar']).default('fr'),
});

export const userIdSchema = z.object({
  userId: z.string().cuid('ID utilisateur invalide'),
});

// ============================================
// CV Validation Schemas
// ============================================

// Sanitize function to remove potentially dangerous content
const sanitizeText = (text: string): string => {
  // Remove script tags
  let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  sanitized = sanitized.replace(/on\w+='[^']*'/gi, '');
  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:[^\s]*/gi, '');
  return sanitized.trim();
};

export const cvAnalysisSchema = z.object({
  cvText: z.string()
    .min(50, 'Le CV est trop court. Veuillez fournir plus de contenu.')
    .max(15000, 'Le CV est trop long. Maximum 15000 caractères.')
    .transform(sanitizeText)
    .refine(
      (text) => !containsMaliciousPatterns(text),
      'Le contenu du CV contient des éléments non autorisés'
    ),
  userId: z.string().cuid().optional(),
  language: z.enum(['fr', 'ar']).default('fr'),
});

export const cvAssistSchema = z.object({
  section: z.enum(['summary', 'experience', 'skills', 'education', 'projects']),
  context: z.string().max(2000).transform(sanitizeText).optional(),
  jobTarget: z.string().max(500).transform(sanitizeText).optional(),
  userId: z.string().cuid().optional(),
  language: z.enum(['fr', 'ar']).default('fr'),
});

// Check for malicious patterns
function containsMaliciousPatterns(text: string): boolean {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /data:/i,
    /vbscript:/i,
    /expression\(/i,
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(text));
}

// ============================================
// Career Identity Validation Schemas
// ============================================

export const careerIdentitySchema = z.object({
  userId: z.string().cuid('ID utilisateur invalide'),
  pepitesHave: z.array(z.string().max(100)).max(20).optional(),
  pepitesWant: z.array(z.string().max(100)).max(20).optional(),
  skills: z.array(z.string().max(100)).max(30).optional(),
  experience: z.string().max(1000).transform(sanitizeText).optional(),
  aspirations: z.array(z.string().max(100)).max(15).optional(),
  language: z.enum(['fr', 'ar']).default('fr'),
}).refine(
  (data) => (data.pepitesHave?.length ?? 0) > 0 || (data.skills?.length ?? 0) > 0,
  'Au moins quelques pépites ou compétences sont requises'
);

// ============================================
// Job Application Validation Schemas
// ============================================

export const jobApplicationSchema = z.object({
  jobId: z.string().cuid('ID de poste invalide'),
  userId: z.string().cuid('ID utilisateur invalide'),
  coverLetter: z.string()
    .max(5000, 'Lettre de motivation trop longue')
    .transform(sanitizeText)
    .optional(),
  adaptedCv: z.string()
    .max(15000)
    .transform(sanitizeText)
    .optional(),
  notes: z.string()
    .max(2000, 'Notes trop longues')
    .transform(sanitizeText)
    .optional(),
  status: z.enum(['saved', 'applied', 'interviewing', 'offered', 'rejected'])
    .default('saved'),
});

export const coverLetterSchema = z.object({
  jobId: z.string().cuid('ID de poste invalide'),
  userId: z.string().cuid('ID utilisateur invalide'),
  userSkills: z.array(z.string().max(100)).max(30).optional(),
  userExperience: z.string().max(2000).transform(sanitizeText).optional(),
  tone: z.enum(['professional', 'enthusiastic', 'creative']).default('professional'),
  language: z.enum(['fr', 'ar']).default('fr'),
});

// ============================================
// Interview Prep Validation Schemas
// ============================================

export const interviewPrepSchema = z.object({
  jobId: z.string().cuid().optional(),
  userId: z.string().cuid('ID utilisateur invalide'),
  jobTitle: z.string().max(200).transform(sanitizeText).optional(),
  company: z.string().max(200).transform(sanitizeText).optional(),
  focusAreas: z.array(z.string().max(100)).max(10).optional(),
  language: z.enum(['fr', 'ar']).default('fr'),
});

// ============================================
// Career Path Validation Schemas
// ============================================

export const careerPathSchema = z.object({
  userId: z.string().cuid('ID utilisateur invalide'),
  name: z.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom est trop long')
    .transform(sanitizeText),
  description: z.string()
    .max(500, 'La description est trop longue')
    .transform(sanitizeText)
    .optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide')
    .default('#10B981'),
  isPrimary: z.boolean().default(false),
});

export const careerNodeSchema = z.object({
  careerPathId: z.string().cuid('ID de parcours invalide'),
  title: z.string()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(200, 'Le titre est trop long')
    .transform(sanitizeText),
  description: z.string()
    .max(1000, 'La description est trop longue')
    .transform(sanitizeText)
    .optional(),
  nodeType: z.enum(['job', 'education', 'certification', 'milestone']),
  position: z.number().int().min(0).default(0),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  requirements: z.array(z.string().max(200)).max(20).optional(),
});

// ============================================
// Pépites Validation Schemas
// ============================================

export const pepiteResponseSchema = z.object({
  userId: z.string().cuid('ID utilisateur invalide'),
  pepiteId: z.string().cuid('ID de pépite invalide'),
  category: z.enum(['have', 'want', 'not_priority']),
});

export const bulkPepiteResponseSchema = z.object({
  userId: z.string().cuid('ID utilisateur invalide'),
  responses: z.array(
    z.object({
      pepiteId: z.string().cuid(),
      category: z.enum(['have', 'want', 'not_priority']),
    })
  ).max(100, 'Trop de réponses en une seule requête'),
});

// ============================================
// Pagination & Query Schemas
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const jobFilterSchema = paginationSchema.extend({
  search: z.string().max(200).transform(sanitizeText).optional(),
  location: z.string().max(100).transform(sanitizeText).optional(),
  salaryMin: z.coerce.number().int().min(0).optional(),
  salaryMax: z.coerce.number().int().min(0).optional(),
  source: z.enum(['manual', 'api', 'scraped']).optional(),
});

// ============================================
// Export Types
// ============================================

export type CVAnalysisInput = z.infer<typeof cvAnalysisSchema>;
export type CVAssistInput = z.infer<typeof cvAssistSchema>;
export type CareerIdentityInput = z.infer<typeof careerIdentitySchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type CoverLetterInput = z.infer<typeof coverLetterSchema>;
export type InterviewPrepInput = z.infer<typeof interviewPrepSchema>;
export type CareerPathInput = z.infer<typeof careerPathSchema>;
export type CareerNodeInput = z.infer<typeof careerNodeSchema>;
export type PepiteResponseInput = z.infer<typeof pepiteResponseSchema>;
export type BulkPepiteResponseInput = z.infer<typeof bulkPepiteResponseSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type JobFilterInput = z.infer<typeof jobFilterSchema>;
