import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class TenantContextService {
  private readonly storage = new AsyncLocalStorage<{ organizationId?: string }>();

  run<T>(organizationId: string | undefined, callback: () => T): T {
    return this.storage.run({ organizationId }, callback);
  }

  getOrganizationId(): string | undefined {
    return this.storage.getStore()?.organizationId;
  }
}
