# Skills Index

This folder maps BUILD_PLAN phases to Claude skills.

## MVP Priority

For the minimal demo, use only:

1. backend-scaffold
2. data-residency-compliance
3. backend-crud-modules
4. frontend-build
5. infra-and-cicd

The ai-integration skill is optional and not required for the MVP.

## Skill Order

1. backend-scaffold
2. data-residency-compliance
3. backend-crud-modules
4. ai-integration
5. frontend-build
6. infra-and-cicd

## Invocation Guide

Use the skill that matches the requested change scope.

1. backend-scaffold
- Use when bootstrapping monorepo, NestJS app, Prisma schema, seed, and tenant context base.

2. data-residency-compliance
- Use when touching Prisma middleware, tenant context, audit logs, or compliance behavior.

3. backend-crud-modules
- Use when implementing or changing domain CRUD endpoints and services.

4. ai-integration
- Use when adding AI features later. Not needed for the minimal demo.

5. frontend-build
- Use when building dashboard/auth routes, app pages, and API-driven UI behavior.

6. infra-and-cicd
- Use when adding Terraform, GitHub workflows, deploy controls, and release safety.

## Dependency Rules

1. Do not start backend-crud-modules before backend-scaffold baseline exists.
2. Do not start ai-integration before applications flow and audit logging exist.
3. frontend-build can start once endpoint contracts are stable.
4. infra-and-cicd can run in parallel after core contracts and env names are fixed.
