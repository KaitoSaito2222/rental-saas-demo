# Skill: data-residency-compliance

## Purpose

Apply cross-cutting tenant isolation and compliance behavior.

## Use When

1. Modifying Prisma middleware or tenant filtering logic.
2. Adding or changing audit logging behavior.
3. Updating compliance-sensitive data paths.

## Inputs

1. Prisma schema models with organizationId fields.
2. Tenant context service and request interceptor.
3. Compliance notes from BUILD_PLAN.md.

## Outputs

1. Enforced organization scoping for tenant data operations.
2. Immutable audit logging for sensitive actions.
3. Validation tests for cross-tenant isolation.

## Steps

1. Identify models that must always be organization-scoped.
2. Update Prisma middleware to inject or enforce organization constraints.
3. Ensure update/delete paths cannot escape tenant scope.
4. Add audit logging hooks for auth and PII-sensitive actions.
5. Add tests proving tenant A cannot read or mutate tenant B data.
6. Document approved exceptions and rationale.

## Guardrails

1. No endpoint accepts client-provided organization override.
2. Audit logs are append-only for regulated actions.
3. If bypass is required, include explicit test coverage and comment.

## Definition of Done

1. Prisma middleware behavior is verified by tests.
2. Audit log coverage exists for core sensitive operations.
3. No known path returns cross-tenant records.
4. Checklist in checklist.md is satisfied.
