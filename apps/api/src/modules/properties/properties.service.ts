import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, Prisma, Province, ResourceType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';

@Injectable()
export class PropertiesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  list(organizationId: string) {
    return this.prisma.property.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: { id: string; organizationId: string }, dto: CreatePropertyDto) {
    const property = await this.prisma.property.create({
      data: {
        organizationId: user.organizationId,
        name: dto.name,
        address: dto.address,
        province: dto.province as Province,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: AuditAction.PROPERTY_CREATED,
        resourceType: ResourceType.PROPERTY,
        resourceId: property.id,
      },
    });

    return property;
  }

  async getById(organizationId: string, id: string) {
    const property = await this.prisma.property.findFirst({
      where: { organizationId, id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async getApplications(organizationId: string, propertyId: string) {
    await this.getById(organizationId, propertyId);

    return this.prisma.application.findMany({
      where: { organizationId, propertyId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
