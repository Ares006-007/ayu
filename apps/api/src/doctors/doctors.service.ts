import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.module.js';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async getTodaysAppointments(doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.prisma.appointment.findMany({
      where: {
        doctorId,
        startsAt: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        patient: { include: { user: true } }
      },
      orderBy: { startsAt: 'asc' }
    });
  }

  async getConsultations(doctorId: string) {
    return this.prisma.consultation.findMany({
      where: { doctorId },
      include: {
        patient: { include: { user: true } }
      },
      orderBy: { startedAt: 'desc' },
      take: 20
    });
  }

  async getPrescriptions(doctorId: string) {
    return this.prisma.prescription.findMany({
      where: { doctorId },
      include: {
        patient: { include: { user: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  async getPatients(doctorId: string) {
    return this.prisma.patient.findMany({
      where: {
        appointments: {
          some: { doctorId }
        }
      },
      include: { user: true }
    });
  }
}
