import { PrismaClient } from '@prisma/client'

const POSTGRESQL_URL = "postgresql://admin_100jours:J0urs!2026*Cent@109.123.249.114:5432/100jours?sslmode=prefer"

const db = new PrismaClient({
  datasourceUrl: POSTGRESQL_URL,
})

// Map of slug → Pexels photo ID
const slugToPhotoId: Record<string, number> = {
  // Création d'entreprise (4 articles)
  'comment-choisir-son-statut-juridique-en-2025': 3184291,         // Statut Juridique
  'micro-entreprise-vs-sasu-quel-est-le-meilleur-choix': 3184292,   // Micro-entreprise vs SASU
  'guide-complet-creation-auto-entrepreneur-etapes': 3184296,        // Auto-entreprise
  'erreurs-eviter-lors-creation-entreprise': 3184299,                // Erreurs Création

  // Banque Pro (3 articles)
  'meilleure-banque-pro-pour-auto-entrepreneur-2025': 3184300,       // Banque Pro
  'qonto-avis-test-complet-2025': 3184301,                           // Compte Pro (Qonto)
  'shine-neo-avis-banque-pro-gratuite': 3184300,                     // Compte Pro (Shine Neo) — reuse banking image

  // Comptabilité (4 articles)
  'meilleur-logiciel-compta-auto-entrepreneur-2025': 3184302,        // Logiciel Comptabilité
  'indy-avis-test-logiciel-comptabilite': 3184302,                   // Comptabilité outil
  'comment-gerer-sa-comptabilite-en-auto-entrepreneur': 3184303,      // Comptabilité Auto-entrepreneur
  'declarations-urssaf-guide-complet': 3184304,                       // Expert-comptable / URSSAF

  // Assurances (3 articles)
  'assurance-rc-pro-obligatoire-guide-2025': 3184305,                // RC Pro
  'alan-avis-assurance-sante-pro': 3184306,                           // Mutuelle TNS
  'assurance-decennale-btp-guide-complet': 3184307,                   // Assurance Décennale

  // Marketing & Ventes (1 article)
  'comment-trouver-premiers-clients-entrepreneur': 3184308,          // Stratégie Marketing

  // Digital (3 articles)
  'creer-site-web-entreprise-guide-2025': 3184311,                   // Site Web
  'reseaux-sociaux-entrepreneurs-strategies': 3184310,                // Réseaux Sociaux
  'seo-local-guide-referencement-entreprise': 3184313,                // SEO Local

  // Gestion (2 articles)
  'gestion-tresorerie-entreprise-guide-pratique': 3184314,            // Trésorerie
  'outils-productivite-indispensables-entrepreneur': 3184315,        // Outils Productivité
}

function buildPexelsUrl(photoId: number): string {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=turbo&w=800&h=400&fit=crop`
}

async function main() {
  console.log('🖼️  Updating blog post cover images...')

  const posts = await db.post.findMany({
    select: { id: true, slug: true, title: true },
    orderBy: { createdAt: 'asc' },
  })

  console.log(`  📋 Found ${posts.length} posts`)

  let updated = 0
  let skipped = 0

  for (const post of posts) {
    const photoId = slugToPhotoId[post.slug]
    if (!photoId) {
      console.log(`  ⚠️  No photo mapping for slug: ${post.slug}`)
      skipped++
      continue
    }

    const coverImage = buildPexelsUrl(photoId)
    await db.post.update({
      where: { id: post.id },
      data: { coverImage },
    })
    console.log(`  ✅ ${post.title.substring(0, 50)}... → ${photoId}`)
    updated++
  }

  console.log(`\n✨ Updated ${updated} posts, skipped ${skipped}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
