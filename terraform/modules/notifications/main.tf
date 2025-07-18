# SNS Topic for notifications
resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-${var.environment}-alerts"

  tags = var.tags
}

# SNS Topic Policy
resource "aws_sns_topic_policy" "alerts" {
  arn = aws_sns_topic.alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudWatchAlarmsToPublish"
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.alerts.arn
      }
    ]
  })
}

# Email subscriptions
resource "aws_sns_topic_subscription" "email" {
  count     = length(var.notification_emails)
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.notification_emails[count.index]
}

# Lambda function for Slack notifications
resource "aws_lambda_function" "slack_notifier" {
  count            = var.slack_webhook_url != "" ? 1 : 0
  filename         = data.archive_file.slack_notifier[0].output_path
  function_name    = "${var.project_name}-${var.environment}-slack-notifier"
  role            = aws_iam_role.slack_notifier[0].arn
  handler         = "index.handler"
  runtime         = "python3.9"
  timeout         = 30
  source_code_hash = data.archive_file.slack_notifier[0].output_base64sha256

  environment {
    variables = {
      SLACK_WEBHOOK_URL = var.slack_webhook_url
      ENVIRONMENT      = var.environment
      PROJECT_NAME     = var.project_name
    }
  }

  tags = var.tags
}

# Lambda code for Slack notifications
data "archive_file" "slack_notifier" {
  count       = var.slack_webhook_url != "" ? 1 : 0
  type        = "zip"
  output_path = "${path.module}/slack_notifier.zip"
  
  source {
    content = <<EOF
import json
import urllib3
import os
from datetime import datetime

def handler(event, context):
    webhook_url = os.environ['SLACK_WEBHOOK_URL']
    environment = os.environ['ENVIRONMENT']
    project_name = os.environ['PROJECT_NAME']
    
    # Parse SNS message
    for record in event['Records']:
        if record['EventSource'] == 'aws:sns':
            message = json.loads(record['Sns']['Message'])
            
            # Determine alert type and color
            if message.get('NewStateValue') == 'ALARM':
                color = '#FF0000'  # Red
                emoji = '🚨'
                status = 'ALARM'
            elif message.get('NewStateValue') == 'OK':
                color = '#00FF00'  # Green
                emoji = '✅'
                status = 'RESOLVED'
            else:
                color = '#FFAA00'  # Orange
                emoji = '⚠️'
                status = 'WARNING'
            
            # Format Slack message
            slack_message = {
                "username": f"AWS {project_name.title()} Monitor",
                "icon_emoji": ":aws:",
                "attachments": [
                    {
                        "color": color,
                        "title": f"{emoji} {status}: {message.get('AlarmName', 'Unknown Alarm')}",
                        "text": message.get('AlarmDescription', 'No description available'),
                        "fields": [
                            {
                                "title": "Environment",
                                "value": environment.upper(),
                                "short": True
                            },
                            {
                                "title": "Region",
                                "value": message.get('Region', 'Unknown'),
                                "short": True
                            },
                            {
                                "title": "Metric",
                                "value": message.get('MetricName', 'Unknown'),
                                "short": True
                            },
                            {
                                "title": "Threshold",
                                "value": str(message.get('Threshold', 'Unknown')),
                                "short": True
                            }
                        ],
                        "footer": "AWS CloudWatch",
                        "ts": int(datetime.now().timestamp())
                    }
                ]
            }
            
            # Add deployment notification handling
            if 'deployment' in message.get('Subject', '').lower():
                slack_message['attachments'][0]['color'] = '#0099FF'  # Blue
                slack_message['attachments'][0]['title'] = f"🚀 Deployment Notification"
            
            # Send to Slack
            http = urllib3.PoolManager()
            
            response = http.request(
                'POST',
                webhook_url,
                body=json.dumps(slack_message).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"Slack notification sent: {response.status}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Notifications sent successfully')
    }
EOF
    filename = "index.py"
  }
}

# IAM role for Slack notifier Lambda
resource "aws_iam_role" "slack_notifier" {
  count = var.slack_webhook_url != "" ? 1 : 0
  name  = "${var.project_name}-${var.environment}-slack-notifier-role"

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

# IAM policy for Slack notifier Lambda
resource "aws_iam_role_policy" "slack_notifier" {
  count = var.slack_webhook_url != "" ? 1 : 0
  name  = "${var.project_name}-${var.environment}-slack-notifier-policy"
  role  = aws_iam_role.slack_notifier[0].id

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
      }
    ]
  })
}

# SNS subscription for Slack Lambda
resource "aws_sns_topic_subscription" "slack" {
  count     = var.slack_webhook_url != "" ? 1 : 0
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.slack_notifier[0].arn
}

