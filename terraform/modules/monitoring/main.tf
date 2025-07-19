terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

# Local values for dashboard widgets - FIXED
locals {
  base_widgets = [
    {
      type   = "metric"
      x      = 0
      y      = 0
      width  = 12
      height = 6

      properties = {
        metrics = [
          ["AWS/CloudFront", "Requests", "DistributionId", var.cloudfront_distribution_id],
          [".", "BytesDownloaded", ".", "."],
          [".", "BytesUploaded", ".", "."],
          [".", "4xxErrorRate", ".", "."],
          [".", "5xxErrorRate", ".", "."]
        ]
        view    = "timeSeries"
        stacked = false
        region  = var.aws_region
        title   = "CloudFront Metrics Overview"
        period  = var.monitoring_period
        stat    = "Average"
      }
    },
    {
      type   = "metric"
      x      = 0
      y      = 6
      width  = 6
      height = 6

      properties = {
        metrics = [
          ["AWS/CloudFront", "CacheHitRate", "DistributionId", var.cloudfront_distribution_id]
        ]
        view    = "timeSeries"
        stacked = false
        region  = var.aws_region
        title   = "Cache Performance"
        period  = var.monitoring_period
        stat    = "Average"
        yAxis = {
          left = {
            min = 0
            max = 100
          }
        }
      }
    },
    {
      type   = "metric"
      x      = 6
      y      = 6
      width  = 6
      height = 6

      properties = {
        metrics = [
          ["AWS/CloudFront", "OriginLatency", "DistributionId", var.cloudfront_distribution_id]
        ]
        view    = "timeSeries"
        stacked = false
        region  = var.aws_region
        title   = "Origin Latency"
        period  = var.monitoring_period
        stat    = "Average"
      }
    }
  ]

  rum_widgets = var.enable_rum ? [
    {
      type   = "metric"
      x      = 0
      y      = 12
      width  = 12
      height = 6

      properties = {
        metrics = [
          ["AWS/RUM", "JsErrorCount", "application_name", "${var.project_name}-${var.environment}-rum"],
          [".", "PageLoadTime", ".", "."],
          [".", "HttpErrorCount", ".", "."]
        ]
        view    = "timeSeries"
        stacked = false
        region  = "us-east-1"
        title   = "Real User Monitoring (RUM)"
        period  = var.monitoring_period
        stat    = "Sum"
      }
    }
  ] : []

  all_widgets = concat(local.base_widgets, local.rum_widgets)
}

# CloudWatch RUM Application Monitor (production feature)
resource "aws_rum_app_monitor" "main" {
  count  = var.enable_rum ? 1 : 0
  name   = "${var.project_name}-${var.environment}-rum"
  domain = var.cloudfront_domain_name

  app_monitor_configuration {
    allow_cookies       = true
    session_sample_rate = var.environment == "prod" ? 0.1 : 0.5
    telemetries         = ["errors", "performance", "http"]
  }

  # Tag configuration for cost tracking
  tags = merge(var.tags, {
    Component = "monitoring"
    Service   = "rum"
  })

  provider = aws.us_east_1
}

# Enhanced CloudWatch Dashboard - FIXED
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}-frontend"

  dashboard_body = jsonencode({
    widgets = local.all_widgets
  })
}

# Enhanced CloudWatch Alarms with Slack notifications
resource "aws_cloudwatch_metric_alarm" "high_4xx_error_rate" {
  alarm_name          = "${var.project_name}-${var.environment}-high-4xx-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = var.monitoring_period
  statistic           = "Average"
  threshold           = var.error_rate_threshold
  alarm_description   = "High 4xx error rate detected on CloudFront distribution"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  ok_actions          = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = var.cloudfront_distribution_id
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "high_5xx_error_rate" {
  alarm_name          = "${var.project_name}-${var.environment}-high-5xx-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = var.monitoring_period
  statistic           = "Average"
  threshold           = var.error_rate_threshold
  alarm_description   = "High 5xx error rate detected on CloudFront distribution"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  ok_actions          = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = var.cloudfront_distribution_id
  }

  tags = var.tags
}

# Cache hit rate alarm
resource "aws_cloudwatch_metric_alarm" "low_cache_hit_rate" {
  alarm_name          = "${var.project_name}-${var.environment}-low-cache-hit-rate"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "CacheHitRate"
  namespace           = "AWS/CloudFront"
  period              = var.monitoring_period
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "CloudFront cache hit rate is below optimal threshold"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = var.cloudfront_distribution_id
  }

  tags = var.tags
}

