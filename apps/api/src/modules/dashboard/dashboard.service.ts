import { Inject, Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { Role } from '@property-copilot/shared';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async stats(user: { id: string; organizationId: string; role?: Role | string }) {
    const applicationWhere =
      user.role === Role.TENANT
        ? { organizationId: user.organizationId, applicantUserId: user.id }
        : { organizationId: user.organizationId };

    const [properties, applications, pendingApplications] = await Promise.all([
      this.prisma.property.count({ where: { organizationId: user.organizationId } }),
      this.prisma.application.count({ where: applicationWhere }),
      this.prisma.application.count({
        where: { ...applicationWhere, status: ApplicationStatus.PENDING },
      }),
    ]);

    return { properties, applications, pendingApplications };
  }
}
