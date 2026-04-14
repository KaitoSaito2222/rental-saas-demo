# Skill: backend-scaffold

## Purpose

Bootstrap the backend foundation for Phase 1.

## Use When

1. Initializing workspace tooling and package layout.
2. Creating Prisma schema and seed baseline.
3. Adding tenant context primitives used by all modules.

## Inputs

1. BUILD_PLAN.md phase requirements.
2. Existing folder structure under apps/api.
3. Environment variable contract for DB and auth.

## Outputs

1. Monorepo-ready backend skeleton.
2. Prisma schema and seed scripts aligned to planned models.
3. Base tenant context flow using AsyncLocalStorage.

## Steps

1. Confirm Node workspace and package boundaries.
2. Initialize NestJS API app structure under apps/api/src.
3. Add or update prisma/schema.prisma models from plan.
4. Add seed data for demo organization, user, properties, and units.
5. Wire Prisma module/service in app module.
6. Add tenant context service and request interceptor.
7. Add JWT guard scaffolding and current user decorator.
8. Validate migrate, seed, and app boot commands.

## Guardrails

1. Keep names and enums aligned with BUILD_PLAN.md.
2. Do not hardcode organizationId in service methods.
3. Keep seed deterministic for repeatable demos.

## Definition of Done

1. App boots with Prisma module configured.
2. Migration and seed run successfully.
3. Tenant context pipeline exists and is testable.
4. Checklist in checklist.md is satisfied.
