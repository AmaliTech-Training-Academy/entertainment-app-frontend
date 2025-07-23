# Cache policy for SPA
resource "aws_cloudfront_cache_policy" "spa" {
  name        = "${var.environment}-spa-cache-policy"
  comment     = "Cache policy for SPA applications - ${var.environment}"
  default_ttl = 86400
  max_ttl     = 31536000
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

# Cache policy for static assets
resource "aws_cloudfront_cache_policy" "static_assets" {
  name        = "${var.environment}-static-assets-cache-policy"
  comment     = "Cache policy for static assets (CSS, JS, images) - ${var.environment}"
  default_ttl = 31536000
  max_ttl     = 31536000
  min_ttl     = 31536000

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

# Cache policy for API calls - Handle all auth and forwarding headers here
resource "aws_cloudfront_cache_policy" "api_no_cache" {
  name        = "${var.environment}-api-no-cache-policy"
  comment     = "No cache policy for API calls - ${var.environment}"
  default_ttl = 0
  max_ttl     = 1
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    query_strings_config {
      query_string_behavior = "all"
    }

    headers_config {
      header_behavior = "whitelist"
      headers {
        items = [
          "Authorization",
          "Content-Type",
          "Accept",
          "Origin",
          "Referer",
          "User-Agent"
        ]
      }
    }

    cookies_config {
      cookie_behavior = "all"
    }
  }
}

# Cache policy for media files - Optimized for video content
resource "aws_cloudfront_cache_policy" "media_optimized" {
  name        = "${var.environment}-media-cache-policy"
  comment     = "Optimized cache policy for media files - ${var.environment}"
  default_ttl = 86400    # 24 hours
  max_ttl     = 31536000 # 1 year
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = false  # Don't compress video files
    enable_accept_encoding_gzip   = false  # Don't compress video files

    query_strings_config {
      query_string_behavior = "none"
    }

    headers_config {
      header_behavior = "whitelist"
      headers {
        items = [
          "Origin",
          "Access-Control-Request-Headers",
          "Access-Control-Request-Method"
        ]
      }
    }

    cookies_config {
      cookie_behavior = "none"
    }
  }
}

# Origin request policy for S3
resource "aws_cloudfront_origin_request_policy" "s3_origin" {
  name    = "${var.environment}-s3-origin-request-policy"
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

# Origin request policy for API calls - Only CloudFront-allowed headers
resource "aws_cloudfront_origin_request_policy" "api_origin" {
  name    = "${var.environment}-api-origin-request-policy"
  comment = "Origin request policy for API calls - ${var.environment}"

  cookies_config {
    cookie_behavior = "all"
  }

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "Content-Type",
        "Accept",
        "Origin",
        "Referer",
        "User-Agent"
      ]
    }
  }

  query_strings_config {
    query_string_behavior = "all"
  }
}

# Origin request policy for media files
resource "aws_cloudfront_origin_request_policy" "media_origin" {
  name    = "${var.environment}-media-origin-request-policy"
  comment = "Origin request policy for media files - ${var.environment}"

  cookies_config {
    cookie_behavior = "none"
  }

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "Origin",
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method"
      ]
    }
  }

  query_strings_config {
    query_string_behavior = "none"
  }
}

# Response headers policy - Updated CSP for S3 media access
resource "aws_cloudfront_response_headers_policy" "security" {
  name    = "${var.environment}-security-headers"
  comment = "Security headers for CineVerse frontend - ${var.environment}"

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
    
    content_security_policy {
      content_security_policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: *.amazonaws.com; connect-src 'self' http://${var.alb_domain_name} https://${var.alb_domain_name} https://*.s3.amazonaws.com https://*.s3.*.amazonaws.com; media-src 'self' https://*.s3.amazonaws.com https://*.s3.*.amazonaws.com;"
      override = true
    }
  }
}

# CloudFront distribution with media support
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CineVerse ${var.environment} Frontend Distribution"
  default_root_object = "index.html"
  price_class         = var.price_class
  web_acl_id          = var.waf_web_acl_id

  aliases = var.domain_aliases

  # Origin for S3 static site
  origin {
    domain_name              = var.s3_bucket_domain_name
    origin_id                = "S3-${var.s3_bucket_id}"
    origin_access_control_id = var.origin_access_control_id
  }

  # Origin for API (ALB)
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

  # Origin for Media S3 bucket
  origin {
    domain_name = var.media_bucket_domain_name
    origin_id   = "MediaS3-${var.environment}"

    s3_origin_config {
      origin_access_identity = ""  # Leave empty for public bucket
    }
  }

  # Default cache behavior - Frontend SPA
  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.spa.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Static assets behavior
  ordered_cache_behavior {
    path_pattern               = "/assets/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.static_assets.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # API behavior
  ordered_cache_behavior {
    path_pattern               = "/api/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "API-ALB"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.api_no_cache.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.api_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Trailers behavior
  ordered_cache_behavior {
    path_pattern               = "/trailers/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "MediaS3-${var.environment}"
    compress                   = false  # Don't compress video files
    viewer_protocol_policy     = "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.media_optimized.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.media_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Thumbnails behavior
  ordered_cache_behavior {
    path_pattern               = "/thumbnails/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "MediaS3-${var.environment}"
    compress                   = true   # Compress images
    viewer_protocol_policy     = "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.media_optimized.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.media_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Screenshots behavior
  ordered_cache_behavior {
    path_pattern               = "/screenshots/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "MediaS3-${var.environment}"
    compress                   = true   # Compress images
    viewer_protocol_policy     = "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.media_optimized.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.media_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Episodes behavior
  ordered_cache_behavior {
    path_pattern               = "/episodes/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "MediaS3-${var.environment}"
    compress                   = false  # Don't compress video files
    viewer_protocol_policy     = "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.media_optimized.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.media_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Media folder behavior (if you have content in media/ folder)
  ordered_cache_behavior {
    path_pattern               = "/media/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "MediaS3-${var.environment}"
    compress                   = false  # Don't compress video files
    viewer_protocol_policy     = "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.media_optimized.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.media_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Uploads behavior (if needed for user uploads)
  ordered_cache_behavior {
    path_pattern               = "/uploads/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "MediaS3-${var.environment}"
    compress                   = true   # Compress based on content type
    viewer_protocol_policy     = "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.media_optimized.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.media_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.use_default_certificate
    acm_certificate_arn            = var.use_default_certificate ? null : var.ssl_certificate_arn
    ssl_support_method             = var.use_default_certificate ? null : "sni-only"
    minimum_protocol_version       = var.use_default_certificate ? null : "TLSv1.2_2021"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  tags = var.tags
}