variable "project_name" {
  description = "Base name used for demo infrastructure resources."
  type        = string
  default     = "property-copilot-demo"
}

variable "environment" {
  description = "Deployment environment label used for docs and future automation."
  type        = string
  default     = "production"
}

variable "railway_region" {
  description = "Railway region to keep the demo in Canada for data residency."
  type        = string
  default     = "ca-central-1"
}

variable "equifax_client_id" {
  description = "Planned integration secret for external screening; keep empty until enabled."
  type        = string
  default     = ""
  sensitive   = true
}

variable "ondato_api_key" {
  description = "Planned integration secret for external screening; keep empty until enabled."
  type        = string
  default     = ""
  sensitive   = true
}

variable "stripe_secret_key" {
  description = "Planned payments secret for later phases; keep empty until enabled."
  type        = string
  default     = ""
  sensitive   = true
}
