"use client";

import { useEffect, useState, useCallback } from "react";

interface CsrfState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook pour gérer la protection CSRF
 * Utilisé pour sécuriser les formulaires
 */
export function useCsrf() {
  const [state, setState] = useState<CsrfState>({
    token: null,
    isLoading: true,
    error: null,
  });

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/csrf-token");
        if (!response.ok) {
          throw new Error("Failed to fetch CSRF token");
        }
        const data = await response.json();
        setState({
          token: data.csrfToken,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          token: null,
          isLoading: false,
          error: "Erreur de sécurité. Veuillez rafraîchir la page.",
        });
      }
    };

    fetchToken();
  }, []);

  // Validate token before form submission
  const validateToken = useCallback(() => {
    if (!state.token) {
      return false;
    }
    return true;
  }, [state.token]);

  // Get headers with CSRF token for fetch requests
  const getHeaders = useCallback(
    (additionalHeaders: Record<string, string> = {}) => {
      if (!state.token) {
        throw new Error("CSRF token not available");
      }

      return {
        "Content-Type": "application/json",
        "X-CSRF-Token": state.token,
        ...additionalHeaders,
      };
    },
    [state.token]
  );

  // Safe fetch wrapper with CSRF protection
  const safeFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!state.token) {
        throw new Error("CSRF token not available");
      }

      const headers = new Headers(options.headers);
      headers.set("X-CSRF-Token", state.token);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      return fetch(url, {
        ...options,
        headers,
      });
    },
    [state.token]
  );

  return {
    csrfToken: state.token,
    isLoading: state.isLoading,
    error: state.error,
    validateToken,
    getHeaders,
    safeFetch,
  };
}
