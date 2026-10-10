import { PrismaClient } from '../../../node_modules/.prisma/client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding clinical data...');

  const patient = await prisma.patient.findFirst({
    where: { user: { email: 'patient@demo.ayu' } }
  });

  const doctor = await prisma.doctor.findFirst({
    where: { user: { email: 'doctor@demo.ayu' } }
  });

  if (!patient || !doctor) {
    console.error('Patient or doctor not found. Run seed-auth.ts first.');
    return;
  }

  const organization = await prisma.organization.findFirst({
    where: { type: 'CLINIC' }
  });

  if (!organization) {
    console.error('Clinic not found.');
    return;
  }

  // Clear existing clinical data to avoid duplicates if run multiple times
  await prisma.doseEvent.deleteMany({});
  await prisma.prescriptionItem.deleteMany({});
  await prisma.prescription.deleteMany({});
  await prisma.consultation.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.document.deleteMany({});

  const today = new Date();
  today.setHours(9, 0, 0, 0);

  // 1. Appointment (Completed)
  const pastApt = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      organizationId: organization.id,
      startsAt: today,
      endsAt: new Date(today.getTime() + 30 * 60000), // 30 mins
      reason: 'General Checkup',
      status: 'COMPLETED'
    }
  });

  // 1.1 Consultation
  await prisma.consultation.create({
    data: {
      appointmentId: pastApt.id,
      patientId: patient.id,
      doctorId: doctor.id,
      notes: 'Patient reported mild headaches. Blood pressure slightly elevated.',
      diagnosis: 'Tension Headache',
      status: 'COMPLETED',
      startedAt: today,
      completedAt: new Date(today.getTime() + 25 * 60000)
    }
  });

  // 1.2 Medicine & Prescription
  const medicine = await prisma.medicine.upsert({
    where: { id: 'med-1' },
    update: {},
    create: {
      id: 'med-1',
      genericName: 'Paracetamol',
      brandName: 'Crocin',
      strength: '500mg',
      dosageForm: 'Tablet'
    }
  });

  const pres = await prisma.prescription.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      organizationId: organization.id,
      status: 'ACTIVE',
      items: {
        create: [
          {
            medicineId: medicine.id,
            medicineNameSnapshot: 'Paracetamol 500mg',
            dose: '1 tablet',
            frequency: 'Twice daily',
            scheduleDefinition: '{"type": "daily"}',
            foodInstruction: 'AFTER_FOOD',
            durationDays: 5
          }
        ]
      }
    }
  });

  // 2. Appointment (Scheduled for Later Today)
  const laterToday = new Date(today);
  laterToday.setHours(15, 30, 0, 0);
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      organizationId: organization.id,
      startsAt: laterToday,
      endsAt: new Date(laterToday.getTime() + 30 * 60000),
      reason: 'Follow-up for Blood Pressure',
      status: 'SCHEDULED'
    }
  });

  // 3. Dose Events (for the Patient dashboard)
  const doseTime = new Date();
  doseTime.setHours(8, 0, 0, 0); // 8 AM today
  
  await prisma.doseEvent.create({
    data: {
      patientId: patient.id,
      eventType: 'TAKEN',
      eventAt: doseTime,
      source: 'WEB'
    }
  });

  const doseTime2 = new Date();
  doseTime2.setHours(20, 0, 0, 0); // 8 PM today
  
  await prisma.doseEvent.create({
    data: {
      patientId: patient.id,
      eventType: 'PENDING',
      eventAt: doseTime2,
      source: 'WEB'
    }
  });

  // 4. Lab Report
  // 4. Lab Report
  await prisma.document.create({
    data: {
      patientId: patient.id,
      ownerType: 'PATIENT',
      ownerId: patient.id,
      category: 'LAB_REPORT',
      storageKey: 'reports/cbc.pdf',
      originalFilename: 'cbc.pdf',
      mimeType: 'application/pdf',
      size: 1024,
      checksum: 'dummy-checksum-123',
      uploadedBy: doctor.userId
    }
  });

  console.log('Clinical data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
