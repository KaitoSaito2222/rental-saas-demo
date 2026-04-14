terraform {
  required_version = ">= 1.6.0"

  # The demo is expected to be deployed in Railway's Canada region for PIPEDA-aligned data residency.
  # This file intentionally keeps the infrastructure layer reviewable before the app modules exist.
}

locals {
  project_name     = var.project_name
  railway_region   = var.railway_region

  # Production guidance for later phases:
  # - keep application hosting and PostgreSQL in the Canada region
  # - log all PII access in the application layer
  # - avoid sending personal data to third parties unless explicitly triggered by a user action
  compliance_notes = [
    "Keep application and database resources in Canada region",
    "Use short-lived JWTs with server-side session invalidation",
    "Record sensitive actions in AuditLog",
  ]
}

# Placeholder resources that document the intended deployment shape without locking the demo
# into a provider that is not yet scaffolded in the repository.
resource "terraform_data" "app_service" {
  input = {
    name   = local.project_name
    type   = "web-app"
    region = local.railway_region
  }
}

resource "terraform_data" "database_service" {
  input = {
    name   = "${local.project_name}-db"
    type   = "postgresql"
    region = local.railway_region
  }
}
