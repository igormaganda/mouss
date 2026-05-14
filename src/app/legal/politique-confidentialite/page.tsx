"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PolitiqueConfidentialitePage() {
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
            Politique de Confidentialité
          </h1>

          <div className="prose prose-lg max-w-none text-[#607090]">
            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">1. Introduction</h2>
              <p>
                L&apos;association CS TERNES PARIS OUEST s&apos;engage à protéger la vie privée des utilisateurs 
                de son site internet et de ses services. Cette politique de confidentialité explique 
                comment nous collectons, utilisons et protégeons vos données personnelles conformément 
                au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">2. Responsable du traitement</h2>
              <p className="mb-4">
                Le responsable du traitement des données personnelles est :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Association :</strong> CS TERNES PARIS OUEST</li>
                <li><strong>Adresse :</strong> Paris Ouest, France</li>
                <li><strong>Email :</strong> contact@csternes.paris</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">3. Données collectées</h2>
              <p className="mb-4">
                Nous collectons les données personnelles suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Données d&apos;identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                <li><strong>Données des membres de la famille :</strong> informations concernant les enfants inscrits (prénom, date de naissance)</li>
                <li><strong>Données de connexion :</strong> adresse IP, cookies, données de navigation</li>
                <li><strong>Données de paiement :</strong> informations nécessaires au traitement des cotisations (via des prestataires de paiement sécurisés)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">4. Finalités du traitement</h2>
              <p className="mb-4">
                Vos données personnelles sont collectées pour les finalités suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestion des inscriptions et des adhésions à l&apos;association</li>
                <li>Organisation des activités sportives et éducatives</li>
                <li>Communication avec les membres (newsletters, informations sur les activités)</li>
                <li>Gestion administrative et comptable</li>
                <li>Amélioration de nos services</li>
                <li>Respect de nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">5. Base légale du traitement</h2>
              <p className="mb-4">
                Le traitement de vos données personnelles repose sur :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Votre consentement (inscription newsletter, cookies non essentiels)</li>
                <li>L&apos;exécution du contrat d&apos;adhésion</li>
                <li>Nos obligations légales</li>
                <li>Notre intérêt légitime (amélioration des services, sécurité)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">6. Destinataires des données</h2>
              <p className="mb-4">
                Vos données personnelles peuvent être transmises aux destinataires suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Membres de l&apos;équipe administrative de l&apos;association</li>
                <li>Intervenants et éducateurs sportifs (dans le cadre des activités)</li>
                <li>Prestataires techniques (hébergement, paiement sécurisé)</li>
                <li>Autorités administratives (si requis par la loi)</li>
              </ul>
              <p className="mt-4">
                Nous ne vendons jamais vos données personnelles à des tiers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">7. Durée de conservation</h2>
              <p className="mb-4">
                Vos données personnelles sont conservées pendant la durée nécessaire aux finalités 
                pour lesquelles elles ont été collectées :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Données des membres : durée de l&apos;adhésion + 3 ans</li>
                <li>Données comptables : 10 ans (obligations légales)</li>
                <li>Données de navigation : 13 mois maximum</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">8. Vos droits</h2>
              <p className="mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
                <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
                <li><strong>Droit de retirer votre consentement :</strong> à tout moment pour les traitements basés sur le consentement</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à : <strong>contact@csternes.paris</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">9. Cookies</h2>
              <p className="mb-4">
                Ce site utilise des cookies pour :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Assurer le bon fonctionnement du site (cookies essentiels)</li>
                <li>Mémoriser vos préférences</li>
                <li>Analyser l&apos;utilisation du site (cookies statistiques)</li>
              </ul>
              <p className="mt-4">
                Vous pouvez à tout moment modifier vos préférences en matière de cookies via les 
                paramètres de votre navigateur ou notre bandeau de cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">10. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
                protéger vos données personnelles contre tout accès non autorisé, modification, 
                divulgation ou destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">11. Réclamation</h2>
              <p>
                Si vous estimez que le traitement de vos données personnelles constitue une 
                violation du RGPD, vous avez le droit d&apos;introduire une réclamation auprès de la 
                CNIL (Commission Nationale de l&apos;Informatique et des Libertés) : <strong>www.cnil.fr</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-xl text-[#0B1F3A] mb-4">12. Modifications</h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout 
                moment. Les modifications entreront en vigueur dès leur publication sur ce site.
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
