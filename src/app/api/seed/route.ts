import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// POST /api/seed - Seed the database with demo data
export async function POST() {
  try {
    // Create Admin user
    const adminPassword = await bcrypt.hash('Admin123!', 12)
    const admin = await db.user.upsert({
      where: { email: 'admin@lalettrebusiness.com' },
      update: {
        credits: 500,
        isActive: true,
      },
      create: {
        email: 'admin@lalettrebusiness.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'LLB',
        company: 'La Lettre Business',
        role: 'ADMIN',
        credits: 500,
      },
    })

    // Create demo client users with credits
    const clientPassword = await bcrypt.hash('Client123!', 12)
    const client1 = await db.user.upsert({
      where: { email: 'contact@digitalplus.fr' },
      update: { credits: 250 },
      create: {
        email: 'contact@digitalplus.fr',
        password: clientPassword,
        firstName: 'Marie',
        lastName: 'Dupont',
        company: 'Digital Plus',
        role: 'CLIENT',
        credits: 250,
      },
    })

    const client2 = await db.user.upsert({
      where: { email: 'info@formapro.fr' },
      update: { credits: 150 },
      create: {
        email: 'info@formapro.fr',
        password: clientPassword,
        firstName: 'Jean',
        lastName: 'Martin',
        company: 'FormaPro',
        role: 'CLIENT',
        credits: 150,
      },
    })

    const client3 = await db.user.upsert({
      where: { email: 'contact@rgpdconseil.com' },
      update: { credits: 100 },
      create: {
        email: 'contact@rgpdconseil.com',
        password: clientPassword,
        firstName: 'Sophie',
        lastName: 'Lambert',
        company: 'RGPD Conseil',
        role: 'CLIENT',
        credits: 100,
      },
    })

    // Create Wedges (example wedges)
    const wedgesData = [
      {
        name: 'Compta Growth 33',
        sector: 'Experts-comptables',
        region: 'Gironde',
        department: '33',
        frequency: 'WEEKLY',
        sendDays: '1,3,5',
        description: 'Newsletter B2B dédiée aux experts-comptables et cabinets d\'audit en Gironde. Tendances réglementaires, outils numériques et bonnes pratiques.',
      },
      {
        name: 'RH Excellence 75',
        sector: 'Ressources Humaines',
        region: 'Paris',
        department: '75',
        frequency: 'DAILY',
        sendDays: '1,2,3,4,5',
        description: 'Actualités RH quotidiennes pour les DRH et responsables RH en Île-de-France. Droit du travail, recrutement et bien-être au travail.',
      },
      {
        name: 'Tech Innovation 69',
        sector: 'Tech & IT',
        region: 'Rhône',
        department: '69',
        frequency: 'WEEKLY',
        sendDays: '2,4',
        description: 'Veille technologique pour les décideurs IT du Grand Lyon. Cybersécurité, cloud, IA et transformation digitale.',
      },
      {
        name: 'Immobilier Pro 13',
        sector: 'Immobilier',
        region: 'Bouches-du-Rhône',
        department: '13',
        frequency: 'BIWEEKLY',
        sendDays: '1,3',
        description: 'Newsletter immobilière pour les professionnels de Marseille et sa région. Marché, réglementation et nouvelles opérations.',
      },
      {
        name: 'Formation Plus IDF',
        sector: 'Formation & Éducation',
        region: 'Île-de-France',
        department: '75,77,78,91,92,93,94,95',
        frequency: 'WEEKLY',
        sendDays: '1,3,5',
        description: 'Offres de formation et actualités OPCO pour les organismes de formation et les entreprises en Île-de-France.',
      },
      {
        name: 'Juridique & Conseil 44',
        sector: 'Juridique & Conseil',
        region: 'Loire-Atlantique',
        department: '44',
        frequency: 'WEEKLY',
        sendDays: '1,5',
        description: 'Actualités juridiques et fiscales pour les cabinets de conseil et avocats nantais.',
      },
      {
        name: 'BTP Pro 31',
        sector: 'BTP & Construction',
        region: 'Haute-Garonne',
        department: '31',
        frequency: 'BIWEEKLY',
        sendDays: '3,5',
        description: 'Newsletter BTP pour les artisans et entreprises du bâtiment en Haute-Garonne. Marchés publics, normes et innovations.',
      },
      {
        name: 'Santé & Pharma 67',
        sector: 'Santé & Pharma',
        region: 'Bas-Rhin',
        department: '67',
        frequency: 'WEEKLY',
        sendDays: '2,4',
        description: 'Actualités santé et pharma pour les professionnels de santé alsaciens. Innovations thérapeutiques, réglementation et marché.',
      },
    ]

    const wedges = []
    for (const w of wedgesData) {
      const wedge = await db.wedge.upsert({
        where: { id: w.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        update: {
          description: w.description,
          status: 'ACTIVE',
        },
        create: {
          id: w.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: w.name,
          sector: w.sector,
          region: w.region,
          department: w.department,
          description: w.description,
          frequency: w.frequency,
          sendDays: w.sendDays,
          sendTime: '09:00',
          maxAdsPerNewsletter: 3,
          status: 'ACTIVE',
          subscriberCount: Math.floor(Math.random() * 500) + 200,
          totalSent: Math.floor(Math.random() * 50) + 10,
          avgOpenRate: Math.random() * 20 + 25,
          avgClickRate: Math.random() * 8 + 3,
        },
      })
      wedges.push(wedge)
    }

    // Create example Ads
    const adsData = [
      { title: 'Formation Certification RGPD - 3 jours', description: 'Formez vos équipes à la conformité RGPD en 3 jours intensifs. Programme certifiant reconnu par la CNIL.', sector: 'Formation & Éducation', region: 'Île-de-France', wedgeId: wedges[4].id, clientId: client3.id, status: 'PAID', destinationUrl: 'https://rgpdconseil.com/formation', openCount: 342, clickCount: 67 },
      { title: 'Logiciel Comptable Cloud - Offre Lancement', description: 'Découvrez notre solution comptable 100% cloud. Facturation, TVA, bilan : tout-en-un pour votre cabinet.', sector: 'Experts-comptables', region: 'Gironde', wedgeId: wedges[0].id, clientId: client1.id, status: 'SENT', destinationUrl: 'https://digitalplus.fr/compta', openCount: 156, clickCount: 23 },
      { title: 'SIRH Intégré - Démarrage en 48h', description: 'Un SIRH moderne et abordable pour les PME. Paie, congés, notes de frais : tout est automatisé.', sector: 'Ressources Humaines', region: 'Paris', wedgeId: wedges[1].id, clientId: client2.id, status: 'PAID', destinationUrl: 'https://formapro.fr/sirh', openCount: 89, clickCount: 15 },
      { title: 'Audit Cybersécurité - Offre Découverte', description: 'Protégez votre entreprise avec un audit de cybersécurité complet. Rapport détaillé et plan d\'action.', sector: 'Tech & IT', region: 'Rhône', wedgeId: wedges[2].id, clientId: client1.id, status: 'PENDING_VALIDATION', destinationUrl: 'https://digitalplus.fr/cyber', openCount: 0, clickCount: 0 },
      { title: 'Pack Immobilier Pro - Gestion Locative', description: 'Solution tout-en-un pour les agents immobiliers : gestion des biens, locataires, quittances et états des lieux.', sector: 'Immobilier', region: 'Bouches-du-Rhône', wedgeId: wedges[3].id, clientId: client2.id, status: 'SCHEDULED', destinationUrl: 'https://formapro.fr/immobilier', openCount: 0, clickCount: 0, scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
      { title: 'Consulting Digital - Diagnostic Gratuit', description: 'Bénéficiez d\'un diagnostic digital gratuit de 2h. Identifiez les leviers de croissance de votre entreprise.', sector: 'Experts-comptables', region: 'Gironde', wedgeId: wedges[0].id, clientId: client1.id, status: 'PAID', destinationUrl: 'https://digitalplus.fr/diagnostic', openCount: 278, clickCount: 45 },
      { title: 'Accompagnement Juridique Startups', description: 'Création de SAS, SASU, SCI : accompagnement juridique complet avec tarif transparent et fixe.', sector: 'Juridique & Conseil', region: 'Loire-Atlantique', wedgeId: wedges[5].id, clientId: client3.id, status: 'VALIDATED', destinationUrl: 'https://rgpdconseil.com/juridique', openCount: 112, clickCount: 28 },
      { title: 'Matériaux Éco-responsables - Remise 15%', description: 'Fourniture de matériaux de construction écologiques certifiés. Remise de 15% sur la première commande.', sector: 'BTP & Construction', region: 'Haute-Garonne', wedgeId: wedges[6].id, clientId: client2.id, status: 'PAID', destinationUrl: 'https://formapro.fr/btp', openCount: 67, clickCount: 12 },
    ]

    const ads = []
    for (const a of adsData) {
      try {
        const ad = await db.ad.create({ data: a })
        ads.push(ad)
      } catch {
        // Ad might already exist, skip
      }
    }

    // Create Payments for paid ads
    for (const ad of ads) {
      if (ad.status === 'PAID' || ad.status === 'SENT') {
        const existingPayment = await db.payment.findFirst({ where: { adId: ad.id } })
        if (!existingPayment) {
          await db.payment.create({
            data: {
              amount: 49,
              currency: 'EUR',
              description: `Bus Mailing - ${ad.title}`,
              status: 'COMPLETED',
              method: 'card',
              paidAt: new Date(),
              userId: ad.clientId,
              adId: ad.id,
            },
          })
        }
      }
    }

    // Create demo contacts
    const sectors = ['Experts-comptables', 'Ressources Humaines', 'Tech & IT', 'Immobilier', 'Formation & Éducation', 'Juridique & Conseil', 'BTP & Construction', 'Santé & Pharma']
    const firstNames = ['Pierre', 'Marie', 'Jean', 'Sophie', 'Thomas', 'Claire', 'Lucas', 'Emma', 'Antoine', 'Léa', 'Nicolas', 'Isabelle', 'François', 'Camille', 'Baptiste', 'Julie', 'Maxime', 'Charlotte', 'Alexandre', 'Chloé']
    const lastNames = ['Durand', 'Martin', 'Bernard', 'Petit', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Garcia', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard', 'Bonnet', 'Dupont', 'Lambert', 'Fontaine']
    const companies = ['Cabinet Alpha', 'RH Solutions', 'TechVision', 'ImmoPro', 'FormAction', 'Digital Plus', 'Expertise Conseil', 'PME Services', 'Growth Partners', 'Business Hub', 'Atlas Groupe', 'Néo Consulting', 'Bâti Plus', 'Pharma Labo', 'Bio Santé']
    const jobTitles = ['Gérant', 'DAF', 'DRH', 'Directeur', 'Responsable', 'Consultant', 'Manager', 'Associé', 'CEO', 'CFO']
    const companySizes = ['1-10', '10-50', '50-250']

    const contactCount = await db.contact.count()
    if (contactCount < 50) {
      const contactsBatch = []
      for (let i = 0; i < 150; i++) {
        const sector = sectors[Math.floor(Math.random() * sectors.length)]
        const dept = ['33', '75', '69', '13', '92', '94', '44', '31', '67'][Math.floor(Math.random() * 9)]
        const wedge = wedges.find((w) => w.department?.includes(dept))
        contactsBatch.push({
          email: `${firstNames[i % 20].toLowerCase()}.${lastNames[i % 20].toLowerCase()}${i}@example.com`,
          firstName: firstNames[i % 20],
          lastName: lastNames[i % 20],
          company: companies[i % 15],
          sector,
          postalCode: `${dept}${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
          department: dept,
          region: ['Gironde', 'Paris', 'Rhône', 'Bouches-du-Rhône', 'Hauts-de-Seine', 'Val-de-Marne', 'Loire-Atlantique', 'Haute-Garonne', 'Bas-Rhin'][Math.floor(Math.random() * 9)],
          jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
          companySize: companySizes[Math.floor(Math.random() * companySizes.length)],
          status: i < 130 ? 'ACTIVE' : i < 145 ? 'INACTIVE' : 'BOUNCE',
          source: ['LinkedIn', 'Web', 'Partenaire', 'Event', 'Import CSV'][Math.floor(Math.random() * 5)],
          engagementScore: Math.floor(Math.random() * 100),
          wedgeId: wedge?.id,
        })
      }

      await db.contact.createMany({ data: contactsBatch, skipDuplicates: true })
    }

    // Create Newsletters
    const nlCount = await db.newsletter.count()
    if (nlCount < 3) {
      const newslettersData = [
        {
          wedgeId: wedges[0].id,
          subject: '📌 5 tendances comptables en 2026 pour les cabinets girondins',
          status: 'SENT',
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          recipientCount: 342,
          openCount: 128,
          clickCount: 45,
          unsubscribeCount: 3,
          bounceCount: 5,
          senderId: admin.id,
          editorialContent: 'Chers confrères, cette semaine nous abordons les évolutions majeures qui transforment notre profession...',
          aiArticle1: 'Les logiciels comptables intègrent désormais l\'IA pour automatiser la catégorisation des écritures...',
          aiArticle2: 'Le cabinet Dupont & Associés a doublé sa clientèle en 1 an grâce au Bus Mailing LLB...',
        },
        {
          wedgeId: wedges[1].id,
          subject: '🚀 Automatisation RH : les outils qui changent tout',
          status: 'SENT',
          sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          recipientCount: 521,
          openCount: 234,
          clickCount: 78,
          unsubscribeCount: 2,
          bounceCount: 8,
          senderId: admin.id,
          editorialContent: 'Bonjour à toutes et à tous, l\'automatisation est plus que jamais au cœur des enjeux RH...',
          aiArticle1: 'Le SIRH nouvelle génération : prévision des départs, analyse des compétences...',
          aiArticle2: 'Témoignage RH : comment FormaPro a réduit son temps de recrutement de 60%...',
        },
        {
          wedgeId: wedges[4].id,
          subject: '💡 RGPD 2026 : les nouvelles obligations des formateurs',
          status: 'SCHEDULED',
          scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          recipientCount: 289,
          senderId: admin.id,
          editorialContent: 'L\'année 2026 apporte son lot de nouveautés en matière de protection des données...',
        },
      ]

      for (const n of newslettersData) {
        try {
          await db.newsletter.create({ data: n })
        } catch {
          // Skip if exists
        }
      }
    }

    // Create demo subscriptions
    for (const [client, plan, quota] of [
      [client1, 'PREMIUM', { newsletterQuota: 15, newslettersUsed: 8, wedgeQuota: 3 }],
      [client2, 'STANDARD', { newsletterQuota: 5, newslettersUsed: 3, wedgeQuota: 1 }],
      [client3, 'STANDARD', { newsletterQuota: 5, newslettersUsed: 2, wedgeQuota: 1 }],
    ] as any[]) {
      const existing = await db.subscription.findFirst({ where: { userId: client.id, status: 'ACTIVE' } })
      if (!existing) {
        await db.subscription.create({
          data: {
            userId: client.id,
            plan,
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            ...quota,
          },
        })
      }
    }

    return NextResponse.json({
      message: 'Base de données peuplée avec succès !',
      data: {
        admin: { email: 'admin@lalettrebusiness.com', password: 'Admin123!', credits: 500 },
        clients: [
          { email: 'contact@digitalplus.fr', password: 'Client123!', credits: 250 },
          { email: 'info@formapro.fr', password: 'Client123!', credits: 150 },
          { email: 'contact@rgpdconseil.com', password: 'Client123!', credits: 100 },
        ],
        wedges: wedges.length,
        ads: ads.length,
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Erreur lors du seeding', details: String(error) }, { status: 500 })
  }
}
