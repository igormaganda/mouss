"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Qui peut rejoindre CS Ternes Paris Ouest ?",
    answer: "Toutes les familles pratiquant l'instruction en famille (IEF) peuvent rejoindre l'association. Notre programme est conçu pour les enfants de 6 à 16 ans scolarisés à la maison. L'adhésion est soumise à validation du dossier de candidature.",
  },
  {
    question: "Comment se déroulent les entraînements multisports ?",
    answer: "Les entraînements ont lieu le mercredi après-midi sur des terrains ou gymnases à Paris Ouest. Ils sont encadrés par des éducateurs sportifs diplômés et suivent le format UNSS. Nous pratiquons le football, basketball, athlétisme, arts martiaux et d'autres sports selon les cycles.",
  },
  {
    question: "Le soutien scolaire en ligne est-il obligatoire ?",
    answer: "Non, le soutien scolaire en ligne est optionnel mais inclus dans l'adhésion. Il est conçu pour compléter le programme IEF de chaque famille, avec des séances interactives adaptées au rythme de l'enfant.",
  },
  {
    question: "Quel est le coût de l'adhésion ?",
    answer: "La cotisation annuelle est de 450 € par famille (quel que soit le nombre d'enfants). Ce montant couvre tous les services : entraînements, soutien scolaire en ligne, participation aux compétitions, accès aux ressources. Le paiement peut être étalé en 3 fois.",
  },
  {
    question: "Y a-t-il des stages pendant les vacances ?",
    answer: "Oui, nous organisons des stages thématiques pendant les vacances scolaires. Ces stages sont optionnels et facturés séparément, avec un tarif préférentiel pour les adhérents. Ils se terminent souvent par des tournois et compétitions.",
  },
  {
    question: "Comment s'inscrire au programme pilote ?",
    answer: "Pour rejoindre le programme pilote (30 places disponibles), remplissez le formulaire de préinscription sur notre site. Nous vous contacterons pour un entretien de présentation avant validation définitive de l'adhésion.",
  },
  {
    question: "L'association est-elle reconnue officiellement ?",
    answer: "Oui, CS Ternes Paris Ouest est une association loi 1901 déclarée. Nous disposons d'une assurance sportive couvrant tous les adhérents lors des activités. Nos encadrants sont diplômés et nos créneaux sportifs sont affiliés au format UNSS.",
  },
  {
    question: "Comment contacter l'association ?",
    answer: "Vous pouvez nous contacter par email à contact@csternes.fr ou par téléphone au 01 23 45 67 89. Nous répondons sous 48h ouvrées. N'hésitez pas à nous poser vos questions !",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="label">✦ FAQ</span>
          <h2 className="section-title">Questions fréquentes</h2>
          <p className="section-sub mx-auto text-center mt-3">
            Trouvez rapidement les réponses à vos questions sur CS Ternes Paris Ouest.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="overflow-hidden border border-[#E0E8F4] shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={cn(
                  "w-full flex items-center justify-between gap-4 p-5 text-left transition-colors",
                  openIndex === index ? "bg-[#F4F6FA]" : "hover:bg-[#F4F6FA]"
                )}
              >
                <span className={cn(
                  "font-bold text-sm transition-colors",
                  openIndex === index ? "text-[#E8A020]" : "text-[#0B1F3A]"
                )}>
                  {faq.question}
                </span>
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                  openIndex === index
                    ? "bg-[#E8A020] text-[#0B1F3A] rotate-45"
                    : "bg-[#F4F6FA] border border-[#C5D4EC] text-[#0B1F3A]"
                )}>
                  <Plus className="w-4 h-4" />
                </div>
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-300",
                openIndex === index ? "max-h-96" : "max-h-0"
              )}>
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-[#607090] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
