# ai-integration checklist

- [ ] @anthropic-ai/sdk is installed and configured.
- [ ] AI module and service are registered in NestJS.
- [ ] screening-summary prompt file exists and is used by service.
- [ ] lease-draft prompt file exists and is used by service.
- [ ] POST /api/applications/:id/screen endpoint works and persists result.
- [ ] POST /api/applications/:id/lease-draft endpoint works and persists result.
- [ ] Each AI action writes an AuditLog entry.
- [ ] API responses include AI-generated disclaimer text.
- [ ] Error handling prevents raw provider errors leaking to clients.
- [ ] Basic token/cost usage metadata is captured or logged.
