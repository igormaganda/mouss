"use client";

import { motion } from "framer-motion";

const partners = [
  "Qonto",
  "Indy",
  "Pennylane",
  "Legalstart",
  "Captain Contrat",
  "Hiscox",
  "HubSpot",
  "Brevo",
];

export function SocialProofSection() {
  return (
    <section className="py-10 sm:py-14 bg-background border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8"
        >
          Ils nous font confiance
        </motion.p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
          {partners.map((partner, i) => (
            <motion.span
              key={partner}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-base sm:text-lg font-bold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors select-none"
            >
              {partner}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
