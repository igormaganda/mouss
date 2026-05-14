import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating test accounts...');

  // Hash passwords
  const userPassword = await bcrypt.hash('User123!', 12);
  const counselorPassword = await bcrypt.hash('Counselor123!', 12);

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
  console.log('✅ Agency created:', agency.name);

  // Create 2 counselors
  const counselors = [
    {
      email: 'conseiller1@crea-entreprise.fr',
      firstName: 'Sophie',
      lastName: 'Martin',
      password: counselorPassword,
      role: 'counselor',
      agencyId: agency.id,
    },
    {
      email: 'conseiller2@crea-entreprise.fr',
      firstName: 'Thomas',
      lastName: 'Dubois',
      password: counselorPassword,
      role: 'counselor',
      agencyId: agency.id,
    },
  ];

  for (const counselor of counselors) {
    const created = await prisma.counselor.upsert({
      where: { email: counselor.email },
      update: {},
      create: counselor,
    });
    console.log('✅ Counselor created:', created.email, '| Password: Counselor123!');
  }

  // Create 2 users (beneficiaries)
  const users = [
    {
      email: 'user1@crea-entreprise.fr',
      firstName: 'Marie',
      lastName: 'Lambert',
      password: userPassword,
      phone: '06 12 34 56 78',
      city: 'Lyon',
      postalCode: '69001',
      persona: 'launcher',
      language: 'fr',
      employmentStatus: 'unemployed',
      experienceYears: 3,
      educationLevel: 'bac+2',
      counselorId: counselors[0].email ? undefined : agency.id,
      agencyId: agency.id,
    },
    {
      email: 'user2@crea-entreprise.fr',
      firstName: 'Pierre',
      lastName: 'Bernard',
      password: userPassword,
      phone: '06 98 76 54 32',
      city: 'Lyon',
      postalCode: '69002',
      persona: 'explorer',
      language: 'fr',
      employmentStatus: 'student',
      experienceYears: 0,
      educationLevel: 'bac',
      counselorId: counselors[1].email ? undefined : agency.id,
      agencyId: agency.id,
    },
  ];

  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log('✅ User created:', created.email, '| Password: User123!');
  }

  console.log('');
  console.log('🎉 Accounts created successfully!');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                ACCOUNTS CREDENTIALS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('👥 USERS (Bénéficiaires):');
  console.log('   Email: user1@crea-entreprise.fr');
  console.log('   Password: User123!');
  console.log('');
  console.log('   Email: user2@crea-entreprise.fr');
  console.log('   Password: User123!');
  console.log('');
  console.log('👨‍🏫 COUNSELORS (Conseillers):');
  console.log('   Email: conseiller1@crea-entreprise.fr');
  console.log('   Password: Counselor123!');
  console.log('');
  console.log('   Email: conseiller2@crea-entreprise.fr');
  console.log('   Password: Counselor123!');
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
