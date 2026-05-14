import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  const admin = await db.user.upsert({
    where: { email: 'admin@lalettrebusiness.com' },
    update: { credits: 500, isActive: true },
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
  console.log(`✅ Admin: ${admin.email} (${admin.credits} credits)`)

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
  console.log(`✅ Client 1: ${client1.email} (${client1.credits} credits)`)

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
  console.log(`✅ Client 2: ${client2.email} (${client2.credits} credits)`)

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
  console.log(`✅ Client 3: ${client3.email} (${client3.credits} credits)`)

  // Create Wedges
  const wedgesData = [
    { id: 'compta-growth-33', name: 'Compta Growth 33', sector: 'Experts-comptables', region: 'Gironde', department: '33', frequency: 'WEEKLY', sendDays: '1,3,5', description: 'Newsletter B2B dédiée aux experts-comptables et cabinets d\'audit en Gironde.' },
    { id: 'rh-excellence-75', name: 'RH Excellence 75', sector: 'Ressources Humaines', region: 'Paris', department: '75', frequency: 'DAILY', sendDays: '1,2,3,4,5', description: 'Actualités RH quotidiennes pour les DRH et responsables RH en Île-de-France.' },
    { id: 'tech-innovation-69', name: 'Tech Innovation 69', sector: 'Tech & IT', region: 'Rhône', department: '69', frequency: 'WEEKLY', sendDays: '2,4', description: 'Veille technologique pour les décideurs IT du Grand Lyon.' },
    { id: 'immobilier-pro-13', name: 'Immobilier Pro 13', sector: 'Immobilier', region: 'Bouches-du-Rhône', department: '13', frequency: 'BIWEEKLY', sendDays: '1,3', description: 'Newsletter immobilière pour les professionnels de Marseille.' },
    { id: 'formation-plus-idf', name: 'Formation Plus IDF', sector: 'Formation & Éducation', region: 'Île-de-France', department: '75,77,78,91,92,93,94,95', frequency: 'WEEKLY', sendDays: '1,3,5', description: 'Offres de formation et actualités OPCO pour l\'Île-de-France.' },
    { id: 'juridique-conseil-44', name: 'Juridique & Conseil 44', sector: 'Juridique & Conseil', region: 'Loire-Atlantique', department: '44', frequency: 'WEEKLY', sendDays: '1,5', description: 'Actualités juridiques et fiscales pour les cabinets nantais.' },
    { id: 'btp-pro-31', name: 'BTP Pro 31', sector: 'BTP & Construction', region: 'Haute-Garonne', department: '31', frequency: 'BIWEEKLY', sendDays: '3,5', description: 'Newsletter BTP pour les artisans et entreprises du bâtiment.' },
    { id: 'sante-pharma-67', name: 'Santé & Pharma 67', sector: 'Santé & Pharma', region: 'Bas-Rhin', department: '67', frequency: 'WEEKLY', sendDays: '2,4', description: 'Actualités santé et pharma pour les professionnels alsaciens.' },
  ]

  for (const w of wedgesData) {
    await db.wedge.upsert({
      where: { id: w.id },
      update: { description: w.description, status: 'ACTIVE' },
      create: {
        ...w,
        sendTime: '09:00',
        maxAdsPerNewsletter: 3,
        status: 'ACTIVE',
        subscriberCount: Math.floor(Math.random() * 500) + 200,
        totalSent: Math.floor(Math.random() * 50) + 10,
        avgOpenRate: Math.random() * 20 + 25,
        avgClickRate: Math.random() * 8 + 3,
      },
    })
    console.log(`✅ Wedge: ${w.name}`)
  }

  // Create subscriptions for clients
  for (const [client, plan, nlQuota, wQuota] of [
    [client1, 'PREMIUM', 15, 3],
    [client2, 'STANDARD', 5, 1],
    [client3, 'STANDARD', 5, 1],
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
          newsletterQuota: nlQuota,
          newslettersUsed: Math.floor(Math.random() * nlQuota),
          wedgeQuota: wQuota,
        },
      })
      console.log(`✅ Subscription: ${client.email} → ${plan}`)
    }
  }

  // Create sample contacts
  const contactCount = await db.contact.count()
  if (contactCount < 50) {
    const sectors = ['Experts-comptables', 'Ressources Humaines', 'Tech & IT', 'Immobilier', 'Formation & Éducation', 'Juridique & Conseil', 'BTP & Construction', 'Santé & Pharma']
    const firstNames = ['Pierre', 'Marie', 'Jean', 'Sophie', 'Thomas', 'Claire', 'Lucas', 'Emma', 'Antoine', 'Léa', 'Nicolas', 'Isabelle', 'François', 'Camille', 'Baptiste']
    const lastNames = ['Durand', 'Martin', 'Bernard', 'Petit', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Garcia', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier']
    const companies = ['Cabinet Alpha', 'RH Solutions', 'TechVision', 'ImmoPro', 'FormAction', 'Digital Plus', 'Expertise Conseil', 'PME Services', 'Growth Partners', 'Business Hub']
    const depts = ['33', '75', '69', '13', '92', '94', '44', '31', '67']

    const batch = []
    for (let i = 0; i < 150; i++) {
      const dept = depts[Math.floor(Math.random() * depts.length)]
      const wedge = await db.wedge.findFirst({ where: { department: { contains: dept } } })
      batch.push({
        email: `${firstNames[i % 15].toLowerCase()}.${lastNames[i % 15].toLowerCase()}${i}@example.com`,
        firstName: firstNames[i % 15],
        lastName: lastNames[i % 15],
        company: companies[i % 10],
        sector: sectors[Math.floor(Math.random() * sectors.length)],
        postalCode: `${dept}${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
        department: dept,
        region: ['Gironde', 'Paris', 'Rhône', 'Bouches-du-Rhône', 'Hauts-de-Seine', 'Val-de-Marne', 'Loire-Atlantique', 'Haute-Garonne', 'Bas-Rhin'][Math.floor(Math.random() * 9)],
        jobTitle: ['Gérant', 'DAF', 'DRH', 'Directeur', 'Responsable', 'Consultant'][Math.floor(Math.random() * 6)],
        companySize: ['1-10', '10-50', '50-250'][Math.floor(Math.random() * 3)],
        status: i < 130 ? 'ACTIVE' : i < 145 ? 'INACTIVE' : 'BOUNCE',
        source: ['LinkedIn', 'Web', 'Partenaire', 'Event'][Math.floor(Math.random() * 4)],
        engagementScore: Math.floor(Math.random() * 100),
        wedgeId: wedge?.id,
      })
    }
    await db.contact.createMany({ data: batch, skipDuplicates: true })
    console.log(`✅ Created ${batch.length} contacts`)
  } else {
    console.log(`ℹ️  Contacts already exist (${contactCount})`)
  }

  // Create newsletters
  const nlCount = await db.newsletter.count()
  if (nlCount < 3) {
    const wedges = await db.wedge.findMany()
    for (const [idx, data] of [
      { wedgeIdx: 0, subject: '📌 5 tendances comptables en 2026', status: 'SENT', sentDays: 2, recipientCount: 342, openCount: 128, clickCount: 45 },
      { wedgeIdx: 1, subject: '🚀 Automatisation RH : les outils qui changent tout', status: 'SENT', sentDays: 1, recipientCount: 521, openCount: 234, clickCount: 78 },
      { wedgeIdx: 4, subject: '💡 RGPD 2026 : nouvelles obligations', status: 'SCHEDULED', sentDays: 0, recipientCount: 289, openCount: 0, clickCount: 0 },
    ] as any[]) {
      await db.newsletter.create({
        data: {
          wedgeId: wedges[data.wedgeIdx].id,
          subject: data.subject,
          status: data.status,
          sentAt: data.sentDays > 0 ? new Date(Date.now() - data.sentDays * 24 * 60 * 60 * 1000) : null,
          scheduledAt: data.sentDays === 0 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
          recipientCount: data.recipientCount,
          openCount: data.openCount,
          clickCount: data.clickCount,
          senderId: admin.id,
        },
      })
      console.log(`✅ Newsletter: ${data.subject}`)
    }
  } else {
    console.log(`ℹ️  Newsletters already exist (${nlCount})`)
  }

  console.log('\n🎉 Seeding complete!')
  console.log('Comptes démo :')
  console.log('  Admin: admin@lalettrebusiness.com / Admin123! (500 credits)')
  console.log('  Client: contact@digitalplus.fr / Client123! (250 credits)')
  console.log('  Client: info@formapro.fr / Client123! (150 credits)')
  console.log('  Client: contact@rgpdconseil.com / Client123! (100 credits)')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
