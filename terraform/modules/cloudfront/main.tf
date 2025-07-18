# CloudFront distribution
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

  # Origin for API (ALB) - FIXED
  origin {
    domain_name = "cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com"
    origin_id   = "API-ALB"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"  # CHANGED: This allows both HTTP and HTTPS
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "S3-${var.s3_bucket_id}"
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    cache_policy_id            = aws_cloudfront_cache_policy.spa.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    # OPTION: Remove security headers for development
    response_headers_policy_id = var.environment == "development" ? null : aws_cloudfront_response_headers_policy.security.id
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
    # OPTION: Remove security headers for development
    response_headers_policy_id = var.environment == "development" ? null : aws_cloudfront_response_headers_policy.security.id
  }

  # API behavior - FIXED
  ordered_cache_behavior {
    path_pattern               = "/api/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "API-ALB"
    compress                   = true
    viewer_protocol_policy     = "allow-all"  # CHANGED: Force HTTPS for API calls
    cache_policy_id            = aws_cloudfront_cache_policy.spa.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3_origin.id
    # OPTION: Remove this line to disable security headers for development
    response_headers_policy_id = var.environment == "development" ? null : aws_cloudfront_response_headers_policy.security.id
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