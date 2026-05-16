"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CGVPage() {
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
            Conditions Générales de Vente
          </h1>

          <div className="prose prose-lg max-w-none text-[#607090]">
            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">1. Objet</h2>
              <p>
                Les présentes conditions générales de vente (CGV) régissent les relations contractuelles 
                entre l&apos;association CS TERNES PARIS OUEST et les personnes physiques souhaitant adhérer 
                à l&apos;association et participer à ses activités.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">2. Présentation de l&apos;association</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dénomination :</strong> CS TERNES PARIS OUEST</li>
                <li><strong>Forme juridique :</strong> Association loi 1901</li>
                <li><strong>Numéro RNA :</strong> W751256865</li>
                <li><strong>Objet :</strong> Promotion du sport et de l&apos;éducation pour les familles pratiquant l&apos;instruction en famille</li>
                <li><strong>Siège social :</strong> Paris Ouest, France</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">3. Conditions d&apos;adhésion</h2>
              <p className="mb-4">
                Pour adhérer à l&apos;association, il faut :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Être une famille pratiquant l&apos;instruction en famille (IEF)</li>
                <li>Remplir le formulaire d&apos;inscription en ligne</li>
                <li>Fournir les documents nécessaires (attestation d&apos;IEF, certificats médicaux)</li>
                <li>S&apos;acquitter de la cotisation annuelle</li>
                <li>Signer le règlement intérieur de l&apos;association</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">4. Cotisation et tarifs</h2>
              <p className="mb-4">
                <strong>Cotisation annuelle :</strong> 450 € par famille pour l&apos;année scolaire
              </p>
              <p className="mb-4">Cette cotisation inclut :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accès au soutien scolaire en ligne (lundi-vendredi)</li>
                <li>Participation aux entraînements multisports du mercredi</li>
                <li>Participation aux challenges et compétitions</li>
                <li>Accès aux stages pendant les vacances scolaires</li>
                <li>Accompagnement et suivi personnalisé</li>
              </ul>
              <p className="mt-4">
                <strong>Mode de paiement :</strong> Virement bancaire, chèque ou carte bancaire.
                Possibilité de paiement en plusieurs fois (nous consulter).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">5. Inscription et admission</h2>
              <p className="mb-4">
                L&apos;inscription se fait via le formulaire en ligne disponible sur le site. 
                La validation définitive de l&apos;inscription est subordonnée à :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vérification des documents fournis</li>
                <li>Confirmation de la disponibilité des places</li>
                <li>Encaissement de la cotisation</li>
              </ul>
              <p className="mt-4">
                En cas de non-validation, la somme éventuellement versée sera intégralement remboursée.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">6. Annulation et remboursement</h2>
              <p className="mb-4">
                <strong>Annulation avant le début des activités :</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Plus de 30 jours avant : remboursement intégral</li>
                <li>Entre 15 et 30 jours : remboursement à 75%</li>
                <li>Moins de 15 jours : remboursement à 50%</li>
              </ul>
              <p className="mt-4 mb-4">
                <strong>Annulation en cours d&apos;année :</strong>
              </p>
              <p>
                En cas de déménagement, de cessation de l&apos;IEF ou de motif grave dûment justifié, 
                un remboursement au prorata temporis pourra être envisagé. Aucun remboursement ne 
                sera effectué pour les absences ponctuelles aux activités.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">7. Obligations des adhérents</h2>
              <p className="mb-4">Les adhérents s&apos;engagent à :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respecter le règlement intérieur de l&apos;association</li>
                <li>Assurer la présence régulière de leurs enfants aux activités</li>
                <li>Prévenir en cas d&apos;absence</li>
                <li>Fournir les certificats médicaux nécessaires</li>
                <li>Respecter les horaires des activités</li>
                <li>Respecter les animateurs, éducateurs et autres adhérents</li>
                <li>Participer à la vie de l&apos;association (assemblées générales, événements)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">8. Obligations de l&apos;association</h2>
              <p className="mb-4">L&apos;association s&apos;engage à :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fournir les activités promises dans le cadre de l&apos;adhésion</li>
                <li>Assurer un encadrement qualifié pour les activités sportives</li>
                <li>Respecter les normes de sécurité en vigueur</li>
                <li>Informer les adhérents de tout changement dans le planning ou l&apos;organisation</li>
                <li>Assurer la confidentialité des données personnelles</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">9. Assurance</h2>
              <p>
                L&apos;association dispose d&apos;une assurance responsabilité civile couvrant ses activités. 
                Cette assurance couvre les dommages causés aux tiers dans le cadre des activités 
                de l&apos;association. Il appartient aux adhérents de vérifier leur couverture personnelle 
                pour leurs biens et leur responsabilité individuelle.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">10. Exclusion</h2>
              <p>
                L&apos;association se réserve le droit d&apos;exclure un adhérent en cas de non-respect grave 
                du règlement intérieur, de comportement inapproprié, ou de mise en danger d&apos;autrui. 
                Aucun remboursement ne sera effectué en cas d&apos;exclusion pour faute grave.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">11. Responsabilité</h2>
              <p>
                L&apos;association ne pourra être tenue responsable des dommages résultant d&apos;une 
                utilisation anormale ou frauduleuse des services, ni des dommages indirects ou 
                immatériels. La responsabilité de l&apos;association est limitée aux dommages directs 
                et prévisibles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">12. Protection des données</h2>
              <p>
                Les données personnelles collectées sont traitées conformément à notre politique 
                de confidentialité, accessible sur notre site internet.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">13. Modification des CGV</h2>
              <p>
                L&apos;association se réserve le droit de modifier les présentes CGV à tout moment. 
                Les CGV applicables sont celles en vigueur au jour de l&apos;inscription.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">14. Droit applicable et litiges</h2>
              <p>
                Les présentes CGV sont soumises au droit français. En cas de litige, les parties 
                s&apos;engagent à rechercher une solution amiable. À défaut d&apos;accord, les tribunaux 
                français seront seuls compétents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">15. Contact</h2>
              <p>
                Pour toute question relative aux présentes CGV, vous pouvez nous contacter à :
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Email :</strong> contact@csternes.paris</li>
                <li><strong>Site web :</strong> www.csternes.paris</li>
              </ul>
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
