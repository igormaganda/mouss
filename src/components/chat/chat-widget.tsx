"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuickActions } from "./quick-actions";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const WELCOME_ACTIONS = [
  "Comment créer mon entreprise ?",
  "Mon métier est réglementé",
  "Quel statut juridique choisir ?",
];

const CONTEXTUAL_ACTIONS = [
  "Quelles obligations réglementaires ?",
  "Quels outils pour mon métier ?",
  "Aide-moi avec mon business plan",
];

/* -------------------------------------------------------------------------- */
/*  Typing Indicator                                                           */
/* -------------------------------------------------------------------------- */

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-end gap-2"
    >
      <Avatar className="size-7 shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-amber-500 text-white text-xs">
          <Bot className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-2 rounded-full bg-muted-foreground/50"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Message Bubble                                                             */
/* -------------------------------------------------------------------------- */

function MessageBubble({ message }: { message: ChatMessage }) {
  const isBot = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && (
        <Avatar className="size-7 shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-amber-500 text-white text-xs">
            <Bot className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot
            ? "bg-muted rounded-bl-md text-foreground"
            : "bg-primary text-primary-foreground rounded-br-md"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={`mt-1 text-[10px] ${
            isBot ? "text-muted-foreground" : "text-primary-foreground/60"
          }`}
        >
          {message.timestamp.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {!isBot && (
        <Avatar className="size-7 shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            <User className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chat Widget                                                                */
/* -------------------------------------------------------------------------- */

export function ChatWidget() {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const sessionIdRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* -- Generate session ID once ------------------------------------------- */
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = crypto.randomUUID();
    }
  }, []);

  /* -- Auto-scroll to bottom ---------------------------------------------- */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  /* -- Focus input when panel opens --------------------------------------- */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  /* -- Unread count (bot messages while closed) --------------------------- */
  const unreadCount = messages.filter((m) => {
    if (m.role !== "assistant") return false;
    // Count messages received while panel was closed — simplified:
    return true; // will be refined once persistence is added
  }).length;

  /* -- Send message ------------------------------------------------------- */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setHasInteracted(true);

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const chatHistory = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatHistory,
            sessionId: sessionIdRef.current,
            userId: session?.user?.id ?? null,
          }),
        });

        if (!res.ok) throw new Error("Failed to get response");

        const data = await res.json();

        const botMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message ?? data.content ?? "Je suis desole, une erreur est survenue.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch {
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Desole, je rencontre un probleme technique. Veuillez reessayer dans un instant.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, session?.user?.id]
  );

  /* -- Clear chat --------------------------------------------------------- */
  const clearChat = useCallback(() => {
    setMessages([]);
    setHasInteracted(false);
    sessionIdRef.current = crypto.randomUUID();
  }, []);

  /* -- Handle submit ------------------------------------------------------ */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(inputValue);
    },
    [inputValue, sendMessage]
  );

  /* -- Handle quick action ------------------------------------------------ */
  const handleQuickAction = useCallback(
    (action: string) => {
      sendMessage(action);
    },
    [sendMessage]
  );

  /* -- Show quick actions? ------------------------------------------------ */
  const showWelcomeActions = !hasInteracted;
  const showContextualActions = hasInteracted && !isLoading && messages.length > 0;

  /* ======================================================================== */
  /*  Render                                                                  */
  /* ======================================================================== */

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl
                       w-[calc(100vw-3rem)] h-[70vh] sm:w-96 sm:h-[500px]"
          >
            {/* -- Header ---------------------------------------------------- */}
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-emerald-500/10 via-background to-amber-500/10 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-amber-500 text-white">
                    <Bot className="size-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold leading-tight">
                    Assistant 100J
                  </h3>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En ligne
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  onClick={clearChat}
                  title="Effacer la conversation"
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fermer le chat"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            {/* -- Messages Area --------------------------------------------- */}
            <ScrollArea className="flex-1 px-4 py-4">
              <div className="flex flex-col gap-4">
                {/* Welcome */}
                {!hasInteracted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-end gap-2"
                  >
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-amber-500 text-white text-xs">
                        <Bot className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed max-w-[75%]">
                      <p className="flex items-center gap-1 font-medium mb-1">
                        <Sparkles className="size-3.5 text-amber-500" />
                        Bienvenue
                      </p>
                      <p>
                        Bonjour ! Je suis votre assistant entrepreneurial.
                        Comment puis-je vous aider ?
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Message list */}
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isLoading && <TypingIndicator />}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* -- Quick Actions --------------------------------------------- */}
            {showWelcomeActions && (
              <QuickActions
                actions={WELCOME_ACTIONS}
                onSelect={handleQuickAction}
              />
            )}
            {showContextualActions && (
              <QuickActions
                actions={CONTEXTUAL_ACTIONS}
                onSelect={handleQuickAction}
              />
            )}

            {/* -- Input Area ------------------------------------------------ */}
            <div className="border-t border-border p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Posez votre question..."
                  disabled={isLoading}
                  className="flex-1 h-10 rounded-full border-border bg-muted/50 pl-4 pr-2 text-sm placeholder:text-muted-foreground focus-visible:ring-emerald-500/30"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !inputValue.trim()}
                  className="size-10 shrink-0 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 text-white shadow-md hover:from-emerald-600 hover:to-amber-600 transition-all disabled:opacity-40"
                  aria-label="Envoyer"
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
        className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-xl hover:shadow-emerald-500/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 opacity-20" />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="size-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="size-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
