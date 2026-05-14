'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Users,
  Briefcase,
  Heart,
  Target,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Award,
  ChevronRight,
  Star,
  Quote,
  Send,
  Globe,
  Scale,
  Cookie,
  FileText,
  BookOpen,
  GraduationCap,
  Code2,
  Megaphone,
  BarChart3,
  PenTool,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

/* ────────────────────────────────────────────
   Shared: Page wrapper with back button & nav
   ──────────────────────────────────────────── */

function PageShell({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  const navigate = useAppStore((s) => s.navigate)
  const goBack = useAppStore((s) => s.goBack)

  return (
    <main className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" onClick={goBack} className="shrink-0">
            <ArrowLeft className="mr-1.5 size-4" />
            Retour
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span className="text-2xl">📬</span>
            <span>
              La Lettre<span className="text-primary"> Business</span>
            </span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 ${className}`}>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <Separator className="mb-8" />
        {children}
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 La Lettre Business &mdash; ARLIS. Tous droits réservés.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <button onClick={() => navigate('legal/mentions')} className="hover:text-foreground">
                Mentions légales
              </button>
              <button onClick={() => navigate('legal/privacy')} className="hover:text-foreground">
                Confidentialité
              </button>
              <button onClick={() => navigate('legal/cookies')} className="hover:text-foreground">
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ────────────────────────────────────────────
   1. MENTIONS LÉGALES
   ──────────────────────────────────────────── */

function LegalMentions() {
  return (
    <PageShell title="Mentions Légales">
      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Building2 className="size-5 text-primary" />
            Éditeur du site
          </h2>
          <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-6">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-3 font-medium text-muted-foreground w-48">Raison sociale</td>
                  <td className="py-3 font-semibold">ARLIS</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3 font-medium text-muted-foreground">Forme juridique</td>
                  <td className="py-3">SARL au capital de 50 000 €</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3 font-medium text-muted-foreground">SIREN</td>
                  <td className="py-3 font-mono">827 585 910</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3 font-medium text-muted-foreground">Siège social</td>
                  <td className="py-3">7 Avenue de la Redoute, 92390 Villeneuve-la-Garenne</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3 font-medium text-muted-foreground">Gérante</td>
                  <td className="py-3">Mme Elisabeth DE OLIVEIRA LOPES</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3 font-medium text-muted-foreground">RCS</td>
                  <td className="py-3">Nanterre</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3 font-medium text-muted-foreground">Code NAF</td>
                  <td className="py-3">4618Z &mdash; Intermédiaires spécialisés dans le commerce</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-muted-foreground">E-mail</td>
                  <td className="py-3">
                    <a href="mailto:contact@lalettrebusiness.com" className="text-primary hover:underline">
                      contact@lalettrebusiness.com
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Globe className="size-5 text-primary" />
            Hébergement
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Le site <strong>lalettrebusiness.com</strong> est hébergé par :{' '}
            <span className="italic">À compléter &mdash; Les informations relatives à l&apos;hébergeur
            seront ajoutées conformément aux obligations de l&apos;article 6 de la loi n° 2004-575
            du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN).</span>
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="size-5 text-primary" />
            Propriété intellectuelle
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            L&apos;ensemble des éléments composant le site lalettrebusiness.com (textes, graphismes,
            logos, icônes, sons, logiciels, etc.) sont la propriété exclusive d&apos;ARLIS ou de ses
            partenaires et sont protégés par les lois françaises et internationales relatives à la
            propriété intellectuelle. Toute reproduction, représentation, modification, publication,
            adaptation, totale ou partielle, des éléments du site, quel que soit le moyen ou le
            procédé utilisé, est interdite sans l&apos;autorisation écrite préalable d&apos;ARLIS.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Toute exploitation non autorisée du site ou de l&apos;un quelconque des éléments qu&apos;il
            contient sera considérée comme constitutive d&apos;une contrefaçon et poursuivie conformément
            aux dispositions des articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Scale className="size-5 text-primary" />
            Responsabilité
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            ARLIS s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées
            sur son site. Toutefois, elle ne peut garantir l&apos;exactitude, la précision ou
            l&apos;exhaustivité des informations mises à disposition sur le site. En conséquence, ARLIS
            décline toute responsabilité pour toute imprécision, inexactitude ou omission portant
            sur des informations disponibles sur le site, ainsi que pour tout dommage résultant d&apos;une
            intrusion frauduleuse d&apos;un tiers ayant entraîné une modification des informations mises
            à disposition sur le site.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <FileText className="size-5 text-primary" />
            CNIL &amp; Données personnelles
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Le traitement des données personnelles effectué sur le site lalettrebusiness.com est
            déclaré auprès de la Commission Nationale de l&apos;Informatique et des Libertés (CNIL)
            conformément à la loi n° 78-17 du 6 janvier 1978 relative à l&apos;informatique, aux
            fichiers et aux libertés, et au Règlement Général sur la Protection des Données (RGPD)
            n° 2016/679 du 27 avril 2016.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Conformément à la loi Informatique et Libertés et au RGPD, chaque utilisateur dispose
            d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition aux données
            personnelles le concernant. Pour exercer ces droits, veuillez contacter :{' '}
            <a href="mailto:contact@lalettrebusiness.com" className="text-primary hover:underline">
              contact@lalettrebusiness.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <BookOpen className="size-5 text-primary" />
            Droit applicable
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Les présentes mentions légales sont régies par le droit français. En cas de litige, et
            après tentative de recherche d&apos;une solution amiable, compétence est attribuée aux
            tribunaux de Nanterre, ressort du siège social d&apos;ARLIS.
          </p>
        </section>
      </div>
    </PageShell>
  )
}

/* ────────────────────────────────────────────
   2. CGV
   ──────────────────────────────────────────── */

function LegalCGV() {
  return (
    <PageShell title="Conditions Générales de Vente">
      <div className="prose prose-slate max-w-none space-y-8">
        <p className="text-muted-foreground italic">
          Dernière mise à jour : 1er janvier 2026
        </p>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Scale className="size-5 text-primary" />
            Article 1 &mdash; Objet
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles
            entre la société ARLIS, SARL au capital de 50 000 €, immatriculée au RCS de Nanterre
            sous le numéro 827 585 910, dont le siège social est situé au 7 Avenue de la Redoute,
            92390 Villeneuve-la-Garenne (ci-après dénommée &laquo; La Lettre Business &raquo; ou
            &laquo; l&apos;Éditeur &raquo;), et toute personne physique ou morale souhaitant
            souscrire aux services de diffusion d&apos;annonces commerciales par voie de newsletters
            sectorielles (ci-après dénommée &laquo; le Client &raquo;).
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Briefcase className="size-5 text-primary" />
            Article 2 &mdash; Services proposés
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            La Lettre Business propose une plateforme SaaS permettant aux entreprises de diffuser des
            annonces commerciales ciblées auprès d&apos;une base de contacts B2B qualifiés via des
            newsletters sectorielles et régionales. Les services comprennent :
          </p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              <span><strong>Bus Mailing</strong> : diffusion ponctuelle d&apos;une annonce dans la newsletter de votre choix.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              <span><strong>Abonnement Standard</strong> : jusqu&apos;à 4 annonces par mois avec analytics avancés.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              <span><strong>Abonnement Premium</strong> : annonces illimitées, conseiller dédié, accès API et branding personnalisé.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Users className="size-5 text-primary" />
            Article 3 &mdash; Inscription et compte
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Le Client doit créer un compte sur la plateforme lalettrebusiness.com afin de bénéficier
            des services. L&apos;inscription implique l&apos;acceptation intégrale des présentes CGV.
            Le Client s&apos;engage à fournir des informations exactes, complètes et à jour lors de
            son inscription et à les maintenir actualisées. L&apos;Éditeur se réserve le droit de
            suspendre ou clôturer tout compte présentant des informations inexactes ou trompeuses.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <FileText className="size-5 text-primary" />
            Article 4 &mdash; Annonces et contenus
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Le Client est seul responsable du contenu de ses annonces. Les annonces doivent respecter
            la législation française en vigueur, notamment en matière de publicité, de droit de la
            consommation et de propriété intellectuelle. L&apos;Éditeur se réserve le droit de refuser
            ou de supprimer toute annonce ne respectant pas ces conditions, sans préavis ni
            indemnité. Sont notamment interdits :
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Les contenus illicites, diffamatoires, injurieux ou contraires à l&apos;ordre public</li>
            <li>Les contenus trompeurs ou portant atteinte aux droits des tiers</li>
            <li>Les contenus à caractère discriminatoire, raciste ou xénophobe</li>
            <li>Les offres de produits ou services illégaux</li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Target className="size-5 text-primary" />
            Article 5 &mdash; Tarifs et paiement
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Les tarifs sont indiqués en euros toutes taxes comprises (TTC) sur le site
            lalettrebusiness.com. L&apos;Éditeur se réserve le droit de modifier ses tarifs à tout
            moment, les modifications prenant effet à compter de la prochaine facturation. Les
            abonnements sont facturés mensuellement à l&apos;avance. Le paiement s&apos;effectue par carte
            bancaire via un prestataire de paiement sécurisé.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Conformément à l&apos;article L.221-18 du Code de la consommation, le Client dispose d&apos;un
            délai de 14 jours à compter de la souscription pour exercer son droit de rétractation,
            sauf si le service a été intégralement consommé avant l&apos;expiration de ce délai.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="size-5 text-primary" />
            Article 6 &mdash; Conformité RGPD
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            La Lettre Business s&apos;engage à respecter le Règlement Général sur la Protection des
            Données (RGPD). Les données de contact utilisées pour la diffusion des newsletters
            sont collectées conformément aux exigences légales, avec le consentement explicite
            des destinataires. Chaque newsletter intègre un lien de désinscription fonctionnel.
            Le Client garantit que les données fournies lors de la création de son compte sont
            exactes et qu&apos;il dispose des droits nécessaires pour les transmettre.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Scale className="size-5 text-primary" />
            Article 7 &mdash; Responsabilité
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            L&apos;Éditeur s&apos;engage à fournir les services avec diligence et selon les règles de l&apos;art.
            Toutefois, il ne saurait être tenu responsable des résultats commerciaux obtenus par le
            Client suite à la diffusion de ses annonces. Les taux d&apos;ouverture, de clic et de
            conversion communiqués sont des statistiques indicatives et ne constituent en aucun cas
            une garantie de résultat. L&apos;Éditeur ne saurait être tenu responsable des interruptions
            temporaires du service dues à des opérations de maintenance ou à des cas de force majeure.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <BookOpen className="size-5 text-primary" />
            Article 8 &mdash; Résiliation
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Chaque partie peut résilier l&apos;abonnement à tout moment, sans motif, moyennant un
            préavis de 30 jours. La résiliation prend effet à l&apos;échéance de la période de
            facturation en cours. Le Client peut résilier directement depuis son espace personnel
            sur la plateforme. En cas de non-paiement, l&apos;Éditeur se réserve le droit de suspendre
            l&apos;accès aux services sans préavis.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Globe className="size-5 text-primary" />
            Article 9 &mdash; Droit applicable et juridiction compétente
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Les présentes CGV sont soumises au droit français. Tout litige relatif à leur
            interprétation ou à leur exécution sera soumis, à défaut de résolution amiable, aux
            tribunaux compétents du ressort du tribunal judiciaire de Nanterre.
          </p>
        </section>
      </div>
    </PageShell>
  )
}

/* ────────────────────────────────────────────
   3. POLITIQUE DE CONFIDENTIALITÉ
   ──────────────────────────────────────────── */

function LegalPrivacy() {
  return (
    <PageShell title="Politique de Confidentialité">
      <div className="prose prose-slate max-w-none space-y-8">
        <p className="text-muted-foreground italic">
          Dernière mise à jour : 1er janvier 2026
        </p>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="size-5 text-primary" />
            Introduction
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            La Lettre Business (ARLIS) s&apos;engage à protéger la vie privée de ses utilisateurs.
            La présente Politique de Confidentialité décrit les types de données personnelles que
            nous collectons, les raisons pour lesquelles nous les collectons, comment nous les
            utilisons et les droits dont vous disposez conformément au Règlement Général sur la
            Protection des Données (RGPD &mdash; Règlement UE 2016/679) et à la loi Informatique
            et Libertés du 6 janvier 1978 modifiée.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Users className="size-5 text-primary" />
            Données personnelles collectées
          </h2>
          <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-6">
            <h3 className="mb-3 font-semibold">Données d&apos;identification du compte</h3>
            <p className="text-sm text-muted-foreground">
              Nom, prénom, adresse e-mail, nom de l&apos;entreprise, numéro de téléphone, poste occupé,
              taille de l&apos;entreprise, secteur d&apos;activité, code postal et région.
            </p>
            <h3 className="mb-3 mt-4 font-semibold">Données de facturation</h3>
            <p className="text-sm text-muted-foreground">
              Coordonnées de facturation, moyen de paiement utilisé (sans stockage du numéro de carte
              bancaire complet), historique des transactions.
            </p>
            <h3 className="mb-3 mt-4 font-semibold">Données d&apos;utilisation</h3>
            <p className="text-sm text-muted-foreground">
              Annonces créées, newsletters sélectionnées, statistiques de performance, historique
              de connexion, adresse IP, type de navigateur, pages visitées.
            </p>
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Target className="size-5 text-primary" />
            Finalités du traitement
          </h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              <span>Gestion du compte utilisateur et fourniture des services souscrits</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              <span>Diffusion des annonces dans les newsletters sectorielles et régionales</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              <span>Facturation et gestion administrative</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              <span>Analyse statistique anonymisée pour l&apos;amélioration des services</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              <span>Communication relative aux services (nouvelles fonctionnalités, maintenance)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              <span>Réponse aux demandes de support et de contact</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Clock className="size-5 text-primary" />
            Durée de conservation
          </h2>
          <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left">
                  <th className="pb-2 font-semibold">Type de données</th>
                  <th className="pb-2 font-semibold">Durée de conservation</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/40">
                  <td className="py-3">Données de compte</td>
                  <td className="py-3">Durée de la relation contractuelle + 3 ans</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3">Données de facturation</td>
                  <td className="py-3">10 ans (obligation légale)</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-3">Données d&apos;utilisation</td>
                  <td className="py-3">13 mois maximum</td>
                </tr>
                <tr>
                  <td className="py-3">Cookies</td>
                  <td className="py-3">13 mois maximum (sauf cookies essentiels)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <FileText className="size-5 text-primary" />
            Vos droits
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits
            suivants :
          </p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-1 size-4 shrink-0 text-primary" />
              <span><strong>Droit d&apos;accès</strong> : obtenir la confirmation que vos données sont traitées et en recevoir une copie.</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-1 size-4 shrink-0 text-primary" />
              <span><strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes.</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-1 size-4 shrink-0 text-primary" />
              <span><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données dans les conditions prévues par la loi.</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-1 size-4 shrink-0 text-primary" />
              <span><strong>Droit à la limitation</strong> : restreindre le traitement de vos données.</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-1 size-4 shrink-0 text-primary" />
              <span><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et couramment utilisé.</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-1 size-4 shrink-0 text-primary" />
              <span><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données pour des motifs légitimes.</span>
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Pour exercer vos droits, contactez-nous à :{' '}
            <a href="mailto:contact@lalettrebusiness.com" className="text-primary hover:underline">
              contact@lalettrebusiness.com
            </a>
            . Vous pouvez également adresser une réclamation auprès de la CNIL :{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              www.cnil.fr
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Building2 className="size-5 text-primary" />
            Sécurité des données
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            La Lettre Business met en œuvre des mesures techniques et organisationnelles appropriées
            pour protéger vos données personnelles contre tout accès non autorisé, toute modification,
            divulgation ou destruction. Ces mesures comprennent le chiffrement SSL/TLS, la gestion
            des accès, la sauvegarde régulière des données et la surveillance continue de la sécurité.
          </p>
        </section>
      </div>
    </PageShell>
  )
}

/* ────────────────────────────────────────────
   4. POLITIQUE COOKIES
   ──────────────────────────────────────────── */

function LegalCookies() {
  return (
    <PageShell title="Politique de Cookies">
      <div className="prose prose-slate max-w-none space-y-8">
        <p className="text-muted-foreground italic">
          Dernière mise à jour : 1er janvier 2026
        </p>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Cookie className="size-5 text-primary" />
            Qu&apos;est-ce qu&apos;un cookie ?
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette,
            smartphone) lors de votre visite sur un site web. Il permet au site de mémoriser des
            informations relatives à votre visite (préférences de langue, identifiants de session,
            etc.) pour faciliter la navigation et améliorer l&apos;expérience utilisateur.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <FileText className="size-5 text-primary" />
            Types de cookies utilisés
          </h2>

          <div className="mt-6 space-y-4">
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  <CardTitle className="text-base">Cookies strictement nécessaires</CardTitle>
                </div>
                <CardDescription>
                  Ces cookies sont indispensables au bon fonctionnement du site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ils permettent notamment la navigation, l&apos;authentification et la sécurité du site.
                  Ils ne nécessitent pas votre consentement. Durée de vie maximale : 13 mois.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">llb_session</Badge>
                  <Badge variant="secondary">llb_auth</Badge>
                  <Badge variant="secondary">XSRF-TOKEN</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-5 text-amber-500" />
                  <CardTitle className="text-base">Cookies analytiques</CardTitle>
                </div>
                <CardDescription>
                  Ces cookies nous aident à comprendre comment les visiteurs utilisent le site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ils permettent de collecter des informations anonymisées sur le nombre de visiteurs,
                  les pages consultées, les sources de trafic et les taux de rebond. Ces données nous
                  aident à améliorer la performance et le contenu du site. Ces cookies sont soumis à
                  votre consentement.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">_ga</Badge>
                  <Badge variant="outline">_ga_*</Badge>
                  <Badge variant="outline">_gid</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Megaphone className="size-5 text-orange-500" />
                  <CardTitle className="text-base">Cookies marketing</CardTitle>
                </div>
                <CardDescription>
                  Ces cookies sont utilisés pour diffuser des publicités pertinentes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ils peuvent être déposés par des partenaires publicitaires et permettent de créer
                  des profils d&apos;intérêts pour vous afficher des annonces adaptées. Ces cookies
                  nécessitent votre consentement explicite.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">_fbp</Badge>
                  <Badge variant="outline">_gcl_au</Badge>
                  <Badge variant="outline">ads_prefs</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Users className="size-5 text-primary" />
            Gestion de vos préférences
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Vous pouvez à tout moment modifier vos préférences en matière de cookies via le bandeau
            de consentement affiché lors de votre première visite. Vous pouvez également gérer vos
            cookies directement dans les paramètres de votre navigateur :
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-muted-foreground">
            <li>
              <strong>Chrome</strong> : Paramètres &gt; Confidentialité et sécurité &gt; Cookies et autres
              données de sites
            </li>
            <li>
              <strong>Firefox</strong> : Paramètres &gt; Vie privée &amp; sécurité &gt; Cookies et données de
              site
            </li>
            <li>
              <strong>Safari</strong> : Préférences &gt; Confidentialité &gt; Cookies et données de sites web
            </li>
            <li>
              <strong>Edge</strong> : Paramètres &gt; Cookies et autorisations de sites &gt; Gérer et supprimer
              les cookies
            </li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Scale className="size-5 text-primary" />
            Base légale
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Les cookies strictement nécessaires sont déposés sur la base de notre intérêt légitime à
            fournir un service fonctionnel et sécurisé. Les cookies analytiques et marketing sont
            déposés après recueil de votre consentement exprès, conformément à l&apos;article 82 de la
            loi n° 78-17 du 6 janvier 1978 modifiée et à la recommandation CNIL relative aux cookies.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Pour toute question relative à notre politique de cookies, contactez-nous à :{' '}
            <a href="mailto:contact@lalettrebusiness.com" className="text-primary hover:underline">
              contact@lalettrebusiness.com
            </a>
            .
          </p>
        </section>
      </div>
    </PageShell>
  )
}

/* ────────────────────────────────────────────
   5. À PROPOS
   ──────────────────────────────────────────── */

function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Simplicité',
      description: 'Des outils intuitifs pensés pour les PME, sans jargon technique ni complexité inutile.',
    },
    {
      icon: Heart,
      title: 'Proximité',
      description: 'Un accompagnement personnalisé avec un interlocuteur dédié pour chaque client.',
    },
    {
      icon: ShieldCheck,
      title: 'Conformité',
      description: 'Un respect absolu du RGPD et des réglementations en vigueur, sans compromis.',
    },
    {
      icon: TrendingUp,
      title: 'Performance',
      description: 'Une obsession des résultats : délivrabilité, taux d\'ouverture, ROI mesurable.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'L\'intelligence artificielle au service de la rédaction et de l\'optimisation.',
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Un écosystème de décideurs B2B qui grandit chaque jour dans toute la France.',
    },
  ]

  const team = [
    {
      name: 'Elisabeth DE OLIVEIRA LOPES',
      role: 'Fondatrice & Gérante',
      description: 'Passionnée par le marketing B2B, Elisabeth fonde ARLIS avec la conviction que les PME françaises méritent des outils de communication aussi performants que ceux des grands groupes.',
    },
    {
      name: 'Marc Renard',
      role: 'Directeur Technique',
      description: 'Ingénieur avec 15 ans d\'expérience dans le email marketing, Marc pilote le développement de la plateforme et garantit la fiabilité de l\'infrastructure d\'envoi.',
    },
    {
      name: 'Camille Dubois',
      role: 'Responsable Marketing',
      description: 'Spécialiste du marketing digital B2B, Camille définit la stratégie de contenu et accompagne les clients dans la création de campagnes performantes.',
    },
  ]

  return (
    <PageShell title="À propos de La Lettre Business">
      {/* Mission */}
      <section className="mb-16">
        <div className="rounded-2xl gradient-hero p-8 sm:p-12">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-white">
            <Sparkles className="size-6 text-amber-400" />
            Notre mission
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/80">
            Démocratiser le marketing B2B pour les PME françaises en offrant un accès simple,
            abordable et performant à la newsletter ciblée. Nous croyons que chaque entreprise,
            quelle que soit sa taille, mérite les mêmes outils de prospection que les grands groupes.
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="mb-16">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <BookOpen className="size-5 text-primary" />
          Notre histoire
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              La Lettre Business est née d&apos;un constat simple : les PME françaises dépensent des
              milliers d&apos;euros en publicité en ligne avec des résultats souvent décevants. Le
              marketing digital est devenu complexe, opaque et coûteux pour les petites entreprises
              qui n&apos;ont pas les ressources d&apos;une grande direction marketing.
            </p>
            <p className="leading-relaxed">
              En 2023, Elisabeth DE OLIVEIRA LOPES fonde ARLIS avec une vision claire : créer une
              plateforme qui permet à toute entreprise de communiquer efficacement auprès de
              décideurs qualifiés, sans compétences techniques et à un tarif accessible.
            </p>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              Le concept est innovant : des newsletters thématiques, segmentées par secteur
              d&apos;activité et par zone géographique, dans lesquelles les entreprises peuvent publier
              leurs offres commerciales. Un modèle éprouvé aux États-Unis mais encore peu développé
              en France.
            </p>
            <p className="leading-relaxed">
              Aujourd&apos;hui, La Lettre Business compte plus de 5 000 contacts qualifiés dans 15
              secteurs d&apos;activité à travers toute la France, et accompagne des centaines
              d&apos;entreprises dans leur croissance B2B.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mb-16">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Heart className="size-5 text-primary" />
          Nos valeurs
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <Card key={v.title} className="border-border/60 py-6 shadow-none transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader className="pb-0">
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <v.icon className="size-6 text-primary" />
                </div>
                <CardTitle className="text-base">{v.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Équipe */}
      <section>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Users className="size-5 text-primary" />
          L&apos;équipe
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name} className="border-border/60 py-6 text-center shadow-none">
              <CardContent>
                <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {member.name.split(' ').filter(w => w.length > 1).slice(-2).map(w => w[0]).join('')}
                </div>
                <h3 className="font-bold">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

/* ────────────────────────────────────────────
   6. BLOG
   ──────────────────────────────────────────── */

function BlogPage() {
  const navigate = useAppStore((s) => s.navigate)

  const articles = [
    {
      slug: '1',
      title: 'Comment générer des leads B2B qualifiés grâce aux newsletters sectorielles',
      excerpt: 'Découvrez pourquoi les newsletters thématiques sont l\'un des canaux les plus efficaces pour atteindre les décideurs B2B et comment optimiser votre approche.',
      category: 'Lead Generation',
      date: '15 décembre 2025',
      readTime: '6 min',
      icon: Target,
    },
    {
      slug: '2',
      title: 'RGPD et email marketing : le guide complet pour les PME',
      excerpt: 'Tout ce que vous devez savoir pour rester conforme au RGPD dans vos campagnes d\'emailing B2B. Consentement, base légale, droit d\'opposition...',
      category: 'Conformité',
      date: '2 décembre 2025',
      readTime: '8 min',
      icon: ShieldCheck,
    },
    {
      slug: '3',
      title: '5 erreurs à éviter lors de votre première campagne B2B',
      excerpt: 'Vous lancez votre première campagne d\'emailing B2B ? Évitez ces pièges courants qui peuvent ruiner votre délivrabilité et votre image de marque.',
      category: 'Conseils',
      date: '18 novembre 2025',
      readTime: '5 min',
      icon: Lightbulb,
    },
    {
      slug: '4',
      title: 'Le bus mailing : pourquoi ce canal revient en force chez les PME françaises',
      excerpt: 'Le bus mailing connaît un renouveau spectaculaire grâce aux plateformes digitales. Focus sur un canal souvent sous-estimé mais redoutablement efficace.',
      category: 'Tendances',
      date: '5 novembre 2025',
      readTime: '4 min',
      icon: TrendingUp,
    },
    {
      slug: '5',
      title: 'Comment rédiger une annonce B2B qui convertit (avec l\'aide de l\'IA)',
      excerpt: 'L\'intelligence artificielle transforme la rédaction publicitaire. Découvrez nos conseils pour créer des annonces percutantes qui génèrent des conversions.',
      category: 'Rédaction',
      date: '22 octobre 2025',
      readTime: '7 min',
      icon: Sparkles,
    },
    {
      slug: '6',
      title: 'Ciblage géographique en B2B : atteignez les bons décideurs au bon endroit',
      excerpt: 'Le ciblage local est un atout majeur pour les PME. Apprenez à segmenter vos campagnes par région, département ou code postal pour maximiser votre ROI.',
      category: 'Stratégie',
      date: '10 octobre 2025',
      readTime: '5 min',
      icon: MapPin,
    },
  ]

  return (
    <PageShell title="Blog &mdash; Actualités B2B">
      <p className="mb-8 text-lg text-muted-foreground">
        Conseils, tendances et bonnes pratiques pour développer votre business B2B.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card
            key={article.slug}
            className="group cursor-pointer border-border/60 py-0 shadow-none transition-all hover:border-primary/30 hover:shadow-md"
            onClick={() => navigate('blog/post')}
          >
            <div className="h-48 rounded-t-xl bg-gradient-to-br from-primary/5 to-amber-500/5 flex items-center justify-center">
              <article.icon className="size-16 text-primary/20 transition-colors group-hover:text-primary/40" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                <span className="text-xs text-muted-foreground">{article.readTime} de lecture</span>
              </div>
              <CardTitle className="mt-2 line-clamp-2 text-base leading-snug">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                Lire l&apos;article
                <ChevronRight className="size-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}

/* ────────────────────────────────────────────
   7. BLOG POST (sample)
   ──────────────────────────────────────────── */

function BlogPostPage() {
  return (
    <PageShell title="Comment générer des leads B2B qualifiés grâce aux newsletters sectorielles">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Lead Generation</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="size-3.5" />
            15 décembre 2025
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            6 min de lecture
          </span>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-amber-500/5 p-8 text-center">
          <Target className="mx-auto size-16 text-primary/30" />
          <p className="mt-2 text-sm text-muted-foreground">Illustration de l&apos;article</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Dans un contexte où l&apos;acquisition de clients B2B devient de plus en plus complexe et
            coûteuse, les newsletters sectorielles émergent comme l&apos;un des canaux les plus
            efficaces pour atteindre des décideurs qualifiés. Découvrez comment exploiter ce levier
            pour votre entreprise.
          </p>

          <h2 className="text-xl font-bold text-foreground">Pourquoi les newsletters sectorielles ?</h2>
          <p className="leading-relaxed">
            Contrairement aux méthodes de prospection traditionnelles (cold calling, publicité
            display), les newsletters thématiques s&apos;adressent à une audience déjà engagée et
            intéressée par votre secteur. Les taux d&apos;ouverture sont en moyenne 3 à 5 fois
            supérieurs à ceux des campagnes d&apos;emailing classique.
          </p>

          <h2 className="text-xl font-bold text-foreground">Les avantages concrets</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Ciblage ultra-précis :</strong> atteignez les décideurs par secteur, région et taille d&apos;entreprise</li>
            <li><strong>Coût maîtrisé :</strong> à partir de 49 € par annonce, sans frais cachés</li>
            <li><strong>Conformité RGPD :</strong> les contacts ont explicitement consenti à recevoir ces communications</li>
            <li><strong>Mesure des performances :</strong> suivez en temps réel ouverture, clics et conversions</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground">Comment optimiser vos annonces ?</h2>
          <p className="leading-relaxed">
            Pour maximiser l&apos;impact de vos annonces, privilégiez des messages clairs et orientés
            vers l&apos;avantage client. Incluez un appel à l&apos;action (CTA) percutant et adaptez
            votre offre au secteur visé. Notre éditeur IA peut vous aider à optimiser automatiquement
            votre message.
          </p>
        </div>
      </div>
    </PageShell>
  )
}

/* ────────────────────────────────────────────
   8. CARRIÈRES
   ──────────────────────────────────────────── */

function CareersPage() {
  const navigate = useAppStore((s) => s.navigate)

  const perks = [
    { icon: Globe, label: 'Télétravail flexible' },
    { icon: Heart, label: 'Mutuelle prise en charge' },
    { icon: GraduationCap, label: 'Budget formation' },
    { icon: Calendar, label: 'RTT généreuses' },
    { icon: Laptop, label: 'Équipement fourni' },
    { icon: UtensilsCrossed, label: 'Tickets restaurant' },
  ]

  const positions = [
    {
      title: 'Développeur Full-stack',
      department: 'Tech',
      location: 'Villeneuve-la-Garenne / Télétravail',
      type: 'CDI',
      description: 'Rejoignez notre équipe technique pour développer la plateforme La Lettre Business. Vous travaillerez sur le frontend (Next.js, React, TypeScript) et le backend (API, base de données).',
      requirements: ['3+ ans d\'expérience en développement web', 'Maîtrise de React/Next.js et TypeScript', 'Expérience avec les bases de données SQL', 'Sens du détail et goût pour la qualité'],
    },
    {
      title: 'Commercial B2B',
      department: 'Ventes',
      location: 'Île-de-France',
      type: 'CDI',
      description: 'Vous êtes en charge de développer notre portefeuille clients PME dans le secteur de la newsletter B2B. Prospection, présentation de la plateforme et suivi commercial.',
      requirements: ['2+ ans d\'expérience en vente B2B', 'Connaissance du marché des PME françaises', 'Excellente communication orale et écrite', 'Autonomie et esprit d\'initiative'],
    },
    {
      title: 'Chef de projet Marketing',
      department: 'Marketing',
      location: 'Villeneuve-la-Garenne / Télétravail',
      type: 'CDI',
      description: 'Vous pilotez les campagnes marketing, gérez les partenariats et animez la communauté. Vous analysez les données pour optimiser la stratégie d\'acquisition.',
      requirements: ['3+ ans d\'expérience en marketing digital', 'Maîtrise des outils analytics (GA4, etc.)', 'Expérience en content marketing B2B', 'Créativité et sens de l\'organisation'],
    },
    {
      title: 'Rédacteur Web',
      department: 'Contenu',
      location: 'Télétravail',
      type: 'Freelance / CDI',
      description: 'Vous rédigez des articles de blog, des newsletters et des contenus SEO optimisés pour le secteur B2B. Vous maîtrisez les techniques de copywriting appliquées au marketing.',
      requirements: ['2+ ans d\'expérience en rédaction web', 'Connaissance du SEO et du copywriting', 'Intérêt pour l\' univers B2B et le marketing', 'Capacité à produire du contenu régulier'],
    },
  ]

  return (
    <PageShell title="Carrières">
      {/* Intro */}
      <section className="mb-16">
        <div className="rounded-2xl gradient-hero p-8 sm:p-12">
          <h2 className="text-2xl font-extrabold text-white">
            Rejoignez l&apos;aventure La Lettre Business
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
            Nous construisons la plateforme de référence pour le marketing B2B des PME françaises.
            Une équipe à taille humaine, des projets stimulants et un impact concret sur la croissance
            de nos clients. Vous aimez les défis ? Bienvenue chez nous.
          </p>
        </div>
      </section>

      {/* Avantages */}
      <section className="mb-16">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Heart className="size-5 text-primary" />
          Nos avantages
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((p) => (
            <div key={p.label} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <p.icon className="size-5 text-primary" />
              </div>
              <span className="font-medium">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Postes */}
      <section>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Briefcase className="size-5 text-primary" />
          Postes ouverts
        </h2>
        <div className="mt-6 space-y-6">
          {positions.map((pos) => (
            <Card key={pos.title} className="border-border/60 py-0 shadow-none transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{pos.title}</CardTitle>
                    <CardDescription className="mt-1">{pos.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{pos.type}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="mr-1 size-3" />
                    {pos.location}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Users className="mr-1 size-3" />
                    {pos.department}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="mb-3 text-sm font-medium">Compétences recherchées :</p>
                <ul className="mb-4 space-y-1.5">
                  {pos.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {r}
                    </li>
                  ))}
                </ul>
                <Button
                  className="gradient-primary border-0 text-white hover:opacity-90"
                  onClick={() => navigate('contact')}
                >
                  Postuler
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

/* ────────────────────────────────────────────
   9. CONTACT
   ──────────────────────────────────────────── */

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <PageShell title="Contact">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left – info */}
        <div>
          <h2 className="text-xl font-bold">Parlons de votre projet</h2>
          <p className="mt-2 text-muted-foreground">
            Vous avez une question sur nos services, vous souhaitez un devis personnalisé ou
            simplement en savoir plus ? N&apos;hésitez pas à nous contacter.
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Siège social</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  7 Avenue de la Redoute<br />
                  92390 Villeneuve-la-Garenne
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Mail className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">E-mail</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  <a href="mailto:contact@lalettrebusiness.com" className="text-primary hover:underline">
                    contact@lalettrebusiness.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Site web</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  <a href="https://lalettrebusiness.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    lalettrebusiness.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-8 flex h-48 items-center justify-center rounded-xl border border-border/60 bg-muted/30">
            <div className="text-center">
              <MapPin className="mx-auto size-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">Carte &mdash; 7 Avenue de la Redoute, 92390 VLG</p>
            </div>
          </div>
        </div>

        {/* Right – form */}
        <div>
          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Envoyez-nous un message</CardTitle>
              <CardDescription>Nous répondons sous 24h ouvrées.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="size-8 text-green-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">Message envoyé !</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', subject: '', message: '' })
                    }}
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Nom complet</Label>
                    <Input
                      id="contact-name"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Adresse e-mail</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="jean@entreprise.fr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Sujet</Label>
                    <Input
                      id="contact-subject"
                      placeholder="Demande de devis, question sur nos services..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Décrivez votre besoin..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-primary border-0 text-white hover:opacity-90"
                  >
                    <Send className="mr-2 size-4" />
                    Envoyer le message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

/* ────────────────────────────────────────────
   10. CAS CLIENTS
   ──────────────────────────────────────────── */

function CaseStudiesPage() {
  const cases = [
    {
      company: 'Fiduciaire du Sud',
      sector: 'Comptabilité & Finance',
      location: 'Toulouse',
      person: 'Sophie Marchand',
      role: 'Directrice Commerciale',
      logo: 'FD',
      challenge: 'Pipeline commercial insuffisant malgré une forte expertise. Difficulté à atteindre les dirigeants de PME dans la région toulousaine.',
      solution: 'Diffusion d\'annonces ciblées dans la newsletter "Compta Growth 33" ciblant le secteur comptable en Nouvelle-Aquitaine et Occitanie.',
      metrics: [
        { label: 'Leads qualifiés', before: '8 / mois', after: '35 / mois', change: '+337%' },
        { label: 'Taux de conversion', before: '3%', after: '11%', change: '+267%' },
        { label: 'Coût par lead', before: '85 €', after: '28 €', change: '-67%' },
      ],
      quote: 'En 3 mois, notre pipeline a été multiplié par 4. Le ciblage géographique fait toute la différence.',
      rating: 5,
    },
    {
      company: 'FormatPro Conseil',
      sector: 'Formation & Conseil',
      location: 'Lyon',
      person: 'Thomas Lefèvre',
      role: 'Gérant',
      logo: 'FP',
      challenge: 'Organisme de formation cherchant à développer sa clientèle B2B en Auvergne-Rhône-Alpes avec un budget marketing limité.',
      solution: 'Abonnement Standard avec 4 annonces mensuelles dans les newsletters RH et Formation de la région AuRA.',
      metrics: [
        { label: 'Participants formation', before: '45 / mois', after: '120 / mois', change: '+167%' },
        { label: 'CA mensuel', before: '12 000 €', after: '32 000 €', change: '+167%' },
        { label: 'Taux d\'ouverture', before: '—', after: '41%', change: 'Nouveau' },
      ],
      quote: 'En 10 minutes, mon annonce est prête et envoyée à des centaines de décideurs. Un gain de temps énorme pour un TPE comme le nôtre.',
      rating: 5,
    },
    {
      company: 'TechSolutions SAS',
      sector: 'Tech & Numérique',
      location: 'Paris',
      person: 'Marie Dupont',
      role: 'Responsable Marketing',
      logo: 'TS',
      challenge: 'Besoin de promouvoir de nouvelles solutions SaaS auprès des décideurs IT en Île-de-France avec un ROI mesurable.',
      solution: 'Abonnement Premium avec annonces illimitées et accessibilité à toutes les newsletters de la région IDF.',
      metrics: [
        { label: 'Démonstrations', before: '12 / mois', after: '48 / mois', change: '+300%' },
        { label: 'Taux de clic', before: '1,8%', after: '5,3%', change: '+194%' },
        { label: 'NPS clients', before: '32', after: '67', change: '+109%' },
      ],
      quote: 'Les analytics sont incroyablement détaillés. On sait exactement qui ouvre et clique. Le support est réactif et toujours à l\'écoute.',
      rating: 5,
    },
    {
      company: 'Espace Immobilier Pro',
      sector: 'Immobilier & Services',
      location: 'Bordeaux',
      person: 'Laurent Mercier',
      role: 'Directeur Général',
      logo: 'EI',
      challenge: 'Agence immobilière professionnelle cherchant à développer sa marque employeur et attirer des investisseurs institutionnels en Nouvelle-Aquitaine.',
      solution: 'Campagnes mensuelles ciblées dans les newsletters immobilier et finance de la région bordelaise avec contenu IA optimisé.',
      metrics: [
        { label: 'Candidatures reçues', before: '6 / mois', after: '22 / mois', change: '+267%' },
        { label: 'Contacts investisseurs', before: '3 / trimestre', after: '14 / trimestre', change: '+367%' },
        { label: 'Notoriété locale', before: 'Faible', after: 'Établie', change: 'Significatif' },
      ],
      quote: 'La Lettre Business nous a permis de nous faire connaître dans un secteur très concurrentiel. Le ROI est au-delà de nos attentes.',
      rating: 5,
    },
  ]

  return (
    <PageShell title="Cas Clients">
      <p className="mb-10 text-lg text-muted-foreground">
        Découvrez comment nos clients boostent leur croissance B2B grâce à La Lettre Business.
      </p>

      <div className="space-y-16">
        {cases.map((c, idx) => (
          <Card key={c.company} className="overflow-hidden border-border/60 shadow-none">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    {c.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{c.company}</h3>
                    <p className="text-sm text-muted-foreground">{c.sector} &middot; {c.location}</p>
                    <p className="text-xs text-muted-foreground">{c.person} &mdash; {c.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: c.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {c.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-border/60 bg-muted/30 p-4 text-center">
                    <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="text-sm text-muted-foreground">{m.before}</span>
                      <ArrowRight className="size-3 text-muted-foreground/40" />
                      <span className="text-lg font-bold text-primary">{m.after}</span>
                    </div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      <TrendingUp className="mr-1 size-3 text-green-500" />
                      {m.change}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Challenge & Solution */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Défi
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{c.challenge}</p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Solution
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{c.solution}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary/5 p-4">
                <Quote className="mt-0.5 size-5 shrink-0 text-primary/40" />
                <p className="text-sm italic leading-relaxed text-muted-foreground">
                  &ldquo;{c.quote}&rdquo;
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Card className="mx-auto max-w-2xl border-border/60 bg-muted/30 py-10 shadow-none">
          <CardContent className="text-center">
            <Award className="mx-auto size-10 text-primary" />
            <h3 className="mt-4 text-xl font-bold">Vous aussi, boostez votre croissance</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Rejoignez les entreprises qui font confiance à La Lettre Business.
            </p>
            <Button
              className="mt-6 gradient-primary border-0 text-white hover:opacity-90"
              onClick={() => useAppStore.getState().navigate('register')}
            >
              Démarrer gratuitement
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

/* ────────────────────────────────────────────
   MAIN EXPORT
   ──────────────────────────────────────────── */

export function ContentPage({ type }: { type: string }) {
  switch (type) {
    case 'legal/mentions':
      return <LegalMentions />
    case 'legal/cgv':
      return <LegalCGV />
    case 'legal/privacy':
      return <LegalPrivacy />
    case 'legal/cookies':
      return <LegalCookies />
    case 'about':
      return <AboutPage />
    case 'blog':
      return <BlogPage />
    case 'blog/post':
      return <BlogPostPage />
    case 'careers':
      return <CareersPage />
    case 'contact':
      return <ContactPage />
    case 'case-studies':
      return <CaseStudiesPage />
    default:
      return null
  }
}
