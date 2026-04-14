# Local Dev Notes

## PostgreSQL in Docker

Use Docker only for PostgreSQL in local development, and run API/Web directly on the host.

1. Start database:
   docker compose up -d postgres
2. Confirm health:
   docker compose ps
3. Stop database:
   docker compose down
4. Reset database data:
   docker compose down -v

## .env for API

DATABASE_URL should point to the local Docker database:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/property_copilot?schema=public"

## Why this pattern

This keeps setup reproducible while preserving fast hot-reload and debugging for Next.js and NestJS.
