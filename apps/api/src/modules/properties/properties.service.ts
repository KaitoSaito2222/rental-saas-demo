import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, Province, ResourceType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';

@Injectable()
export class PropertiesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      include: { organization: true },
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

  async getById(id: string) {
    const property = await this.prisma.property.findFirst({
      where: { id },
      include: { organization: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async getApplications(organizationId: string, propertyId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, organizationId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.prisma.application.findMany({
      where: { organizationId, propertyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(user: { id: string; organizationId: string }, id: string, dto: UpdatePropertyDto) {
    const property = await this.prisma.property.findFirst({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.organizationId !== user.organizationId) {
      throw new NotFoundException('Property not found');
    }

    const updated = await this.prisma.property.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.province !== undefined && { province: dto.province as Province }),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: AuditAction.PROPERTY_UPDATED,
        resourceType: ResourceType.PROPERTY,
        resourceId: updated.id,
      },
    });

    return updated;
  }

  async remove(user: { id: string; organizationId: string }, id: string) {
    const property = await this.prisma.property.findFirst({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.organizationId !== user.organizationId) {
      throw new NotFoundException('Property not found');
    }

    await this.prisma.property.delete({ where: { id } });

    await this.prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: AuditAction.PROPERTY_DELETED,
        resourceType: ResourceType.PROPERTY,
        resourceId: id,
      },
    });

    return { id };
  }
}
