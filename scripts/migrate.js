// Migration script for Vercel deployment
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Running Prisma db push...');

  const { execSync } = require('child_process');
  try {
    execSync('npx prisma db push --skip-generate', {
      stdio: 'inherit',
      env: { ...process.env }
    });
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
