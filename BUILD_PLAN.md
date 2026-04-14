# Property Copilot - Build Plan

## Goal

Demo project for a rental property management platform.

## MVP Scope

Build only the pieces needed to prove product understanding and execution:

1. User registration and login for Landlord and Tenant.
2. Property creation by Landlord.
3. Tenant application submission for a property.
4. Simple application screening status: Pending, Reviewed, Approved, Rejected.

Everything else is intentionally out of scope for the demo.

## Post-MVP Priorities

These are the pieces that will matter once the demo is extended into a real product.

### Must Have

1. Tenant-safe authentication and authorization hardening.
2. Property and application lifecycle completeness.
3. Audit logging for sensitive actions and PII access.
4. Notification delivery for application and status changes.
5. Production deployment, monitoring, and rollback capability.

### Should Have

1. Unit-level inventory and availability management.
2. External screening integrations such as Equifax and Ondato.
3. Payment collection workflows for rent and fees.
4. E-signature and PDF generation for leases.
5. Feature flags for controlled rollout.

### Later

1. AI-assisted screening and document generation.
2. Multi-jurisdiction compliance variants.
3. Advanced analytics and portfolio reporting.
4. White-label tenant and landlord experiences.

---

## Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | NestJS + TypeScript + Prisma + PostgreSQL 16   |
| Frontend  | Next.js 14 (App Router) + Tailwind + shadcn/ui |
| Deploy    | Railway (Canada region - data residency)        |
| IaC       | Terraform (`infra/`)                            |
| AI        | Not required for MVP                             |
| CI/CD     | GitHub Actions                                  |

---

## Project Structure

```
rental-saas-demo/
|- apps/
|  |- api/                  # NestJS backend
|  |  |- prisma/
|  |  |  |- schema.prisma
|  |  |  `- seed.ts
|  |  `- src/
|  |     |- main.ts
|  |     |- app.module.ts
|  |     |- prisma/
|  |     |  |- prisma.module.ts
|  |     |  |- prisma.service.ts         # Core RLS middleware logic
|  |     |  `- tenant-context.service.ts # AsyncLocalStorage context
|  |     |- common/
|  |     |  |- decorators/
|  |     |  |  |- current-user.decorator.ts
|  |     |  |  `- public.decorator.ts
|  |     |  |- guards/
|  |     |  |  `- jwt-auth.guard.ts
|  |     |  `- interceptors/
|  |     |     `- tenant-context.interceptor.ts
|  |     `- modules/
|  |        |- auth/
|  |        |  |- auth.module.ts
|  |        |  |- auth.controller.ts
|  |        |  |- auth.service.ts
|  |        |  |- strategies/jwt.strategy.ts
|  |        |  `- dto/register.dto.ts, login.dto.ts
|  |        |- properties/
|  |        |- units/
|  |        |- applications/
|  |        `- dashboard/
|  `- web/                  # Next.js frontend
|     `- app/
|        |- (auth)/login, register
|        `- (dashboard)/
|           |- dashboard/
|           |- properties/new
|           |- properties/[id]
|           |- applications/new
|           `- applications/[id]
|- packages/
|  `- shared/               # Shared DTOs + enums (referenced by both apps)
|- infra/                   # Terraform
|  |- main.tf
|  |- variables.tf
|  `- outputs.tf
|- .github/workflows/
|  |- ci.yml
|  `- terraform.yml
`- README.md
```

---

## Multi-Tenant Design

**Pattern**: Prisma middleware + AsyncLocalStorage

- All tenant data tables include an `organizationId` column.
- `PrismaService.$use()` intercepts all queries:
  - `create` -> auto-inject `organizationId`
  - `findMany/findFirst/count` -> add `WHERE organizationId = :id`
  - `update/delete` -> add `WHERE organizationId = :id`
- `TenantContextService` stores org ID via `AsyncLocalStorage`.
- Request flow order: JWT guard -> `TenantContextInterceptor` -> `AsyncLocalStorage.run()`.

**Why not PostgreSQL RLS only?**  
Prisma middleware is visible and testable at the application layer. PostgreSQL RLS is documented in README as production defense in depth.

---

## Data Model (Prisma)

