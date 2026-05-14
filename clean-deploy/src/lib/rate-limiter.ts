/**
 * Rate Limiting Service
 * Protects API endpoints from abuse
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  blockDuration?: number; // How long to block after exceeding
}

// Default configurations for different endpoint types
export const RATE_LIMIT_CONFIGS = {
  // AI endpoints - stricter limits due to cost
  ai: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 AI calls per minute
    blockDuration: 5 * 60 * 1000, // 5 minute block
  },
  // Standard API endpoints
  standard: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    blockDuration: 15 * 60 * 1000, // 15 minute block
  },
  // Authentication endpoints - very strict
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    blockDuration: 30 * 60 * 1000, // 30 minute block
  },
  // CV analysis - moderate limits
  cv: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20, // 20 CV analyses per hour
    blockDuration: 60 * 60 * 1000, // 1 hour block
  },
} as const;

// In-memory store (consider Redis for production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean every minute

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.standard
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  // No entry exists - create new one
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
      blocked: false,
    });
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Check if currently blocked
  if (entry.blocked) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    const blockDuration = config.blockDuration || config.windowMs;
    rateLimitStore.set(key, {
      ...entry,
      blocked: true,
      resetTime: now + blockDuration,
    });
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: now + blockDuration,
      retryAfter: Math.ceil(blockDuration / 1000),
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get user ID from authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    // Use token hash as identifier (don't store the actual token)
    return `user:${hashString(authHeader.slice(7))}`;
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  return `ip:${ip}`;
}

/**
 * Simple hash function for identifiers
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Rate limit middleware wrapper
 */
export function withRateLimit(
  handler: (request: Request, ...args: unknown[]) => Promise<Response>,
  config: keyof typeof RATE_LIMIT_CONFIGS = 'standard'
) {
  return async (request: Request, ...args: any[]) => {
    const identifier = getClientIdentifier(request);
    const result = checkRateLimit(identifier, RATE_LIMIT_CONFIGS[config]);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Trop de requêtes. Veuillez réessayer plus tard.',
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': result.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': RATE_LIMIT_CONFIGS[config].maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetTime.toString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = await handler(request, ...args);
    
    if (response instanceof Response) {
      response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIGS[config].maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
    }

    return response;
  };
}

/**
 * Reset rate limit for an identifier (admin use)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Get current rate limit status
 */
export function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.standard
): {
  count: number;
  remaining: number;
  resetTime: number;
  blocked: boolean;
} {
  const entry = rateLimitStore.get(identifier);
  const now = Date.now();

  if (!entry || now > entry.resetTime) {
    return {
      count: 0,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
      blocked: false,
    };
  }

  return {
    count: entry.count,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
    blocked: entry.blocked,
  };
}
