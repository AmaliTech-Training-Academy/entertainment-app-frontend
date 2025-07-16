output "dashboard_url" {
  description = "CloudWatch dashboard URL"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${var.project_name}-${var.environment}-frontend"
}

output "cloudtrail_arn" {
  description = "CloudTrail ARN"
  value       = var.environment == "prod" ? aws_cloudtrail.main[0].arn : ""
}