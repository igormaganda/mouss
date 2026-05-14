/**
 * Security Utilities for CS Ternes Paris Ouest
 * 
 * This file contains security helpers for:
 * - Rate limiting
 * - Input validation
 * - Password strength
 * - Session management
 */

import { z } from "zod";

// ============================================
// INPUT VALIDATION SCHEMAS
// ============================================

export const schemas = {
  // User registration validation
  register: z.object({
    email: z.string().email("Email invalide"),
    password: z.string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").max(50),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
    phone: z.string().regex(/^[\d\s+.-]*$/, "Numéro de téléphone invalide").optional(),
  }),

  // Login validation
  login: z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
  }),

  // Event validation
  event: z.object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(200),
    description: z.string().max(5000).optional(),
    type: z.enum(["training", "competition", "stage", "challenge"]),
    category: z.enum(["multisports", "scolaire", "competition"]).optional(),
    location: z.string().max(200).optional(),
    startDate: z.string().or(z.date()),
    capacity: z.number().int().positive().optional(),
    price: z.number().nonnegative().optional(),
  }),

  // Article validation
  article: z.object({
    title: z.string().min(3).max(200),
    excerpt: z.string().max(500).optional(),
    content: z.string().max(50000).optional(),
    category: z.enum(["sport", "education", "ief", "conseils"]),
    author: z.string().max(100).optional(),
  }),

  // Contact form validation
  contact: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    subject: z.string().max(200).optional(),
    message: z.string().min(10).max(2000),
  }),
};

// ============================================
// RATE LIMITING (In-memory for development)
// ============================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function rateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 300000);

// ============================================
// PASSWORD UTILITIES
// ============================================

export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
  isStrong: boolean;
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 8) feedback.push("Au moins 8 caractères");
  if (!/[A-Z]/.test(password)) feedback.push("Au moins une majuscule");
  if (!/[a-z]/.test(password)) feedback.push("Au moins une minuscule");
  if (!/[0-9]/.test(password)) feedback.push("Au moins un chiffre");
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push("Au moins un caractère spécial");

  return {
    score,
    feedback,
    isStrong: score >= 5,
  };
}

// ============================================
// SANITIZATION
// ============================================

export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(sanitized[key] as string);
    }
  }
  return sanitized;
}

// ============================================
// SESSION HELPERS
// ============================================

export function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// CSRF PROTECTION
// ============================================

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  return token === expectedToken;
}

// ============================================
// SECURITY HEADERS HELPER
// ============================================

export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'",
  };
}