# RUM-based alarms (production only)
resource "aws_cloudwatch_metric_alarm" "high_js_error_rate" {
  count               = var.enable_rum ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-high-js-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "JsErrorCount"
  namespace           = "AWS/RUM"
  period              = 300
  statistic           = "Sum"
  threshold           = var.environment == "prod" ? 10 : 20
  alarm_description   = "High JavaScript error rate detected in RUM"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  treat_missing_data  = "notBreaching"

  dimensions = {
    application_name = aws_rum_app_monitor.main[0].name
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "high_page_load_time" {
  count               = var.enable_rum ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-high-page-load-time"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "PageLoadTime"
  namespace           = "AWS/RUM"
  period              = 300
  statistic           = "Average"
  threshold           = var.environment == "prod" ? 3000 : 5000  # milliseconds
  alarm_description   = "Page load time is above acceptable threshold"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  treat_missing_data  = "notBreaching"

  dimensions = {
    application_name = aws_rum_app_monitor.main[0].name
  }

  tags = var.tags
}

# Cost monitoring alarms
resource "aws_cloudwatch_metric_alarm" "estimated_charges" {
  count               = var.enable_cost_alerts ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-estimated-charges"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "EstimatedCharges"
  namespace           = "AWS/Billing"
  period              = "86400"  # 24 hours
  statistic           = "Maximum"
  threshold           = var.cost_alert_thresholds.warning
  alarm_description   = "AWS estimated charges exceeded warning threshold"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []
  treat_missing_data  = "notBreaching"

  dimensions = {
    Currency = "USD"
  }

  tags = var.tags
}

# S3 CloudTrail for audit logging (production only)
resource "aws_cloudtrail" "main" {
  count                         = var.environment == "prod" ? 1 : 0
  name                          = "${var.project_name}-${var.environment}-trail"
  s3_bucket_name               = aws_s3_bucket.cloudtrail[0].bucket
  include_global_service_events = true
  is_multi_region_trail        = true
  enable_logging               = true

  event_selector {
    read_write_type                 = "All"
    include_management_events       = true
    exclude_management_event_sources = []

    data_resource {
      type   = "AWS::S3::Object"
      values = ["${var.s3_bucket_arn}/*"]
    }
  }

  tags = var.tags
}

resource "aws_s3_bucket" "cloudtrail" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = "${var.project_name}-${var.environment}-cloudtrail-${random_string.trail_suffix[0].result}"
  tags   = var.tags
}

resource "random_string" "trail_suffix" {
  count   = var.environment == "prod" ? 1 : 0
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_policy" "cloudtrail" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = aws_s3_bucket.cloudtrail[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSCloudTrailAclCheck"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.cloudtrail[0].arn
      },
      {
        Sid    = "AWSCloudTrailWrite"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.cloudtrail[0].arn}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      }
    ]
  })
}

# Custom application health check using CloudWatch Synthetics - FIXED
resource "aws_synthetics_canary" "health_check" {
  count                = var.environment == "prod" ? 1 : 0
  name                 = "${var.project_name}-${var.environment}-health-check"
  artifact_s3_location = "s3://${aws_s3_bucket.canary_artifacts[0].bucket}/canary-artifacts"
  execution_role_arn   = aws_iam_role.canary[0].arn
  handler              = "synthetics.syn-index.handler"
  runtime_version      = "syn-python-selenium-2.1"
  
  schedule {
    expression = "rate(5 minutes)"
  }

  zip_file = data.archive_file.canary_script[0].output_path

  tags = var.tags
}

# S3 bucket for canary artifacts
resource "aws_s3_bucket" "canary_artifacts" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = "${var.project_name}-${var.environment}-canary-artifacts-${random_string.canary_suffix[0].result}"
  tags   = var.tags
}

resource "random_string" "canary_suffix" {
  count   = var.environment == "prod" ? 1 : 0
  length  = 8
  special = false
  upper   = false
}

# S3 bucket policy for canary artifacts
resource "aws_s3_bucket_policy" "canary_artifacts" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = aws_s3_bucket.canary_artifacts[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_role.canary[0].arn
        }
        Action = [
          "s3:GetBucketLocation",
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.canary_artifacts[0].arn
      },
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_role.canary[0].arn
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.canary_artifacts[0].arn}/*"
      }
    ]
  })
}

# Canary script
data "archive_file" "canary_script" {
  count       = var.environment == "prod" ? 1 : 0
  type        = "zip"
  output_path = "${path.module}/canary_script.zip"
  
  source {
    content = <<EOF
import synthetics
from synthetics.logger import synthetics_logger
from synthetics.common import synthetics_configuration

def main():
    synthetics_configuration.set_config({
        "screenshot_on_step_start": True,
        "screenshot_on_step_success": True,
        "screenshot_on_step_failure": True
    })
    
    url = "https://${var.cloudfront_domain_name}"
    synthetics.launch_browser_config({
        "selenium_version": "3.141.0",
        "chrome_version": "91.0.4472.101"
    })
    
    synthetics.browser_step(
        step_name="verify_homepage",
        action=lambda: verify_homepage(url)
    )

def verify_homepage(url):
    synthetics.go_to_url(url)
    
    # Wait for page to load
    synthetics.wait_for_element("body", timeout=10)
    
    # Verify title
    title = synthetics.get_title()
    if "CineVerse" not in title:
        raise Exception(f"Unexpected page title: {title}")
    
    # Check for key elements
    synthetics.wait_for_element("app-root", timeout=5)
    
    synthetics_logger.info("Homepage verification successful")

def handler(event, context):
    return synthetics.run_step(main, event, context)
EOF
    filename = "synthetics/syn-index.py"
  }
}

# IAM role for CloudWatch Synthetics
resource "aws_iam_role" "canary" {
  count = var.environment == "prod" ? 1 : 0
  name  = "${var.project_name}-${var.environment}-canary-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# Enhanced IAM policy for CloudWatch Synthetics - FIXED with comprehensive permissions
resource "aws_iam_role_policy" "canary" {
  count = var.environment == "prod" ? 1 : 0
  name  = "${var.project_name}-${var.environment}-canary-policy"
  role  = aws_iam_role.canary[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetBucketLocation",
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.canary_artifacts[0].arn
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.canary_artifacts[0].arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "cloudwatch:namespace" = "CloudWatchSynthetics"
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "synthetics:*"
        ]
        Resource = "*"
      }
    ]
  })
}

# REMOVED: AWS managed policy attachment that was causing the error
# The custom policy above includes all necessary permissions for CloudWatch Synthetics