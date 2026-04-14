# backend-crud-modules checklist

- [ ] Auth endpoints exist: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me.
- [ ] Properties CRUD endpoints exist and are tenant-safe.
- [ ] Units CRUD endpoints exist and validate parent property ownership.
- [ ] Applications CRUD and status update endpoint exist.
- [ ] Leases list/detail and status update endpoints exist.
- [ ] Feature flags endpoint exists with org-aware behavior.
- [ ] Dashboard stats endpoint exists.
- [ ] Stub services exist: payments.service.ts, kyc.service.ts, credit.service.ts.
- [ ] External integration flags default disabled: equifax_integration, ondato_kyc, stripe_pad.
- [ ] Protected routes use JwtAuthGuard and current user extraction.
- [ ] Key module tests cover success and forbidden access cases.
