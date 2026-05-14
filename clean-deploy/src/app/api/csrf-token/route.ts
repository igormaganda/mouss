import { NextRequest, NextResponse } from "next/server";
import { generateCSRFToken } from "@/lib/security";

// Store CSRF tokens with expiry (in production, use Redis)
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

// Clean up expired tokens every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of csrfTokens.entries()) {
    if (value.expiresAt < now) {
      csrfTokens.delete(key);
    }
  }
}, 600000);

export async function GET(request: NextRequest) {
  // Check if user has a session
  const sessionId = request.cookies.get("session_id")?.value;

  // Generate CSRF token
  const csrfToken = generateCSRFToken();
  const csrfSessionId = crypto.randomUUID();

  // Store token with 1 hour expiry
  csrfTokens.set(csrfSessionId, {
    token: csrfToken,
    expiresAt: Date.now() + 60 * 60 * 1000,
  });

  const response = NextResponse.json({
    csrfToken,
    message: "CSRF token generated",
  });

  // Set CSRF session cookie
  response.cookies.set("csrf_session", csrfSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  return response;
}

// Export the store for validation in other routes
export { csrfTokens };
