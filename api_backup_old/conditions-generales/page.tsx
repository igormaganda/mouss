"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  FileText,
  Wrench,
  UserCircle,
  AlertTriangle,
  Shield,
  Lock,
  Scale,
  Gavel,
  RefreshCw,
} from "lucide-react";

export default function ConditionsGeneralesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            &larr; Retour à l&apos;accueil
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-muted-foreground mb-2">
            Dernière mise à jour : janvier 2025
          </p>
          <p className="text-muted-foreground mb-8">
            Les présentes conditions générales d&apos;utilisation (ci-après
            &laquo; CGU &raquo;) régissent l&apos;utilisation du site
            100jourspourentreprendre.fr et de l&apos;ensemble des services proposés
            par la société GEORGES ERNEST CONSEIL. En accédant au site et/ou en
            utilisant les services, vous acceptez sans réserve les présentes CGU.
          </p>

          {/* Article 1 - Objet */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Article 1 — Objet
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Les présentes CGU ont pour objet de définir les modalités et
              conditions d&apos;utilisation du site 100jourspourentreprendre.fr,
              plateforme dédiée à l&apos;accompagnement des entrepreneurs dans la
              création et le développement de leur activité. Elles définissent
              également les droits et obligations des parties : l&apos;éditeur
              (GEORGES ERNEST CONSEIL) et l&apos;utilisateur.
            </p>
          </section>

          {/* Article 2 - Services */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Article 2 — Services proposés
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Le site 100jourspourentreprendre.fr propose les services suivants :
            </p>
            <Card>
              <CardContent className="p-5">
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <div>
                      <strong className="text-foreground">Audit de lancement gratuit</strong> :
                      analyse du projet entrepreneurial et recommandations personnalisées.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <div>
                      <strong className="text-foreground">Guides et ressources</strong> :
                      articles, tutoriels et guides pratiques sur la création d&apos;entreprise,
                      la gestion, la comptabilité, le juridique, etc.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <div>
                      <strong className="text-foreground">Outils et comparatifs</strong> :
                      comparaison de solutions professionnelles (banque, comptabilité, assurance,
                      juridique) adaptées à chaque profil entrepreneurial.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <div>
                      <strong className="text-foreground">Tableau de bord et suivi de progression</strong> :
                      suivi des étapes de création d&apos;entreprise et planification des tâches.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <div>
                      <strong className="text-foreground">Abonnements payants</strong> :
                      packs d&apos;accompagnement premium incluant des fonctionnalités avancées
                      et un support personnalisé.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              L&apos;éditeur se réserve le droit de modifier, suspendre ou
              interrompre tout ou partie des services, à tout moment, sans
              préavis ni indemnité.
            </p>
          </section>

          {/* Article 3 - Inscription */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Article 3 — Inscription et comptes utilisateurs
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                L&apos;accès à certaines fonctionnalités du site nécessite la création
                d&apos;un compte utilisateur. L&apos;inscription est ouverte à toute personne
                physique majeure capable juridiquement.
              </p>
              <p>
                Lors de l&apos;inscription, l&apos;utilisateur s&apos;engage à fournir des
                informations exactes, complètes et à jour. L&apos;utilisateur est seul
                responsable de la confidentialité de ses identifiants de connexion.
              </p>
              <p>
                L&apos;utilisateur s&apos;interdit de :
              </p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>Créer plusieurs comptes pour une même personne</li>
                <li>Utiliser un compte appartenant à un tiers</li>
                <li>Céder, louer ou transférer son compte à un tiers</li>
                <li>Fournir de fausses informations lors de l&apos;inscription</li>
              </ul>
              <p>
                L&apos;éditeur se réserve le droit de suspendre ou supprimer tout
                compte en cas de non-respect des présentes CGU.
              </p>
            </div>
          </section>

          {/* Article 4 - Responsabilités utilisateur */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Article 4 — Responsabilités de l&apos;utilisateur
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                L&apos;utilisateur s&apos;engage à utiliser le site et les services de manière
                conforme aux lois et réglementations en vigueur, ainsi qu&apos;aux bonnes
                pratiques.
              </p>
              <p>L&apos;utilisateur s&apos;interdit notamment de :</p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>Utiliser le site à des fins illicites, frauduleuses ou portant atteinte aux droits de tiers</li>
                <li>Tenter de porter atteinte au bon fonctionnement du site</li>
                <li>Collecter ou extraire des données du site sans autorisation</li>
                <li>Diffuser des contenus illicites, diffamatoires, injurieux ou contraires à l&apos;ordre public</li>
                <li>Se livrer à des activités de harcèlement, spam ou phishing</li>
                <li>Contourner les mesures de sécurité mises en place</li>
              </ul>
            </div>
          </section>

          {/* Article 5 - Propriété intellectuelle */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Article 5 — Propriété intellectuelle
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                L&apos;ensemble des contenus du site (textes, images, graphismes, logos,
                icônes, vidéos, marques, logiciels, bases de données, etc.) sont la
                propriété exclusive de GEORGES ERNEST CONSEIL ou de ses partenaires et
                sont protégés par les lois françaises et internationales relatives à la
                propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, distribution ou
                exploitation, même partielle, de tout ou partie des éléments du site,
                par quelque procédé que ce soit, sans l&apos;autorisation écrite préalable
                de l&apos;éditeur, est strictement interdite et constitue une contrefaçon
                sanctionnée par le Code de la Propriété Intellectuelle.
              </p>
              <p>
                L&apos;utilisateur dispose d&apos;un droit d&apos;usage personnel et non exclusif des
                contenus du site, à des fins privées et non commerciales.
              </p>
            </div>
          </section>

          {/* Article 6 - Données personnelles */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Article 6 — Données personnelles
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le traitement des données personnelles est régi par notre{" "}
              <Link href="/politique-de-confidentialite" className="text-primary hover:underline font-medium">
                Politique de confidentialité
              </Link>
              , qui décrit en détail les données collectées, les finalités du
              traitement, les bases légales, les durées de conservation et les
              droits des personnes concernées.
            </p>
          </section>

          {/* Article 7 - Limitation de responsabilité */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Article 7 — Limitation de responsabilité
            </h2>
            <Card>
              <CardContent className="p-5">
                <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                  <p>
                    <strong className="text-foreground">Contenus informatifs</strong> : Les informations
                    et contenus publiés sur le site sont fournis à titre indicatif et ne sauraient
                    constituer un conseil juridique, comptable, fiscal ou financier. L&apos;utilisateur
                    est invité à consulter un professionnel qualifié pour toute décision importante.
                  </p>
                  <p>
                    <strong className="text-foreground">Disponibilité du service</strong> : L&apos;éditeur
                    s&apos;efforce d&apos;assurer la disponibilité continue du site, mais ne saurait être tenu
                    pour responsable des interruptions, qu&apos;elles soient dues à des opérations de
                    maintenance, des mises à jour, des pannes techniques ou des cas de force majeure.
                  </p>
                  <p>
                    <strong className="text-foreground">Liens tiers</strong> : Le site peut contenir des
                    liens vers des sites tiers. L&apos;éditeur ne saurait être tenu responsable du contenu
                    de ces sites, de leurs pratiques en matière de protection des données ou de leur
                    disponibilité.
                  </p>
                  <p>
                    <strong className="text-foreground">Résultats</strong> : L&apos;éditeur ne garantit
                    aucun résultat spécifique quant à l&apos;utilisation des outils, guides et services
                    proposés. Le succès de la création d&apos;entreprise dépend de nombreux facteurs
                    extérieurs au contrôle de l&apos;éditeur.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Article 8 - Force majeure */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              Article 8 — Force majeure
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Aucune des parties ne pourra être tenue responsable en cas de
              manquement à ses obligations découlant des présentes CGU, lorsque
              ce manquement résulte d&apos;un cas de force majeure tel que défini
              par l&apos;article 1218 du Code civil (catastrophe naturelle, épidémie,
              guerre, grève générale, interruption des réseaux de télécommunication,
              etc.).
            </p>
          </section>

          {/* Article 9 - Modifications */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Article 9 — Modifications
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              L&apos;éditeur se réserve le droit de modifier les présentes CGU à tout
              moment. Les modifications seront publiées sur cette page avec mise à
              jour de la date de dernière modification. L&apos;utilisateur est invité
              à consulter régulièrement cette page. La poursuite de l&apos;utilisation
              du site après la publication des modifications vaut acceptation des
              nouvelles CGU.
            </p>
          </section>

          {/* Article 10 - Droit applicable */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Article 10 — Droit applicable et juridiction compétente
            </h2>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Les présentes CGU sont régies par le droit français. En cas de
                  litige relatif à leur interprétation ou à leur exécution, les
                  parties s&apos;efforceront de trouver une solution amiable. À défaut
                  d&apos;accord amiable, le litige sera soumis à la compétence exclusive
                  du <strong className="text-foreground">Tribunal de commerce d&apos;Évry</strong>,
                  nonobstant les dispositions relatives à la pluralité de défendeurs ou à
                  l&apos;appel en garantie.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Navigation */}
          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <Link href="/mentions-legales" className="text-sm text-primary hover:underline">
              Mentions légales
            </Link>
            <span className="text-sm text-muted-foreground">|</span>
            <Link href="/politique-de-confidentialite" className="text-sm text-primary hover:underline">
              Politique de confidentialité
            </Link>
            <span className="text-sm text-muted-foreground">|</span>
            <Link href="/politique-cookies" className="text-sm text-primary hover:underline">
              Politique de cookies
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
