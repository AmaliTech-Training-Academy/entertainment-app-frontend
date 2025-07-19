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

# NEW: Dedicated variable for ALB domain (ADDED FROM DEV CONFIG)
variable "alb_domain_name" {
  description = "ALB domain name for API origin"
  type        = string
  default     = "cineverse-prod-service-alb-964667856.eu-west-1.elb.amazonaws.com"  # Set this to your production ALB domain
}

variable "api_endpoint" {
  description = "Backend API endpoint for CSP headers (deprecated - use alb_domain_name)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

# New variables for enhanced features
variable "cloudfront_cache_ttl" {
  description = "Default cache TTL for CloudFront in seconds"
  type        = number
  default     = 86400  # 1 day
}

variable "static_assets_ttl" {
  description = "Cache TTL for static assets in seconds"
  type        = number
  default     = 31536000  # 1 year
}

variable "enable_access_logging" {
  description = "Enable CloudFront access logging"
  type        = bool
  default     = false
}