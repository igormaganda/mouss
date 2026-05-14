"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "crea-entreprise-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // On mount, read localStorage to determine if consent was already given
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        // No consent recorded yet — show the banner after a tiny delay for animation
        requestAnimationFrame(() => {
          setVisible(true);
        });
      }
    } catch {
      // localStorage unavailable — show the banner as a safe fallback
      requestAnimationFrame(() => {
        setVisible(true);
      });
    }
  }, []);

  const storeConsent = (consent: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ consent, timestamp: Date.now() }));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  };

  const handleDismiss = (consent: boolean) => {
    storeConsent(consent);
    // Trigger slide-down animation, then remove from DOM
    setVisible(false);
    setDismissed(true);
  };

  // Don't render anything if consent was already stored
  if (dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      aria-describedby="cookie-banner-description"
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
    >
      <div className="border-t bg-background/80 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left side — text */}
            <p
              id="cookie-banner-description"
              className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
              <span>
                Nous utilisons des cookies pour améliorer votre expérience, mesurer
                l&apos;audience et afficher des contenus personnalisés. En poursuivant
                votre navigation, vous acceptez notre{" "}
                <Link
                  href="/politique-de-confidentialite"
                  className="underline underline-offset-2 font-medium text-foreground transition-colors hover:text-primary"
                >
                  politique de cookies
                </Link>
                .
              </span>
            </p>

            {/* Right side — buttons */}
            <div className="flex shrink-0 items-center gap-3 sm:ml-6">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer rounded-full px-5"
                onClick={() => handleDismiss(false)}
              >
                Refuser
              </Button>
              <Button
                size="sm"
                className="cursor-pointer rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
                onClick={() => handleDismiss(true)}
              >
                Tout accepter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
