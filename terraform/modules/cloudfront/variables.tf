variable "environment" {
  description = "Environment name"
  type        = string
}

variable "s3_bucket_id" {
  description = "S3 bucket ID"
  type        = string
}

variable "s3_bucket_domain_name" {
  description = "S3 bucket domain name"
  type        = string
}

variable "origin_access_control_id" {
  description = "CloudFront Origin Access Control ID"
  type        = string
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "domain_aliases" {
  description = "List of domain aliases"
  type        = list(string)
  default     = []
}

variable "use_default_certificate" {
  description = "Use CloudFront default certificate"
  type        = bool
  default     = true
}

variable "ssl_certificate_arn" {
  description = "SSL certificate ARN"
  type        = string
  default     = ""
}

variable "waf_web_acl_id" {
  description = "WAF Web ACL ID"
  type        = string
  default     = ""
}

variable "alb_domain_name" {
  description = "ALB domain name for API origin (without protocol)"
  type        = string
  validation {
    condition     = can(regex("^[a-zA-Z0-9][a-zA-Z0-9-._]*[a-zA-Z0-9]$", var.alb_domain_name))
    error_message = "ALB domain name must be a valid domain name without protocol (http/https)."
  }
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}