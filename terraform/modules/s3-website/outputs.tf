output "bucket_id" {
  description = "S3 bucket ID"
  value       = aws_s3_bucket.website.id
}

output "bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.website.arn
}

output "bucket_domain_name" {
  description = "S3 bucket domain name"
  value       = aws_s3_bucket.website.bucket_domain_name
}

output "bucket_regional_domain_name" {
  description = "S3 bucket regional domain name"
  value       = aws_s3_bucket.website.bucket_regional_domain_name
}

output "origin_access_control_id" {
  description = "CloudFront Origin Access Control ID"
  value       = aws_cloudfront_origin_access_control.website.id
}

# New outputs for enhanced features
output "access_logs_bucket_id" {
  description = "S3 access logs bucket ID"
  value       = var.enable_access_logging ? aws_s3_bucket.access_logs[0].id : null
}

output "access_logs_bucket_arn" {
  description = "S3 access logs bucket ARN"
  value       = var.enable_access_logging ? aws_s3_bucket.access_logs[0].arn : null
}

output "intelligent_tiering_enabled" {
  description = "Whether S3 Intelligent Tiering is enabled"
  value       = var.enable_intelligent_tiering
}

output "versioning_enabled" {
  description = "Whether S3 versioning is enabled"
  value       = var.enable_versioning
}

output "access_logging_enabled" {
  description = "Whether S3 access logging is enabled"
  value       = var.enable_access_logging
}

# CloudTrail monitoring outputs (production only)
output "cloudtrail_arn" {
  description = "CloudTrail ARN for S3 object monitoring"
  value       = var.environment == "prod" ? aws_cloudtrail.s3_monitoring[0].arn : null
}

output "cloudtrail_logs_bucket_id" {
  description = "CloudTrail logs bucket ID"
  value       = var.environment == "prod" ? aws_s3_bucket.cloudtrail_logs[0].id : null
}

output "cloudtrail_logs_bucket_arn" {
  description = "CloudTrail logs bucket ARN"
  value       = var.environment == "prod" ? aws_s3_bucket.cloudtrail_logs[0].arn : null
}