# Skill: infra-and-cicd

## Purpose

Deliver Phase 5 infrastructure, CI/CD, and deployment safety.

## Use When

1. Creating Terraform baseline under infra.
2. Adding CI workflows and deployment gates.
3. Documenting data residency and rollout strategy.

## Inputs

1. Core app build commands and env contract.
2. Deployment target assumptions from BUILD_PLAN.md.
3. Security and compliance requirements.

## Outputs

1. Terraform project for app and database resources.
2. GitHub Actions workflows for CI and infra plan/apply.
3. Deployment notes including rollback path.

## Steps

1. Create infra module structure and variables.
2. Encode Canada-region deployment assumptions in comments and config.
3. Add CI workflow for lint, test, and build.
4. Add Terraform workflow for plan and controlled apply.
5. Add deployment workflow with staging and production strategy.
6. Configure required secrets and environment mappings.
7. Include stub variables for planned integrations: EQUIFAX_CLIENT_ID, ONDATO_API_KEY, STRIPE_SECRET_KEY.

## Guardrails

1. Keep infra changes reviewable and reversible.
2. Do not auto-apply production terraform on every push.
3. Keep secret values out of repository files.

## Definition of Done

1. Terraform validate and plan complete.
2. CI workflow passes for default branch and PRs.
3. Deployment steps and rollback are documented.
4. Checklist in checklist.md is satisfied.
