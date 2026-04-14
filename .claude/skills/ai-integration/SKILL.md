# Skill: ai-integration

## Purpose

Implement AI features only if the demo needs them later. This is not part of the MVP scope.

## Use When

1. Adding screening summary generation.
2. Adding lease draft generation.
3. Updating prompts, model config, or AI audit behavior.

## Inputs

1. Applications and leases domain readiness.
2. ANTHROPIC_API_KEY and SDK configuration.
3. Prompt requirements from BUILD_PLAN.md.

## Outputs

1. AI module/service integrated with Anthropic SDK.
2. Screening and lease draft endpoints.
3. Persisted outputs and audit trail.

## Steps

1. Initialize Anthropic client in AI service.
2. Add screening prompt and parse structured output.
3. Add lease draft prompt and persist markdown output.
4. Implement POST /applications/:id/screen.
5. Implement POST /applications/:id/lease-draft.
6. Record each AI run to AuditLog with actor and target.
7. Add disclaimer text in API response payload for UI display.
8. Add timeout, retry, and error handling for external API calls.

## Guardrails

1. Use claude-haiku-4-5 unless explicitly overridden.
2. Avoid sending unnecessary PII in prompt payload.
3. Never fail closed-path CRUD operations due to optional AI failures.

## Definition of Done

1. Both AI endpoints return valid payloads for demo data.
2. Results are persisted and visible through existing read endpoints.
3. Audit entries are created for each run.
4. Checklist in checklist.md is satisfied.
