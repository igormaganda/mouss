"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#F4F6FA] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-[#0B1F3A] hover:bg-[#0B1F3A]/5">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l&apos;accueil
          </Button>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="font-heading text-3xl md:text-4xl text-[#0B1F3A] mb-8 tracking-wide">
            Mentions Légales
          </h1>

          <div className="prose prose-lg max-w-none text-[#607090]">
            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">1. Éditeur du site</h2>
              <p className="mb-4">
                Le présent site est édité par :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dénomination sociale :</strong> CS TERNES PARIS OUEST</li>
                <li><strong>Forme juridique :</strong> Association loi 1901</li>
                <li><strong>Numéro RNA :</strong> W751256865</li>
                <li><strong>Siège social :</strong> Paris Ouest, France</li>
                <li><strong>Email :</strong> contact@csternes.paris</li>
                <li><strong>Site web :</strong> www.csternes.paris</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">2. Directeur de la publication</h2>
              <p>
                Le directeur de la publication est le Président de l&apos;association CS TERNES PARIS OUEST.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">3. Hébergeur du site</h2>
              <p className="mb-4">
                Ce site est hébergé par :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Société :</strong> Vercel Inc.</li>
                <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li><strong>Site web :</strong> vercel.com</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">4. Propriété intellectuelle</h2>
              <p className="mb-4">
                L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) 
                est la propriété exclusive de l&apos;association CS TERNES PARIS OUEST ou de ses partenaires et est 
                protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie 
                des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf 
                autorisation écrite préalable de l&apos;association CS TERNES PARIS OUEST.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">5. Limitation de responsabilité</h2>
              <p className="mb-4">
                L&apos;association CS TERNES PARIS OUEST s&apos;efforce d&apos;assurer au mieux l&apos;exactitude et la mise à jour 
                des informations diffusées sur ce site. Toutefois, l&apos;association ne peut garantir l&apos;exactitude, 
                la précision ou l&apos;exhaustivité des informations mises à disposition sur ce site.
              </p>
              <p>
                En conséquence, l&apos;association décline toute responsabilité pour toute imprécision, inexactitude 
                ou omission portant sur des informations disponibles sur le site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">6. Liens hypertextes</h2>
              <p className="mb-4">
                Le site peut contenir des liens hypertextes vers d&apos;autres sites internet. L&apos;association 
                CS TERNES PARIS OUEST n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité 
                quant à leur contenu.
              </p>
              <p>
                La création de liens hypertextes vers le site www.csternes.paris est soumise à l&apos;accord 
                préalable de l&apos;association.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">7. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige, 
                les tribunaux français seront seuls compétents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">8. Contact</h2>
              <p>
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter à 
                l&apos;adresse suivante : <strong>contact@csternes.paris</strong>
              </p>
            </section>

            <p className="text-sm text-[#8899BB] mt-8">
              Dernière mise à jour : Janvier 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
