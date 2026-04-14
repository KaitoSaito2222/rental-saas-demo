# Rental Property Saas Demo

Demo repository for a rental property management platform.

## Scope

This demo is intentionally narrow. The product story focuses on:

1. User registration and login for landlords and tenants.
2. Property creation by landlords.
3. Tenant application submission for a property.
4. Application screening states: Pending, Reviewed, Approved, Rejected.

Everything else is out of scope until the MVP proves the core flow.

## Stack

- Backend: NestJS + TypeScript + Prisma + PostgreSQL 16
- Frontend: Next.js 14 App Router + Tailwind + shadcn/ui
- Infrastructure: Terraform under `infra/`
- CI/CD: GitHub Actions under `.github/workflows/`
- Deployment target: Railway in the Canada region for data residency alignment

## Implemented Scaffold

The repository now includes the Phase 1 to Phase 4 scaffold:

- `package.json` defines the npm workspaces for `apps/` and `packages/`.
- `packages/shared` contains the shared enums used by both apps.
- `apps/api` contains the NestJS backend scaffold, Prisma schema, auth, and CRUD modules.
- `apps/web` contains the Next.js App Router pages for auth and the dashboard flow.
- `infra/main.tf` documents the Canada-region deployment assumptions.
- `infra/variables.tf` defines the environment contract and planned integration secrets.
- `infra/outputs.tf` surfaces the intended app and database shape.
- `.github/workflows/ci.yml` runs Terraform validation and app checks when app manifests exist.
- `.github/workflows/terraform.yml` runs plan on pull requests and controlled apply on manual dispatch.

## Design Decisions

### Multi-Tenant Isolation: Prisma Middleware

Tenant data isolation is enforced at the application layer using Prisma middleware (`PrismaService.$use()`), not PostgreSQL Row Level Security.

- Every query is intercepted and `organizationId` is automatically injected into `WHERE` clauses for reads and `data` for writes.
- `TenantContextService` stores the current org ID in `AsyncLocalStorage`, avoiding the need to pass it through every service method.
- This approach is visible and testable at the application layer without requiring database-level configuration.
- PostgreSQL RLS is the recommended addition for production as a second layer of defense in depth.

### Infrastructure: Terraform as a Scaffold

The `infra/` directory contains Terraform files that document the intended deployment shape. The resources use `terraform_data` placeholders and do not provision real infrastructure until a provider (such as the Railway provider) is wired in. The files exist to make the deployment intent reviewable and to hold the Canada-region and PIPEDA rationale as code comments.

### Deployment Region

The design targets the Canada region for data residency alignment with PIPEDA requirements. The current demo is not deployed to a paid cloud environment due to cost constraints. When deploying to production, use a Canada-region host and ensure all PII stays within that boundary.

---

## Demo Account

```
Email:    landlord@mapleproperties.ca
Password: demo1234
```

---

## Data Residency

The demo is designed around Canadian data residency expectations.

- Keep application and database hosting in the Canada region.
- Do not send personal data to third parties unless a user action explicitly triggers it.
- Log sensitive actions in the application layer once the API is implemented.
- Use short-lived JWTs and server-side session invalidation in later phases.

## Required Secrets

Keep secret values out of the repository and supply them through the deployment platform or GitHub environments.

- `DATABASE_URL`
- `JWT_SECRET`
- `RAILWAY_TOKEN`
- `EQUIFAX_CLIENT_ID`
- `ONDATO_API_KEY`
- `STRIPE_SECRET_KEY`

## Local Development

### Option A: PostgreSQL in Docker (recommended)

```bash
docker compose up -d postgres
cp apps/api/.env.example apps/api/.env
```

Set apps/api/.env values:

- DATABASE_URL="postgresql://postgres:postgres@localhost:5432/property_copilot?schema=public"
- JWT_SECRET="replace-me"

Then run:

```bash
npm install
npm run db:migrate:dev
npm run db:seed
npm run dev
```

Stop DB when done:

```bash
docker compose down
```

### Option B: Native PostgreSQL

The expected local flow is:

```bash
cp apps/api/.env.example apps/api/.env
npm install
npm run db:migrate:dev
npm run db:seed
npm run dev
```

The API runs on port `3001` and the web app runs on port `3000`.

## Deployment

Use the GitHub Actions workflows as the default review path:

1. Open a pull request and let `.github/workflows/ci.yml` verify the repo.
2. Review Terraform changes with `.github/workflows/terraform.yml`.
3. Trigger the same workflow manually with `apply=true` only after approval.

The live Railway URL is not wired in this snapshot yet. When the app scaffold lands, document the final URL here and keep the production environment protected.

## Rollback

Rollback should be explicit and low-risk:

1. Revert the deployment source revision.
2. Re-run the controlled Terraform apply if infrastructure changed.
3. Restore the previous application release and confirm the health checks pass.
