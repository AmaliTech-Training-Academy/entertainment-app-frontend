resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

locals {
  bucket_name = "${var.project_name}-frontend-${var.environment}-${random_string.bucket_suffix.result}"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    Component   = "frontend"
    ManagedBy   = "terraform"
  }

  # Environment-specific configurations
  env_config = {
    dev = {
      cloudfront_price_class = "PriceClass_100"
      s3_versioning          = false
      waf_rate_limit         = 10000
      monitoring_period      = 300
    }
    staging = {
      cloudfront_price_class = "PriceClass_200"
      s3_versioning          = true
      waf_rate_limit         = 5000
      monitoring_period      = 300
    }
    prod = {
      cloudfront_price_class = "PriceClass_All"
      s3_versioning          = true
      waf_rate_limit         = 2000
      monitoring_period      = 60
    }
  }
}
