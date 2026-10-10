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
};
PatientsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], PatientsService);
export { PatientsService };
//# sourceMappingURL=patients.service.js.map