"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, RotateCcw, Package, Timer, ClipboardList, Clock, AlertTriangle, Phone } from "lucide-react";

export default function PolitiqueRemboursementPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-background border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <RotateCcw className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Garanties & remboursements
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Politique de Remboursement
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-2xl">
              GEORGES ERNEST CONSEIL (GEC) met en place une politique de remboursement transparente et conforme à 
              la législation française en vigueur pour protéger les droits des consommateurs.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="text-sm text-muted-foreground mb-10">
            Dernière mise à jour : 1<sup>er</sup> janvier 2025
          </p>

          {/* 1. Produits et services concernés */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                1. Produits et services concernés
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                La présente Politique de Remboursement s&apos;applique aux services payants proposés sur le site 
                crearentreprise.fr, édité par GEORGES ERNEST CONSEIL (GEC), et notamment :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <span className="font-medium text-foreground">Abonnements premium :</span> Offres d&apos;abonnement mensuels 
                  ou annuels donnant accès à des contenus exclusifs, des outils avancés et un accompagnement personnalisé.
                </li>
                <li>
                  <span className="font-medium text-foreground">Packs premium :</span> Packs thématiques incluant des guides 
                  détaillés, des modèles de documents, des check-lists et des ressources spécifiques à un besoin entrepreneurial.
                </li>
                <li>
                  <span className="font-medium text-foreground">Services d&apos;accompagnement :</span> Prestations de conseil, 
                  audit ou formation dispensées à distance ou en présentiel.
                </li>
              </ul>
              <p>
                Les contenus et outils gratuits accessibles sur le site ne sont pas concernés par la présente politique.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 2. Droit de rétractation */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Timer className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                2. Droit de rétractation
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Conformément à l&apos;article L.221-18 du Code de la consommation, l&apos;utilisateur dispose d&apos;un délai 
                de <span className="font-medium text-foreground">14 jours calendaires</span> à compter de la conclusion 
                du contrat pour exercer son droit de rétractation, sans avoir à justifier de motif ni à payer de pénalité.
              </p>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 sm:p-6">
                <p className="font-medium text-foreground mb-1">Point d&apos;information</p>
                <p>
                  Le droit de rétractation ne peut être exercé pour les contrats de fourniture de contenu numérique non 
                  préenregistré sur un support matériel, dont l&apos;exécution a commencé après accord préalable exprès du 
                  consommateur et renoncement exprès à son droit de rétractation (article L.221-28 du Code de la 
                  consommation).
                </p>
              </div>

              <p>
                Pour les abonnements avec engagement, l&apos;utilisateur peut exercer son droit de rétractation dans les 
                14 jours suivant la souscription. Au-delà de ce délai, l&apos;abonnement court jusqu&apos;à son terme et 
                l&apos;utilisateur peut demander la non-reconduction à tout moment (voir section « Conditions de remboursement »).
              </p>
              <p>
                Pour les services d&apos;accompagnement dont l&apos;exécution a commencé avec l&apos;accord exprès de l&apos;utilisateur, 
                le droit de rétractation ne s&apos;applique pas à compter du début de la prestation. L&apos;utilisateur est informé 
                de cette renonciation lors de la souscription.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 3. Conditions de remboursement */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                3. Conditions de remboursement
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Le remboursement est accordé dans les cas suivants :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <span className="font-medium text-foreground">Rétractation dans le délai légal :</span> Demande formulée 
                  dans les 14 jours calendaires suivant la souscription, pour les éligibles (voir section 2).
                </li>
                <li>
                  <span className="font-medium text-foreground">Non-reconduction d&apos;abonnement :</span> Toute demande 
                  de non-reconduction formulée avant la date de renouvellement sera prise en compte. Le service restera 
                  accessible jusqu&apos;à la fin de la période en cours.
                </li>
                <li>
                  <span className="font-medium text-foreground">Dysfonctionnement majeur :</span> En cas de problème 
                  technique majeur rendant le service inaccessible pendant une période prolongée (supérieure à 7 jours 
                  consécutifs) et non résolu malgré les diligences de GEORGES ERNEST CONSEIL (GEC).
                </li>
                <li>
                  <span className="font-medium text-foreground">Double prélèvement :</span> En cas de facturation 
                  erronée ou de double prélèvement, le remboursement intégral du montant excédentaire sera effectué.
                </li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-6">Modalités de remboursement</h3>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  Le remboursement sera effectué sur le moyen de paiement utilisé lors de l&apos;achat (carte bancaire, 
                  virement, etc.).
                </li>
                <li>
                  Pour les abonnements mensuels ou annuels ayant débuté depuis plus de 14 jours, un remboursement 
                  partiel pourra être accordé au prorata temporis de la durée d&apos;utilisation non écoulée, après examen 
                  de la demande par notre service client.
                </li>
                <li>
                  Les frais de transaction bancaire éventuellement perçus par le prestataire de paiement ne sont pas 
                  remboursables.
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 4. Procédure de demande */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                4. Procédure de demande de remboursement
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Pour demander un remboursement, l&apos;utilisateur doit suivre la procédure suivante :
              </p>
              <div className="space-y-4 mt-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Adressez votre demande par email</p>
                    <p>
                      Envoyez un email à{" "}
                      <a href="mailto:contact@crea-entreprise.fr" className="text-primary hover:underline">
                        contact@crea-entreprise.fr
                      </a>{" "}
                      avec l&apos;objet « Demande de remboursement – [votre nom/prénom] » en indiquant :
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-1.5 pl-2">
                      <li>Votre nom et prénom</li>
                      <li>L&apos;adresse email associée à votre compte</li>
                      <li>La référence de votre commande ou abonnement</li>
                      <li>Le motif de votre demande</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Réception de l&apos;accusé de réception</p>
                    <p>
                      Notre service client accuse réception de votre demande dans un délai de 48 heures ouvrées.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Examen de la demande</p>
                    <p>
                      Votre demande est étudiée par notre équipe qui peut vous contacter pour obtenir des 
                      informations complémentaires si nécessaire.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Notification de la décision</p>
                    <p>
                      Vous êtes informé de la décision d&apos;accord ou de refus du remboursement par email, avec les 
                      justifications éventuelles.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    5
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Exécution du remboursement</p>
                    <p>
                      En cas d&apos;accord, le remboursement est effectué selon les délais précisés à la section suivante.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 5. Délais de traitement */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                5. Délais de traitement
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                GEORGES ERNEST CONSEIL (GEC) s&apos;engage à traiter les demandes de remboursement dans les délais suivants :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <span className="font-medium text-foreground">Accusé de réception :</span> Sous 48 heures ouvrées à 
                  compter de la réception de la demande.
                </li>
                <li>
                  <span className="font-medium text-foreground">Réponse à la demande :</span> Sous 10 jours ouvrés à compter 
                  de la réception de la demande complète.
                </li>
                <li>
                  <span className="font-medium text-foreground">Exécution du remboursement :</span> Dans un délai de 
                  14 jours calendaires à compter de l&apos;accord de remboursement, par le même moyen de paiement que 
                  celui utilisé lors de l&apos;achat.
                </li>
              </ul>
              <p>
                En cas de remboursement par virement bancaire, le délai d&apos;apparition des fonds sur le compte de 
                l&apos;utilisateur peut varier en fonction de son établissement bancaire (généralement entre 3 et 5 jours 
                ouvrés supplémentaires).
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 6. Exceptions */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                6. Exceptions et cas non éligibles
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Le remboursement ne sera pas accordé dans les cas suivants :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  Demande de rétractation formulée au-delà du délai de 14 jours calendaires, sauf cas de 
                  dysfonctionnement majeur du service.
                </li>
                <li>
                  Utilisation abusive ou frauduleuse du service (multi-comptes, partage d&apos;identifiants, etc.).
                </li>
                <li>
                  Violation des Conditions Générales d&apos;Utilisation du site entraînant la suspension ou la 
                  résiliation du compte.
                </li>
                <li>
                  Services d&apos;accompagnement dont l&apos;exécution a commencé après accord exprès de l&apos;utilisateur 
                  et renoncement au droit de rétractation (article L.221-28 du Code de la consommation).
                </li>
                <li>
                  Contenus numériques téléchargés et dont l&apos;utilisation a commencé après accord exprès de 
                  l&apos;utilisateur.
                </li>
              </ul>

              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-5 sm:p-6 mt-4">
                <p className="font-medium text-foreground mb-1">Cas de non-reconduction</p>
                <p>
                  Pour les abonnements avec reconduction automatique, la demande de non-reconduction doit être 
                  formulée <span className="font-medium text-foreground">avant la date de renouvellement</span>. 
                  Les frais correspondant à la période en cours restent dus et ne sont pas remboursables. Le service 
                  reste accessible jusqu&apos;à l&apos;expiration de la période payée.
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 7. Contact */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                7. Contact
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Pour toute question relative à la présente Politique de Remboursement, pour soumettre une demande 
                de remboursement ou pour signaler un problème lié à un achat, vous pouvez nous contacter :
              </p>
              <div className="rounded-lg border bg-muted/20 p-5 sm:p-6 space-y-2">
                <p>
                  <span className="font-medium text-foreground">Email :</span>{" "}
                  <a href="mailto:contact@crea-entreprise.fr" className="text-primary hover:underline">
                    contact@crea-entreprise.fr
                  </a>
                </p>
                <p>
                  <span className="font-medium text-foreground">Courrier :</span>{" "}
                  GEORGES ERNEST CONSEIL (GEC)<br />
                  Service Client – Remboursements<br />
                  12 chemin de la Prairie<br />
                  91230 MONTGERON, France
                </p>
              </div>
              <p>
                En cas de litige non résolu par nos services, l&apos;utilisateur peut recourir à une procédure de 
                médiation de la consommation ou saisir la plateforme de résolution des litiges en ligne de la 
                Commission européenne :{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
                .
              </p>
            </div>
          </div>

          {/* Back to home link */}
          <div className="mt-12 pt-8 border-t">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
