# S3 bucket for rollback artifacts
resource "aws_s3_bucket" "rollback_artifacts" {
  bucket = "${var.project_name}-${var.environment}-rollback-artifacts-${random_string.rollback_suffix.result}"
  
  tags = merge(var.tags, {
    Purpose = "rollback-artifacts"
  })
}

resource "random_string" "rollback_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_versioning" "rollback_artifacts" {
  bucket = aws_s3_bucket.rollback_artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "rollback_artifacts" {
  bucket = aws_s3_bucket.rollback_artifacts.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "rollback_artifacts" {
  bucket = aws_s3_bucket.rollback_artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle configuration for rollback artifacts
resource "aws_s3_bucket_lifecycle_configuration" "rollback_artifacts" {
  bucket = aws_s3_bucket.rollback_artifacts.id

  rule {
    id     = "rollback_retention"
    status = "Enabled"

    filter {
      prefix = ""
    }

    expiration {
      days = 30  # Keep rollback artifacts for 30 days
    }

    noncurrent_version_expiration {
      noncurrent_days = 7
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

# Lambda function for automated rollback
resource "aws_lambda_function" "rollback_handler" {
  filename         = data.archive_file.rollback_handler.output_path
  function_name    = "${var.project_name}-${var.environment}-rollback-handler"
  role            = aws_iam_role.rollback_handler.arn
  handler         = "index.handler"
  runtime         = "python3.9"
  timeout         = 300
  source_code_hash = data.archive_file.rollback_handler.output_base64sha256

  environment {
    variables = {
      S3_BUCKET_NAME             = var.s3_bucket_name
      CLOUDFRONT_DISTRIBUTION_ID = var.cloudfront_distribution_id
      ROLLBACK_BUCKET_NAME       = aws_s3_bucket.rollback_artifacts.bucket
      SNS_TOPIC_ARN             = var.sns_topic_arn
      PROJECT_NAME              = var.project_name
      ENVIRONMENT               = var.environment
    }
  }

  tags = var.tags
}

# Lambda code for rollback handler
data "archive_file" "rollback_handler" {
  type        = "zip"
  output_path = "${path.module}/rollback_handler.zip"
  
  source {
    content = <<EOF
import json
import boto3
import os
from datetime import datetime
import zipfile
import tempfile

def handler(event, context):
    s3_client = boto3.client('s3')
    cloudfront_client = boto3.client('cloudfront')
    sns_client = boto3.client('sns')
    
    s3_bucket = os.environ['S3_BUCKET_NAME']
    cf_distribution_id = os.environ['CLOUDFRONT_DISTRIBUTION_ID']
    rollback_bucket = os.environ['ROLLBACK_BUCKET_NAME']
    sns_topic_arn = os.environ['SNS_TOPIC_ARN']
    project_name = os.environ['PROJECT_NAME']
    environment = os.environ['ENVIRONMENT']
    
    try:
        # Determine rollback action
        action = event.get('action', 'backup')
        
        if action == 'backup':
            # Create backup of current deployment
            return create_backup(s3_client, s3_bucket, rollback_bucket)
            
        elif action == 'rollback':
            # Perform rollback to previous version
            version = event.get('version', 'latest')
            return perform_rollback(
                s3_client, cloudfront_client, sns_client,
                s3_bucket, cf_distribution_id, rollback_bucket,
                sns_topic_arn, project_name, environment, version
            )
            
        elif action == 'list_versions':
            # List available backup versions
            return list_backup_versions(s3_client, rollback_bucket)
            
        else:
            raise ValueError(f"Unknown action: {action}")
            
    except Exception as e:
        error_message = f"Rollback operation failed: {str(e)}"
        print(error_message)
        
        # Send error notification
        sns_client.publish(
            TopicArn=sns_topic_arn,
            Subject=f"Rollback Failed - {project_name} {environment}",
            Message=error_message
        )
        
        return {
            'statusCode': 500,
            'body': json.dumps({'error': error_message})
        }

def create_backup(s3_client, s3_bucket, rollback_bucket):
    """Create backup of current S3 website content"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_key = f"backups/backup_{timestamp}.zip"
    
    # List all objects in the website bucket
    objects = s3_client.list_objects_v2(Bucket=s3_bucket)
    
    if 'Contents' not in objects:
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'No content to backup'})
        }
    
    # Create temporary zip file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_file:
        with zipfile.ZipFile(temp_file.name, 'w') as zip_file:
            for obj in objects['Contents']:
                key = obj['Key']
                
                # Download object
                response = s3_client.get_object(Bucket=s3_bucket, Key=key)
                content = response['Body'].read()
                
                # Add to zip
                zip_file.writestr(key, content)
        
        # Upload backup to rollback bucket
        with open(temp_file.name, 'rb') as zip_data:
            s3_client.put_object(
                Bucket=rollback_bucket,
                Key=backup_key,
                Body=zip_data,
                Metadata={
                    'created_at': timestamp,
                    'source_bucket': s3_bucket
                }
            )
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Backup created successfully',
            'backup_key': backup_key,
            'timestamp': timestamp
        })
    }

def perform_rollback(s3_client, cloudfront_client, sns_client, 
                    s3_bucket, cf_distribution_id, rollback_bucket,
                    sns_topic_arn, project_name, environment, version):
    """Perform rollback to specified version"""
    
    # Find backup to rollback to
    if version == 'latest':
        # Get the most recent backup
        backups = s3_client.list_objects_v2(
            Bucket=rollback_bucket,
            Prefix='backups/'
        )
        
        if 'Contents' not in backups:
            raise Exception("No backups available for rollback")
        
        # Sort by last modified and get the latest
        latest_backup = sorted(backups['Contents'], 
                             key=lambda x: x['LastModified'], reverse=True)[0]
        backup_key = latest_backup['Key']
    else:
        backup_key = f"backups/backup_{version}.zip"
    
    # Download backup
    with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_file:
        s3_client.download_file(rollback_bucket, backup_key, temp_file.name)
        
        # Clear current S3 bucket content
        objects = s3_client.list_objects_v2(Bucket=s3_bucket)
        if 'Contents' in objects:
            delete_objects = [{'Key': obj['Key']} for obj in objects['Contents']]
            s3_client.delete_objects(
                Bucket=s3_bucket,
                Delete={'Objects': delete_objects}
            )
        
        # Extract and upload backup content
        with zipfile.ZipFile(temp_file.name, 'r') as zip_file:
            for file_info in zip_file.filelist:
                content = zip_file.read(file_info.filename)
                
                # Determine content type
                content_type = 'text/html'
                if file_info.filename.endswith('.css'):
                    content_type = 'text/css'
                elif file_info.filename.endswith('.js'):
                    content_type = 'application/javascript'
                elif file_info.filename.endswith('.json'):
                    content_type = 'application/json'
                elif file_info.filename.endswith(('.png', '.jpg', '.jpeg')):
                    content_type = 'image/' + file_info.filename.split('.')[-1]
                
                s3_client.put_object(
                    Bucket=s3_bucket,
                    Key=file_info.filename,
                    Body=content,
                    ContentType=content_type
                )
    
    # Invalidate CloudFront cache
    invalidation_response = cloudfront_client.create_invalidation(
        DistributionId=cf_distribution_id,
        InvalidationBatch={
            'Paths': {
                'Quantity': 1,
                'Items': ['/*']
            },
            'CallerReference': f"rollback_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
    )
    
    # Send success notification
    sns_client.publish(
        TopicArn=sns_topic_arn,
        Subject=f"Rollback Completed - {project_name} {environment}",
        Message=f'''
Rollback completed successfully for {project_name} ({environment})

Backup Version: {backup_key}
CloudFront Invalidation ID: {invalidation_response['Invalidation']['Id']}
Rollback Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

The application should be accessible shortly after cache invalidation completes.
        '''.strip()
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Rollback completed successfully',
            'backup_version': backup_key,
            'invalidation_id': invalidation_response['Invalidation']['Id']
        })
    }

def list_backup_versions(s3_client, rollback_bucket):
    """List available backup versions"""
    backups = s3_client.list_objects_v2(
        Bucket=rollback_bucket,
        Prefix='backups/'
    )
    
    if 'Contents' not in backups:
        return {
            'statusCode': 200,
            'body': json.dumps({'versions': []})
        }
    
    versions = []
    for backup in backups['Contents']:
        # Extract metadata
        metadata_response = s3_client.head_object(
            Bucket=rollback_bucket,
            Key=backup['Key']
        )
        
        versions.append({
            'key': backup['Key'],
            'size': backup['Size'],
            'last_modified': backup['LastModified'].isoformat(),
            'created_at': metadata_response.get('Metadata', {}).get('created_at', 'unknown')
        })
    
    # Sort by last modified (newest first)
    versions.sort(key=lambda x: x['last_modified'], reverse=True)
    
    return {
        'statusCode': 200,
        'body': json.dumps({'versions': versions})
    }
EOF
    filename = "index.py"
  }
}

# IAM role for rollback handler Lambda
resource "aws_iam_role" "rollback_handler" {
  name = "${var.project_name}-${var.environment}-rollback-handler-role"

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

# IAM policy for rollback handler Lambda
resource "aws_iam_role_policy" "rollback_handler" {
  name = "${var.project_name}-${var.environment}-rollback-handler-policy"
  role = aws_iam_role.rollback_handler.id

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
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.s3_bucket_name}",
          "arn:aws:s3:::${var.s3_bucket_name}/*",
          aws_s3_bucket.rollback_artifacts.arn,
          "${aws_s3_bucket.rollback_artifacts.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation"
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

# CloudWatch alarm for high error rates that triggers rollback
resource "aws_cloudwatch_metric_alarm" "auto_rollback_trigger" {
  alarm_name          = "${var.project_name}-${var.environment}-auto-rollback-trigger"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = "300"
  statistic           = "Average"
  threshold           = "10"  # 10% error rate
  alarm_description   = "High error rate detected - consider rollback"
  alarm_actions       = [aws_sns_topic.rollback_alerts.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = var.cloudfront_distribution_id
  }

  tags = var.tags
}

# SNS topic for rollback alerts
resource "aws_sns_topic" "rollback_alerts" {
  name = "${var.project_name}-${var.environment}-rollback-alerts"
  tags = var.tags
}

# Lambda function for rollback decision making
resource "aws_lambda_function" "rollback_decision" {
  filename         = data.archive_file.rollback_decision.output_path
  function_name    = "${var.project_name}-${var.environment}-rollback-decision"
  role            = aws_iam_role.rollback_decision.arn
  handler         = "index.handler"
  runtime         = "python3.9"
  timeout         = 60
  source_code_hash = data.archive_file.rollback_decision.output_base64sha256

  environment {
    variables = {
      ROLLBACK_LAMBDA_ARN = aws_lambda_function.rollback_handler.arn
      SNS_TOPIC_ARN      = var.sns_topic_arn
      PROJECT_NAME       = var.project_name
      ENVIRONMENT        = var.environment
    }
  }

  tags = var.tags
}

# Lambda code for rollback decision
data "archive_file" "rollback_decision" {
  type        = "zip"
  output_path = "${path.module}/rollback_decision.zip"
  
  source {
    content = <<EOF
import json
import boto3
import os
from datetime import datetime

def handler(event, context):
    lambda_client = boto3.client('lambda')
    sns_client = boto3.client('sns')
    
    rollback_lambda_arn = os.environ['ROLLBACK_LAMBDA_ARN']
    sns_topic_arn = os.environ['SNS_TOPIC_ARN']
    project_name = os.environ['PROJECT_NAME']
    environment = os.environ['ENVIRONMENT']
    
    # Parse CloudWatch alarm
    alarm_data = json.loads(event['Records'][0]['Sns']['Message'])
    alarm_name = alarm_data.get('AlarmName', '')
    new_state = alarm_data.get('NewStateValue', '')
    
    if new_state == 'ALARM' and 'auto-rollback-trigger' in alarm_name:
        # Send notification about potential rollback need
        notification_message = f'''
ALERT: High error rate detected on {project_name} ({environment})

Alarm: {alarm_name}
State: {new_state}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

A rollback may be required. To perform automatic rollback, run:

aws lambda invoke --function-name {rollback_lambda_arn.split(':')[-1]} \\
  --payload '{{"action": "rollback", "version": "latest"}}' \\
  /tmp/rollback-response.json

Available rollback versions can be listed with:

aws lambda invoke --function-name {rollback_lambda_arn.split(':')[-1]} \\
  --payload '{{"action": "list_versions"}}' \\
  /tmp/versions-response.json
        '''.strip()
        
        sns_client.publish(
            TopicArn=sns_topic_arn,
            Subject=f"Rollback Required - {project_name} {environment}",
            Message=notification_message
        )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Rollback decision processed')
    }
EOF
    filename = "index.py"
  }
}

# IAM role for rollback decision Lambda
resource "aws_iam_role" "rollback_decision" {
  name = "${var.project_name}-${var.environment}-rollback-decision-role"

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

# IAM policy for rollback decision Lambda
resource "aws_iam_role_policy" "rollback_decision" {
  name = "${var.project_name}-${var.environment}-rollback-decision-policy"
  role = aws_iam_role.rollback_decision.id

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
          "lambda:InvokeFunction"
        ]
        Resource = aws_lambda_function.rollback_handler.arn
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

# SNS subscription for rollback decision Lambda
resource "aws_sns_topic_subscription" "rollback_decision" {
  topic_arn = aws_sns_topic.rollback_alerts.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.rollback_decision.arn
}

# Lambda permission for SNS rollback alerts
resource "aws_lambda_permission" "rollback_sns" {
  statement_id  = "AllowExecutionFromSNSRollback"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.rollback_decision.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.rollback_alerts.arn
}