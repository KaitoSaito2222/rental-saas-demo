import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from './tenant-context.service.js';

const TENANT_MODELS = new Set(['User', 'Session', 'Property', 'Application', 'AuditLog']);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(TenantContextService) private readonly tenantContext: TenantContextService) {
    super();

    this.$use(async (params, next) => {
      if (!params.model || !TENANT_MODELS.has(params.model)) {
        return next(params);
      }

      const organizationId = this.tenantContext.getOrganizationId();
      const tenantActions = new Set([
        'findUnique',
        'findFirst',
        'findMany',
        'count',
        'aggregate',
        'groupBy',
        'update',
        'updateMany',
        'delete',
        'deleteMany',
        'create',
        'createMany',
        'upsert',
      ]);

      if (!organizationId) {
        throw new Error(`Tenant context is required for ${params.model} operations`);
      }

      if (!tenantActions.has(params.action)) {
        return next(params);
      }

      const args = params.args ?? {};

      if (params.action === 'create') {
        params.args = {
          ...args,
          data: {
            ...args.data,
            organizationId: args.data?.organizationId ?? organizationId,
          },
        };
        return next(params);
      }

      if (params.action === 'createMany' && Array.isArray(args.data)) {
        params.args = {
          ...args,
          data: args.data.map((item: Record<string, unknown>) => ({
            ...item,
            organizationId: item.organizationId ?? organizationId,
          })),
        };
        return next(params);
      }

      if (params.action === 'findUnique') {
        params.action = 'findFirst';
      }

      if (params.action === 'upsert') {
        params.args = {
          ...args,
          create: {
            ...args.create,
            organizationId: args.create?.organizationId ?? organizationId,
          },
          update: {
            ...args.update,
            organizationId: args.update?.organizationId ?? organizationId,
          },
        };
      }

      if (organizationId) {
        params.args = {
          ...args,
          where: {
            ...(args.where ?? {}),
            organizationId,
          },
        };
      }

      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
