import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Euro, ClipboardList, Wrench, ShieldCheck, AlertTriangle, UserCheck, Lock, Scale, HelpCircle, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente | AQUABION® - aquabion-mag.com",
  description: "Conditions générales de vente du site aquabion-mag.com. Devis gratuit, mise en relation, services d'information AQUABION®.",
};

export default function CGVPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            &larr; Retour &agrave; l&apos;accueil
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo-aquabion.png" alt="AQUABION®" className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-hero text-white py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium text-white/90">Conditions g&eacute;n&eacute;rales</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Conditions G&eacute;n&eacute;rales de Vente</h1>
          <p className="text-white/70 text-sm">Derni&egrave;re mise &agrave; jour : Janvier 2025</p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">

            {/* 1. Objet */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 1 &ndash; Objet</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales de Vente (ci-apr&egrave;s &laquo; CGV &raquo;) r&eacute;gissent les relations entre <strong className="text-foreground">aquabion-mag.com</strong>, distributeur officiel de la solution AQUABION&reg;, et les utilisateurs du site <strong className="text-foreground">www.aquabion-mag.com</strong> (ci-apr&egrave;s &laquo; l&apos;Utilisateur &raquo;).
                  </p>
                  <p>
                    aquabion-mag.com est un site d&apos;information et de mise en relation sp&eacute;cialis&eacute; dans les solutions anti-calcaire AQUABION&reg;. Les services propos&eacute;s consistent en :
                  </p>
                  <ul className="ml-4 list-disc space-y-1.5">
                    <li>L&apos;information et le conseil sur les solutions AQUABION&reg;</li>
                    <li>La mise &agrave; disposition d&apos;outils de simulation d&apos;&eacute;conomies</li>
                    <li>La mise en relation entre les utilisateurs et les installateurs partenaires AQUABION&reg;</li>
                    <li>L&apos;&eacute;tablissement de devis gratuits et personnalis&eacute;s</li>
                    <li>L&apos;envoi de newsletters et contenus informatifs (avec consentement)</li>
                  </ul>
                  <p>
                    Toute utilisation du site implique l&apos;acceptation pleine et enti&egrave;re des pr&eacute;sentes CGV. aquabion-mag.com se r&eacute;serve le droit de modifier les CGV &agrave; tout moment. Les modifications prennent effet d&egrave;s leur publication sur le site.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Prix */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Euro className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 2 &ndash; Prix</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Les services d&apos;information, de simulation et de mise en relation propos&eacute;s sur aquabion-mag.com sont <strong className="text-foreground">entièrement gratuits</strong> pour l&apos;Utilisateur.
                  </p>
                  <p>
                    Les devis personnalis&eacute;s sont &eacute;tablis <strong className="text-foreground">sans engagement</strong> et ne constituent pas une offre contractuelle de vente. Les prix indiqu&eacute;s dans les devis sont donn&eacute;s &agrave; titre indicatif et peuvent varier en fonction des sp&eacute;cificit&eacute;s techniques de l&apos;installation, de la r&eacute;gion g&eacute;ographique et des conditions du march&eacute;.
                  </p>
                  <p>
                    Les tarifs des produits AQUABION&reg; et de leur installation sont communiqu&eacute;s par les installateurs partenaires. aquabion-mag.com ne fixe pas les prix de vente finale et agit en tant qu&apos;interm&eacute;diaire.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3. Commande */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 3 &ndash; Demande de devis et commande</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    L&apos;Utilisateur peut formuler une demande de devis gratuit via le formulaire en ligne. Cette demande n&apos;engage pas l&apos;Utilisateur et ne constitue pas une commande.
                  </p>
                  <p>
                    La demande de devis est transmise aux installateurs partenaires d&apos;AQUABION&reg; comp&eacute;tents dans la zone g&eacute;ographique de l&apos;Utilisateur. L&apos;Utilisateur sera contact&eacute; dans un d&eacute;lai de <strong className="text-foreground">24 heures ouvr&eacute;es</strong> pour recevoir son devis personnalis&eacute;.
                  </p>
                  <p>
                    La commande finale d&apos;un produit AQUABION&reg; et de son installation intervient directement entre l&apos;Utilisateur et l&apos;installateur partenaire. Un contrat de vente sp&eacute;cifique est alors sign&eacute; entre les deux parties, dans les conditions pr&eacute;vues par le Code de la consommation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 4. Devis */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 4 &ndash; Devis</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Le devis est un document informatif &eacute;tabli sur la base des informations communiqu&eacute;es par l&apos;Utilisateur. Il comprend :
                  </p>
                  <ul className="ml-4 list-disc space-y-1.5">
                    <li>La description du ou des produit(s) AQUABION&reg; recommand&eacute;(s)</li>
                    <li>Le co&ucirc;t estim&eacute; du mat&eacute;riel</li>
                    <li>Le co&ucirc;t estim&eacute; de l&apos;installation</li>
                    <li>Les d&eacute;lais de r&eacute;alisation pr&eacute;visionnels</li>
                    <li>Les conditions de garantie applicables</li>
                  </ul>
                  <p>
                    Le devis a une validit&eacute; de <strong className="text-foreground">30 jours</strong> &agrave; compter de sa date d&apos;&eacute;mission. Pass&eacute; ce d&eacute;lai, les conditions tarifaires et techniques peuvent &ecirc;tre r&eacute;vis&eacute;es.
                  </p>
                  <p>
                    Le devis est personnalis&eacute; et ne peut &ecirc;tre transmis &agrave; des tiers sans l&apos;accord pr&eacute;alable de aquabion-mag.com.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 5. Installation */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 5 &ndash; Installation</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    L&apos;installation des produits AQUABION&reg; est r&eacute;alis&eacute;e par des installateurs partenaires certifi&eacute;s, sp&eacute;cialis&eacute;s dans le traitement de l&apos;eau et la plomberie.
                  </p>
                  <p>
                    Avant toute installation, un technicien se d&eacute;place au domicile de l&apos;Utilisateur (ou sur le lieu d&apos;installation) pour r&eacute;aliser un diagnostic technique approfondi, incluant :
                  </p>
                  <ul className="ml-4 list-disc space-y-1.5">
                    <li>L&apos;&eacute;valuation de la duret&eacute; de l&apos;eau (titrage en degr&eacute;s TH)</li>
                    <li>L&apos;analyse du r&eacute;seau de plomberie existant</li>
                    <li>La d&eacute;termination du mod&egrave;le AQUABION&reg; le plus adapt&eacute;</li>
                    <li>L&apos;&eacute;valuation des contraintes techniques sp&eacute;cifiques</li>
                  </ul>
                  <p>
                    L&apos;Utilisateur est tenu de garantir l&apos;acc&egrave;s libre aux installations concern&eacute;es et de fournir toutes les informations n&eacute;cessaires au bon d&eacute;roulement de l&apos;intervention.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 6. Garantie */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 6 &ndash; Garantie</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Les produits AQUABION&reg; b&eacute;n&eacute;ficient de la garantie du fabricant, <strong className="text-foreground">Aquabion SA, Suisse</strong>. Les conditions de garantie sont d&eacute;taill&eacute;es dans le certificat de garantie fourni avec chaque produit.
                  </p>
                  <p>
                    La garantie couvre les d&eacute;fauts de fabrication et de mat&eacute;riel dans les conditions normales d&apos;utilisation. Elle ne couvre pas les dommages r&eacute;sultant :
                  </p>
                  <ul className="ml-4 list-disc space-y-1.5">
                    <li>D&apos;une installation non conforme aux recommandations du fabricant</li>
                    <li>D&apos;une utilisation abusive ou inappropri&eacute;e</li>
                    <li>D&apos;interventions non autoris&eacute;es sur le produit</li>
                    <li>De cas de force majeure</li>
                  </ul>
                  <p>
                    L&apos;installation r&eacute;alis&eacute;e par les partenaires est garantie selon les conditions d&eacute;finies dans le contrat de vente conclu entre l&apos;Utilisateur et l&apos;installateur.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 7. Responsabilité */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 7 &ndash; Responsabilit&eacute;</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    aquabion-mag.com agit en qualit&eacute; d&apos;interm&eacute;diaire entre l&apos;Utilisateur et les installateurs partenaires. &Agrave; ce titre, sa responsabilit&eacute; est limit&eacute;e aux services d&apos;information, de simulation et de mise en relation.
                  </p>
                  <p>
                    aquabion-mag.com ne saurait &ecirc;tre tenu responsable :
                  </p>
                  <ul className="ml-4 list-disc space-y-1.5">
                    <li>Des dommages r&eacute;sultant de l&apos;installation r&eacute;alis&eacute;e par les partenaires</li>
                    <li>De l&apos;inad&eacute;quation du produit entre les besoins de l&apos;Utilisateur et la solution propos&eacute;e</li>
                    <li>Des performances r&eacute;elles du produit, qui d&eacute;pendent des conditions d&apos;installation et de la qualit&eacute; de l&apos;eau locale</li>
                    <li>Des interruptions ou dysfonctionnements du site internet</li>
                    <li>Des informations inexactes ou incompl&egrave;tes fournies par l&apos;Utilisateur dans les formulaires</li>
                  </ul>
                  <p>
                    La responsabilit&eacute; de aquabion-mag.com ne pourra en aucun cas &ecirc;tre engag&eacute;e pour les dommages indirects, tels que la perte de profit, la perte de chance ou le pr&eacute;judice commercial.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 8. Rétractation */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 8 &ndash; Droit de r&eacute;tractation</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Conform&eacute;ment &agrave; l&apos;article L.221-18 du Code de la consommation, l&apos;Utilisateur dispose d&apos;un <strong className="text-foreground">d&eacute;lai de r&eacute;tractation de 14 jours</strong> &agrave; compter de la conclusion du contrat de vente avec l&apos;installateur partenaire.
                  </p>
                  <p>
                    Ce droit de r&eacute;tractation ne s&apos;applique pas aux contrats dont l&apos;ex&eacute;cution a d&eacute;but&eacute; avec l&apos;accord expr&egrave;s de l&apos;Utilisateur avant l&apos;expiration du d&eacute;lai de r&eacute;tractation (installation r&eacute;alis&eacute;e).
                  </p>
                  <p>
                    Les demandes de devis formul&eacute;es sur aquabion-mag.com &eacute;tant gratuites et sans engagement, elles ne sont pas concern&eacute;es par le droit de r&eacute;tractation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 9. Données personnelles */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 9 &ndash; Donn&eacute;es personnelles</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Le traitement des donn&eacute;es personnelles est r&eacute;gi par notre <Link href="/politique-confidentialite" className="text-primary hover:underline">Politique de Protection des Donn&eacute;es Personnelles</Link>, conforme au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es (RGPD &ndash; R&egrave;glement UE 2016/679).
                  </p>
                  <p>
                    Les donn&eacute;es collect&eacute;es via les formulaires du site (nom, pr&eacute;nom, email, t&eacute;l&eacute;phone, code postal, informations sur le logement) sont n&eacute;cessaires au traitement de la demande de devis et &agrave; la mise en relation avec les installateurs partenaires.
                  </p>
                  <p>
                    L&apos;Utilisateur dispose d&apos;un droit d&apos;acc&egrave;s, de rectification, d&apos;effacement, de portabilit&eacute; et d&apos;opposition au traitement de ses donn&eacute;es, qu&apos;il peut exercer en contactant : <a href="mailto:contact@aquabion-mag.com" className="text-primary hover:underline">contact@aquabion-mag.com</a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 10. Litiges */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 10 &ndash; R&egrave;glement des litiges</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    En cas de litige relatif aux pr&eacute;sentes CGV ou aux services fournis, l&apos;Utilisateur est invit&eacute; &agrave; contacter en priorit&eacute; aquabion-mag.com par email &agrave; l&apos;adresse <a href="mailto:contact@aquabion-mag.com" className="text-primary hover:underline">contact@aquabion-mag.com</a> afin de rechercher une solution amiable.
                  </p>
                  <p>
                    En cas d&apos;&eacute;chec de la m&eacute;diation amiable, et conform&eacute;ment au d&eacute;cret n&deg;2015-1382 du 30 octobre 2015 relatif &agrave; la m&eacute;diation des litiges de la consommation, le consommateur peut recourir gratuitement &agrave; un m&eacute;diateur de la consommation en vue de la r&eacute;solution amiable du diff&eacute;rend.
                  </p>
                  <p>
                    Conform&eacute;ment au R&egrave;glement (UE) n&deg;524/2013, les consommateurs europ&eacute;ens peuvent utiliser la <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">plateforme de r&egrave;glement en ligne des litiges</a> de la Commission europ&eacute;enne.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 11. Droit applicable */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Article 11 &ndash; Droit applicable</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Les pr&eacute;sentes CGV sont r&eacute;gies par le <strong className="text-foreground">droit fran&ccedil;ais</strong>. En cas de litige non r&eacute;solu par voie amiable, les tribunaux fran&ccedil;ais comp&eacute;tents seront seuls comp&eacute;tents pour conna&icirc;tre du diff&eacute;rend, nonobstant pluralit&eacute; de d&eacute;fendeurs ou appel en garantie.
                  </p>
                  <p>
                    Pour les utilisateurs r&eacute;sidant en Belgique ou au Luxembourg, les dispositions l&eacute;gales locales en mati&egrave;re de protection des consommateurs restent applicables le cas &eacute;ch&eacute;ant, sans pr&eacute;judice du droit fran&ccedil;ais applicable au pr&eacute;sent contrat.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#004E6D] text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-white/60">
          &copy; {new Date().getFullYear()} aquabion-mag.com &ndash; Distributeur officiel AQUABION&reg; &ndash;{" "}
          <Link href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialit&eacute;</Link>
        </div>
      </footer>
    </div>
  );
}
