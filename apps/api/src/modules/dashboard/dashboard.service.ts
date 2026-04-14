import { Inject, Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async stats(organizationId: string) {
    const [properties, applications, pendingApplications] = await Promise.all([
      this.prisma.property.count({ where: { organizationId } }),
      this.prisma.application.count({ where: { organizationId } }),
      this.prisma.application.count({ where: { organizationId, status: ApplicationStatus.PENDING } }),
    ]);

    return { properties, applications, pendingApplications };
  }
}
