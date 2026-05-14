import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    // Récupérer l'ID de session depuis le cookie
    const sessionId = request.cookies.get("session_id")?.value;

    // Supprimer la session du store
    if (sessionId) {
      clearSession(sessionId);
    }

    // Créer la réponse
    const response = NextResponse.json({
      message: "Déconnexion réussie",
      success: true,
    });

    // Supprimer les cookies
    response.cookies.delete("session_id");
    response.cookies.delete("user_role");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    // Même en cas d'erreur, on supprime les cookies
    const response = NextResponse.json({
      message: "Déconnexion réussie",
      success: true,
    });
    response.cookies.delete("session_id");
    response.cookies.delete("user_role");
    return response;
  }
}
