import { PrismaClient } from '../../../node_modules/.prisma/client/index.js';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Password123!';

async function main() {
  console.log('Seeding auth test users...');

  const passwordHash = await argon2.hash(DEMO_PASSWORD);

  const platformOrg = await prisma.organization.upsert({
    where: { id: 'seed-platform' },
    update: {},
    create: {
      id: 'seed-platform',
      type: 'PLATFORM',
      name: 'AYU Platform',
    },
  });

  const clinic = await prisma.organization.upsert({
    where: { id: 'seed-clinic-1' },
    update: {},
    create: {
      id: 'seed-clinic-1',
      type: 'CLINIC',
      name: 'Citycare General Hospital',
    },
  });

  const pharmacyOrg = await prisma.organization.upsert({
    where: { id: 'seed-pharmacy-1' },
    update: {},
    create: {
      id: 'seed-pharmacy-1',
      type: 'PHARMACY',
      name: 'Apollo Pharmacy',
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@demo.ayu' },
    update: { passwordHash, name: 'Aarav Sharma', status: 'ACTIVE' },
    create: {
      email: 'patient@demo.ayu',
      name: 'Aarav Sharma',
      passwordHash,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      dateOfBirth: new Date('1992-03-14'),
      gender: 'male',
      status: 'ACTIVE',
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@demo.ayu' },
    update: { passwordHash, name: 'Dr. Ramesh Kumar', status: 'ACTIVE' },
    create: {
      email: 'doctor@demo.ayu',
      name: 'Dr. Ramesh Kumar',
      passwordHash,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  let doctor =
    await prisma.doctor.findUnique({ where: { userId: doctorUser.id } }) ??
    await prisma.doctor.findUnique({ where: { registrationNumber: 'REG-CC-101' } });
  if (!doctor) {
    doctor = await prisma.doctor.create({
      data: {
        userId: doctorUser.id,
        registrationNumber: 'REG-CC-101',
        specialty: 'General Medicine',
        clinicId: clinic.id,
      },
    });
  } else if (doctor.userId !== doctorUser.id) {
    doctor = await prisma.doctor.update({
      where: { id: doctor.id },
      data: { userId: doctorUser.id, clinicId: clinic.id },
    });
  }

  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: { organizationId: clinic.id, userId: doctorUser.id },
    },
    update: { role: 'DOCTOR', status: 'ACTIVE' },
    create: {
      organizationId: clinic.id,
      userId: doctorUser.id,
      role: 'DOCTOR',
      permissions: '[]',
      status: 'ACTIVE',
    },
  });

  const pharmacyUser = await prisma.user.upsert({
    where: { email: 'pharmacy@demo.ayu' },
    update: { passwordHash, name: 'Apollo Pharmacy Staff', status: 'ACTIVE' },
    create: {
      email: 'pharmacy@demo.ayu',
      name: 'Apollo Pharmacy Staff',
      passwordHash,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.pharmacy.upsert({
    where: { organizationId: pharmacyOrg.id },
    update: {},
    create: {
      organizationId: pharmacyOrg.id,
      licenseNumber: 'PH-001',
      address: '123 Main St',
      contactInfo: '{}',
    },
  });

  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: { organizationId: pharmacyOrg.id, userId: pharmacyUser.id },
    },
    update: { role: 'PHARMACIST', status: 'ACTIVE' },
    create: {
      organizationId: pharmacyOrg.id,
      userId: pharmacyUser.id,
      role: 'PHARMACIST',
      permissions: '[]',
      status: 'ACTIVE',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.ayu' },
    update: { passwordHash, name: 'Clinic Admin', status: 'ACTIVE' },
    create: {
      email: 'admin@demo.ayu',
      name: 'Clinic Admin',
      passwordHash,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: { organizationId: clinic.id, userId: adminUser.id },
    },
    update: { role: 'ADMIN', status: 'ACTIVE' },
    create: {
      organizationId: clinic.id,
      userId: adminUser.id,
      role: 'ADMIN',
      permissions: '[]',
      status: 'ACTIVE',
    },
  });

  const multiUser = await prisma.user.upsert({
    where: { email: 'multi@demo.ayu' },
    update: { passwordHash, name: 'Multi Role User', status: 'ACTIVE' },
    create: {
      email: 'multi@demo.ayu',
      name: 'Multi Role User',
      passwordHash,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.patient.upsert({
    where: { userId: multiUser.id },
    update: {},
    create: {
      userId: multiUser.id,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'other',
      status: 'ACTIVE',
    },
  });

  const existingMultiDoctor = await prisma.doctor.findUnique({ where: { userId: multiUser.id } });
  if (!existingMultiDoctor) {
    await prisma.doctor.create({
      data: {
        userId: multiUser.id,
        registrationNumber: 'REG-MULTI-1',
        specialty: 'General Medicine',
        clinicId: clinic.id,
      },
    });
  }

  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: { organizationId: clinic.id, userId: multiUser.id },
    },
    update: { role: 'DOCTOR', status: 'ACTIVE' },
    create: {
      organizationId: clinic.id,
      userId: multiUser.id,
      role: 'DOCTOR',
      permissions: '[]',
      status: 'ACTIVE',
    },
  });

  // Link doctor to patient via appointment for object-level auth tests
  const patient = await prisma.patient.findUnique({ where: { userId: patientUser.id } });
  if (patient) {
    const existing = await prisma.appointment.findFirst({
      where: { patientId: patient.id, doctorId: doctor.id },
    });
    if (!existing) {
      await prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          organizationId: clinic.id,
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 3600000),
          status: 'SCHEDULED',
        },
      });
    }
  }

  console.log('Seeded users (password: Password123!):');
  console.log('  patient@demo.ayu');
  console.log('  doctor@demo.ayu');
  console.log('  pharmacy@demo.ayu');
  console.log('  admin@demo.ayu');
  console.log('  multi@demo.ayu (patient + doctor)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
