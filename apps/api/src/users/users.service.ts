import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.module.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async recordFailedLogin(id: string, attempts: number, lockedUntil: Date | null) {
    return this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil,
        status: lockedUntil ? 'LOCKED' : 'ACTIVE',
      },
    });
  }

  async resetLoginAttempts(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        status: 'ACTIVE',
      },
    });
  }

  async create(data: {
    email: string;
    externalAuthId?: string;
    status?: string;
    passwordHash?: string;
    name?: string | null;
    emailVerifiedAt?: Date | null;
  }) {
    return this.prisma.user.create({ data });
  }

  async update(
    id: string,
    data: Partial<{
      externalAuthId: string;
      name: string | null;
      passwordHash: string;
      emailVerifiedAt: Date | null;
    }>,
  ) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
