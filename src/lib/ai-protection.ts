/**
 * AI Protection Service
 * Manages quotas, logging, and protection for AI endpoints
 */

import { db } from '@/lib/db';
import { checkRateLimit, RATE_LIMIT_CONFIGS, getClientIdentifier } from './rate-limiter';

// AI Quota configuration
export const AI_QUOTA_CONFIG = {
  free: {
    dailyLimit: 10,
    monthlyLimit: 100,
    features: ['cv_analysis', 'career_identity'],
  },
  premium: {
    dailyLimit: 50,
    monthlyLimit: 1000,
    features: ['cv_analysis', 'career_identity', 'cover_letter', 'interview_prep', 'cv_assist'],
  },
  enterprise: {
    dailyLimit: -1, // Unlimited
    monthlyLimit: -1,
    features: ['all'],
  },
} as const;

export type QuotaTier = keyof typeof AI_QUOTA_CONFIG;

interface AIUsageRecord {
  userId: string;
  feature: AIFeature;
  tokensUsed: number;
  timestamp: Date;
}

type AIFeature = 
  | 'cv_analysis' 
  | 'career_identity' 
  | 'cover_letter' 
  | 'interview_prep' 
  | 'cv_assist'
  | 'job_matching';

/**
 * Check if user can use AI feature
 */
export async function canUseAI(
  userId: string,
  feature: AIFeature,
  tier: QuotaTier = 'free'
): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  reason?: string;
}> {
  const config = AI_QUOTA_CONFIG[tier];
  
  // Check if feature is available for tier
  if (config.features[0] !== 'all' && !config.features.includes(feature)) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(),
      reason: 'Cette fonctionnalité n\'est pas disponible dans votre plan',
    };
  }

  // Unlimited for enterprise
  if (config.dailyLimit === -1) {
    return {
      allowed: true,
      remaining: -1,
      resetTime: new Date(),
    };
  }

  // Get today's usage
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    // Count today's AI calls
    const usageCount = await db.aIUsageLog.count({
      where: {
        userId,
        feature,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const remaining = config.dailyLimit - usageCount;

    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
      resetTime: tomorrow,
      reason: remaining <= 0 
        ? 'Limite quotidienne atteinte. Réessayez demain.' 
        : undefined,
    };
  } catch (error) {
    console.error('Error checking AI quota:', error);
    // On error, allow the request but log it
    return {
      allowed: true,
      remaining: config.dailyLimit,
      resetTime: tomorrow,
    };
  }
}

/**
 * Log AI usage
 */
export async function logAIUsage(data: {
  userId: string;
  feature: AIFeature;
  tokensUsed?: number;
  model?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    // Create AI usage log
    await db.aIUsageLog.create({
      data: {
        userId: data.userId,
        feature: data.feature,
        tokensUsed: data.tokensUsed || 0,
        model: data.model || 'unknown',
        success: data.success,
        errorMessage: data.errorMessage,
        metadata: data.metadata || {},
      },
    });
  } catch (error) {
    console.error('Failed to log AI usage:', error);
  }
}

/**
 * Get user's AI usage statistics
 */
export async function getAIUsageStats(userId: string): Promise<{
  today: { total: number; byFeature: Record<string, number> };
  thisMonth: { total: number; byFeature: Record<string, number> };
  allTime: { total: number; byFeature: Record<string, number> };
}> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const [todayLogs, monthLogs, allLogs] = await Promise.all([
      db.aIUsageLog.findMany({
        where: { userId, createdAt: { gte: today } },
        select: { feature: true },
      }),
      db.aIUsageLog.findMany({
        where: { userId, createdAt: { gte: monthStart } },
        select: { feature: true },
      }),
      db.aIUsageLog.findMany({
        where: { userId },
        select: { feature: true },
      }),
    ]);

    const countByFeature = (logs: { feature: string }[]) => {
      return logs.reduce((acc, log) => {
        acc[log.feature] = (acc[log.feature] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    };

    return {
      today: {
        total: todayLogs.length,
        byFeature: countByFeature(todayLogs),
      },
      thisMonth: {
        total: monthLogs.length,
        byFeature: countByFeature(monthLogs),
      },
      allTime: {
        total: allLogs.length,
        byFeature: countByFeature(allLogs),
      },
    };
  } catch (error) {
    console.error('Error getting AI usage stats:', error);
    return {
      today: { total: 0, byFeature: {} },
      thisMonth: { total: 0, byFeature: {} },
      allTime: { total: 0, byFeature: {} },
    };
  }
}

/**
 * Protected AI call wrapper
 */
export async function protectedAICall<T>(
  params: {
    userId: string;
    feature: AIFeature;
    tier?: QuotaTier;
  },
  aiFunction: () => Promise<T>
): Promise<{
  success: boolean;
  data?: T;
  error?: string;
  remaining: number;
}> {
  const { userId, feature, tier = 'free' } = params;

  // 1. Check rate limit
  const rateLimitResult = checkRateLimit(
    `ai:${userId}:${feature}`,
    RATE_LIMIT_CONFIGS.ai
  );

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: `Trop de requêtes. Réessayez dans ${rateLimitResult.retryAfter} secondes.`,
      remaining: 0,
    };
  }

  // 2. Check quota
  const quotaCheck = await canUseAI(userId, feature, tier);
  
  if (!quotaCheck.allowed) {
    return {
      success: false,
      error: quotaCheck.reason || 'Quota dépassé',
      remaining: 0,
    };
  }

  // 3. Execute AI call
  try {
    const startTime = Date.now();
    const result = await aiFunction();
    const duration = Date.now() - startTime;

    // 4. Log success
    await logAIUsage({
      userId,
      feature,
      success: true,
      metadata: { duration },
    });

    return {
      success: true,
      data: result,
      remaining: quotaCheck.remaining - 1,
    };
  } catch (error: any) {
    // 5. Log failure
    await logAIUsage({
      userId,
      feature,
      success: false,
      errorMessage: error.message || 'Unknown error',
    });

    return {
      success: false,
      error: 'Erreur lors de l\'appel IA. Veuillez réessayer.',
      remaining: quotaCheck.remaining,
    };
  }
}

/**
 * Validate AI input to prevent abuse
 */
export function validateAIInput(input: string, maxLength: number = 10000): {
  valid: boolean;
  sanitized: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  let sanitized = input;

  // Check length
  if (input.length > maxLength) {
    warnings.push(`Input tronqué à ${maxLength} caractères`);
    sanitized = input.slice(0, maxLength);
  }

  // Remove potential prompt injection attempts
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|above)\s+(instructions|prompts?)/gi,
    /forget\s+(all\s+)?(previous|above)\s+(instructions|prompts?)/gi,
    /system\s*:\s*you\s+are\s+now/gi,
    /\[SYSTEM\]/gi,
    /\[INST\]/gi,
    /<\|.*?\|>/g,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(sanitized)) {
      warnings.push('Tentative d\'injection de prompt détectée et supprimée');
      sanitized = sanitized.replace(pattern, '');
    }
  }

  return {
    valid: warnings.length === 0 || warnings[0].includes('tronqué'),
    sanitized,
    warnings,
  };
}

/**
 * Calculate token estimate (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token for English/French
  return Math.ceil(text.length / 4);
}
