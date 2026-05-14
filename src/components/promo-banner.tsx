"use client";

import { useEffect, useState } from "react";
import { X, ChevronRight } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "promo-banner-dismissed";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Small delay so the slide-down animation is visible
      requestAnimationFrame(() => {
        setIsVisible(true);
        setIsAnimating(true);
      });
    }
  }, []);

  function handleDismiss() {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem(STORAGE_KEY, "true");
    }, 200);
  }

  if (!isVisible) return null;

  return (
    <div
      className={`sticky top-0 z-[60] w-full transition-transform duration-200 ease-out ${
        isAnimating ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center relative h-10">
          {/* Desktop content */}
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <span>
              🚀 Packs d&rsquo;accompagnement à partir de 9€ — Audit gratuit
              + Livrable PDF inclus
            </span>
            <Link
              href="/accompagnement"
              className="inline-flex items-center gap-1 font-semibold hover:underline whitespace-nowrap"
            >
              Découvrir les packs
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
            <span className="text-white/40">|</span>
            <Link
              href="/audit"
              className="inline-flex items-center gap-1 font-semibold underline whitespace-nowrap"
            >
              Audit gratuit
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile content */}
          <div className="flex sm:hidden items-center gap-3 text-xs w-full justify-center">
            <span className="truncate">
              🚀 Packs d&rsquo;accompagnement dès 9€
            </span>
            <Link
              href="/accompagnement"
              className="inline-flex items-center gap-0.5 font-semibold hover:underline whitespace-nowrap shrink-0"
            >
              Découvrir
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Fermer la bannière"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
