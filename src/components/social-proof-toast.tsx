"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, FileDown, Zap } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface SocialProofNotification {
  id: string;
  message: string;
  icon: string;
  group: string;
  scenarioId: number;
  location?: {
    city: string;
    department: string;
    departmentCode: string;
    region: string;
  };
  displayDuration: number;
  nextInterval: number;
}

// ═══════════════════════════════════════════════════════════════
// ICONS & COLORS
// ═══════════════════════════════════════════════════════════════

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  FileDown,
  Zap,
};

const ICON_COLORS: Record<string, string> = {
  packs: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
  ressources:
    "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400",
  activite:
    "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
};

// ═══════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════

const SEEN_KEY = "sp_seen";
const DISABLED_KEY = "sp_disabled";

// ═══════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════

const toastVariants = {
  hidden: {
    opacity: 0,
    x: -100,
    scale: 0.85,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    x: -60,
    scale: 0.9,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const progressBarVariants = {
  hidden: { scaleX: 1 },
  visible: { scaleX: 0, transition: { duration: 6, ease: "linear" } },
  exit: { scaleX: 0, transition: { duration: 0 } },
};

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSeenIds(): number[] {
  try {
    const stored = localStorage.getItem(SEEN_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as { ids: number[]; ts: number };
    if (Date.now() - parsed.ts > 3600000) {
      localStorage.removeItem(SEEN_KEY);
      return [];
    }
    return parsed.ids;
  } catch {
    return [];
  }
}

function addSeenId(id: number) {
  try {
    const ids = getSeenIds();
    const updated = [...new Set([...ids, id])].slice(-50);
    localStorage.setItem(SEEN_KEY, JSON.stringify({ ids: updated, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

function isDisabled(): boolean {
  try {
    return localStorage.getItem(DISABLED_KEY) === "true";
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export function SocialProofToast() {
  const [notification, setNotification] = useState<SocialProofNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  // Ref to avoid circular deps between doFetch and scheduleNext
  const fetchRef = useRef<() => void>(() => {});

  // ── Schedule next fetch (uses ref to call fetch) ────────────
  function scheduleNextFetch(interval?: number, isFirst?: boolean) {
    if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    // First notification: random 0-60s. Subsequent: random 120-480s (2-8 min)
    const delay = interval || (isFirst ? randomInt(5000, 60000) : randomInt(120000, 480000));
    fetchTimerRef.current = setTimeout(() => {
      fetchRef.current();
    }, delay);
  }

  // ── Core fetch logic ───────────────────────────────────────
  const doFetch = useCallback(async () => {
    if (!mountedRef.current || isDisabled()) return;

    try {
      const pagePath = window.location.pathname;
      const seenIds = getSeenIds();
      const seenParam =
        seenIds.length > 0 ? `&seen=${seenIds.join(",")}` : "";

      const res = await fetch(
        `/api/social-proof/random?page=${encodeURIComponent(pagePath)}${seenParam}`
      );
      if (!mountedRef.current || !res.ok) return;

      const data = await res.json();
      if (!mountedRef.current) return;

      if (data.skip) {
        scheduleNextFetch(data.nextInterval || randomInt(120000, 480000), false);
        return;
      }

      if (data.scenarioId) {
        addSeenId(data.scenarioId);
      }

      setNotification(data);
      setIsVisible(true);
      setAnimKey((k) => k + 1);
    } catch {
      if (mountedRef.current) {
        scheduleNextFetch(120000, false);
      }
    }
  }, []);

  // ── Keep fetchRef updated ────────────────────────────────
  useEffect(() => {
    fetchRef.current = doFetch;
  }, [doFetch]);

  // ── Hide notification after display duration ───────────────
  const isFirstFetch = useRef(true);

  useEffect(() => {
    if (!isVisible || !notification) return;

    const duration = notification.displayDuration || 6000;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    hideTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setIsVisible(false);
      setTimeout(() => {
        if (!mountedRef.current) return;
        setNotification(null);
        isFirstFetch.current = false;
        scheduleNextFetch(undefined, false);
      }, 400);
    }, duration);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isVisible, notification]);

  // ── Initial startup: random delay (5-60s) after mount ──────────
  useEffect(() => {
    mountedRef.current = true;

    if (typeof window === "undefined") return;
    if (isDisabled()) return;

    const initialDelay = setTimeout(() => {
      doFetch();
    }, randomInt(5000, 60000));

    return () => {
      mountedRef.current = false;
      clearTimeout(initialDelay);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    };
  }, [doFetch]);

  // ── Dismiss handler ────────────────────────────────────────
  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setIsDismissed(true);
    setTimeout(() => {
      if (!mountedRef.current) return;
      setNotification(null);
      setIsDismissed(false);
      scheduleNextFetch(120000);
    }, 400);
  }, []);

  // ── Render ─────────────────────────────────────────────────
  if (!notification) return null;

  const Icon = ICON_MAP[notification.icon] || Zap;
  const iconColor = ICON_COLORS[notification.group] || ICON_COLORS.activite;

  return (
    <div
      className="fixed bottom-6 left-6 z-[9999] pointer-events-none"
      style={{ maxWidth: "380px" }}
    >
      <AnimatePresence mode="wait">
        {isVisible && !isDismissed && (
          <motion.div
            key={`${notification.id}-${animKey}`}
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="pointer-events-auto relative overflow-hidden rounded-xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-xl shadow-black/10"
          >
            {/* Progress bar */}
            <motion.div
              variants={progressBarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-emerald-500 to-emerald-400"
            />

            <div className="flex items-start gap-3 p-4 pr-10">
              {/* Icon */}
              <div
                className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg ${iconColor}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed text-foreground/90">
                  {notification.message}
                </p>
                {notification.location && (
                  <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {notification.location.city},{" "}
                    {notification.location.departmentCode}
                  </p>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2.5 right-2.5 flex items-center justify-center h-6 w-6 rounded-full text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50 transition-colors"
              aria-label="Fermer la notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
