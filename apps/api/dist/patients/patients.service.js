var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/database.module.js';
let PatientsService = class PatientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPatientProfile(patientId) {
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
    async getPatientDashboard(patientId) {
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
            where: { patientId, type: 'LAB_REPORT' },
            orderBy: { createdAt: 'desc' },
            take: 2
        });
        return {
            appointments,
            activePrescriptions,
            doseEvents: doseEvents.map(d => ({
                id: d.id,
                status: d.eventType.toLowerCase(),
                medicineName: "Medication",
                scheduledTime: d.eventAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })),
            recentReports
        };
    }
};
PatientsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], PatientsService);
export { PatientsService };
//# sourceMappingURL=patients.service.js.map