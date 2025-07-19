# AWS Budget for cost monitoring (minimal working version)
resource "aws_budgets_budget" "cost_budget" {
  name         = "${var.project_name}-${var.environment}-budget"
  budget_type  = "COST"
  limit_amount = var.cost_alert_thresholds.critical
  limit_unit   = "USD"
  time_unit    = "MONTHLY"
  time_period_start = formatdate("YYYY-MM-01_00:00", timestamp())

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 80
    threshold_type            = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = []
    subscriber_sns_topic_arns  = [var.sns_topic_arn]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 100
    threshold_type            = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = []
    subscriber_sns_topic_arns  = [var.sns_topic_arn]
  }

  lifecycle {
    ignore_changes = [time_period_start]
  }

  tags = var.tags
}

# CloudWatch dashboard for cost monitoring (REMOVED TAGS - not supported)
resource "aws_cloudwatch_dashboard" "cost_dashboard" {
  dashboard_name = "${var.project_name}-${var.environment}-costs"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Billing", "EstimatedCharges", "Currency", "USD"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Estimated Monthly Charges"
          period  = 86400
          stat    = "Maximum"
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
            ["AWS/CloudFront", "BytesDownloaded", "DistributionId", "ALL"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "CloudFront Data Transfer"
          period  = 3600
          stat    = "Sum"
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
            ["AWS/S3", "BucketSizeBytes", "BucketName", "ALL", "StorageType", "StandardStorage"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "S3 Storage Usage"
          period  = 86400
          stat    = "Average"
        }
      }
    ]
  })
}

# Lambda function for cost optimization recommendations
resource "aws_lambda_function" "cost_optimizer" {
  filename         = data.archive_file.cost_optimizer.output_path
  function_name    = "${var.project_name}-${var.environment}-cost-optimizer"
  role            = aws_iam_role.cost_optimizer.arn
  handler         = "index.handler"
  runtime         = "python3.9"
  timeout         = 300
  source_code_hash = data.archive_file.cost_optimizer.output_base64sha256

  environment {
    variables = {
      SNS_TOPIC_ARN = var.sns_topic_arn
      PROJECT_NAME  = var.project_name
      ENVIRONMENT   = var.environment
    }
  }

  tags = var.tags
}

# Lambda code for cost optimization
data "archive_file" "cost_optimizer" {
  type        = "zip"
  output_path = "${path.module}/cost_optimizer.zip"
  
  source {
    content = <<EOF
import json
import boto3
import os
from datetime import datetime, timedelta

def handler(event, context):
    ce_client = boto3.client('ce')
    sns_client = boto3.client('sns')
    
    project_name = os.environ['PROJECT_NAME']
    environment = os.environ['ENVIRONMENT']
    sns_topic_arn = os.environ['SNS_TOPIC_ARN']
    
    # Get cost data for the last 30 days
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    
    try:
        # Get cost and usage data
        response = ce_client.get_cost_and_usage(
            TimePeriod={
                'Start': start_date,
                'End': end_date
            },
            Granularity='MONTHLY',
            Metrics=['BlendedCost'],
            GroupBy=[
                {
                    'Type': 'DIMENSION',
                    'Key': 'SERVICE'
                }
            ]
        )
        
        recommendations = []
        total_cost = 0
        
        for result in response['ResultsByTime']:
            for group in result['Groups']:
                service = group['Keys'][0]
                cost = float(group['Metrics']['BlendedCost']['Amount'])
                total_cost += cost
                
                # Generate recommendations based on service costs
                if service == 'Amazon CloudFront' and cost > 50:
                    recommendations.append(f"CloudFront costs ($${cost:.2f}) are high. Consider optimizing cache policies and using regional edge caches.")
                
                if service == 'Amazon Simple Storage Service' and cost > 20:
                    recommendations.append(f"S3 costs ($${cost:.2f}) could be optimized. Consider using S3 Intelligent Tiering or lifecycle policies.")
        
        # Send recommendations via SNS if any
        if recommendations:
            message_body = f"""
Cost Optimization Report for {project_name} ({environment})

Total Monthly Cost: $${total_cost:.2f}

Recommendations:
{chr(10).join(f"• {rec}" for rec in recommendations)}

Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            """.strip()
            
            sns_client.publish(
                TopicArn=sns_topic_arn,
                Subject=f'Cost Optimization Recommendations - {project_name} {environment}',
                Message=message_body
            )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'total_cost': total_cost,
                'recommendations_count': len(recommendations)
            })
        }
        
    except Exception as e:
        print(f"Error in cost optimization: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
EOF
    filename = "index.py"
  }
}

# IAM role for cost optimizer Lambda
resource "aws_iam_role" "cost_optimizer" {
  name = "${var.project_name}-${var.environment}-cost-optimizer-role"

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

# IAM policy for cost optimizer Lambda
resource "aws_iam_role_policy" "cost_optimizer" {
  name = "${var.project_name}-${var.environment}-cost-optimizer-policy"
  role = aws_iam_role.cost_optimizer.id

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
          "ce:GetCostAndUsage",
          "ce:GetUsageReport",
          "ce:GetRightsizingRecommendation"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = var.sns_topic_arn
      }
    ]
  })
}

# EventBridge rule to trigger cost optimization weekly - FIXED
resource "aws_cloudwatch_event_rule" "cost_optimization_schedule" {
  name                = "${var.project_name}-${var.environment}-cost-optimization"
  description         = "Trigger cost optimization analysis weekly"
  schedule_expression = "cron(0 9 ? * MON *)"  # FIXED: 9 AM every Monday

  tags = var.tags
}

# EventBridge target for cost optimization Lambda
resource "aws_cloudwatch_event_target" "cost_optimization_target" {
  rule      = aws_cloudwatch_event_rule.cost_optimization_schedule.name
  target_id = "CostOptimizationTarget"
  arn       = aws_lambda_function.cost_optimizer.arn
}

# Lambda permission for EventBridge
resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cost_optimizer.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.cost_optimization_schedule.arn
}