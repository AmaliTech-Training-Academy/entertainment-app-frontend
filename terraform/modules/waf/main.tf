terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

# Data sources to check for existing WAF resources
data "aws_wafv2_web_acl" "existing" {
  count    = var.use_existing_waf ? 1 : 0
  name     = "${var.project_name}-${var.environment}-waf"
  scope    = "CLOUDFRONT"
  provider = aws.us_east_1
}

data "aws_cloudwatch_log_group" "existing_waf_logs" {
  count    = var.use_existing_waf ? 1 : 0
  name     = "/aws/wafv2/${var.project_name}-${var.environment}"
  provider = aws.us_east_1
}

# Random suffix for unique WAF resource names (only if creating new)
resource "random_string" "waf_suffix" {
  count   = var.use_existing_waf ? 0 : 1
  length  = 8
  special = false
  upper   = false
  lower   = true
  numeric = true
}

locals {
  # Use existing WAF if available, otherwise use newly created one
  web_acl_id = var.use_existing_waf && length(data.aws_wafv2_web_acl.existing) > 0 ? data.aws_wafv2_web_acl.existing[0].id : (length(aws_wafv2_web_acl.main) > 0 ? aws_wafv2_web_acl.main[0].id : null)
  
  web_acl_arn = var.use_existing_waf && length(data.aws_wafv2_web_acl.existing) > 0 ? data.aws_wafv2_web_acl.existing[0].arn : (length(aws_wafv2_web_acl.main) > 0 ? aws_wafv2_web_acl.main[0].arn : null)
  
  log_group_arn = var.use_existing_waf && length(data.aws_cloudwatch_log_group.existing_waf_logs) > 0 ? data.aws_cloudwatch_log_group.existing_waf_logs[0].arn : (length(aws_cloudwatch_log_group.waf) > 0 ? aws_cloudwatch_log_group.waf[0].arn : null)
}

# WAF Web ACL - Only create if not using existing
resource "aws_wafv2_web_acl" "main" {
  count = var.enable_waf && !var.use_existing_waf ? 1 : 0
  
  name        = "${var.project_name}-${var.environment}-waf-${random_string.waf_suffix[0].result}"
  description = "WAF for CineVerse ${var.environment} frontend"
  scope       = "CLOUDFRONT"

  provider = aws.us_east_1

  default_action {
    allow {}
  }

  # AWS Managed Rule: Core Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Rule: Known Bad Inputs
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "KnownBadInputsRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  # Rate Limiting Rule
  rule {
    name     = "RateLimitRule"
    priority = 3

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = var.rate_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRuleMetric"
      sampled_requests_enabled   = true
    }
  }

  # Geo-blocking rule (if needed)
  dynamic "rule" {
    for_each = length(var.blocked_countries) > 0 ? [1] : []
    content {
      name     = "GeoBlockingRule"
      priority = 4

      action {
        block {}
      }

      statement {
        geo_match_statement {
          country_codes = var.blocked_countries
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "GeoBlockingRuleMetric"
        sampled_requests_enabled   = true
      }
    }
  }

  tags = var.tags

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}-${var.environment}-waf-${random_string.waf_suffix[0].result}"
    sampled_requests_enabled   = true
  }

  lifecycle {
    prevent_destroy = true
  }
}

# CloudWatch Log Group for WAF - Only create if not using existing
resource "aws_cloudwatch_log_group" "waf" {
  count             = var.enable_waf && !var.use_existing_waf ? 1 : 0
  name              = "/aws/wafv2/${var.project_name}-${var.environment}-${random_string.waf_suffix[0].result}"
  retention_in_days = var.log_retention_days
  
  provider = aws.us_east_1
  
  tags = var.tags

  lifecycle {
    prevent_destroy = true
  }
}

# WAF Logging Configuration - Only create if WAF exists (existing or new)
resource "aws_wafv2_web_acl_logging_configuration" "main" {
  count = var.enable_waf && local.web_acl_arn != null && local.log_group_arn != null ? 1 : 0
  
  resource_arn            = local.web_acl_arn
  log_destination_configs = [local.log_group_arn]

  provider = aws.us_east_1

  redacted_fields {
    single_header {
      name = "authorization"
    }
  }

  redacted_fields {
    single_header {
      name = "cookie"
    }
  }

  depends_on = [
    aws_wafv2_web_acl.main,
    aws_cloudwatch_log_group.waf,
    data.aws_wafv2_web_acl.existing,
    data.aws_cloudwatch_log_group.existing_waf_logs
  ]
}