"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ScrollText, Target, CheckCircle2, LayoutGrid, User, MousePointer, ShieldCheck, AlertTriangle, Link2, RefreshCw, Clock, Landmark } from "lucide-react";

export default function CGUPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-background border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ScrollText className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Conditions d&apos;utilisation
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Conditions Générales d&apos;Utilisation
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-2xl">
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;utilisation du site 
              runweek.fr édité par RUNWEEK MEDIA.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="text-sm text-muted-foreground mb-10">
            Dernière mise à jour : 13 mai 2026
          </p>

          {/* Préambule */}
          <div className="rounded-lg border bg-muted/20 p-5 sm:p-6 mb-10 text-base leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Préambule</p>
            <p>
              Les présentes CGU ont pour objet de définir les modalités et conditions d&apos;utilisation du site internet 
              runweek.fr, ainsi que les droits et obligations des parties. Toute utilisation du site implique 
              l&apos;acceptation pleine et entière des présentes CGU.
            </p>
          </div>

          {/* 1. Objet */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 1 – Objet
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Le site runweek.fr est un magazine sportif dédié à la course à pied et aux sports d&apos;endurance.
                Il propose des récits de course, des conseils d&apos;entraînement, des actualités du monde de la course
                à pied et des fonctionnalités de suivi de performance.
              </p>
              <p>
                RUNWEEK MEDIA, SAS (Société par Actions Simplifiée) immatriculée sous le SIREN 103 168 944,
                dont le siège social est situé au 173 Rue de Courcelles, 75017 Paris, est l&apos;éditeur et l&apos;exploitant du site.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 2. Acceptation des CGU */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 2 – Acceptation des CGU
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                L&apos;utilisation du site runweek.fr implique l&apos;acceptation sans réserve des présentes CGU. 
                L&apos;utilisateur reconnaît avoir pris connaissance de ces conditions avant toute utilisation du site.
              </p>
              <p>
                RUNWEEK MEDIA se réserve le droit de modifier les CGU à tout moment. Les modifications 
                entreront en vigueur dès leur publication sur le site. Il appartient à l&apos;utilisateur de consulter 
                régulièrement les CGU.
              </p>
              <p>
                En cas de désaccord avec tout ou partie des CGU, l&apos;utilisateur est invité à cesser immédiatement 
                l&apos;utilisation du site.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 3. Services proposés */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 3 – Services proposés
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Le site runweek.fr propose les services suivants :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <span className="font-medium text-foreground">Guides et articles éditoriaux :</span> Contenus informatifs 
                  relatifs à la création, la gestion et le développement d&apos;entreprise (choix du statut juridique, 
                  formalités de création, fiscalité, social, comptabilité, etc.).
                </li>
                <li>
                  <span className="font-medium text-foreground">Comparatifs :</span> Analyses comparatives de solutions 
                  professionnelles (banques en ligne, assurances, outils de gestion, etc.) afin d&apos;aider les 
                  entrepreneurs dans leurs choix.
                </li>
                <li>
                  <span className="font-medium text-foreground">Outils :</span> Outils pratiques en ligne (simulateurs, 
                  générateurs de documents, check-lists, etc.) destinés à faciliter les démarches entrepreneuriales.
                </li>
                <li>
                  <span className="font-medium text-foreground">Newsletter :</span> Service d&apos;envoi périodique d&apos;informations 
                  et de conseils par courrier électronique, sur abonnement volontaire.
                </li>
                <li>
                  <span className="font-medium text-foreground">Offres premium et abonnements :</span> Accès à des contenus 
                  exclusifs, des services avancés et un accompagnement personnalisé, soumis à des conditions tarifaires 
                  spécifiques détaillées dans la section Tarifs du site.
                </li>
              </ul>
              <p>
                RUNWEEK MEDIA se réserve le droit de modifier, suspendre ou interrompre tout ou partie 
                des services, sans préavis ni indemnité.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 4. Inscription et compte utilisateur */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 4 – Inscription et compte utilisateur
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Certains services du site peuvent nécessiter la création d&apos;un compte utilisateur. L&apos;inscription est 
                gratuite et nécessite la fourniture de informations exactes et à jour.
              </p>
              <p>
                L&apos;utilisateur s&apos;engage à :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Fournir des informations personnelles exactes, complètes et à jour lors de l&apos;inscription ;</li>
                <li>Maintenir la confidentialité de ses identifiants de connexion ;</li>
                <li>Notifier immédiatement RUNWEEK MEDIA de toute utilisation non autorisée de son compte ;</li>
                <li>Ne pas créer plusieurs comptes pour un même utilisateur.</li>
              </ul>
              <p>
                RUNWEEK MEDIA se réserve le droit de suspendre ou supprimer tout compte en cas de 
                non-respect des présentes CGU ou de toute utilisation abusive du service.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 5. Utilisation du site */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <MousePointer className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 5 – Utilisation du site
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                L&apos;utilisateur s&apos;engage à utiliser le site runweek.fr de manière conforme aux lois et 
                règlements en vigueur et aux présentes CGU.
              </p>
              <p>
                Il est interdit à l&apos;utilisateur de :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Utiliser le site à des fins illicites, frauduleuses ou portant atteinte aux droits de tiers ;</li>
                <li>Tenter de porter atteinte au bon fonctionnement du site ;</li>
                <li>Récupérer ou extraire, par tout moyen, tout ou partie des contenus du site sans autorisation ;</li>
                <li>Utiliser des robots, aspirateurs de site ou tout autre dispositif automatisé pour accéder au site ;</li>
                <li>Diffuser des contenus illicites, diffamatoires, injurieux, racistes, xénophobes ou contraires à l&apos;ordre public ;</li>
                <li>Se livrer à des pratiques de spam, phishing ou harcèlement ;</li>
                <li>Contourner les mesures de sécurité du site.</li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 6. Propriété intellectuelle */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 6 – Propriété intellectuelle
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                L&apos;ensemble des éléments composant le site runweek.fr (textes, articles, guides, images, 
                graphismes, logos, marques, dessins, vidéos, sons, logiciels, base de données, etc.) sont la propriété 
                exclusive de RUNWEEK MEDIA ou de ses partenaires et sont protégés par les lois 
                françaises et internationales relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation, distribution ou exploitation, 
                totale ou partielle, de tout ou partie des éléments du site, par quelque procédé que ce soit, sans 
                l&apos;autorisation écrite préalable de RUNWEEK MEDIA, est strictement interdite et 
                constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
              </p>
              <p>
                Le nom de domaine runweek.fr, la marque « Créa Entreprise » et le logo associé sont la 
                propriété de RUNWEEK MEDIA. Toute utilisation sans autorisation est interdite.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 7. Responsabilité et limites */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 7 – Responsabilité et limites
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Les informations publiées sur le site sont fournies à titre indicatif et informatif. Elles ne 
                sauraient se substituer à un conseil professionnel juridique, fiscal, comptable ou financier. 
                L&apos;utilisateur reste seul responsable de l&apos;utilisation qu&apos;il fait des informations contenues 
                sur le site.
              </p>
              <p>
                RUNWEEK MEDIA ne saurait être tenue responsable de :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Des erreurs, omissions ou inexactitudes des informations publiées ;</li>
                <li>Des dommages directs ou indirects résultant de l&apos;utilisation du site ;</li>
                <li>De l&apos;indisponibilité temporaire ou permanente du site ;</li>
                <li>Des performances, résultats ou décisions pris sur la base des informations du site ;</li>
                <li>Des contenus des sites tiers accessibles via des liens hypertextes ;</li>
                <li>Des dommages causés par des virus ou programmes malveillants, bien que RUNWEEK MEDIA mette en œuvre des mesures de sécurité raisonnables.</li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 8. Données personnelles */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 8 – Données personnelles
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                RUNWEEK MEDIA collecte et traite des données personnelles conformément au Règlement 
                Général sur la Protection des Données (RGPD – Règlement UE 2016/679) et à la loi Informatique et 
                Libertés du 6 janvier 1978 modifiée.
              </p>
              <p>
                Les données collectées sont nécessaires au bon fonctionnement du site, à la fourniture des services 
                et, le cas échéant, à l&apos;envoi de communications commerciales avec le consentement préalable de 
                l&apos;utilisateur.
              </p>
              <p>
                Pour plus d&apos;informations sur le traitement de vos données personnelles, vos droits et les modalités 
                d&apos;exercice de ceux-ci, veuillez consulter notre{" "}
                <a href="/politique-de-confidentialite" className="text-primary hover:underline font-medium">
                  Politique de Confidentialité
                </a>
                .
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 9. Liens hypertextes et affiliations */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 9 – Liens hypertextes et affiliations
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Le site runweek.fr peut contenir des liens hypertextes renvoyant vers des sites tiers. 
                RUNWEEK MEDIA n&apos;exerce aucun contrôle sur le contenu de ces sites et décline toute 
                responsabilité quant à leur contenu ou aux éventuels dommages résultant de leur consultation.
              </p>
              <p>
                RUNWEEK MEDIA peut percevoir des commissions dans le cadre de programmes d&apos;affiliation 
                ou de partenariats commerciaux avec certains prestataires présentés sur le site. Ces liens affiliés 
                sont clairement identifiés. Les recommandations formulées sur le site sont fondées sur une analyse 
                indépendante et objective des produits et services présentés.
              </p>
              <p>
                L&apos;utilisateur est informé que le fait de cliquer sur un lien affilié peut engendrer une rémunération 
                pour RUNWEEK MEDIA, sans incidence sur le tarif proposé à l&apos;utilisateur.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 10. Modification des CGU */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 10 – Modification des CGU
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                RUNWEEK MEDIA se réserve le droit de modifier les présentes CGU à tout moment et 
                sans préavis. Les modifications entrent en vigueur dès leur publication sur le site.
              </p>
              <p>
                L&apos;utilisateur est informé des modifications par la mise à jour de la date de « Dernière mise à jour » 
                figurant en tête des CGU. Il est invité à consulter régulièrement cette page pour prendre connaissance 
                des éventuelles modifications.
              </p>
              <p>
                La poursuite de l&apos;utilisation du site après la publication des modifications vaut acceptation pleine 
                et entière des nouvelles CGU.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 11. Durée et résiliation */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 11 – Durée et résiliation
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Les présentes CGU prennent effet dès l&apos;utilisation du site par l&apos;utilisateur et restent en vigueur 
                tant que l&apos;utilisateur accède au site.
              </p>
              <p>
                L&apos;utilisateur peut cesser d&apos;utiliser le site à tout moment, sans formalité. Pour les services 
                payants (abonnements, packs premium), l&apos;utilisateur peut résilier à tout moment en se conformant 
                aux conditions prévues dans notre{" "}
                <a href="/politique-remboursement" className="text-primary hover:underline font-medium">
                  Politique de Remboursement
                </a>
                .
              </p>
              <p>
                RUNWEEK MEDIA se réserve le droit de suspendre ou résilier l&apos;accès au site pour tout 
                utilisateur en cas de violation des présentes CGU, sans préavis ni indemnité.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 12. Droit applicable et juridiction */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Article 12 – Droit applicable et juridiction
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Les présentes CGU sont régies par le droit français. En cas de litige relatif à leur interprétation 
                ou à leur exécution, les parties s&apos;efforceront de trouver une solution amiable.
              </p>
              <p>
                À défaut d&apos;accord amiable, le litige sera soumis aux tribunaux français compétents, conformément 
                aux règles de compétence en vigueur, et notamment le tribunal judiciaire compétent du ressort du 
                siège social de RUNWEEK MEDIA.
              </p>
              <p>
                Conformément au Règlement UE n° 524/2013, l&apos;utilisateur peut recourir à la plateforme de résolution 
                de litiges en ligne de la Commission européenne accessible à l&apos;adresse :{" "}
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
