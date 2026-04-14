# Rental SaaS Demo - Claude Agent Rules

## Goal

Deliver the BUILD_PLAN in phase order while protecting tenant isolation and compliance requirements.

## Global Engineering Rules

1. Keep implementation aligned with the monorepo plan in BUILD_PLAN.md.
2. Do not introduce cross-tenant data access. Every data path must be organization scoped.
3. Prefer simple managed infrastructure choices over custom platform engineering.
4. Keep feature flags database-backed and environment-aware.
5. Add tests for behavior changes, especially security and isolation logic.

## Backend Rules

1. Use NestJS module boundaries by feature under apps/api/src/modules.
2. Use Prisma as the single data access layer.
3. Never execute bare Prisma queries that bypass organization filters.
4. Keep auth-protected endpoints behind JWT guard unless explicitly public.
5. Log sensitive actions through AuditLog service.

## Tenant Isolation Rules

1. All tenant data models must include organizationId.
2. Prisma middleware must inject organization constraints on read and write operations.
3. Tenant context must come from AsyncLocalStorage request context, not from client body.
4. Any exception to tenant filter rules must be documented in code comments and tests.

## AI Integration Rules

1. Default model for this demo is gemini-2.0-flash.
2. Persist AI outputs to domain entities and log the execution in AuditLog.
3. Include user-facing disclaimer for generated screening and lease output.
4. Handle API failures gracefully and return safe errors.

## Frontend Rules

1. Build App Router pages under apps/web/app as planned.
2. Keep auth flow and API client behavior consistent across routes.
3. Provide explicit loading, empty, and error states.
4. Guard private routes and redirect on unauthorized responses.

## Infrastructure and Delivery Rules

1. Keep IaC under infra with comments for Canadian data residency.
2. CI must block merge on lint, test, and build failures.
3. Keep deploy workflows explicit and reversible.

## Source Control Safety Rules

1. Never push to remote unless the user explicitly asks for push.
2. Never create or modify tags unless the user explicitly asks.
3. Before any commit or push, summarize intended changes and wait for user confirmation.

## Secret and Environment File Rules

1. Never commit or push .env files or secret-bearing local config files.
2. Keep only safe templates like .env.example in version control.
3. If a secret is found in tracked files, stop and notify the user immediately.

## Done Criteria (Global)

1. Phase artifact exists in expected path.
2. Behavior is tested or validated with reproducible steps.
3. No security regression for tenant isolation.
4. Documentation updated when assumptions change.
