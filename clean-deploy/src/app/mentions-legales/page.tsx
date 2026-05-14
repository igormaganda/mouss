"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Scale, Building2, Globe, Server, ShieldCheck, Cookie, Landmark } from "lucide-react";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-background border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Informations légales
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Mentions Légales
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-2xl">
              Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique,
              les mentions légales du site runweek.fr sont détaillées ci-dessous.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="text-sm text-muted-foreground mb-10">
            Dernière mise à jour : 13 mai 2026
          </p>

          {/* 1. Éditeur du site */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                1. Éditeur du site
              </h2>
            </div>
            <div className="rounded-lg border bg-muted/20 p-5 sm:p-6 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Dénomination sociale :</span>{" "}
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
                <span className="font-medium text-foreground">SIRET du siège social :</span>{" "}
                103 168 944 00017
              </p>
              <p>
                <span className="font-medium text-foreground">N° TVA intracommunautaire :</span>{" "}
                FR20 103168944
              </p>
              <p>
                <span className="font-medium text-foreground">Code NAF/APE :</span>{" "}
                6312Z – Portails internet
              </p>
              <p>
                <span className="font-medium text-foreground">Activité principale :</span>{" "}
                Développement et exploitation de portail internet
              </p>
              <p>
                <span className="font-medium text-foreground">Siège social :</span>{" "}
                173 Rue de Courcelles, 75017 Paris, France
              </p>
              <p>
                <span className="font-medium text-foreground">Date de création :</span>{" "}
                1<sup>er</sup> avril 2026
              </p>
              <p>
                <span className="font-medium text-foreground">Directeur de la publication :</span>{" "}
                Monsieur Quentin Fourez
              </p>
              <p>
                <span className="font-medium text-foreground">Contact :</span>{" "}
                <a href="mailto:contact@runweek.fr" className="text-primary hover:underline">
                  contact@runweek.fr
                </a>
              </p>
              <p>
                <span className="font-medium text-foreground">Site internet :</span>{" "}
                <a href="https://runweek.fr" className="text-primary hover:underline">
                  runweek.fr
                </a>
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 2. Hébergeur */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Server className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                2. Hébergeur
              </h2>
            </div>
            <div className="rounded-lg border border-dashed bg-muted/10 p-5 sm:p-6 space-y-2 text-base leading-relaxed text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Prestataire d&apos;hébergement :</span>{" "}
                Microsoft Azure
              </p>
              <p>
                <span className="font-medium text-foreground">Adresse :</span>{" "}
                Microsoft France, 37 Quai du Président Roosevelt, 92130 Issy-les-Moulineaux, France
              </p>
              <p className="mt-2 text-sm">
                Les services d&apos;hébergement sont assurés par des centres de données certifiés ISO 27001,
                garantissant un niveau élevé de sécurité et de disponibilité.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 3. Propriété intellectuelle */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                3. Propriété intellectuelle
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                L&apos;ensemble des contenus présents sur le site runweek.fr (textes, articles, récits, images,
                photographies, graphismes, logos, icônes, sons, logiciels, marques, etc.) est protégé par le droit
                de la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation, totale ou partielle, des éléments
                du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l&apos;autorisation écrite préalable
                de RUNWEEK MEDIA, à l&apos;exception de :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>L&apos;utilisation privée et non commerciale, sous réserve du respect des droits de propriété intellectuelle des tiers ;</li>
                <li>La reproduction de courts extraits à des fins d&apos;information, de critique ou de revue, dans le respect des dispositions de l&apos;article L.122-5 du Code de la propriété intellectuelle.</li>
              </ul>
              <p>
                Toute exploitation non autorisée du site ou de l&apos;un quelconque des éléments qu&apos;il contient sera considérée
                comme constitutive d&apos;une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et
                suivants du Code de la propriété intellectuelle.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 4. Responsabilité */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                4. Responsabilité
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                RUNWEEK MEDIA s&apos;efforce de fournir des informations aussi précises que possible sur le site
                runweek.fr. Toutefois, la société ne pourra être tenue responsable des omissions, des inexactitudes
                et des carences dans la mise à jour, qu&apos;elles soient de son fait ou du fait des tiers partenaires qui lui
                fournissent ces informations.
              </p>
              <p>
                Les informations et contenus publiés sur le site (articles, récits, conseils, entraînements) sont fournis à titre
                indicatif et informatif. Ils ne constituent en aucun cas un avis médical, nutritionnel ou d&apos;entraînement formel.
                L&apos;utilisateur est invité à consulter un professionnel qualifié pour tout programme d&apos;entraînement
                ou décision engageant sa santé.
              </p>
              <p>
                RUNWEEK MEDIA ne saurait être tenue responsable des éventuels dommages directs ou indirects
                résultant de l&apos;accès ou de l&apos;utilisation du site, y compris l&apos;indisponibilité, les erreurs ou tout défaut
                de fonctionnement.
              </p>
              <p>
                Le site runweek.fr peut contenir des liens hypertextes vers d&apos;autres sites internet. RUNWEEK MEDIA
                ne dispose d&apos;aucun moyen de contrôle du contenu de ces sites tiers et n&apos;assume aucune
                responsabilité quant à leur contenu.
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 5. Données personnelles */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                5. Données personnelles
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                RUNWEEK MEDIA s&apos;engage à respecter la confidentialité des données personnelles collectées
                sur le site runweek.fr, conformément au Règlement Général sur la Protection des Données (RGPD –
                Règlement UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée.
              </p>
              <p>
                Pour en savoir plus sur la collecte, le traitement et la protection de vos données personnelles,
                veuillez consulter notre{" "}
                <a href="/politique-de-confidentialite" className="text-primary hover:underline font-medium">
                  Politique de Confidentialité
                </a>
                .
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 6. Cookies */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Cookie className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                6. Cookies
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Le site runweek.fr utilise des cookies pour améliorer l&apos;expérience de l&apos;utilisateur,
                mesurer l&apos;audience et proposer des contenus personnalisés. Les cookies sont de petits fichiers
                texte stockés sur le terminal de l&apos;utilisateur lors de la visite du site.
              </p>
              <p>
                Vous pouvez gérer vos préférences de cookies via la bannière de cookies présente sur le site
                ou en modifiant les paramètres de votre navigateur. Pour plus d&apos;informations sur l&apos;utilisation
                des cookies, veuillez vous référer à notre{" "}
                <a href="/politique-cookies" className="text-primary hover:underline font-medium">
                  Politique de Cookies
                </a>
                .
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 7. Droit applicable */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                7. Droit applicable
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige, et après tentative
                de recherche d&apos;une solution amiable, compétence est attribuée aux tribunaux français compétents,
                conformément aux règles de compétence en vigueur.
              </p>
              <p>
                Tout utilisateur du site runweek.fr reconnaît avoir pris connaissance des présentes mentions
                légales et s&apos;engage à les respecter.
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
