import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    const session = getSession(request);

    if (!session) {
      return NextResponse.json({ user: null, authenticated: false });
    }

    // Retourner les infos de session
    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
      },
      authenticated: true,
    });
  } catch (error) {
    console.error("Error checking auth:", error);
    return NextResponse.json({ user: null, authenticated: false });
  }
}
