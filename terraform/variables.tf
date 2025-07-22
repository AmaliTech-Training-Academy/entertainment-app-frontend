variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "cineverse"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "entertainment-app-frontend"
}

variable "alb_domain_name" {
  description = "ALB domain name for backend API (without protocol)"
  type        = string
  validation {
    condition     = can(regex("^[a-zA-Z0-9][a-zA-Z0-9-._]*[a-zA-Z0-9]$", var.alb_domain_name))
    error_message = "ALB domain name must be a valid domain name without protocol (http/https)."
  }
}

variable "enable_waf" {
  description = "Enable WAF for CloudFront distribution"
  type        = bool
  default     = true
}

variable "enable_monitoring" {
  description = "Enable CloudWatch monitoring and alarms"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}