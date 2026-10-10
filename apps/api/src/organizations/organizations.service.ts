import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/database.module.js';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany();
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              }
            }
          }
        }
      }
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }
}
