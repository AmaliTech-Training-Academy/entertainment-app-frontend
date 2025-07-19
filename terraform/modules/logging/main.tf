# S3 bucket for CloudFront access logs
resource "aws_s3_bucket" "cloudfront_logs" {
  bucket = "${var.project_name}-${var.environment}-cloudfront-logs-${random_string.logs_suffix.result}"
  
  tags = merge(var.tags, {
    Purpose = "cloudfront-access-logs"
  })
}

resource "random_string" "logs_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_versioning" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle configuration for log retention - FIXED
resource "aws_s3_bucket_lifecycle_configuration" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    id     = "log_retention"
    status = "Enabled"

    # Add filter to apply rule to all objects
    filter {
      prefix = ""
    }

    expiration {
      days = var.environment == "prod" ? 365 : 90
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# S3 bucket for S3 access logs
resource "aws_s3_bucket" "s3_access_logs" {
  bucket = "${var.project_name}-${var.environment}-s3-access-logs-${random_string.s3_logs_suffix.result}"
  
  tags = merge(var.tags, {
    Purpose = "s3-access-logs"
  })
}

resource "random_string" "s3_logs_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_versioning" "s3_access_logs" {
  bucket = aws_s3_bucket.s3_access_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "s3_access_logs" {
  bucket = aws_s3_bucket.s3_access_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "s3_access_logs" {
  bucket = aws_s3_bucket.s3_access_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle configuration for S3 access logs - FIXED
resource "aws_s3_bucket_lifecycle_configuration" "s3_access_logs" {
  bucket = aws_s3_bucket.s3_access_logs.id

  rule {
    id     = "s3_log_retention"
    status = "Enabled"

    # Add filter to apply rule to all objects
    filter {
      prefix = ""
    }

    expiration {
      days = var.environment == "prod" ? 180 : 60
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# CloudWatch Log Group for aggregated logs
resource "aws_cloudwatch_log_group" "access_logs" {
  name              = "/aws/cineverse/${var.environment}/access-logs"
  retention_in_days = var.environment == "prod" ? 90 : 30
  
  tags = var.tags
}

# Lambda function for log processing
resource "aws_lambda_function" "log_processor" {
  filename         = data.archive_file.log_processor.output_path
  function_name    = "${var.project_name}-${var.environment}-log-processor"
  role            = aws_iam_role.log_processor.arn
  handler         = "index.handler"
  runtime         = "python3.9"
  timeout         = 60
  source_code_hash = data.archive_file.log_processor.output_base64sha256

  environment {
    variables = {
      LOG_GROUP_NAME = aws_cloudwatch_log_group.access_logs.name
      ENVIRONMENT    = var.environment
    }
  }

  tags = var.tags
}

# Lambda code for log processing
data "archive_file" "log_processor" {
  type        = "zip"
  output_path = "${path.module}/log_processor.zip"
  
  source {
    content = <<EOF
import json
import boto3
import gzip
import base64
import os
from datetime import datetime

def handler(event, context):
    logs_client = boto3.client('logs')
    
    for record in event['Records']:
        # Process S3 event for new log files
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        
        s3_client = boto3.client('s3')
        
        # Download and process log file
        try:
            response = s3_client.get_object(Bucket=bucket, Key=key)
            
            # CloudFront logs are gzipped
            if key.endswith('.gz'):
                content = gzip.decompress(response['Body'].read()).decode('utf-8')
            else:
                content = response['Body'].read().decode('utf-8')
            
            # Parse and send to CloudWatch Logs
            lines = content.strip().split('\n')
            
            # Skip header lines that start with #
            log_entries = [line for line in lines if not line.startswith('#')]
            
            # Send to CloudWatch Logs in batches
            log_group = os.environ['LOG_GROUP_NAME']
            log_stream = f"access-logs-{datetime.now().strftime('%Y-%m-%d')}"
            
            # Create log stream if it doesn't exist
            try:
                logs_client.create_log_stream(
                    logGroupName=log_group,
                    logStreamName=log_stream
                )
            except logs_client.exceptions.ResourceAlreadyExistsException:
                pass
            
            # Send log events
            log_events = []
            for entry in log_entries[:50]:  # CloudWatch Logs limit
                if entry.strip():  # Only process non-empty lines
                    log_events.append({
                        'timestamp': int(datetime.now().timestamp() * 1000),
                        'message': entry
                    })
            
            if log_events:
                logs_client.put_log_events(
                    logGroupName=log_group,
                    logStreamName=log_stream,
                    logEvents=log_events
                )
            
        except Exception as e:
            print(f"Error processing {bucket}/{key}: {str(e)}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Log processing completed')
    }
EOF
    filename = "index.py"
  }
}

# IAM role for Lambda
resource "aws_iam_role" "log_processor" {
  name = "${var.project_name}-${var.environment}-log-processor-role"

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

# IAM policy for Lambda
resource "aws_iam_role_policy" "log_processor" {
  name = "${var.project_name}-${var.environment}-log-processor-policy"
  role = aws_iam_role.log_processor.id

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
        Resource = [
          "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/${var.project_name}-${var.environment}-log-processor:*",
          aws_cloudwatch_log_group.access_logs.arn,
          "${aws_cloudwatch_log_group.access_logs.arn}:*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = [
          "${aws_s3_bucket.cloudfront_logs.arn}/*",
          "${aws_s3_bucket.s3_access_logs.arn}/*"
        ]
      }
    ]
  })
}

# S3 bucket notification for CloudFront logs
resource "aws_s3_bucket_notification" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.log_processor.arn
    events             = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_lambda_permission.cloudfront_logs]
}

# Lambda permission for S3 CloudFront logs
resource "aws_lambda_permission" "cloudfront_logs" {
  statement_id  = "AllowExecutionFromS3CloudFrontLogs"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.log_processor.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.cloudfront_logs.arn
}