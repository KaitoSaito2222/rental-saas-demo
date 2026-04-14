import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module.js';
import { ApplicationsModule } from './modules/applications/applications.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { PropertiesModule } from './modules/properties/properties.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from './common/guards/permissions.guard.js';
import { TenantContextInterceptor } from './common/interceptors/tenant-context.interceptor.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, AuthModule, PropertiesModule, ApplicationsModule, DashboardModule],
  providers: [
    {
      provide: APP_GUARD,
      inject: [Reflector],
      useFactory: (reflector: Reflector) => new JwtAuthGuard(reflector),
    },
    {
      provide: APP_GUARD,
      inject: [Reflector],
      useFactory: (reflector: Reflector) => new PermissionsGuard(reflector),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantContextInterceptor,
    },
  ],
})
export class AppModule {}
