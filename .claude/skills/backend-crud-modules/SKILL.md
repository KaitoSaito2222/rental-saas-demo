# Skill: backend-crud-modules

## Purpose

Deliver Phase 2 domain modules and endpoints.

## Use When

1. Implementing REST endpoints for core entities.
2. Adding DTO validation and service business logic.
3. Extending dashboard or feature-flag behavior.

## Inputs

1. Completed backend scaffold and tenant context base.
2. Prisma schema and generated client.
3. API endpoint list in BUILD_PLAN.md.

## Outputs

1. Auth, properties, units, applications, leases modules.
2. Feature flag query endpoint.
3. Dashboard stats endpoint.
4. Third-party stub services for credit, KYC, and payments.

## Delivery Order

1. Auth module: register, login, me.
2. Properties and units CRUD.
3. Applications CRUD and status update.
4. Leases read/status endpoints.
5. Feature flags and dashboard stats.

## Steps

1. Create DTOs with validation decorators.
2. Add controller routes exactly matching planned paths.
3. Implement service methods with tenant-safe data access.
4. Add auth guard and current user extraction to protected routes.
5. Add domain-specific checks (for example unit belongs to property in same org).
6. Add stub services for external providers: credit, KYC, and payments.
7. Wire feature flags so external stubs default to disabled.
8. Add integration tests for key flows.

## Guardrails

1. Never duplicate tenant filter logic in controllers.
2. Keep status transitions explicit and validated.
3. Return safe errors without leaking internal details.

## Definition of Done

1. All planned Phase 2 endpoints are implemented.
2. Endpoint behavior is validated by tests.
3. Tenant-safe behavior confirmed in CRUD paths.
4. Checklist in checklist.md is satisfied.
