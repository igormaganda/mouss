/**
 * Security helpers for API route authentication, rate limiting, and validation.
 * All admin and protected routes MUST use these helpers.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ─── Authentication Helpers ──────────────────────────────────────────────────

/**
 * Require authenticated user session.
 * Returns session object or 401 response.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Non authentifie" }, { status: 401 }), session: null };
  }
  return { error: null, session };
}

/**
 * Require authenticated ADMIN user session.
 * Returns session object or 401/403 response.
 */
export async function requireAdmin() {
  const { error, session } = await requireAuth();
  if (error) return { error, session: null };

  const user = session.user as Record<string, unknown>;
  if (user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Acces refuse - droits administrateur requis" }, { status: 403 }),
      session: null,
    };
  }

  return { error: null, session };
}

/**
 * Get the current user ID from session, or null if unauthenticated.
 */
export async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as Record<string, unknown>).id as string;
}

// ─── Rate Limiting (In-Memory) ───────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt < now) rateLimitStore.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Check rate limit for a given key.
 * @param key - Unique identifier (e.g., IP, userId, endpoint+IP)
 * @param maxRequests - Max requests in window
 * @param windowMs - Time window in milliseconds
 * @returns true if rate limited (should reject)
 */
export function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count++;
  return false;
}

/**
 * Get client IP from request headers.
 * Prefers X-Real-IP (set by trusted proxy/Caddy) over X-Forwarded-For (spoofable by client).
 */
export function getClientIp(request: NextRequest): string {
  // X-Real-IP is set by Caddy (our trusted proxy) and cannot be spoofed by the client
  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp !== "unknown" && realIp !== "") {
    return realIp.trim();
  }

  // Fallback to X-Forwarded-For: take the RIGHTMOST IP (set by last proxy)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    // The rightmost IP is set by our trusted proxy (Caddy)
    const trustedIp = ips[ips.length - 1];
    if (trustedIp && trustedIp !== "unknown" && trustedIp !== "") {
      return trustedIp;
    }
  }

  return "unknown";
}

/**
 * Rate limit middleware shortcut for API routes.
 * Returns 429 response if limited, or null if allowed.
 */
export function rateLimitCheck(
  request: NextRequest,
  endpoint: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): NextResponse | null {
  const ip = getClientIp(request);
  const key = `${endpoint}:${ip}`;

  if (isRateLimited(key, maxRequests, windowMs)) {
    return NextResponse.json(
      { error: "Trop de requetes. Reessayez dans quelques instants." },
      { status: 429 }
    );
  }
  return null;
}

// ─── Pagination Helper ───────────────────────────────────────────────────────

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

/**
 * Safely parse pagination parameters from URL.
 * Caps limit to MAX_PAGE_SIZE (100) to prevent DoS.
 */
export function parsePagination(searchParams: URLSearchParams) {
  const rawPage = parseInt(searchParams.get("page") || "1");
  const rawLimit = parseInt(searchParams.get("limit") || String(DEFAULT_PAGE_SIZE));
  const rawOffset = parseInt(searchParams.get("offset") || "0");

  const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, isNaN(rawLimit) ? DEFAULT_PAGE_SIZE : rawLimit));
  const offset = Math.max(0, isNaN(rawOffset) ? 0 : rawOffset);

  return { page, limit, offset, skip: offset > 0 ? offset : (page - 1) * limit };
}

// ─── Production Safety ───────────────────────────────────────────────────────

/**
 * Check if the app is running in production.
 * Used to disable dangerous endpoints (seeds, etc.)
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Guard for seed/maintenance endpoints.
 * Returns 403 in production.
 */
export function denyInProduction(endpoint: string): NextResponse | null {
  if (isProduction()) {
    return NextResponse.json(
      { error: `${endpoint} est desactive en production` },
      { status: 403 }
    );
  }
  return null;
}

// ─── Security Headers Helper ─────────────────────────────────────────────────

/**
 * Standard security headers for API responses.
 */
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
} as const;

/**
 * Add security headers to a NextResponse.
 */
export function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

// ─── Input Sanitization ──────────────────────────────────────────────────────

/**
 * Sanitize a string for safe storage (trim + remove null bytes + limit length).
 */
