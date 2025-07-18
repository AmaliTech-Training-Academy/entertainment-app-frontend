resource "aws_s3_bucket" "website" {
  bucket = var.bucket_name
  tags   = var.tags
}

# Enhanced versioning configuration
resource "aws_s3_bucket_versioning" "website" {
  count  = var.enable_versioning ? 1 : 0
  bucket = aws_s3_bucket.website.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Server-side encryption configuration
resource "aws_s3_bucket_server_side_encryption_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# S3 Intelligent Tiering for cost optimization
resource "aws_s3_bucket_intelligent_tiering_configuration" "website" {
  count  = var.enable_intelligent_tiering ? 1 : 0
  bucket = aws_s3_bucket.website.id
  name   = "entire-bucket"

  status = "Enabled"

  tiering {
    access_tier = "ARCHIVE_ACCESS"
    days        = 90
  }

  tiering {
    access_tier = "DEEP_ARCHIVE_ACCESS"
    days        = 180
  }

  # Note: Intelligent Tiering Configuration doesn't support tags directly
}

# Public access block
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enhanced lifecycle configuration
resource "aws_s3_bucket_lifecycle_configuration" "website" {
  depends_on = [aws_s3_bucket_versioning.website]
  bucket     = aws_s3_bucket.website.id

  rule {
    id     = "delete_old_versions"
    status = "Enabled"

    filter {
      prefix = ""  # Apply to all objects
    }

    noncurrent_version_expiration {
      noncurrent_days = var.environment == "prod" ? 30 : 7
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }

  # Additional rule for transitioning to cheaper storage classes
  dynamic "rule" {
    for_each = var.environment == "prod" ? [1] : []
    content {
      id     = "cost_optimization"
      status = "Enabled"

      filter {
        prefix = "assets/"  # Apply to static assets
      }

      transition {
        days          = 30
        storage_class = "STANDARD_IA"
      }

      transition {
        days          = 90
        storage_class = "GLACIER"
      }
    }
  }
}

# S3 access logging (production feature)
resource "aws_s3_bucket" "access_logs" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = "${var.bucket_name}-access-logs"
  
  tags = merge(var.tags, {
    Purpose = "access-logs"
  })
}

resource "aws_s3_bucket_public_access_block" "access_logs" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = aws_s3_bucket.access_logs[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "access_logs" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = aws_s3_bucket.access_logs[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# Lifecycle for access logs
resource "aws_s3_bucket_lifecycle_configuration" "access_logs" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = aws_s3_bucket.access_logs[0].id

  rule {
    id     = "access_log_retention"
    status = "Enabled"

    expiration {
      days = var.environment == "prod" ? 90 : 30
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# Enable S3 access logging
resource "aws_s3_bucket_logging" "website" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = aws_s3_bucket.website.id

  target_bucket = aws_s3_bucket.access_logs[0].id
  target_prefix = "access-logs/"
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "${var.bucket_name}-oac"
  description                       = "OAC for ${var.bucket_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudTrail for S3 object-level monitoring (production feature)
resource "aws_cloudtrail" "s3_monitoring" {
  count                         = var.environment == "prod" ? 1 : 0
  name                          = "${var.bucket_name}-object-monitoring"
  s3_bucket_name               = aws_s3_bucket.cloudtrail_logs[0].bucket
  include_global_service_events = false
  is_multi_region_trail        = false
  enable_logging               = true

  event_selector {
    read_write_type                 = "All"
    include_management_events       = false
    
    data_resource {
      type   = "AWS::S3::Object"
      values = ["${aws_s3_bucket.website.arn}/*"]
    }
    
    data_resource {
      type   = "AWS::S3::Bucket"
      values = [aws_s3_bucket.website.arn]
    }
  }

  tags = var.tags
}

# S3 bucket for CloudTrail logs (production monitoring)
resource "aws_s3_bucket" "cloudtrail_logs" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = "${var.bucket_name}-cloudtrail-logs"
  
  tags = merge(var.tags, {
    Purpose = "cloudtrail-logs"
  })
}

resource "aws_s3_bucket_public_access_block" "cloudtrail_logs" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = aws_s3_bucket.cloudtrail_logs[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudtrail_logs" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = aws_s3_bucket.cloudtrail_logs[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# CloudTrail bucket policy
resource "aws_s3_bucket_policy" "cloudtrail_logs" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = aws_s3_bucket.cloudtrail_logs[0].id

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
        Resource = aws_s3_bucket.cloudtrail_logs[0].arn
      },
      {
        Sid    = "AWSCloudTrailWrite"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.cloudtrail_logs[0].arn}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      }
    ]
  })
}

# Enhanced S3 bucket metrics for monitoring
resource "aws_s3_bucket_metric" "website_metrics" {
  bucket = aws_s3_bucket.website.id
  name   = "entire-bucket"
}

# Request payment configuration for production
resource "aws_s3_bucket_request_payment_configuration" "website" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = aws_s3_bucket.website.id
  payer  = "BucketOwner"
}