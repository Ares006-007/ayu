import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/database.module.js';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPatientProfile(patientId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const { user, ...profile } = patient;
    return {
      id: profile.id,
      userId: profile.userId,
      email: user.email,
      name: user.name,
      phone: user.phone,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      healthRecordNumber: profile.healthRecordNumber,
      status: profile.status,
    };
  }

  async getPatientDashboard(patientId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: { include: { user: true } },
        organization: true
      },
      orderBy: { startsAt: 'asc' },
    });

    const activePrescriptions = await this.prisma.prescription.findMany({
      where: { patientId, status: 'ACTIVE' },
      include: {
        doctor: { include: { user: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' },
    });

    const doseEvents = await this.prisma.doseEvent.findMany({
      where: { 
        patientId,
        eventAt: {
          gte: today,
        }
      },
      orderBy: { eventAt: 'asc' }
    });

    const recentReports = await this.prisma.document.findMany({
      where: { patientId, category: 'LAB_REPORT' },
      orderBy: { createdAt: 'desc' },
      take: 2
    });

    return {
      appointments,
      activePrescriptions,
      doseEvents: doseEvents.map(d => ({
        id: d.id,
        status: d.eventType.toLowerCase(),
        medicineName: "Medication", // Requires join with prescriptionItem
        scheduledTime: d.eventAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })),
      recentReports
    };
  }

  async createAppointment(patientId: string, payload: { doctorId: string, date: string, timeSlot: string, symptoms: string }) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: payload.doctorId } });
    const startsAt = new Date(payload.date);
    const endsAt = new Date(startsAt.getTime() + 30 * 60000); // 30 minutes duration
    
    const appointment = await this.prisma.appointment.create({
      data: {
        patientId,
        doctorId: payload.doctorId,
        organizationId: doctor?.clinicId || '',
        startsAt,
        endsAt,
        reason: payload.symptoms,
        status: 'SCHEDULED',
      }
    });
    return appointment;
  }
}
