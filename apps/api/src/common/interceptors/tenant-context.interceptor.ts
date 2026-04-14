import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from '../../prisma/tenant-context.service.js';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  constructor(@Inject(TenantContextService) private readonly tenantContext: TenantContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.user?.organizationId as string | undefined;

    if (!organizationId) {
      return next.handle();
    }

    return new Observable((subscriber) => {
      let subscription: { unsubscribe: () => void } | undefined;

      this.tenantContext.run(organizationId, () => {
        subscription = next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete(),
        });
      });

      return () => subscription?.unsubscribe();
    });
  }
}
