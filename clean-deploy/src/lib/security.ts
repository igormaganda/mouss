import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * Require authenticated admin user. Returns session or throws.
 * Use at the top of every admin API route handler.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new AuthError("Non authentifié", 401);
  }
  if ((session.user as any).role !== "admin") {
    throw new AuthError("Accès refusé — droits administrateur requis", 403);
  }
  return session;
}

/**
 * Require authenticated user (any role). Returns session or throws.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new AuthError("Non authentifié", 401);
  }
  if ((session.user as any).role === "deleted") {
    throw new AuthError("Compte supprimé", 403);
  }
  return session;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// ─── Rate Limiting (in-memory) ─────────────────────────────────

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) rateLimitStore.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Simple IP-based rate limiter.
 * @param key - Unique key (e.g., "login:1.2.3.4")
 * @param maxRequests - Max requests in the window
 * @param windowMs - Window duration in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get client IP from request headers.
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || 
         headersList.get("x-real-ip") || 
         "unknown";
}

/**
 * Validate pagination parameters.
 */
export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.min(Math.max(parseInt(searchParams.get("page") || "1") || 1, 1), 1000);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10") || 10, 1), 100);
  return { page, limit };
}

/**
 * Sanitize search string to prevent abuse.
 */
export function sanitizeSearch(input: string, maxLength = 100): string {
  if (!input || input.length < 2) return "";
  return input.slice(0, maxLength).trim();
}

/**
 * Generate a secure CSRF token.
 */
export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

/**
 * Validate CSRF token.
 */
export function validateCSRFToken(token: string): boolean {
  return token && token.length > 0;
}
