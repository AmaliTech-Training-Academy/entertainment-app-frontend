output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.website.id
}

output "distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.website.arn
}

output "distribution_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "distribution_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID"
  value       = aws_cloudfront_distribution.website.hosted_zone_id
}

output "origin_request_policy_id" {
  description = "CloudFront origin request policy ID"
  value       = aws_cloudfront_origin_request_policy.s3_origin.id
}

# New outputs for enhanced features
output "cache_policy_spa_id" {
  description = "CloudFront SPA cache policy ID"
  value       = aws_cloudfront_cache_policy.spa.id
}

output "cache_policy_static_assets_id" {
  description = "CloudFront static assets cache policy ID"
  value       = aws_cloudfront_cache_policy.static_assets.id
}

output "cache_policy_images_id" {
  description = "CloudFront images cache policy ID"
  value       = aws_cloudfront_cache_policy.images.id
}

output "response_headers_policy_id" {
  description = "CloudFront response headers policy ID"
  value       = aws_cloudfront_response_headers_policy.security.id
}

output "access_logs_bucket_id" {
  description = "CloudFront access logs bucket ID"
  value       = var.enable_access_logging ? aws_s3_bucket.cloudfront_logs[0].id : null
}

output "access_logs_bucket_arn" {
  description = "CloudFront access logs bucket ARN"
  value       = var.enable_access_logging ? aws_s3_bucket.cloudfront_logs[0].arn : null
}

output "cache_configuration" {
  description = "CloudFront cache configuration summary"
  value = {
    spa_cache_ttl           = var.cloudfront_cache_ttl
    static_assets_ttl       = var.static_assets_ttl
    images_ttl             = 31536000
    access_logging_enabled = var.enable_access_logging
  }
}