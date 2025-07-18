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
    CostCenter  = var.cost_center
    Owner       = var.owner
    CreatedAt   = timestamp()
  }

  # Environment-specific configurations
  env_config = {
    dev = {
      cloudfront_price_class     = "PriceClass_100"
      s3_versioning             = false
      s3_intelligent_tiering    = false
      waf_rate_limit           = 10000
      monitoring_period        = 300
      enable_access_logging    = false
      enable_rum              = false
      cloudfront_cache_ttl    = 86400    # 1 day
      static_assets_ttl       = 2592000  # 30 days
      enable_cost_alerts      = false
      enable_drift_detection  = false
    }
    staging = {
      cloudfront_price_class     = "PriceClass_200"
      s3_versioning             = true
      s3_intelligent_tiering    = false
      waf_rate_limit           = 5000
      monitoring_period        = 300
      enable_access_logging    = true
      enable_rum              = true
      cloudfront_cache_ttl    = 86400    # 1 day
      static_assets_ttl       = 2592000  # 30 days
      enable_cost_alerts      = false
      enable_drift_detection  = false
    }
    prod = {
      cloudfront_price_class     = "PriceClass_All"
      s3_versioning             = true
      s3_intelligent_tiering    = true
      waf_rate_limit           = 2000
      monitoring_period        = 60
      enable_access_logging    = true
      enable_rum              = true
      cloudfront_cache_ttl    = 86400    # 1 day
      static_assets_ttl       = 31536000 # 1 year
      enable_cost_alerts      = true
      enable_drift_detection  = true
    }
  }

  # Production-specific configurations
  is_production = var.environment == "prod"
  
  # Cost alert thresholds (USD)
  cost_alert_thresholds = {
    warning = 100
    critical = 250
  }

  # Notification settings
  slack_webhook_url = var.slack_webhook_url
  notification_emails = var.notification_emails
}