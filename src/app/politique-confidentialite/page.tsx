import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Protection des Données Personnelles | AQUABION® - aquabion-mag.com",
  description: "Politique de confidentialité et protection des données personnelles du site aquabion-mag.com, conforme au RGPD.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Retour à l&apos;accueil
          </a>
          <a href="/" className="flex items-center gap-2">
            <img src="/images/logo-aquabion.png" alt="AQUABION®" className="h-9 w-auto" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-hero text-white py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Politique de Protection des Données Personnelles</h1>
          <p className="text-white/70 text-sm">Dernière mise à jour : Janvier 2025</p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm sm:prose-base max-w-none">
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Responsable du traitement</h2>
              <p className="text-muted-foreground leading-relaxed">
                Le responsable du traitement des données personnelles est <strong className="text-foreground">aquabion-mag.com</strong>, distributeur officiel de la solution AQUABION®.
              </p>
              <div className="mt-3 text-sm text-muted-foreground space-y-1">
                <p><strong className="text-foreground">Dénomination :</strong> aquabion-mag.com</p>
                <p><strong className="text-foreground">Email :</strong> <a href="mailto:contact@aquabion-mag.com" className="text-primary hover:underline">contact@aquabion-mag.com</a></p>
                <p><strong className="text-foreground">Site :</strong> <a href="https://aquabion-mag.com" className="text-primary hover:underline">www.aquabion-mag.com</a></p>
                <p><strong className="text-foreground">Zone géographique :</strong> France, Belgique, Luxembourg</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Données personnelles collectées</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Dans le cadre de l&apos;utilisation de notre site et de nos services, nous pouvons collecter les données personnelles suivantes :
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                <li><strong className="text-foreground">Identité :</strong> nom, prénom</li>
                <li><strong className="text-foreground">Coordonnées :</strong> adresse email, numéro de téléphone, code postal</li>
                <li><strong className="text-foreground">Données de navigation :</strong> adresse IP, type de navigateur, pages visitées, durée de visite (via cookies techniques)</li>
                <li><strong className="text-foreground">Données de formulaire :</strong> type de logement, problématique rencontrée, message libre</li>
                <li><strong className="text-foreground">Données de prospection :</strong> consentement à la newsletter, source d&apos;acquisition, paramètres UTM</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Finalités du traitement</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Vos données personnelles sont collectées et traitées pour les finalités suivantes :
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                <li>Répondre à vos demandes de devis, de renseignements ou de contact</li>
                <li>Vous envoyer des informations commerciales (uniquement si vous y avez consenti)</li>
                <li>Améliorer nos services et l&apos;expérience utilisateur de notre site</li>
                <li>Mesurer l&apos;audience et l&apos;efficacité de nos campagnes (via cookies analytiques, avec consentement)</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Base légale du traitement</h2>
              <p className="text-muted-foreground leading-relaxed">
                Le traitement de vos données repose sur les bases légales suivantes, conformément au Règlement Général sur la Protection des Données (RGPD – Règlement UE 2016/679) :
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mt-3 ml-4 list-disc">
                <li><strong className="text-foreground">Article 6.1.a – Consentement :</strong> pour la collecte via nos formulaires de contact, devis et newsletter</li>
                <li><strong className="text-foreground">Article 6.1.b – Exécution d&apos;un contrat :</strong> pour le traitement de votre demande de devis et la mise en relation avec nos installateurs</li>
                <li><strong className="text-foreground">Article 6.1.f – Intérêt légitime :</strong> pour l&apos;amélioration de nos services et la sécurité du site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Durée de conservation des données</h2>
              <div className="text-sm text-muted-foreground space-y-3">
                <p>
                  <strong className="text-foreground">Données de contact / devis :</strong> conservées pendant une durée de <strong>3 ans</strong> à compter du dernier contact avec la personne concernée, conformément aux recommandations de la CNIL.
                </p>
                <p>
                  <strong className="text-foreground">Données de newsletter :</strong> conservées jusqu&apos;à votre désinscription. Vous pouvez vous désinscrire à tout moment en cliquant sur le lien prévu à cet effet dans chaque email ou en nous contactant directement.
                </p>
                <p>
                  <strong className="text-foreground">Données de navigation :</strong> conservées pendant <strong>13 mois</strong> maximum à compter de leur collecte.
                </p>
                <p>
                  <strong className="text-foreground">Données contractuelles :</strong> conservées pendant <strong>5 ans</strong> à compter de la fin de la relation contractuelle, pour les besoins de preuve.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Destinataires des données</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vos données personnelles sont destinées exclusivement aux services de <strong>aquabion-mag.com</strong> et à ses sous-traitants habilités dans le cadre strict de leur mission. Vos données ne sont <strong>jamais transmises à des tiers</strong> à des fins commerciales sans votre consentement explicite et préalable.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Les données peuvent être transmises aux installateurs partenaires d&apos;AQUABION® <strong>uniquement dans le cadre de votre demande de devis</strong> et avec votre accord.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Vos droits</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Conformément au RGPD (Articles 15 à 22) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez des droits suivants :
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                <li><strong className="text-foreground">Droit d&apos;accès :</strong> obtenir la confirmation que vos données sont traitées et en recevoir une copie</li>
                <li><strong className="text-foreground">Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
                <li><strong className="text-foreground">Droit à l&apos;effacement :</strong> demander la suppression de vos données (&quot;droit à l&apos;oubli&quot;)</li>
                <li><strong className="text-foreground">Droit à la limitation :</strong> restreindre le traitement de vos données dans certains cas</li>
                <li><strong className="text-foreground">Droit à la portabilité :</strong> recevoir vos données dans un format structuré et courant</li>
                <li><strong className="text-foreground">Droit d&apos;opposition :</strong> vous opposer au traitement de vos données pour des motifs légitimes</li>
                <li><strong className="text-foreground">Droit de retirer votre consentement :</strong> à tout moment, sans que cela ne compromette la licéité du traitement effectué avant le retrait</li>
              </ul>
              <div className="mt-4 bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Pour exercer ces droits :</p>
                <p>Envoyez votre demande accompagnée d&apos;une copie de votre pièce d&apos;identité à : <a href="mailto:contact@aquabion-mag.com" className="text-primary hover:underline">contact@aquabion-mag.com</a></p>
                <p className="mt-1">Nous nous engageons à vous répondre dans un délai maximum d&apos;un mois à compter de la réception de votre demande.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Notre site utilise des cookies pour améliorer votre expérience de navigation :
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mt-3 ml-4 list-disc">
                <li><strong className="text-foreground">Cookies strictement nécessaires :</strong> indispensables au fonctionnement du site (aucun consentement requis)</li>
                <li><strong className="text-foreground">Cookies analytiques :</strong> pour mesurer l&apos;audience et améliorer nos services (consentement requis)</li>
                <li><strong className="text-foreground">Cookies publicitaires :</strong> pour personnaliser les annonces affichées (consentement requis)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Vous pouvez à tout moment modifier vos préférences de cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Sécurité des données</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, toute modification, divulgation ou destruction. Ces mesures incluent le chiffrement des données, la restriction d&apos;accès aux personnes autorisées et la surveillance régulière de nos systèmes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Réclamation auprès de la CNIL</h2>
              <p className="text-muted-foreground leading-relaxed">
                Si vous estimez que le traitement de vos données n&apos;est pas conforme au RGPD, vous avez le droit d&apos;introduire une réclamation auprès de la Commission Nationale de l&apos;Informatique et des Libertés (CNIL) :
              </p>
              <div className="mt-3 bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-1">
                <p><strong className="text-foreground">CNIL</strong></p>
                <p>3 Place de Fontenoy – TSA 80715 – 75334 PARIS CEDEX 07</p>
                <p>Téléphone : 01 53 73 22 22</p>
                <p>Site : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">11. Modifications de la politique</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nous nous réservons le droit de modifier la présente politique de protection des données à tout moment. Toute modification sera publiée sur cette page avec la date de mise à jour. Nous vous invitons à la consulter régulièrement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">12. Mentions légales</h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong className="text-foreground">Site :</strong> aquabion-mag.com</p>
                <p><strong className="text-foreground">Éditeur :</strong> aquabion-mag.com, distributeur officiel de la solution AQUABION® développée par Aquabion SA, Suisse</p>
                <p><strong className="text-foreground">Hébergement :</strong> Les données sont hébergées sur des serveurs sécurisés situés en France, conformément au RGPD</p>
                <p><strong className="text-foreground">Crédits :</strong> La technologie AQUABION® est une marque déposée d&apos;Aquabion SA, Suisse – <a href="https://aquabion-distribution.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aquabion-distribution.com</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#004E6D] text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-white/60">
          © {new Date().getFullYear()} aquabion-mag.com – Distributeur officiel AQUABION® –{" "}
          <a href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</a>
        </div>
      </footer>
    </div>
  );
}
