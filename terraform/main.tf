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
    tags = merge(
      {
        Project     = "CineVerse"
        ManagedBy   = "Terraform"
        Environment = var.environment
        Owner       = "DevOps-Team"
      },
      var.tags
    )
  }
}

# US East 1 provider for CloudFront WAF
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = merge(
      {
        Project     = "CineVerse"
        ManagedBy   = "Terraform"
        Environment = var.environment
        Owner       = "DevOps-Team"
      },
      var.tags
    )
  }
}

# WAF with us-east-1 provider - Create first so CloudFront can reference it
module "waf" {
  count  = var.enable_waf ? 1 : 0
  source = "./modules/waf"

  project_name = var.project_name
  environment  = var.environment
  rate_limit   = local.env_config[var.environment].waf_rate_limit

  tags = local.common_tags

  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}

# CloudFront distribution
module "cloudfront" {
  source = "./modules/cloudfront"

  environment              = var.environment
  s3_bucket_id             = module.s3_website.bucket_id
  s3_bucket_domain_name    = module.s3_website.bucket_domain_name
  origin_access_control_id = module.s3_website.origin_access_control_id
  price_class              = local.env_config[var.environment].cloudfront_price_class
  waf_web_acl_id           = var.enable_waf ? module.waf[0].web_acl_id : ""
  alb_domain_name          = var.alb_domain_name  # ✅ Using ALB domain for API backend
  media_bucket_domain_name = "cineverse-media-bucket-staging.s3.amazonaws.com"
  domain_aliases           = []  # No custom domains
  use_default_certificate  = true  # Always use CloudFront default certificate

  tags = local.common_tags

  depends_on = [module.waf]
}

# S3 Website bucket
module "s3_website" {
  source = "./modules/s3-website"

  bucket_name                 = local.bucket_name
  environment                 = var.environment
  enable_versioning           = local.env_config[var.environment].s3_versioning
  cloudfront_distribution_arn = module.cloudfront.distribution_arn

  tags = local.common_tags
}

# Monitoring
module "monitoring" {
  count  = var.enable_monitoring ? 1 : 0
  source = "./modules/monitoring"

  project_name               = var.project_name
  environment                = var.environment
  aws_region                 = var.aws_region
  cloudfront_distribution_id = module.cloudfront.distribution_id
  s3_bucket_arn              = module.s3_website.bucket_arn
  monitoring_period          = local.env_config[var.environment].monitoring_period

  tags = local.common_tags
}
