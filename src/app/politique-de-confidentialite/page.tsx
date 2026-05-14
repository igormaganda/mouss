"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShieldCheck, UserCog, Database, Target, Scale, Clock, Users, Cookie, ListChecks, Lock, RefreshCw, Mail, Activity } from "lucide-react";

export default function PolitiqueDeConfidentialitePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-background border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Protection des données
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Politique de Confidentialité
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-2xl">
              RUNWEEK MEDIA s&apos;engage à protéger la vie privée des utilisateurs de runweek.fr.
              La présente politique détaille les pratiques de collecte, d&apos;utilisation et de protection des données personnelles.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="text-sm text-muted-foreground mb-10">
            Dernière mise à jour : 13 mai 2026
          </p>

          {/* Introduction */}
          <div className="rounded-lg border bg-muted/20 p-5 sm:p-6 mb-10 text-base leading-relaxed text-muted-foreground">
            <p>
              La présente Politique de Confidentialité a pour objet d&apos;informer les utilisateurs du site runweek.fr
              sur la manière dont RUNWEEK MEDIA collecte, utilise, conserve et protège leurs données personnelles,
              conformément au Règlement Général sur la Protection des Données (RGPD – Règlement UE 2016/679) et à la loi
              Informatique et Libertés du 6 janvier 1978 modifiée.
            </p>
          </div>

          {/* 1. Responsable du traitement */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <UserCog className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                1. Responsable du traitement
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Le responsable du traitement des données personnelles collectées sur le site runweek.fr est :
              </p>
              <div className="rounded-lg border bg-muted/20 p-5 sm:p-6 space-y-2">
                <p>
                  <span className="font-medium text-foreground">Dénomination :</span>{" "}
                  RUNWEEK MEDIA
                </p>
                <p>
                  <span className="font-medium text-foreground">Forme juridique :</span>{" "}
                  SAS (Société par Actions Simplifiée)
                </p>
                <p>
                  <span className="font-medium text-foreground">SIREN :</span>{" "}
                  103 168 944
                </p>
                <p>
                  <span className="font-medium text-foreground">Siège social :</span>{" "}
                  173 Rue de Courcelles, 75017 Paris, France
                </p>
                <p>
                  <span className="font-medium text-foreground">Contact :</span>{" "}
                  <a href="mailto:contact@runweek.fr" className="text-primary hover:underline">
                    contact@runweek.fr
                  </a>
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 2. Données collectées */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                2. Données collectées
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                RUNWEEK MEDIA peut collecter les données personnelles suivantes :
              </p>

              <h3 className="text-lg font-medium text-foreground mt-6">a) Données fournies volontairement par l&apos;utilisateur</h3>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Nom, prénom</li>
                <li>Adresse électronique</li>
                <li>Numéro de téléphone</li>
                <li>Photo de profil (optionnelle)</li>
                <li>Données de performance sportive (distance, temps, allure, dénivelé)</li>
                <li>Contenu généré par l&apos;utilisateur (récits de course, commentaires)</li>
                <li>Informations de paiement (pour les services payants, traitées par des prestataires sécurisés)</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-6">b) Données collectées automatiquement</h3>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Adresse IP</li>
                <li>Type et version du navigateur</li>
                <li>Système d&apos;exploitation</li>
                <li>Pages visitées, durée de la visite, date et heure de la consultation</li>
                <li>Source de trafic (site référent)</li>
                <li>Données de géolocalisation (pour les fonctionnalités de suivi d&apos;entraînement)</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-6">c) Cookies et technologies similaires</h3>
              <p>
                Le site utilise des cookies pour améliorer l&apos;expérience utilisateur, mesurer l&apos;audience et proposer
                des contenus adaptés. Pour plus de détails, consultez notre{" "}
                <a href="/politique-cookies" className="text-primary hover:underline font-medium">
                  Politique de Cookies
                </a>
                .
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 3. Finalités du traitement */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                3. Finalités du traitement
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Les données personnelles sont collectées et traitées pour les finalités suivantes :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <span className="font-medium text-foreground">Gestion du compte utilisateur :</span> Création, authentification
                  et gestion du compte personnel sur le site.
                </li>
                <li>
                  <span className="font-medium text-foreground">Publication de récits de course :</span> Publication,
                  modération et affichage des récits et performances sportifs.
                </li>
                <li>
                  <span className="font-medium text-foreground">Suivi d&apos;entraînement :</span> Enregistrement et analyse
                  des performances sportives, statistiques et progression.
                </li>
                <li>
                  <span className="font-medium text-foreground">Intégration Strava/Garmin :</span> Connexion et synchronisation
                  des données d&apos;entraînement avec les plateformes tierces (avec consentement explicite).
                </li>
                <li>
                  <span className="font-medium text-foreground">Envoi de la newsletter :</span> Communication d&apos;informations
                  éditoriales, conseils d&apos;entraînement et actualités, avec le consentement préalable de l&apos;utilisateur.
                </li>
                <li>
                  <span className="font-medium text-foreground">Gestion de la relation communauté :</span> Modération des
                  commentaires, signalement et gestion des interactions entre utilisateurs.
                </li>
                <li>
                  <span className="font-medium text-foreground">Analyse et amélioration du site :</span> Mesure d&apos;audience,
                  analyse des comportements de navigation et amélioration de l&apos;ergonomie et des contenus.
                </li>
                <li>
                  <span className="font-medium text-foreground">Sécurité du site :</span> Prévention des fraudes, protection
                  contre les attaques et garantie de la disponibilité du service.
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 4. Base légale */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                4. Base légale du traitement
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Les traitements de données personnelles sont fondés sur les bases légales suivantes, conformément aux
                articles 6 et 9 du RGPD :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <span className="font-medium text-foreground">Consentement (art. 6.1.a) :</span> Pour le traitement des
                  données liées à la newsletter, aux cookies non essentiels, aux communications commerciales et à la
                  synchronisation avec Strava/Garmin.
                </li>
                <li>
                  <span className="font-medium text-foreground">Exécution du contrat (art. 6.1.b) :</span> Pour la gestion
                  du compte utilisateur et la fourniture des services souscrits.
                </li>
                <li>
                  <span className="font-medium text-foreground">Intérêt légitime (art. 6.1.f) :</span> Pour l&apos;analyse
                  d&apos;audience, l&apos;amélioration du site, la sécurité, la prévention des fraudes et la modération des contenus.
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 5. Durée de conservation */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                5. Durée de conservation des données
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Les données personnelles sont conservées pour une durée proportionnée à la finalité pour laquelle elles
                ont été collectées :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <span className="font-medium text-foreground">Données de compte :</span> Conservées pendant toute la durée
                  de la relation contractuelle, puis pendant 3 ans à compter de la fin de la relation commerciale.
                </li>
                <li>
                  <span className="font-medium text-foreground">Données de performance sportive :</span> Conservées
                  tant que le compte est actif, puis anonymisées après suppression du compte.
                </li>
                <li>
                  <span className="font-medium text-foreground">Récits et contenus publiés :</span> Conservés jusqu&apos;à
                  la suppression du compte ou demande de retrait par l&apos;utilisateur.
                </li>
                <li>
                  <span className="font-medium text-foreground">Newsletter :</span> Les données liées à l&apos;inscription à la
                  newsletter sont conservées jusqu&apos;au désabonnement de l&apos;utilisateur.
                </li>
                <li>
                  <span className="font-medium text-foreground">Données de navigation (cookies) :</span> Conservation maximale
                  de 13 mois pour les cookies analytiques et publicitaires.
                </li>
                <li>
                  <span className="font-medium text-foreground">Données de facturation :</span> Conservées pendant 10 ans
                  conformément aux obligations comptables (art. L123-22 du Code de commerce).
                </li>
              </ul>
              <p>
                À l&apos;expiration des durées de conservation, les données sont supprimées ou anonymisées de manière
                irréversible.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 6. Destinataires des données */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                6. Destinataires des données
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Les données personnelles peuvent être communiquées aux catégories de destinataires suivantes :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <span className="font-medium text-foreground">Personnel habilité de RUNWEEK MEDIA :</span>{" "}
                  Employés et collaborateurs nécessitant l&apos;accès aux données dans le cadre de leurs fonctions.
                </li>
                <li>
                  <span className="font-medium text-foreground">Prestataires techniques :</span> Hébergeur (Microsoft Azure),
                  fournisseurs de services d&apos;analyse, services d&apos;envoi d&apos;emails, prestataires de paiement sécurisé,
                  sous réserve de contrats de sous-traitance conformes au RGPD.
                </li>
                <li>
                  <span className="font-medium text-foreground">API tierces (Strava, Garmin) :</span> Uniquement avec
                  le consentement explicite de l&apos;utilisateur pour la synchronisation des données d&apos;entraînement.
                </li>
                <li>
                  <span className="font-medium text-foreground">Autorités compétentes :</span> En cas d&apos;obligation légale,
                  de décision judiciaire ou de demande des autorités habilitées.
                </li>
              </ul>
              <p>
                RUNWEEK MEDIA s&apos;engage à ne jamais vendre, louer ou échanger les données personnelles
                de ses utilisateurs à des tiers à des fins commerciales.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 7. Données de santé et activité sportive */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                7. Données d&apos;activité sportive
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Les données de performance sportive collectées par RUNWEEK MEDIA (distance, temps, fréquence cardiaque,
                localisation) sont considérées comme des données de santé au sens du RGPD.
              </p>
              <p>
                Ces données sont traitées avec un niveau de sécurité renforcé et ne sont utilisées que pour les finalités
                décrites dans la présente politique. Elles ne font l&apos;objet d&apos;aucun partage à des fins commerciales
                et ne sont pas utilisées pour des assurances ou des employeurs.
              </p>
              <p>
                L&apos;utilisateur reste propriétaire de ses données et peut les exporter ou les supprimer à tout moment.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 8. Droits des personnes concernées */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                8. Droits des personnes concernées
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Conformément au RGPD (articles 15 à 22) et à la loi Informatique et Libertés, chaque utilisateur
                dispose des droits suivants sur ses données personnelles :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <span className="font-medium text-foreground">Droit d&apos;accès (art. 15) :</span> Obtenir la confirmation
                  que des données sont traitées et en recevoir une copie.
                </li>
                <li>
                  <span className="font-medium text-foreground">Droit de rectification (art. 16) :</span> Demander la
                  correction de données inexactes ou incomplètes.
                </li>
                <li>
                  <span className="font-medium text-foreground">Droit à l&apos;effacement (art. 17) :</span> Demander la
                  suppression de ses données dans les cas prévus par la réglementation.
                </li>
                <li>
                  <span className="font-medium text-foreground">Droit à la limitation du traitement (art. 18) :</span>
                  Demander la suspension du traitement de ses données.
                </li>
                <li>
                  <span className="font-medium text-foreground">Droit à la portabilité (art. 20) :</span> Recevoir ses
                  données dans un format structuré, couramment utilisé et lisible par machine, et les transmettre à un
                  autre responsable de traitement.
                </li>
                <li>
                  <span className="font-medium text-foreground">Droit d&apos;opposition (art. 21) :</span> S&apos;opposer au
                  traitement de ses données pour des raisons tenant à sa situation particulière, ou s&apos;opposer à la
                  prospection commerciale.
                </li>
                <li>
                  <span className="font-medium text-foreground">Droit de retirer son consentement :</span> Retirer à tout
                  moment son consentement au traitement de ses données, sans que cela ne compromette la licéité du
                  traitement effectué avant le retrait.
                </li>
              </ul>
              <p>
                Pour exercer ces droits, l&apos;utilisateur peut adresser sa demande par email à :{" "}
                <a href="mailto:contact@runweek.fr" className="text-primary hover:underline font-medium">
                  contact@runweek.fr
                </a>
                .
              </p>
              <p>
                RUNWEEK MEDIA s&apos;engage à répondre à toute demande dans un délai maximum d&apos;un mois
                à compter de sa réception.
              </p>
              <p>
                En cas de réponse jugée insatisfaisante, l&apos;utilisateur dispose d&apos;un droit de recours auprès de la
                Commission Nationale de l&apos;Informatique et des Libertés (CNIL) :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://www.cnil.fr
                </a>
                .
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 9. Sécurité des données */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                9. Sécurité des données
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                RUNWEEK MEDIA met en œuvre des mesures techniques et organisationnelles appropriées
                pour protéger les données personnelles contre la destruction accidentelle ou illicite, la perte,
                l&apos;altération, la divulgation ou l&apos;accès non autorisé, conformément à l&apos;article 32 du RGPD.
              </p>
              <p>
                Parmi les mesures de sécurité mises en place :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Chiffrement des données sensibles (notamment les mots de passe) ;</li>
                <li>Utilisation du protocole HTTPS (TLS) pour les échanges de données ;</li>
                <li>Restriction de l&apos;accès aux données aux seules personnes habilitées ;</li>
                <li>Sauvegardes régulières et sécurisées sur des serveurs redondants ;</li>
                <li>Mise à jour régulière des logiciels et systèmes de sécurité ;</li>
                <li>Sensibilisation du personnel à la protection des données.</li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 10. Modifications de la politique */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                10. Modifications de la politique
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                RUNWEEK MEDIA se réserve le droit de modifier la présente Politique de Confidentialité
                à tout moment afin de l&apos;adapter aux évolutions légales, réglementaires ou techniques.
              </p>
              <p>
                Toute modification sera signalée par la mise à jour de la date de « Dernière mise à jour » figurant
                en tête de cette page. L&apos;utilisateur est invité à consulter régulièrement cette page.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 11. Contact */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                11. Contact
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Pour toute question relative à la présente Politique de Confidentialité, à l&apos;exercice de vos droits
                ou au traitement de vos données personnelles, vous pouvez nous contacter par :
              </p>
              <div className="rounded-lg border bg-muted/20 p-5 sm:p-6 space-y-2">
                <p>
                  <span className="font-medium text-foreground">Email :</span>{" "}
                  <a href="mailto:contact@runweek.fr" className="text-primary hover:underline">
                    contact@runweek.fr
                  </a>
                </p>
                <p>
                  <span className="font-medium text-foreground">Courrier :</span>{" "}
                  RUNWEEK MEDIA<br />
                  173 Rue de Courcelles<br />
                  75017 Paris, France
                </p>
              </div>
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
