# backend-scaffold checklist

- [ ] Workspace packages and scripts are wired.
- [ ] apps/api/src/main.ts and app.module.ts exist and boot.
- [ ] prisma/schema.prisma includes Organization, User, Session, Property, Unit, Application, Lease, FeatureFlag, AuditLog.
- [ ] prisma/seed.ts creates at least one demo organization and landlord user.
- [ ] Prisma module and service are injectable in NestJS.
- [ ] TenantContextService is implemented with AsyncLocalStorage.
- [ ] TenantContextInterceptor sets context per authenticated request.
- [ ] JwtAuthGuard and CurrentUser decorator are available in common.
- [ ] db migrate and seed commands complete without manual patching.
