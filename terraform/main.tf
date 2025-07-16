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
    }
  }
}

# US East 1 provider for CloudFront WAF
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "CineVerse"
      ManagedBy   = "Terraform"
      Environment = var.environment
      Owner       = "DevOps-Team"
    }
  }
}

# Create S3 bucket first
module "s3_website" {
  source = "./modules/s3-website"

  bucket_name       = local.bucket_name
  environment       = var.environment
  enable_versioning = local.env_config[var.environment].s3_versioning

  tags = local.common_tags
}

# FIXED: Create WAF before CloudFront to ensure proper dependency
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

# FIXED: Create CloudFront distribution after S3 and WAF
module "cloudfront" {
  source = "./modules/cloudfront"

  environment              = var.environment
  s3_bucket_id             = module.s3_website.bucket_id
  s3_bucket_domain_name    = module.s3_website.bucket_domain_name
  origin_access_control_id = module.s3_website.origin_access_control_id
  price_class              = local.env_config[var.environment].cloudfront_price_class
  # FIXED: Conditional WAF Web ACL ID reference with proper dependency
  waf_web_acl_id           = var.enable_waf && length(module.waf) > 0 ? module.waf[0].web_acl_id : ""
  api_endpoint             = var.domain_name != "" ? "https://api.${var.domain_name}" : ""

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

  depends_on = [module.cloudfront]
}