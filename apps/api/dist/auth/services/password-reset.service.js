var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/database.module.js';
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
let PasswordResetService = class PasswordResetService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    hashToken(token) {
        return createHash('sha256').update(token).digest('hex');
    }
    async createResetToken(userId) {
        const token = randomBytes(32).toString('hex');
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
        await this.prisma.passwordResetToken.create({
            data: { userId, tokenHash, expiresAt },
        });
        return token;
    }
    async resetPassword(token, newPassword) {
        const tokenHash = this.hashToken(token);
        const record = await this.prisma.passwordResetToken.findUnique({
            where: { tokenHash },
        });
        if (!record || record.usedAt || record.expiresAt < new Date()) {
            throw new BadRequestException('Invalid or expired reset token');
        }
        const passwordHash = await argon2.hash(newPassword);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: record.userId },
                data: {
                    passwordHash,
                    failedLoginAttempts: 0,
                    lockedUntil: null,
                    status: 'ACTIVE',
                },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: record.id },
                data: { usedAt: new Date() },
            }),
            this.prisma.session.updateMany({
                where: { userId: record.userId, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);
        return record.userId;
    }
};
PasswordResetService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], PasswordResetService);
export { PasswordResetService };
//# sourceMappingURL=password-reset.service.js.map