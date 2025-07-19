terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

# Enhanced WAF Web ACL with production-specific rules
resource "aws_wafv2_web_acl" "main" {
  name        = "cineverse-${var.project_name}-${var.environment}-waf"
  description = "Enhanced WAF for CineVerse ${var.environment} frontend"
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

        # Production-specific rule exclusions
        dynamic "rule_action_override" {
          for_each = var.is_production ? [] : [
            {
              name          = "SizeRestrictions_BODY"
              action_to_use = "allow"
            }
          ]
          content {
            name = rule_action_override.value.name
            action_to_use {
              allow {}
            }
          }
        }
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

  # Production-only: SQL Injection Protection
  dynamic "rule" {
    for_each = var.is_production ? [1] : []
    content {
      name     = "AWSManagedRulesSQLiRuleSet"
      priority = 3

      override_action {
        none {}
      }

      statement {
        managed_rule_group_statement {
          name        = "AWSManagedRulesSQLiRuleSet"
          vendor_name = "AWS"
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "SQLiRuleSetMetric"
        sampled_requests_enabled   = true
      }
    }
  }

  # Production-only: Linux/Unix Operating System Protection
  dynamic "rule" {
    for_each = var.is_production ? [1] : []
    content {
      name     = "AWSManagedRulesUnixRuleSet"
      priority = 4

      override_action {
        none {}
      }

      statement {
        managed_rule_group_statement {
          name        = "AWSManagedRulesUnixRuleSet"
          vendor_name = "AWS"
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "UnixRuleSetMetric"
        sampled_requests_enabled   = true
      }
    }
  }

  # Enhanced Rate Limiting Rule with different limits for production
  rule {
    name     = "RateLimitRule"
    priority = 5

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = var.rate_limit
        aggregate_key_type = "IP"
        
        # Production-only: Additional rate limiting based on forwarded IP
        dynamic "scope_down_statement" {
          for_each = var.is_production ? [1] : []
          content {
            byte_match_statement {
              search_string = "application/json"
              field_to_match {
                single_header {
                  name = "content-type"
                }
              }
              text_transformation {
                priority = 0
                type     = "LOWERCASE"
              }
              positional_constraint = "CONTAINS"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRuleMetric"
      sampled_requests_enabled   = true
    }
  }

  # Geo-blocking rule for production
  dynamic "rule" {
    for_each = length(var.blocked_countries) > 0 ? [1] : []
    content {
      name     = "GeoBlockingRule"
      priority = 6

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

  # Production-only: IP Reputation Rule
  dynamic "rule" {
    for_each = var.is_production ? [1] : []
    content {
      name     = "AWSManagedRulesAmazonIpReputationList"
      priority = 7

      override_action {
        none {}
      }

      statement {
        managed_rule_group_statement {
          name        = "AWSManagedRulesAmazonIpReputationList"
          vendor_name = "AWS"
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "AmazonIpReputationListMetric"
        sampled_requests_enabled   = true
      }
    }
  }

  # Production-only: Anonymous IP Rule
  dynamic "rule" {
    for_each = var.is_production ? [1] : []
    content {
      name     = "AWSManagedRulesAnonymousIpList"
      priority = 8

      override_action {
        none {}
      }

      statement {
        managed_rule_group_statement {
          name        = "AWSManagedRulesAnonymousIpList"
          vendor_name = "AWS"
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "AnonymousIpListMetric"
        sampled_requests_enabled   = true
      }
    }
  }

  tags = var.tags

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "cineverse-${var.project_name}-${var.environment}-waf"
    sampled_requests_enabled   = true
  }
}

# Enhanced CloudWatch Log Group with simpler naming - FIXED
resource "aws_cloudwatch_log_group" "waf" {
  name              = "/aws/wafv2/cineverse-${var.environment}-waf-logs"  # CHANGED: Simpler name
  retention_in_days = var.is_production ? 90 : var.log_retention_days
  
  provider = aws.us_east_1
  
  tags = var.tags
}

# CloudWatch Log Resource Policy for WAF - MOVED BEFORE logging config
data "aws_caller_identity" "current" {
  provider = aws.us_east_1
}

resource "aws_cloudwatch_log_resource_policy" "waf_logging" {
  policy_name = "AWSWAFLoggingPolicy-${var.environment}-${random_string.policy_suffix.result}"

  policy_document = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        },
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:us-east-1:${data.aws_caller_identity.current.account_id}:log-group:/aws/wafv2/*:*"
      }
    ]
  })

  provider = aws.us_east_1
}

# Random suffix for policy name uniqueness
resource "random_string" "policy_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Enhanced WAF Logging Configuration - with correct dependencies
resource "aws_wafv2_web_acl_logging_configuration" "main" {
  resource_arn            = aws_wafv2_web_acl.main.arn
  log_destination_configs = ["${aws_cloudwatch_log_group.waf.arn}:*"]

  provider = aws.us_east_1

  depends_on = [
    aws_wafv2_web_acl.main,
    aws_cloudwatch_log_group.waf,
    aws_cloudwatch_log_resource_policy.waf_logging  # Ensure policy exists first
  ]

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

  # Production-only: Additional redacted fields
  dynamic "redacted_fields" {
    for_each = var.is_production ? [1] : []
    content {
      single_header {
        name = "x-api-key"
      }
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}