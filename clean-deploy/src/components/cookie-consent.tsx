"use client";

import { useReducer, useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Shield, BarChart3, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ConsentData {
  accepted: boolean;
  analytics: boolean;
  marketing: boolean;
  date: string;
}

const CONSENT_KEY = "cookie-consent";

function getStoredConsent(): ConsentData | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentData;
  } catch {
    return null;
  }
}

function saveConsent(data: ConsentData) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
}

// Track consent changes across components for useSyncExternalStore
let consentVersion = 0;
const consentListeners = new Set<() => void>();

function subscribeToConsent(callback: () => void) {
  consentListeners.add(callback);
  return () => consentListeners.delete(callback);
}

function notifyConsentChange() {
  consentVersion++;
  consentListeners.forEach((listener) => listener());
}

function getConsentSnapshot(): ConsentData | null {
  return getStoredConsent();
}

function getServerSnapshot(): ConsentData | null {
  return null;
}

interface CookieCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function CookieCategory({
  icon,
  title,
  description,
  checked,
  disabled = false,
  onCheckedChange,
}: CookieCategoryProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 text-primary shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <Switch
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            aria-label={title}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

type BannerState = {
  status: "hidden" | "banner" | "settings" | "floating";
  analytics: boolean;
  marketing: boolean;
};

type BannerAction =
  | { type: "SHOW_SETTINGS" }
  | { type: "ACCEPT_ALL" }
  | { type: "ACCEPT_SELECTED" }
  | { type: "CLOSE" }
  | { type: "REOPEN_SETTINGS"; analytics: boolean; marketing: boolean };

function bannerReducer(state: BannerState, action: BannerAction): BannerState {
  switch (action.type) {
    case "SHOW_SETTINGS":
      return { ...state, status: "settings" };
    case "ACCEPT_ALL": {
      saveConsent({
        accepted: true,
        analytics: true,
        marketing: true,
        date: new Date().toISOString(),
      });
      notifyConsentChange();
      return { ...state, status: "floating" };
    }
    case "ACCEPT_SELECTED": {
      saveConsent({
        accepted: true,
        analytics: state.analytics,
        marketing: state.marketing,
        date: new Date().toISOString(),
      });
      notifyConsentChange();
      return { ...state, status: "floating" };
    }
    case "CLOSE":
      return { ...state, status: "floating" };
    case "REOPEN_SETTINGS":
      return {
        status: "settings",
        analytics: action.analytics,
        marketing: action.marketing,
      };
    default:
      return state;
  }
}

export function CookieConsent() {
  const storedConsent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerSnapshot
  );

  const hasConsent = storedConsent !== null;

  const [state, dispatch] = useReducer(bannerReducer, {
    status: hasConsent ? "floating" : "banner",
    analytics: storedConsent?.analytics ?? false,
    marketing: storedConsent?.marketing ?? false,
  });

  const acceptAll = useCallback(() => {
    dispatch({ type: "ACCEPT_ALL" });
  }, []);

  const acceptSelected = useCallback(() => {
    dispatch({ type: "ACCEPT_SELECTED" });
  }, []);

  const openSettings = useCallback(() => {
    dispatch({ type: "SHOW_SETTINGS" });
  }, []);

  const closeBanner = useCallback(() => {
    dispatch({ type: "CLOSE" });
  }, []);

  const reopenSettings = useCallback(() => {
    const consent = getStoredConsent();
    dispatch({
      type: "REOPEN_SETTINGS",
      analytics: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
    });
  }, []);

  const showFloating = state.status === "floating";
  const showBanner = state.status === "banner" || state.status === "settings";
  const showSettings = state.status === "settings";

  return (
    <>
      {/* Floating cookie button (visible after first consent) */}
      <AnimatePresence>
        {showFloating && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={reopenSettings}
            className="fixed bottom-4 left-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            aria-label="Paramètres des cookies"
            title="Gérer les cookies"
          >
            <Cookie className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4"
          >
            <div className="mx-auto max-w-3xl rounded-xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl">
              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Cookie className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        🍪 Nous respectons votre vie privée
                      </h3>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        Conformément au RGPD
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeBanner}
                    className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    aria-label="Fermer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience,
                  mesurer notre audience et vous proposer des contenus
                  personnalisés. Vous pouvez personnaliser vos préférences ou
                  tout accepter.
                </p>

                {/* Settings Panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/50 pt-3 mb-4 space-y-1">
                        <CookieCategory
                          icon={<Shield className="h-4 w-4" />}
                          title="Cookies strictement nécessaires"
                          description="Requis au bon fonctionnement du site. Ils ne peuvent pas être désactivés."
                          checked={true}
                          disabled={true}
                          onCheckedChange={() => {}}
                        />
                        <CookieCategory
                          icon={<BarChart3 className="h-4 w-4" />}
                          title="Cookies analytiques"
                          description="Nous permettent de comprendre comment les visiteurs utilisent le site et d'améliorer nos services."
                          checked={state.analytics}
                          onCheckedChange={(checked) => {
                            // Use reducer dispatch to update analytics
                            dispatch({
                              type: "REOPEN_SETTINGS",
                              analytics: checked,
                              marketing: state.marketing,
                            });
                          }}
                        />
                        <CookieCategory
                          icon={<Megaphone className="h-4 w-4" />}
                          title="Cookies marketing"
                          description="Utilisés pour vous proposer des publicités et contenus pertinents."
                          checked={state.marketing}
                          onCheckedChange={(checked) => {
                            dispatch({
                              type: "REOPEN_SETTINGS",
                              analytics: state.analytics,
                              marketing: checked,
                            });
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Button
                    onClick={acceptAll}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none"
                  >
                    Tout accepter
                  </Button>
                  {showSettings ? (
                    <Button
                      onClick={acceptSelected}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      Enregistrer mes choix
                    </Button>
                  ) : (
                    <Button
                      onClick={openSettings}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      Personnaliser
                    </Button>
                  )}
                </div>

                {/* Legal links */}
                <p className="text-[11px] text-muted-foreground/70 mt-3 text-center">
                  En poursuivant votre navigation, vous acceptez l&apos;utilisation
                  des cookies.{" "}
                  <a
                    href="/politique-cookies"
                    className="underline hover:text-muted-foreground"
                  >
                    Politique de cookies
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
