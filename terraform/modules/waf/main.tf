terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

resource "random_string" "waf_suffix" {
  length  = 6
  upper   = false
  special = false
}

# WAF Web ACL with environment-specific unique name
resource "aws_wafv2_web_acl" "main" {
  # count = var.enable_waf ? 1 : 0
  name        = "cineverse-${var.project_name}-${var.environment}-waf-${random_string.waf_suffix.result}"
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
    metric_name                = "cineverse-${var.project_name}-${var.environment}-waf"
    sampled_requests_enabled   = true
  }
}

# FIXED: CloudWatch Log Group with corrected naming (single cineverse)
resource "aws_cloudwatch_log_group" "waf" {
  name              = "/aws/wafv2/cineverse-${var.environment}-waf"
  retention_in_days = var.log_retention_days
  
  provider = aws.us_east_1
  
  tags = var.tags
}

# OPTION 1: WAF Logging Configuration (Simple - recommended)
# Comment this out if it continues to fail
resource "aws_wafv2_web_acl_logging_configuration" "main" {
  #count = var.enable_waf_logging ? 1 : 0
  resource_arn            = aws_wafv2_web_acl.main.arn
  log_destination_configs = [aws_cloudwatch_log_group.waf.arn]

  provider = aws.us_east_1

  depends_on = [
    aws_wafv2_web_acl.main,
    aws_cloudwatch_log_group.waf
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

  lifecycle {
    create_before_destroy = true
  }
}




# OPTION 2: Skip WAF logging (uncomment if Option 1 fails)
# If WAF logging continues to fail, you can skip it entirely.
# The WAF will still work for protection, just without logging.
# 
# resource "null_resource" "skip_waf_logging" {
#   provisioner "local-exec" {
#     command = "echo 'WAF logging disabled - WAF protection still active'"
#   }
# }

data "aws_caller_identity" "current" {
  provider = aws.us_east_1
}

resource "aws_cloudwatch_log_resource_policy" "waf_logging" {
  policy_name = "AWSWAFLoggingPolicy"

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
