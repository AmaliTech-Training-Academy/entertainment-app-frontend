variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "rate_limit" {
  description = "Rate limit for WAF (requests per 5 minutes)"
  type        = number
  default     = 2000
}

variable "blocked_countries" {
  description = "List of country codes to block"
  type        = list(string)
  default     = []
}

variable "log_retention_days" {
  description = "Number of days to retain WAF logs"
  type        = number
  default     = 30
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "enable_waf" {
  description = "Enable WAF protection"
  type        = bool
  default     = false
}

variable "enable_waf_logging" {
  description = "Enable WAF logging to CloudWatch (can be disabled to avoid deployment issues)"
  type        = bool
  default     = false  # CHANGED: Start with false to avoid ARN issues during initial deployment
}

variable "is_production" {
  description = "Whether this is a production environment (enables additional security rules)"
  type        = bool
  default     = false
}

