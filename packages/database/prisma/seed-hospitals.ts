import { PrismaClient } from '../../../node_modules/.prisma/client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock hospitals and doctors...');

  // Create Organizations (Hospitals)
  const citycare = await prisma.organization.create({
    data: {
      type: 'CLINIC',
      name: 'Citycare General Hospital',
      timezone: 'UTC',
    },
  });

  const metro = await prisma.organization.create({
    data: {
      type: 'CLINIC',
      name: 'Metro Health Clinic',
      timezone: 'UTC',
    },
  });

  const apex = await prisma.organization.create({
    data: {
      type: 'CLINIC',
      name: 'Apex Medical Center',
      timezone: 'UTC',
    },
  });

  // Create mock Users for Doctors
  const docUser1 = await prisma.user.create({
    data: { email: 'doc1@citycare.com', status: 'ACTIVE' },
  });
  const docUser2 = await prisma.user.create({
    data: { email: 'doc2@metro.com', status: 'ACTIVE' },
  });
  const docUser3 = await prisma.user.create({
    data: { email: 'doc3@apex.com', status: 'ACTIVE' },
  });

  // Create Doctors
  await prisma.doctor.create({
    data: {
      userId: docUser1.id,
      registrationNumber: 'REG-CC-101',
      specialty: 'General Medicine',
      clinicId: citycare.id,
    },
  });

  await prisma.doctor.create({
    data: {
      userId: docUser2.id,
      registrationNumber: 'REG-MH-202',
      specialty: 'Cardiology',
      clinicId: metro.id,
    },
  });

  await prisma.doctor.create({
    data: {
      userId: docUser3.id,
      registrationNumber: 'REG-AM-303',
      specialty: 'Pediatrics',
      clinicId: apex.id,
    },
  });

  console.log('Successfully seeded 3 mock hospitals and 3 doctors.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
