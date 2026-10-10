var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.module.js';
let DoctorsService = class DoctorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTodaysAppointments(doctorId) {
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
    async getConsultations(doctorId) {
        return this.prisma.consultation.findMany({
            where: { doctorId },
            include: {
                patient: { include: { user: true } }
            },
            orderBy: { startedAt: 'desc' },
            take: 20
        });
    }
    async getPrescriptions(doctorId) {
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
    async getPatients(doctorId) {
        return this.prisma.patient.findMany({
            where: {
                appointments: {
                    some: { doctorId }
                }
            },
            include: { user: true }
        });
    }
};
DoctorsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DoctorsService);
export { DoctorsService };
//# sourceMappingURL=doctors.service.js.map