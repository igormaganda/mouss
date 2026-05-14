"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface NewsletterSettings {
  placeholder: string;
  ctaText: string;
  description: string;
}

export interface NewsletterProps {
  title: string;
  subtitle: string;
  badge: string;
  settings: NewsletterSettings;
}

export function NewsletterSection({ title, subtitle, badge, settings }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);

    // Mock submit - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Inscription reussie ! Vous recevrez nos prochains articles.");
  };

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Card background */}
          <div className="bg-gradient-to-br from-emerald-600 via-primary to-emerald-700 p-8 sm:p-12 lg:p-16 text-center">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

            <div className="relative">
              {/* Badge */}
              <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/20 text-white border-white/30 hover:bg-white/20">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                {badge}
              </Badge>

              {/* Title */}
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {title}
              </h2>

              {/* Subtitle */}
              <p className="mt-4 text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
                {subtitle}
              </p>

              {/* Description from settings */}
              <p className="mt-2 text-sm text-white/60">
                {settings.description}
              </p>

              {/* Form */}
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 flex flex-col items-center gap-3"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-white">
                    Merci pour votre inscription !
                  </p>
                  <p className="text-sm text-white/70">
                    Votre premier email arrive bientot.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={settings.placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 bg-white/95 border-white text-foreground placeholder:text-muted-foreground focus-visible:ring-white/30"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !email.includes("@")}
                    size="lg"
                    className="h-12 gap-2 bg-white text-primary hover:bg-white/90 font-semibold px-8 shadow-lg shadow-black/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {settings.ctaText}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
