terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
}

# Main provider (eu-west-1)
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CineVerse"
      ManagedBy   = "Terraform"
      Environment = var.environment
      Owner       = "DevOps-Team"
      CostCenter  = var.cost_center
    }
  }
}

# US East 1 provider for CloudFront WAF and RUM
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "CineVerse"
      ManagedBy   = "Terraform"
      Environment = var.environment
      Owner       = "DevOps-Team"
      CostCenter  = var.cost_center
    }
  }
}

# Notifications module (create first for dependency)
module "notifications" {
  source = "./modules/notifications"

  project_name        = var.project_name
  environment         = var.environment
  slack_webhook_url   = var.slack_webhook_url
  notification_emails = var.notification_emails

  tags = local.common_tags
}

# Create S3 bucket first
module "s3_website" {
  source = "./modules/s3-website"

  bucket_name               = local.bucket_name
  environment              = var.environment
  enable_versioning        = local.env_config[var.environment].s3_versioning
  enable_intelligent_tiering = local.env_config[var.environment].s3_intelligent_tiering
  enable_access_logging    = local.env_config[var.environment].enable_access_logging
  # Remove this line: cloudfront_distribution_arn = module.cloudfront.distribution_arn

  tags = local.common_tags
}

# Enhanced WAF with production rules
module "waf" {
  count  = var.enable_waf ? 1 : 0
  source = "./modules/waf"

  project_name      = var.project_name
  environment       = var.environment
  rate_limit        = local.env_config[var.environment].waf_rate_limit
  blocked_countries = var.blocked_countries
  is_production     = local.is_production

  tags = local.common_tags

  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}

# Create CloudFront distribution after S3 and WAF
module "cloudfront" {
  source = "./modules/cloudfront"

  environment              = var.environment
  s3_bucket_id             = module.s3_website.bucket_id
  s3_bucket_domain_name    = module.s3_website.bucket_domain_name
  origin_access_control_id = module.s3_website.origin_access_control_id
  price_class              = local.env_config[var.environment].cloudfront_price_class
  waf_web_acl_id          = var.enable_waf && length(module.waf) > 0 ? module.waf[0].web_acl_arn : ""
  api_endpoint            = var.api_endpoint
  cloudfront_cache_ttl    = local.env_config[var.environment].cloudfront_cache_ttl
  static_assets_ttl       = local.env_config[var.environment].static_assets_ttl
  enable_access_logging   = local.env_config[var.environment].enable_access_logging

  tags = local.common_tags

  depends_on = [
    module.s3_website,
    module.waf
  ]
}

# Create S3 bucket policy after CloudFront distribution
resource "aws_s3_bucket_policy" "website" {
  bucket = module.s3_website.bucket_id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${module.s3_website.bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = module.cloudfront.distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [module.cloudfront]
}

# Enhanced monitoring with RUM and cost alerts
module "monitoring" {
  count  = var.enable_monitoring ? 1 : 0
  source = "./modules/monitoring"

  project_name               = var.project_name
  environment                = var.environment
  aws_region                 = var.aws_region
  cloudfront_distribution_id = module.cloudfront.distribution_id
  cloudfront_domain_name     = module.cloudfront.distribution_domain_name
  s3_bucket_arn              = module.s3_website.bucket_arn
  monitoring_period          = local.env_config[var.environment].monitoring_period
  enable_rum                 = local.env_config[var.environment].enable_rum
  enable_cost_alerts         = local.env_config[var.environment].enable_cost_alerts
  cost_alert_thresholds      = local.cost_alert_thresholds
  sns_topic_arn              = module.notifications.sns_topic_arn

  tags = local.common_tags

  providers = {
    aws.us_east_1 = aws.us_east_1
  }

  depends_on = [module.cloudfront, module.notifications]
}

# Logging module for access logs and monitoring
module "logging" {
  count  = local.env_config[var.environment].enable_access_logging ? 1 : 0
  source = "./modules/logging"

  project_name               = var.project_name
  environment                = var.environment
  aws_region                 = var.aws_region
  cloudfront_distribution_id = module.cloudfront.distribution_id
  s3_bucket_arn              = module.s3_website.bucket_arn

  tags = local.common_tags

  depends_on = [module.cloudfront]
}

# Cost optimization module
module "cost_optimization" {
  count  = local.env_config[var.environment].enable_cost_alerts ? 1 : 0
  source = "./modules/cost-optimization"

  project_name          = var.project_name
  environment           = var.environment
  aws_region            = var.aws_region
  cost_alert_thresholds = local.cost_alert_thresholds
  sns_topic_arn         = module.notifications.sns_topic_arn

  tags = local.common_tags

  depends_on = [module.notifications]
}

# Rollback module for automated rollback capabilities
module "rollback" {
  count  = local.is_production ? 1 : 0
  source = "./modules/rollback"

  project_name               = var.project_name
  environment                = var.environment
  aws_region                 = var.aws_region
  s3_bucket_name             = module.s3_website.bucket_id
  cloudfront_distribution_id = module.cloudfront.distribution_id
  sns_topic_arn              = module.notifications.sns_topic_arn

  tags = local.common_tags

  depends_on = [module.cloudfront, module.notifications]
}