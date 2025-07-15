# Data sources to check for existing CloudFront policies
data "aws_cloudfront_cache_policy" "existing_spa" {
  count = var.use_existing_policies ? 1 : 0
  name  = "${var.environment}-spa-cache-policy"
}

data "aws_cloudfront_cache_policy" "existing_static_assets" {
  count = var.use_existing_policies ? 1 : 0
  name  = "${var.environment}-static-assets-cache-policy"
}

data "aws_cloudfront_origin_request_policy" "existing_s3_origin" {
  count = var.use_existing_policies ? 1 : 0
  name  = "${var.environment}-s3-origin-request-policy"
}

data "aws_cloudfront_response_headers_policy" "existing_security" {
  count = var.use_existing_policies ? 1 : 0
  name  = "${var.environment}-security-headers"
}

# Random suffix for unique CloudFront policy names (only if creating new)
resource "random_string" "policy_suffix" {
  count   = var.use_existing_policies ? 0 : 1
  length  = 8
  special = false
  upper   = false
  lower   = true
  numeric = true
}

locals {
  # Use existing policies if available, otherwise use newly created ones
  spa_cache_policy_id = var.use_existing_policies && length(data.aws_cloudfront_cache_policy.existing_spa) > 0 ? data.aws_cloudfront_cache_policy.existing_spa[0].id : (length(aws_cloudfront_cache_policy.spa) > 0 ? aws_cloudfront_cache_policy.spa[0].id : null)
  
  static_assets_cache_policy_id = var.use_existing_policies && length(data.aws_cloudfront_cache_policy.existing_static_assets) > 0 ? data.aws_cloudfront_cache_policy.existing_static_assets[0].id : (length(aws_cloudfront_cache_policy.static_assets) > 0 ? aws_cloudfront_cache_policy.static_assets[0].id : null)
  
  s3_origin_request_policy_id = var.use_existing_policies && length(data.aws_cloudfront_origin_request_policy.existing_s3_origin) > 0 ? data.aws_cloudfront_origin_request_policy.existing_s3_origin[0].id : (length(aws_cloudfront_origin_request_policy.s3_origin) > 0 ? aws_cloudfront_origin_request_policy.s3_origin[0].id : null)
  
  security_response_headers_policy_id = var.use_existing_policies && length(data.aws_cloudfront_response_headers_policy.existing_security) > 0 ? data.aws_cloudfront_response_headers_policy.existing_security[0].id : (length(aws_cloudfront_response_headers_policy.security) > 0 ? aws_cloudfront_response_headers_policy.security[0].id : null)
}

resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CineVerse ${var.environment} Frontend Distribution"
  default_root_object = "index.html"
  price_class         = var.price_class
  web_acl_id          = var.waf_web_acl_id

  aliases = var.domain_aliases

  origin {
    domain_name              = var.s3_bucket_domain_name
    origin_id                = "S3-${var.s3_bucket_id}"
    origin_access_control_id = var.origin_access_control_id
  }

  default_cache_behavior {
    allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "redirect-to-https"
    cache_policy_id            = local.spa_cache_policy_id
    origin_request_policy_id   = local.s3_origin_request_policy_id
    response_headers_policy_id = local.security_response_headers_policy_id
  }

  # Cache behavior for static assets
  ordered_cache_behavior {
    path_pattern               = "/assets/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "redirect-to-https"
    cache_policy_id            = local.static_assets_cache_policy_id
    origin_request_policy_id   = local.s3_origin_request_policy_id
    response_headers_policy_id = local.security_response_headers_policy_id
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

  lifecycle {
    prevent_destroy = true
  }
}

# Cache Policy for SPA - Only create if not using existing
resource "aws_cloudfront_cache_policy" "spa" {
  count   = var.use_existing_policies ? 0 : 1
  name    = var.use_existing_policies ? null : "${var.environment}-spa-cache-policy-${random_string.policy_suffix[0].result}"
  comment = "Cache policy for SPA applications - ${var.environment}"
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

  lifecycle {
    prevent_destroy = true
  }
}

# Cache Policy for Static Assets - Only create if not using existing
resource "aws_cloudfront_cache_policy" "static_assets" {  
  count   = var.use_existing_policies ? 0 : 1
  name    = var.use_existing_policies ? null : "${var.environment}-static-assets-cache-policy-${random_string.policy_suffix[0].result}"
  comment = "Cache policy for static assets (CSS, JS, images) - ${var.environment}"
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

  lifecycle {
    prevent_destroy = true
  }
}

# Origin Request Policy for S3 - Only create if not using existing
resource "aws_cloudfront_origin_request_policy" "s3_origin" {
  count   = var.use_existing_policies ? 0 : 1
  name    = var.use_existing_policies ? null : "${var.environment}-s3-origin-request-policy-${random_string.policy_suffix[0].result}"
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

  lifecycle {
    prevent_destroy = true
  }
}

# Response Headers Policy for Security - Only create if not using existing
resource "aws_cloudfront_response_headers_policy" "security" {  
  count   = var.use_existing_policies ? 0 : 1
  name    = var.use_existing_policies ? null : "${var.environment}-security-headers-${random_string.policy_suffix[0].result}"
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
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      override                   = true
    }

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
      content_security_policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ${var.api_endpoint}; media-src 'self';"
      override = true
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}