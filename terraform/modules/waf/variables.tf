variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "enable_waf" {
  description = "Enable WAF"
  type        = bool
  default     = true
}

variable "rate_limit" {
  description = "Rate limit for WAF"
  type        = number
  default     = 2000
}

variable "blocked_countries" {
  description = "List of country codes to block"
  type        = list(string)
  default     = []
}

variable "log_retention_days" {
  description = "Log retention days"
  type        = number
  default     = 30
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}


variable "create_policies" {
  description = "Whether to create CloudFront and WAF policies"
  type        = bool
  default     = true  # This ensures it's created by default (e.g., in dev)
}