# Lambda permission for SNS
resource "aws_lambda_permission" "sns_slack" {
  count         = var.slack_webhook_url != "" ? 1 : 0
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.slack_notifier[0].function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.alerts.arn
}

# SNS topic for deployment notifications
resource "aws_sns_topic" "deployments" {
  name = "${var.project_name}-${var.environment}-deployments"

  tags = var.tags
}

# Lambda function for deployment notifications
resource "aws_lambda_function" "deployment_notifier" {
  count            = var.slack_webhook_url != "" ? 1 : 0
  filename         = data.archive_file.deployment_notifier[0].output_path
  function_name    = "${var.project_name}-${var.environment}-deployment-notifier"
  role            = aws_iam_role.deployment_notifier[0].arn
  handler         = "index.handler"
  runtime         = "python3.9"
  timeout         = 30
  source_code_hash = data.archive_file.deployment_notifier[0].output_base64sha256

  environment {
    variables = {
      SLACK_WEBHOOK_URL = var.slack_webhook_url
      ENVIRONMENT      = var.environment
      PROJECT_NAME     = var.project_name
    }
  }

  tags = var.tags
}

# Lambda code for deployment notifications
data "archive_file" "deployment_notifier" {
  count       = var.slack_webhook_url != "" ? 1 : 0
  type        = "zip"
  output_path = "${path.module}/deployment_notifier.zip"
  
  source {
    content = <<EOF
import json
import urllib3
import os
from datetime import datetime

def handler(event, context):
    webhook_url = os.environ['SLACK_WEBHOOK_URL']
    environment = os.environ['ENVIRONMENT']
    project_name = os.environ['PROJECT_NAME']
    
    # Parse deployment event
    deployment_info = json.loads(event['Records'][0]['Sns']['Message'])
    
    status = deployment_info.get('status', 'unknown')
    version = deployment_info.get('version', 'unknown')
    deployed_by = deployment_info.get('deployed_by', 'unknown')
    url = deployment_info.get('url', '')
    
    # Determine color based on status
    if status == 'success':
        color = '#00FF00'  # Green
        emoji = '🚀'
    elif status == 'failed':
        color = '#FF0000'  # Red
        emoji = '💥'
    else:
        color = '#FFAA00'  # Orange
        emoji = '⚠️'
    
    # Format Slack message
    slack_message = {
        "username": f"{project_name.title()} Deployment Bot",
        "icon_emoji": ":rocket:",
        "attachments": [
            {
                "color": color,
                "title": f"{emoji} Deployment {status.title()}",
                "text": f"Environment: {environment.upper()}",
                "fields": [
                    {
                        "title": "Version",
                        "value": version,
                        "short": True
                    },
                    {
                        "title": "Deployed By",
                        "value": deployed_by,
                        "short": True
                    }
                ],
                "footer": "CineVerse CI/CD",
                "ts": int(datetime.now().timestamp())
            }
        ]
    }
    
    # Add URL if available
    if url:
        slack_message['attachments'][0]['actions'] = [
            {
                "type": "button",
                "text": "View Application",
                "url": url
            }
        ]
    
    # Send to Slack
    http = urllib3.PoolManager()
    
    response = http.request(
        'POST',
        webhook_url,
        body=json.dumps(slack_message).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"Deployment notification sent: {response.status}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Deployment notification sent successfully')
    }
EOF
    filename = "index.py"
  }
}

# IAM role for deployment notifier Lambda
resource "aws_iam_role" "deployment_notifier" {
  count = var.slack_webhook_url != "" ? 1 : 0
  name  = "${var.project_name}-${var.environment}-deployment-notifier-role"

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

# IAM policy for deployment notifier Lambda
resource "aws_iam_role_policy" "deployment_notifier" {
  count = var.slack_webhook_url != "" ? 1 : 0
  name  = "${var.project_name}-${var.environment}-deployment-notifier-policy"
  role  = aws_iam_role.deployment_notifier[0].id

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
      }
    ]
  })
}

# SNS subscription for deployment notifications
resource "aws_sns_topic_subscription" "deployment_slack" {
  count     = var.slack_webhook_url != "" ? 1 : 0
  topic_arn = aws_sns_topic.deployments.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.deployment_notifier[0].arn
}

# Lambda permission for deployment notifications
resource "aws_lambda_permission" "sns_deployment" {
  count         = var.slack_webhook_url != "" ? 1 : 0
  statement_id  = "AllowExecutionFromSNSDeployment"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.deployment_notifier[0].function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.deployments.arn
}