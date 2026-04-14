import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus, AuditAction, Prisma, ResourceType } from '@prisma/client';
import { Role } from '@property-copilot/shared';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';

@Injectable()
export class ApplicationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  list(user: { id: string; organizationId: string; role?: Role | string }) {
    const where: Prisma.ApplicationWhereInput =
      user.role === Role.TENANT
        ? { organizationId: user.organizationId, applicantUserId: user.id }
        : { organizationId: user.organizationId };

    return this.prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { property: true },
    });
  }

  async create(user: { id: string; organizationId: string }, dto: CreateApplicationDto) {
    const property = await this.prisma.property.findFirst({
      where: { id: dto.propertyId, organizationId: user.organizationId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const application = await this.prisma.application.create({
      data: {
        organizationId: user.organizationId,
        propertyId: dto.propertyId,
        applicantUserId: user.id,
        applicantEmail: dto.applicantEmail,
        income: dto.income,
        notes: dto.notes,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: AuditAction.APPLICATION_SUBMITTED,
        resourceType: ResourceType.APPLICATION,
        resourceId: application.id,
      },
    });

    return application;
  }

  async getById(user: { id: string; organizationId: string; role?: Role | string }, id: string) {
    const where: Prisma.ApplicationWhereInput =
      user.role === Role.TENANT
        ? { organizationId: user.organizationId, id, applicantUserId: user.id }
        : { organizationId: user.organizationId, id };

    const application = await this.prisma.application.findFirst({
      where,
      include: { property: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async updateStatus(
    user: { id: string; organizationId: string },
    id: string,
    dto: UpdateApplicationStatusDto,
  ) {
    await this.getById(user, id);

    const application = await this.prisma.application.update({
      where: { id },
      data: { status: dto.status as ApplicationStatus },
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: AuditAction.APPLICATION_STATUS_UPDATED,
        resourceType: ResourceType.APPLICATION,
        resourceId: application.id,
      },
    });

    return application;
  }

  async remove(user: { id: string; organizationId: string }, id: string) {
    await this.getById(user, id);

    await this.prisma.application.delete({ where: { id } });

    await this.prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: AuditAction.APPLICATION_DELETED,
        resourceType: ResourceType.APPLICATION,
        resourceId: id,
      },
    });

    return { id };
  }
}
