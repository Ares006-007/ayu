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
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../database/database.module.js';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
let SessionService = class SessionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    hashToken(token) {
        return createHash('sha256').update(token).digest('hex');
    }
    async createSession(userId, meta) {
        const refreshToken = randomBytes(48).toString('hex');
        const refreshTokenHash = this.hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
        const session = await this.prisma.session.create({
            data: {
                userId,
                refreshTokenHash,
                expiresAt,
                userAgent: meta?.userAgent,
                ipAddress: meta?.ipAddress,
            },
        });
        return { sessionId: session.id, refreshToken };
    }
    async validateRefreshToken(refreshToken) {
        const refreshTokenHash = this.hashToken(refreshToken);
        const session = await this.prisma.session.findUnique({
            where: { refreshTokenHash },
        });
        if (!session || session.revokedAt || session.expiresAt < new Date()) {
            return null;
        }
        return { userId: session.userId, sessionId: session.id };
    }
    async rotateSession(sessionId, userId, meta) {
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { revokedAt: new Date() },
        });
        return this.createSession(userId, meta);
    }
    async revokeSession(sessionId) {
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { revokedAt: new Date() },
        });
    }
    async revokeByRefreshToken(refreshToken) {
        const refreshTokenHash = this.hashToken(refreshToken);
        const session = await this.prisma.session.findUnique({
            where: { refreshTokenHash },
        });
        if (session && !session.revokedAt) {
            await this.revokeSession(session.id);
        }
    }
    async revokeAllForUser(userId) {
        await this.prisma.session.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
};
SessionService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SessionService);
export { SessionService };
//# sourceMappingURL=session.service.js.map