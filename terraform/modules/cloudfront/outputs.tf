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

# CloudFront policy outputs - updated to include new policies
output "s3_origin_request_policy_id" {
  description = "S3 origin request policy ID"
  value       = aws_cloudfront_origin_request_policy.s3_origin.id
}

output "api_origin_request_policy_id" {
  description = "API origin request policy ID"
  value       = aws_cloudfront_origin_request_policy.api_origin.id
}

output "spa_cache_policy_id" {
  description = "SPA cache policy ID"
  value       = aws_cloudfront_cache_policy.spa.id
}

output "static_assets_cache_policy_id" {
  description = "Static assets cache policy ID"
  value       = aws_cloudfront_cache_policy.static_assets.id
}

output "api_no_cache_policy_id" {
  description = "API no-cache policy ID"
  value       = aws_cloudfront_cache_policy.api_no_cache.id
}

output "security_response_headers_policy_id" {
  description = "Security response headers policy ID"
  value       = aws_cloudfront_response_headers_policy.security.id
}