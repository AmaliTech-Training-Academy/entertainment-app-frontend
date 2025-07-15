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

variable "api_endpoint" {
  description = "Backend API endpoint for CSP headers"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}