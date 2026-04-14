# Skill: frontend-build

## Purpose

Deliver Phase 4 Next.js user interface flows.

## Use When

1. Building auth pages and dashboard shell.
2. Building CRUD views for properties, units, applications, leases.
3. Building AI screening panel UX.

## Inputs

1. Stable backend endpoint contracts.
2. Next.js App Router project under apps/web.
3. Design choices for Tailwind and component library.

## Outputs

1. Auth pages for login and register.
2. Dashboard routes for domain workflows.
3. AI screening panel in application details page.

## Steps

1. Initialize Next.js app with Tailwind and chosen UI components.
2. Create route groups for auth and dashboard layouts.
3. Build API client with auth token handling and safe error mapping.
4. Implement dashboard pages in plan order: properties, units, applications, leases.
5. Add AI screening panel action and result display.
6. Add feature flag hook for conditional UI behavior.
7. Ensure mobile and desktop responsive behavior.

## Guardrails

1. Keep protected pages behind auth checks.
2. Standardize loading and error states.
3. Never expose secrets in client-side code.

## Definition of Done

1. Planned routes render and load data from API.
2. AI screening panel works against backend endpoints.
3. Unauthorized states redirect correctly.
4. Checklist in checklist.md is satisfied.
