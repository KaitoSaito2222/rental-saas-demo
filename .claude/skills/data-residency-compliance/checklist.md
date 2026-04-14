# data-residency-compliance checklist

- [ ] Prisma middleware intercepts create, read, update, delete for tenant models.
- [ ] organizationId is injected or validated on writes.
- [ ] organizationId filters are enforced on reads.
- [ ] Tenant context is sourced from request context, not body/query.
- [ ] AuditLog service writes immutable entries.
- [ ] Auth operations and AI processing events are logged.
- [ ] Isolation tests include both read and write attempts across tenants.
- [ ] Any non-tenant model exceptions are explicitly documented.
