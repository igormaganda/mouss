"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const includedFeatures = [
  "Accès aux entraînements multisports (mercredi après-midi)",
  "Soutien scolaire en ligne illimité",
  "Participation aux challenges et compétitions",
  "Accès aux stages vacances (tarifs préférentiels)",
  "Accès au magazine et ressources IEF",
  "Couverture assurance sportive",
  "Participation à la vie de l'association",
  "Accès au forum privé des familles",
];

const pricingFeatures = [
  "30 places disponibles",
  "Engagement annuel",
  "Paiement en 3 fois possible",
  "Réduction famille nombreuse",
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-[#0B1F3A] via-[#122850] to-[#1A3660]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-6">
              Rejoignez le programme pilote
            </h2>
            
            <div className="space-y-3">
              {includedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/82 text-sm">
                  <div className="w-6 h-6 rounded-full bg-[#E8A020]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#E8A020] text-xs font-bold">✓</span>
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pricing Card */}
          <Card className="shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="text-[0.72rem] font-bold tracking-wider uppercase text-[#E8A020]">
                Programme Pilote 2025
              </div>
              
              <h3 className="font-heading text-2xl text-[#0B1F3A] tracking-wide">
                Adhésion Annuelle
              </h3>
              
              <div className="py-5 border-y border-[#F4F6FA]">
                <div className="flex items-end gap-1">
                  <span className="font-heading text-5xl text-[#0B1F3A]">450</span>
                  <span className="text-lg text-[#0B1F3A] mb-2">€</span>
                </div>
                <div className="text-sm text-[#8899BB]">par an / famille</div>
              </div>
              
              <div className="space-y-3">
                {pricingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-[#1C2D4A]">
                    <div className="w-2 h-2 rounded-full bg-[#E8A020]"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-[#E8A020]/10 border border-[#E8A020]/30 rounded-xl p-4 text-center">
                <div className="text-sm text-[#7A5000] font-semibold">
                  ⚡ Seulement 30 places disponibles – Inscription sur sélection
                </div>
              </div>
              
              <Link href="/register">
                <Button className="w-full bg-[#E8A020] text-[#0B1F3A] hover:bg-[#F5BE5A] font-bold py-4 rounded-full text-sm">
                  🏅 Préinscription
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
