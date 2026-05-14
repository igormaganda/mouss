import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating test accounts...');

  // Create or update demo agency
  const agency = await prisma.agency.upsert({
    where: { slug: 'mission-locale-lyon' },
    update: {},
    create: {
      name: 'Mission Locale Lyon',
      nameEn: 'Lyon Mission Local',
      slug: 'mission-locale-lyon',
      description: 'Accompagnement des jeunes vers l\'emploi et la création d\'entreprise',
      city: 'Lyon',
      postalCode: '69001',
      country: 'France',
      type: 'mission_locale',
      maxCounselors: 10,
      maxBeneficiaries: 500,
      isActive: true,
    },
  });
  console.log('✅ Agency created:', agency.name, 'ID:', agency.id);

  // Create 2 counselors
  const counselor1 = await prisma.counselor.upsert({
    where: { email: 'conseiller1@crea-entreprise.fr' },
    update: {},
    create: {
      email: 'conseiller1@crea-entreprise.fr',
      firstName: 'Sophie',
      lastName: 'Martin',
      role: 'counselor',
      agencyId: agency.id,
      maxBeneficiaries: 50,
      isActive: true,
    },
  });
  console.log('✅ Counselor created:', counselor1.email);

  const counselor2 = await prisma.counselor.upsert({
    where: { email: 'conseiller2@crea-entreprise.fr' },
    update: {},
    create: {
      email: 'conseiller2@crea-entreprise.fr',
      firstName: 'Thomas',
      lastName: 'Dubois',
      role: 'counselor',
      agencyId: agency.id,
      maxBeneficiaries: 50,
      isActive: true,
    },
  });
  console.log('✅ Counselor created:', counselor2.email);

  // Create 2 users (beneficiaries)
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@crea-entreprise.fr' },
    update: {},
    create: {
      email: 'user1@crea-entreprise.fr',
      firstName: 'Marie',
      lastName: 'Lambert',
      phone: '06 12 34 56 78',
      city: 'Lyon',
      postalCode: '69001',
      persona: 'launcher',
      language: 'fr',
      employmentStatus: 'unemployed',
      experienceYears: 3,
      educationLevel: 'bac+2',
      counselorId: counselor1.id,
      agencyId: agency.id,
      isActive: true,
      onboardingCompleted: true,
    },
  });
  console.log('✅ User created:', user1.email);

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@crea-entreprise.fr' },
    update: {},
    create: {
      email: 'user2@crea-entreprise.fr',
      firstName: 'Pierre',
      lastName: 'Bernard',
      phone: '06 98 76 54 32',
      city: 'Lyon',
      postalCode: '69002',
      persona: 'explorer',
      language: 'fr',
      employmentStatus: 'student',
      experienceYears: 0,
      educationLevel: 'bac',
      counselorId: counselor2.id,
      agencyId: agency.id,
      isActive: true,
      onboardingCompleted: false,
    },
  });
  console.log('✅ User created:', user2.email);

  console.log('');
  console.log('🎉 Accounts created successfully!');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                ACCOUNTS CREATED');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('👥 USERS (Bénéficiaires):');
  console.log('   Email: user1@crea-entreprise.fr');
  console.log('   Email: user2@crea-entreprise.fr');
  console.log('   (Use "Forgot Password" to set passwords)');
  console.log('');
  console.log('👨‍🏫 COUNSELORS (Conseillers):');
  console.log('   Email: conseiller1@crea-entreprise.fr');
  console.log('   Email: conseiller2@crea-entreprise.fr');
  console.log('   (Use "Forgot Password" to set passwords)');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
