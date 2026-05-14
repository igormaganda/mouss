import { PrismaClient } from '@prisma/client'

const POSTGRESQL_URL = "postgresql://admin_100jours:J0urs!2026*Cent@109.123.249.114:5432/100jours?sslmode=prefer"

const db = new PrismaClient({
  datasourceUrl: POSTGRESQL_URL,
})

const packs = [
  {
    name: 'Découverte',
    slug: 'decouverte',
    tagline: 'Commencez votre aventure entrepreneuriale',
    price: 0,
    period: 'mois',
    features: JSON.stringify([
      'Audit entrepreneurial gratuit',
      'Accès aux articles et guides',
      'Comparatifs d\'outils basiques',
      'Newsletter hebdomadaire',
      'Communauté Discord',
    ]),
    highlighted: false,
    order: 1,
  },
  {
    name: 'Starter',
    slug: 'starter',
    tagline: 'Les outils essentiels pour bien démarrer',
    price: 9,
    period: 'mois',
    features: JSON.stringify([
      'Tout le plan Découverte',
      'Checklist 100 jours interactive',
      'Tableau de bord personnalisé',
      'Recommandations d\'outils IA',
      'Support email prioritaire',
      'Templates documents de base',
    ]),
    highlighted: false,
    order: 2,
  },
  {
    name: 'Pro',
    slug: 'pro',
    tagline: 'La boîte à outils complète de l\'entrepreneur',
    price: 19,
    period: 'mois',
    features: JSON.stringify([
      'Tout le plan Starter',
      'Suivi de progression avancé',
      'Simulateur de coûts et charges',
      'Templates documents avancés (factures, devis, CGV...)',
      'Chatbot IA conseiller entrepreneurial',
      'Masterclasses exclusives',
      'Badge vérifié sur le profil',
    ]),
    highlighted: false,
    order: 3,
  },
  {
    name: 'Pack IA',
    slug: 'pack-ia',
    tagline: 'Génération de documents pro grâce à l\'IA',
    price: 29,
    period: 'mois',
    features: JSON.stringify([
      'Tout le plan Pro',
      'Génération IA : Plan d\'affaires',
      'Génération IA : Plan marketing',
      'Génération IA : Guide du plan d\'affaires',
      'Génération IA : Sommaire exécutif (Résumé)',
      'Génération IA : Plan d\'étude de marché',
      'Documents personnalisés selon votre activité',
      'Export PDF & Word',
    ]),
    highlighted: true,
    order: 4,
  },
]

async function main() {
  console.log('🌱 Updating packs...')

  // Clear existing packs
  const deleted = await db.pack.deleteMany()
  console.log(`  🗑️  Deleted ${deleted.count} existing packs`)

  for (const pack of packs) {
    const created = await db.pack.create({ data: pack })
    console.log(`  ✅ ${created.name} (${created.price}€/${created.period}) ${created.highlighted ? '⭐ POPULAR' : ''}`)
  }

  console.log(`\n✨ ${packs.length} packs created successfully!`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
