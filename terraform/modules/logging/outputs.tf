output "cloudfront_logs_bucket" {
  description = "S3 bucket name for CloudFront access logs"
  value       = aws_s3_bucket.cloudfront_logs.bucket
}

output "s3_access_logs_bucket" {
  description = "S3 bucket name for S3 access logs"
  value       = aws_s3_bucket.s3_access_logs.bucket
}

output "access_logs_bucket" {
  description = "Primary access logs bucket"
  value       = aws_s3_bucket.cloudfront_logs.bucket
}

output "log_group_arn" {
  description = "CloudWatch Log Group ARN for aggregated logs"
  value       = aws_cloudwatch_log_group.access_logs.arn
}

output "log_processor_function_arn" {
  description = "Lambda function ARN for log processing"
  value       = aws_lambda_function.log_processor.arn
}