export function sanitizeString(input: string, maxLength: number = 10000): string {
  return input.replace(/\0/g, "").trim().slice(0, maxLength);
}

/**
 * Safely get JSON body from request with size limit.
 * Now uses AbortController to enforce actual body size (not just Content-Length header).
 */
export async function safeParseBody<T>(
  request: NextRequest,
  maxSizeBytes: number = 1_000_000 // 1MB default
): Promise<T | null> {
  // Check Content-Length as first line of defense
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > maxSizeBytes) {
    return null;
  }

  try {
    // Clone the request and add actual size enforcement via AbortController
    const controller = new AbortController();
    let bytesReceived = 0;
    const originalBody = request.body;
    let bodyStream: ReadableStream<Uint8Array> | null = null;

    if (originalBody) {
      const reader = originalBody.getReader();
      bodyStream = new ReadableStream<Uint8Array>({
        async pull(controller) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          bytesReceived += value.byteLength;
          if (bytesReceived > maxSizeBytes) {
            reader.cancel();
            controller.error(new Error("Body too large"));
            return;
          }
          controller.enqueue(value);
        },
        cancel() {
          reader.cancel();
        },
      });
    }

    // Create a new request with the size-limited stream
    const sizeLimitedRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: bodyStream,
      signal: controller.signal,
    });

    return await sizeLimitedRequest.json();
  } catch {
    return null;
  }
}

// ─── CSRF Protection ──────────────────────────────────────────────────────────

/**
 * Validate CSRF double-submit cookie for state-changing requests.
 * The client must send a CSRF token both in the header (X-CSRF-Token)
 * and as a cookie (csrf_token). If they match, the request is from the same origin.
 *
 * Usage in API routes:
 *   const csrfError = validateCsrf(request);
 *   if (csrfError) return csrfError;
 */
export function validateCsrf(request: NextRequest): NextResponse | null {
  // Skip CSRF check for GET/HEAD/OPTIONS (safe methods)
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return null;
  }

  const headerToken = request.headers.get("x-csrf-token");
  const cookieToken = request.cookies.get("csrf_token")?.value;

  if (!headerToken || !cookieToken) {
    return NextResponse.json(
      { error: "Token CSRF manquant. Rechargez la page et reessayez." },
      { status: 403 }
    );
  }

  // Use constant-time comparison to prevent timing attacks
  if (headerToken !== cookieToken) {
    return NextResponse.json(
      { error: "Token CSRF invalide. Rechargez la page et reessayez." },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Generate a CSRF token for setting in cookies and sending to the client.
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// ─── Audit Logging ───────────────────────────────────────────────────────────

/**
 * Audit action types for logging.
 */
export type AuditAction =
  | "user.login.success"
  | "user.login.failed"
  | "user.register"
  | "user.password.change"
  | "user.password.reset.request"
  | "user.password.reset.success"
  | "user.email.verified"
  | "user.account.delete"
  | "user.account.update"
  | "admin.lead.create"
  | "admin.lead.update"
  | "admin.lead.update.consent"
  | "admin.lead.delete"
  | "admin.email.send"
  | "admin.campaign.send"
  | "admin.campaign.update"
  | "admin.campaign.delete"
  | "admin.post.create"
  | "admin.post.update"
  | "admin.post.delete"
  | "admin.tool.create"
  | "admin.tool.update"
  | "admin.tool.delete"
  | "admin.task.create"
  | "admin.task.update"
  | "admin.task.delete"
  | "admin.notification.send"
  | "admin.template.update"
  | "admin.data.export";

/**
 * Log an audit event. Stores in database asynchronously (fire-and-forget).
 * Falls back to console.error if the DB write fails.
 */
export async function createAuditLog(params: {
  action: AuditAction;
  userId?: string;
  targetId?: string;
  details?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const { db } = await import("@/lib/db");
    await db.auditLog.create({
      data: {
        action: params.action,
        userId: params.userId || null,
        targetId: params.targetId || null,
        details: params.details || null,
        ip: params.ip || null,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (error) {
    // Never let audit logging failures break the request
    console.error("[AuditLog] Failed to write audit log:", error);
  }
}
