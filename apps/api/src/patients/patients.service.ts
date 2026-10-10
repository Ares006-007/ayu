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
}
