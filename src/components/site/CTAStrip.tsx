"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTAStrip() {
  return (
    <section className="bg-[#E8A020] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#0B1F3A] tracking-wide">
              Rejoignez les 30 familles du programme pilote
            </h2>
            <p className="text-sm text-[#0B1F3A]/70 mt-1">
              Cotisation annuelle : 450 € · Démarrage septembre 2025
            </p>
          </div>
          
          <Link href="/register">
            <Button className="bg-[#0B1F3A] text-white hover:bg-[#122850] font-bold px-8 py-4 rounded-full text-sm whitespace-nowrap">
              ✦ Préinscription
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