```
Organization  { id, name, slug, plan(FREE/PRO/ENTERPRISE), country, timezone }
User          { id, organizationId, email, passwordHash, role(LANDLORD/PM/TENANT/ADMIN) }
Session       { id, userId, token, expiresAt }        <- server-side invalidation
Property      { id, organizationId, name, address, province(BC/AB/ON...) }
Application   { id, organizationId, propertyId, applicantEmail, income, status, notes }
AuditLog      { id, organizationId, userId, action, resourceType, resourceId, createdAt }
                                                      <- no updatedAt (PIPEDA immutable log)
```

---

## API Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/properties
POST /api/properties
GET  /api/properties/:id

GET  /api/properties/:id/applications

GET  /api/applications
POST /api/applications
GET  /api/applications/:id
PATCH /api/applications/:id/status
GET  /api/dashboard/stats
```

---

## Canadian Data Residency (PIPEDA)

- Explicitly set Railway Canada region in Terraform and include PIPEDA rationale comments.
- Log all PII operations in `AuditLog`.
- Password hashing: bcrypt cost 12.
- JWT expiry: 15 minutes + server-side invalidation via `Session` table.
- Send PII to third parties only when explicitly triggered by a landlord action (with logs).

---

## Feature Flags

Not required for the MVP.

---

## Implementation Phases

### Phase 1 - Scaffold and Data Layer (completed)
- [ ] npm workspaces monorepo
- [ ] `packages/shared` - enums + DTOs
- [ ] `apps/api/prisma/schema.prisma`
- [ ] `apps/api/prisma/seed.ts`
- [ ] `PrismaService` (RLS middleware)
- [ ] `TenantContextService` (AsyncLocalStorage)
- [ ] `TenantContextInterceptor`
- [ ] JWT Guard + CurrentUser decorator
- [ ] `AuthModule` - register, login, JWT strategy

### Phase 2 - MVP Core CRUD
- [ ] `AuthModule` (register, login, me)
- [ ] `PropertiesModule` (CRUD)
- [ ] `ApplicationsModule` (create + status update)
- [ ] `DashboardModule` (simple counts)

### Phase 3 - Minimal Frontend
- [ ] Next.js + Tailwind + shadcn/ui initialization
- [ ] Auth pages (login, register)
- [ ] Dashboard layout
- [ ] Property create form
- [ ] Application submission form
- [ ] Application status display

### Phase 4 - IaC, CI/CD, Docs
- [ ] `infra/main.tf` (Railway + Canada region comments)
- [ ] `.github/workflows/ci.yml`
- [ ] `.github/workflows/terraform.yml`
- [ ] `README.md` (English, multi-tenant, data residency, MVP scope)
- [ ] Railway deploy -> obtain live URL

---

## Most Important Files (Priority)

1. `apps/api/src/prisma/prisma.service.ts` - core RLS middleware
2. `apps/api/src/modules/auth/auth.service.ts` - registration and login flow
3. `apps/api/prisma/schema.prisma` - data model
4. `apps/web/app/(dashboard)/applications/[id]` - application status UI
5. `infra/main.tf` - Canada region declaration
6. `README.md` - first file reviewers read

---

## Architecture Decisions Likely Asked in Interview

**Q: Prisma middleware vs PostgreSQL RLS?**  
A: Prisma middleware is visible and testable at the application layer. PostgreSQL RLS is planned as additional production defense in depth (documented in README).

**Q: Railway vs AWS?**  
A: Railway is chosen for demo setup speed. Terraform comments will document an equivalent production path on AWS (ca-central-1 + ECS Fargate + RDS Aurora).

**Q: Why no AI in the MVP?**  
A: The smallest demo that still shows product understanding is registration, property creation, applications, and status updates. AI can be added later if the story needs a second demo layer.

**Q: Why AsyncLocalStorage?**  
A: ALS avoids passing `organizationId` through every service method and follows a common Node.js context propagation pattern used across the ecosystem.

---

## Local Development

```bash
# Prerequisite: PostgreSQL is running
# Option (recommended): docker compose up -d postgres
cp apps/api/.env.example apps/api/.env
# Set DATABASE_URL and JWT_SECRET in .env

npm install
npm run db:migrate:dev   # prisma migrate dev
npm run db:seed          # insert seed data
npm run dev              # starts API :3001 + Web :3000
```

**Demo account**:  
Email: `landlord@mapleproperties.ca`  
Password: `demo1234`
