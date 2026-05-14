"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Constants ────────────────────────────────────────────────
const STORAGE_KEY = "ce_exit_intent_shown";
const TIMER_KEY = "ce_exit_intent_timer_end";
const SESSION_KEY = "ce_session_id";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// ─── Timer helper ─────────────────────────────────────────────
function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function shouldSkipByCooldown(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const ts = parseInt(stored, 10);
    return Date.now() - ts < SEVEN_DAYS_MS;
  } catch {
    return false;
  }
}

function markShown() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    const timerEnd = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(TIMER_KEY, String(timerEnd));
  } catch {
    /* ignore */
  }
}

function getTimerEnd(): number | null {
  try {
    const val = localStorage.getItem(TIMER_KEY);
    if (!val) return null;
    return parseInt(val, 10);
  } catch {
    return null;
  }
}

// ─── Animation variants ───────────────────────────────────────
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: 60,
    scale: 0.95,
    transition: { duration: 0.25 },
  },
};

// ─── Component ────────────────────────────────────────────────
export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; value: number; description: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("23:59:59");
  const triggeredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  // ── Countdown timer ─────────────────────────────────────
  useEffect(() => {
    const end = getTimerEnd();
    if (!end) return;

    function tick() {
      if (!mountedRef.current) return;
      const diff = end - Date.now();
      setTimeLeft(formatTime(diff));
    }

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  // ── Mouse-leave detection + API call ────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    mountedRef.current = true;

    async function checkAndShow() {
      try {
        const sessionId = getSessionId();
        const page = window.location.pathname;

        const res = await fetch("/api/exit-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, page }),
        });

        if (!res.ok || !mountedRef.current) return;

        const data = await res.json();
        if (data.showPopup && mountedRef.current) {
          if (data.coupon) {
            setCoupon({
              code: data.coupon.code,
              value: data.coupon.value,
              description: data.coupon.description,
            });
          }
          markShown();
          setIsOpen(true);
        }
      } catch {
        /* silently ignore */
      }
    }

    function handleMouseLeave(e: MouseEvent) {
      if (triggeredRef.current) return;
      if (shouldSkipByCooldown()) return;
      if (e.clientY <= 0) {
        triggeredRef.current = true;
        checkAndShow();
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      mountedRef.current = false;
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Close handler ───────────────────────────────────────
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // ── ESC key ─────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  // ── Render ──────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 mx-0 sm:mx-4 mb-0 sm:mb-0 w-full sm:max-w-md overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Gradient background card */}
            <div className="relative overflow-hidden bg-white dark:bg-zinc-900">
              {/* Decorative gradient top bar */}
              <div
                className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s ease-in-out infinite",
                }}
              />

              {/* Decorative blobs */}
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 flex items-center justify-center h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors z-10"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative px-6 pt-8 pb-8 sm:px-8 sm:pt-10 sm:pb-10">
                {/* Icon */}
                <div className="flex justify-center mb-5">
                  <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-amber-500/10 border border-emerald-500/20">
                    <Gift className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    <div className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-amber-500">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 dark:from-emerald-400 dark:via-emerald-300 dark:to-amber-400 bg-clip-text text-transparent">
                  Offre exclusive — Ne partez pas !
                </h2>

                {/* Subtitle */}
                <p className="text-center text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
                  Profitez de{" "}
                  <span className="font-bold text-foreground">
                    -{coupon?.value ?? 20}%
                  </span>{" "}
                  sur votre premier mois avec le code :
                </p>

                {/* Coupon code display */}
                {coupon && (
                  <div className="flex justify-center mb-6">
                    <div className="relative px-6 py-3 rounded-lg bg-muted border-2 border-dashed border-emerald-500/40 font-mono text-lg sm:text-xl font-bold tracking-wider text-emerald-700 dark:text-emerald-400 select-all">
                      {coupon.code}
                      <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
                        -{coupon.value}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>
                    L&apos;offre expire dans{" "}
                    <span className="font-bold text-foreground tabular-nums">
                      {timeLeft}
                    </span>
                  </span>
                </div>

                {/* CTA buttons */}
                <div className="space-y-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold text-base h-12 shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
                  >
                    <a href={`/tarifs?coupon=${coupon?.code ?? "BIENVENUE20"}`}>
                      <Gift className="h-5 w-5" />
                      Profiter de l&apos;offre
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>

                  <button
                    onClick={handleClose}
                    className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Non merci, je risque de le regretter
                  </button>
                </div>

                {/* Trust line */}
                <p className="text-center text-xs text-muted-foreground/70 mt-5">
                  Offre reservee aux nouveaux entrepreneurs · 1 utilisation par personne
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
