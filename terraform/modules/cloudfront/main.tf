resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CineVerse ${var.environment} Frontend Distribution"
  default_root_object = "index.html"
  price_class         = var.price_class
  web_acl_id          = var.waf_web_acl_id != "" ? var.waf_web_acl_id : null

  aliases = var.domain_aliases

  # Enhanced logging configuration
  dynamic "logging_config" {
    for_each = var.enable_access_logging ? [1] : []
    content {
      include_cookies = false
      bucket          = aws_s3_bucket.cloudfront_logs[0].bucket_domain_name
      prefix          = "cloudfront-access-logs/"
    }
  }

  # Origin for S3 static site
  origin {
    domain_name              = var.s3_bucket_domain_name
    origin_id                = "S3-${var.s3_bucket_id}"
    origin_access_control_id = var.origin_access_control_id
  }

  # Origin for API (ALB) - ADDED FROM DEV CONFIG
  origin {
    domain_name = var.alb_domain_name
    origin_id   = "API-ALB"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Default cache behavior - CHANGED TO ALLOW HTTP
  default_cache_behavior {
    allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"  # CHANGED from "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.spa.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Optimized cache behavior for static assets - CHANGED TO ALLOW HTTP
  ordered_cache_behavior {
    path_pattern               = "/assets/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"  # CHANGED from "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.static_assets.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # API behavior - ADDED FROM DEV CONFIG
  ordered_cache_behavior {
    path_pattern               = "/api/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "API-ALB"
    compress                   = true
    viewer_protocol_policy     = "allow-all"  # Allow HTTP for API calls
    cache_policy_id            = aws_cloudfront_cache_policy.spa.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Additional cache behavior for CSS/JS files - CHANGED TO ALLOW HTTP
  ordered_cache_behavior {
    path_pattern               = "*.css"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"  # CHANGED from "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.static_assets.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  ordered_cache_behavior {
    path_pattern               = "*.js"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"  # CHANGED from "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.static_assets.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # FIXED: Separate cache behaviors for each image type
  # Cache behavior for JPEG/JPG images
  ordered_cache_behavior {
    path_pattern               = "*.jpg"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.images.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  ordered_cache_behavior {
    path_pattern               = "*.jpeg"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.images.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Cache behavior for PNG images
  ordered_cache_behavior {
    path_pattern               = "*.png"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.images.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Cache behavior for GIF images
  ordered_cache_behavior {
    path_pattern               = "*.gif"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.images.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Cache behavior for ICO files (favicons)
  ordered_cache_behavior {
    path_pattern               = "*.ico"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.images.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Cache behavior for SVG images
  ordered_cache_behavior {
    path_pattern               = "*.svg"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.images.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Cache behavior for WebP images
  ordered_cache_behavior {
    path_pattern               = "*.webp"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.images.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.use_default_certificate
    acm_certificate_arn           = var.use_default_certificate ? null : var.ssl_certificate_arn
    ssl_support_method            = var.use_default_certificate ? null : "sni-only"
    minimum_protocol_version      = var.use_default_certificate ? null : "TLSv1.2_2021"
  }

  # Enhanced error responses
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
    error_caching_min_ttl = 300
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
    error_caching_min_ttl = 300
  }

  custom_error_response {
    error_code         = 500
    response_code      = 500
    response_page_path = "/error.html"
    error_caching_min_ttl = 0
  }

  tags = var.tags

  # Ensure logging bucket is properly configured before creating distribution
  depends_on = [
    aws_s3_bucket_ownership_controls.cloudfront_logs,
    aws_s3_bucket_acl.cloudfront_logs
  ]
}

# S3 bucket for CloudFront access logs
resource "aws_s3_bucket" "cloudfront_logs" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = "${replace(var.s3_bucket_id, "-frontend-", "-cloudfront-logs-")}"
  
  tags = merge(var.tags, {
    Purpose = "cloudfront-access-logs"
  })
}

# ADDED: S3 bucket ownership controls - Required for ACL configuration
resource "aws_s3_bucket_ownership_controls" "cloudfront_logs" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = aws_s3_bucket.cloudfront_logs[0].id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# ADDED: S3 bucket ACL - Required for CloudFront logging
resource "aws_s3_bucket_acl" "cloudfront_logs" {
  count      = var.enable_access_logging ? 1 : 0
  bucket     = aws_s3_bucket.cloudfront_logs[0].id
  acl        = "private"
  
  depends_on = [aws_s3_bucket_ownership_controls.cloudfront_logs]
}

resource "aws_s3_bucket_public_access_block" "cloudfront_logs" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = aws_s3_bucket.cloudfront_logs[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudfront_logs" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = aws_s3_bucket.cloudfront_logs[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# Lifecycle for CloudFront logs - FIXED
resource "aws_s3_bucket_lifecycle_configuration" "cloudfront_logs" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = aws_s3_bucket.cloudfront_logs[0].id

  rule {
    id     = "cloudfront_log_retention"
    status = "Enabled"

    filter {
      prefix = ""
    }

    expiration {
      days = var.environment == "prod" ? 365 : 90
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# Enhanced Cache Policy for SPA with environment-specific TTL
resource "aws_cloudfront_cache_policy" "spa" {
  name        = "cineverse-${var.environment}-spa-cache-policy"
  comment     = "Optimized cache policy for SPA applications - ${var.environment}"
  default_ttl = var.cloudfront_cache_ttl
  max_ttl     = var.cloudfront_cache_ttl * 2
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    query_strings_config {
      query_string_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    cookies_config {
      cookie_behavior = "none"
    }
  }
}

# Enhanced Cache Policy for Static Assets with optimized TTL
resource "aws_cloudfront_cache_policy" "static_assets" {
  name        = "cineverse-${var.environment}-static-assets-cache-policy"
  comment     = "Optimized cache policy for static assets - ${var.environment}"
  default_ttl = var.static_assets_ttl
  max_ttl     = var.static_assets_ttl
  min_ttl     = var.static_assets_ttl

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    query_strings_config {
      query_string_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    cookies_config {
      cookie_behavior = "none"
    }
  }
}

# Cache Policy for Images with very long TTL
resource "aws_cloudfront_cache_policy" "images" {
  name        = "cineverse-${var.environment}-images-cache-policy"
  comment     = "Cache policy for images with long TTL - ${var.environment}"
  default_ttl = 31536000  # 1 year
  max_ttl     = 31536000  # 1 year
  min_ttl     = 31536000  # 1 year

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    query_strings_config {
      query_string_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    cookies_config {
      cookie_behavior = "none"
    }
  }
}

# Origin Request Policy for S3 with environment-specific unique name
resource "aws_cloudfront_origin_request_policy" "s3_origin" {
  name    = "cineverse-${var.environment}-s3-origin-request-policy"
  comment = "Origin request policy for S3 static website - ${var.environment}"

  cookies_config {
    cookie_behavior = "none"
  }

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin"
      ]
    }
  }

  query_strings_config {
    query_string_behavior = "none"
  }
}

# Response headers policy - HSTS removed for HTTP compatibility (UPDATED FROM DEV)
resource "aws_cloudfront_response_headers_policy" "security" {
  name    = "cineverse-${var.environment}-security-headers"
  comment = "Security headers for CineVerse frontend (HTTP compatible) - ${var.environment}"

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["*"]
    }

    access_control_allow_methods {
      items = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"]
    }

    access_control_allow_origins {
      items = ["*"]
    }

    origin_override = true
  }

  security_headers_config {
    # HSTS removed - conflicts with allow-all HTTP policy (SAME AS DEV)
    
    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    # UPDATED CSP to allow HTTP connections to ALB (SAME AS DEV)
    content_security_policy {
      content_security_policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://${var.alb_domain_name} https://${var.alb_domain_name}; media-src 'self';"
      override = true
    }
  }

  # Add server timing header for performance monitoring
  custom_headers_config {
    items {
      header   = "Server-Timing"
      value    = "cf-cache;dur=0"
      override = false
    }
  }
}