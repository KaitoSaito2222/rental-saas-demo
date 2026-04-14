output "project_name" {
  description = "Demo project name used by the Terraform scaffold."
  value       = var.project_name
}

output "railway_region" {
  description = "Canada region required for the demo's data residency assumptions."
  value       = var.railway_region
}

output "planned_services" {
  description = "Human-readable summary of the intended app and database resources."
  value = {
    app_service      = terraform_data.app_service.input
    database_service = terraform_data.database_service.input
    compliance_notes = [
      "Terraform is a scaffold for the demo until provider wiring is added.",
      "Keep production deployments in Canada region to align with the build plan.",
    ]
  }
}
