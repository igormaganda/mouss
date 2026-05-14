"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Bell, Check, CheckCircle, X, Loader2, AlertCircle } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface NewsletterState {
  subscribed: boolean;
  subscribedAt: string | null;
}

interface NewsletterToggleResponse {
  success: boolean;
  subscribed: boolean;
  message: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function formatDateFR(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function NewsletterSettings() {
  const { data: session, status } = useSession();

  const [newsletter, setNewsletter] = useState<NewsletterState>({
    subscribed: false,
    subscribedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* ── Fetch current subscription status ─────────────────────────────────── */

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/newsletter");
      if (res.ok) {
        const data: NewsletterState = await res.json();
        setNewsletter(data);
      }
    } catch {
      toast.error("Impossible de charger le statut de la newsletter");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchStatus();
    }
  }, [status, fetchStatus]);

  /* ── Toggle subscription ──────────────────────────────────────────────── */

  const handleToggle = async () => {
    try {
      setToggling(true);
      setFeedback(null);

      const res = await fetch("/api/user/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscribed: !newsletter.subscribed }),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      const data: NewsletterToggleResponse = await res.json();

      if (data.success) {
        setNewsletter((prev) => ({
          ...prev,
          subscribed: data.subscribed,
          subscribedAt: data.subscribed ? new Date().toISOString() : prev.subscribedAt,
        }));
        toast.success(data.message);
      } else {
        setFeedback({ type: "error", message: data.message });
        toast.error(data.message);
      }
    } catch {
      const errorMsg = newsletter.subscribed
        ? "Impossible de se désabonner. Veuillez réessayer."
        : "Impossible de s'abonner. Veuillez réessayer.";
      setFeedback({ type: "error", message: errorMsg });
      toast.error(errorMsg);
    } finally {
      setToggling(false);
    }
  };

  /* ── Loading state ─────────────────────────────────────────────────────── */

  if (status === "loading" || loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-48" />
        </CardContent>
      </Card>
    );
  }

  /* ── Render ────────────────────────────────────────────────────────────── */

  return (
    <Card
      className={`overflow-hidden transition-colors ${
        newsletter.subscribed
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:border-emerald-800/50 dark:from-emerald-950/20 dark:to-teal-950/10"
          : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 transition-colors ${
              newsletter.subscribed
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            <Mail className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base flex items-center gap-2">
              Newsletter
              {newsletter.subscribed && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Check className="h-2.5 w-2.5" />
                  Abonné
                </span>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              Recevez nos derniers guides, conseils et actualités pour entrepreneurs.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Subscription status / toggle area */}
        <AnimatePresence mode="wait">
          {newsletter.subscribed ? (
            <motion.div
              key="subscribed"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Vous êtes abonné à la newsletter
                  </p>
                  {newsletter.subscribedAt && (
                    <p className="text-xs text-muted-foreground">
                      Abonné depuis le {formatDateFR(newsletter.subscribedAt)}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/30 dark:text-red-400 dark:hover:text-red-300 shrink-0"
                onClick={handleToggle}
                disabled={toggling}
              >
                {toggling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Se désabonner
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="unsubscribed"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Vous n&apos;êtes pas abonné
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Restez informé des dernières nouveautés
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                onClick={handleToggle}
                disabled={toggling}
              >
                {toggling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                S&apos;abonner à la newsletter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback message */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                )}
                {feedback.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info notice */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {newsletter.subscribed
            ? "En cas de désabonnement, vous ne recevrez plus aucun email de notre part."
            : "Abonnez-vous pour recevoir nos guides exclusifs, conseils d'experts et offres spéciales directement dans votre boîte mail."}
        </p>
      </CardContent>
    </Card>
  );
}
