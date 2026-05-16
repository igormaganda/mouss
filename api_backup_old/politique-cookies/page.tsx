"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Cookie, Settings, Shield, BarChart3, Megaphone, Clock, RefreshCw, Mail } from "lucide-react";

export default function PolitiqueCookiesPage() {
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
            ← Retour à l&apos;accueil
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Politique de Cookies
          </h1>
          <p className="text-muted-foreground mb-2">
            Dernière mise à jour : 13 mai 2026
          </p>
          <p className="text-muted-foreground mb-8">
            La présente politique de cookies a pour but de vous informer de manière
            transparente sur les cookies utilisés sur le site
            runweek.fr, leurs finalités et les moyens dont vous
            disposez pour les gérer, conformément à la recommandation CNIL et à
            la directive ePrivacy.
          </p>

          {/* 1. Qu'est-ce qu'un cookie */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              1. Qu&apos;est-ce qu&apos;un cookie ?
            </h2>
            <Card>
              <CardContent className="p-5">
                <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                  <p>
                    Un cookie est un petit fichier texte déposé sur votre appareil
                    (ordinateur, tablette, smartphone) lors de votre visite sur un
                    site web. Il permet au site de mémoriser des informations
                    relatives à votre visite (préférences d&apos;affichage, identifiants
                    de session, etc.).
                  </p>
                  <p>
                    Les cookies peuvent être déposés par le site que vous visitez
                    (cookies internes) ou par des services tiers (cookies externes).
                    Certains cookies sont indispensables au fonctionnement du site,
                    d&apos;autres permettent d&apos;en améliorer les fonctionnalités ou de
                    mesurer l&apos;audience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 2. Types de cookies */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              2. Types de cookies utilisés
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-2 rounded-lg bg-primary/10 shrink-0">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        Cookies strictement nécessaires
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Ces cookies sont indispensables au bon fonctionnement du site.
                        Ils permettent notamment la navigation, l&apos;authentification,
                        la sécurité et l&apos;accès aux fonctionnalités de base. Ils ne
                        nécessitent pas votre consentement et ne peuvent pas être
                        désactivés.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-2 rounded-lg bg-primary/10 shrink-0">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        Cookies analytiques
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Ces cookies nous permettent de collecter des informations
                        anonymisées sur la façon dont les visiteurs utilisent le site.
                        Ils nous aident à comprendre le trafic, les pages les plus
                        visitées et à améliorer l&apos;expérience utilisateur. Ils sont
                        soumis à votre consentement.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-2 rounded-lg bg-primary/10 shrink-0">
                      <Megaphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        Cookies marketing
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Ces cookies sont utilisés pour vous proposer des contenus et
                        publicités adaptés à vos centres d&apos;intérêt. Ils peuvent
                        également être utilisés pour mesurer l&apos;efficacité des
                        campagnes publicitaires. Ils sont soumis à votre consentement.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 3. Liste des cookies */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              3. Liste des cookies utilisés
            </h2>

            <h3 className="text-base font-semibold mb-3">Cookies strictement nécessaires</h3>
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Finalité</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Durée</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Fournisseur</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 font-mono text-xs">connect.sid</td>
                        <td className="py-3 px-4">Authentification et maintien de session</td>
                        <td className="py-3 px-4">Session</td>
                        <td className="py-3 px-4">RUNWEEK MEDIA</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 font-mono text-xs">cookie-consent</td>
                        <td className="py-3 px-4">Mémorisation du consentement aux cookies</td>
                        <td className="py-3 px-4">13 mois</td>
                        <td className="py-3 px-4">RUNWEEK MEDIA</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-xs">csrf_token</td>
                        <td className="py-3 px-4">Protection CSRF</td>
                        <td className="py-3 px-4">Session</td>
                        <td className="py-3 px-4">RUNWEEK MEDIA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-base font-semibold mb-3">Cookies analytiques</h3>
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Finalité</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Durée</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Fournisseur</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 font-mono text-xs">_ga</td>
                        <td className="py-3 px-4">Identifier les visiteurs uniques</td>
                        <td className="py-3 px-4">13 mois</td>
                        <td className="py-3 px-4">Google Analytics</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-xs">_ga_*</td>
                        <td className="py-3 px-4">Maintenir l&apos;état de la session</td>
                        <td className="py-3 px-4">13 mois</td>
                        <td className="py-3 px-4">Google Analytics</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-base font-semibold mb-3">Cookies marketing</h3>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Finalité</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Durée</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Fournisseur</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 font-mono text-xs">_fbp</td>
                        <td className="py-3 px-4">Mesure des performances publicitaires</td>
                        <td className="py-3 px-4">3 mois</td>
                        <td className="py-3 px-4">Meta (Facebook)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-xs">_gcl_au</td>
                        <td className="py-3 px-4">Lier les visiteurs aux conversions Google Ads</td>
                        <td className="py-3 px-4">3 mois</td>
                        <td className="py-3 px-4">Google Ads</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 4. Gestion des cookies */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              4. Gestion des cookies
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Vous disposez de plusieurs moyens pour gérer vos préférences en
              matière de cookies :
            </p>

            <Card className="mb-4">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-foreground mb-3">
                  a) Via la bannière de consentement
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Lors de votre première visite sur notre site, une bannière de
                  consentement vous permet de tout accepter ou de personnaliser vos
                  choix catégorie par catégorie. Vous pouvez modifier vos préférences
                  à tout moment en cliquant sur le bouton cookie situé en bas à
                  gauche de l&apos;écran.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-foreground mb-3">
                  b) Via les paramètres de votre navigateur
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Vous pouvez également gérer ou supprimer les cookies directement
                  dans les paramètres de votre navigateur. Voici les liens vers les
                  pages d&apos;aide des navigateurs les plus courants :
                </p>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>
                    <a
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Safari
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Microsoft Edge
                    </a>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  <strong className="text-foreground">Attention</strong> : la
                  désactivation de certains cookies peut affecter le bon
                  fonctionnement du site.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 5. Consentement */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              5. Recueil du consentement
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                Conformément à la réglementation en vigueur, votre consentement
                est requis avant le dépôt de cookies analytiques et marketing sur
                votre terminal.
              </p>
              <p>
                Le consentement est recueilli via notre bannière de cookies lors
                de votre première visite. Vous pouvez à tout moment modifier ou
                retirer votre consentement en cliquant sur le bouton cookie en bas
                à gauche de l&apos;écran ou en modifiant les paramètres de votre
                navigateur.
              </p>
              <p>
                Les cookies strictement nécessaires ne nécessitent pas de
                consentement, car ils sont indispensables au fonctionnement du
                site.
              </p>
            </div>
          </section>

          {/* 6. Modifications */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              6. Modifications
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nous nous réservons le droit de modifier la présente politique de
              cookies à tout moment, notamment en cas de mise à jour des cookies
              utilisés ou de changement de prestataires. Toute modification sera
              publiée sur cette page avec mise à jour de la date de dernière
              modification.
            </p>
          </section>

          {/* 7. Contact */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              7. Contact
            </h2>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pour toute question relative à la présente politique de cookies ou
                  pour exercer vos droits, vous pouvez nous contacter :
                </p>
                <ul className="text-sm text-muted-foreground mt-3 space-y-2">
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <a
                      href="mailto:contact@runweek.fr"
                      className="text-primary hover:underline"
                    >
                      contact@runweek.fr
                    </a>
                  </li>
                </ul>
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
            <Link href="/cgu" className="text-sm text-primary hover:underline">
              Conditions générales d&apos;utilisation
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
