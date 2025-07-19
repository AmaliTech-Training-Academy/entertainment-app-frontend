output "web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = aws_wafv2_web_acl.main.arn
}

output "web_acl_id" {
  description = "WAF Web ACL ID"
  value       = aws_wafv2_web_acl.main.id
}

output "web_acl_name" {
  description = "WAF Web ACL name"
  value       = aws_wafv2_web_acl.main.name
}

# UPDATED: Handle optional logging with conditional output
output "waf_log_group_arn" {
  description = "ARN of the WAF CloudWatch Log Group (null if logging disabled)"
  value       = var.enable_waf_logging ? aws_cloudwatch_log_group.waf[0].arn : null
}

output "waf_log_group_name" {
  description = "Name of the WAF CloudWatch Log Group (null if logging disabled)"
  value       = var.enable_waf_logging ? aws_cloudwatch_log_group.waf[0].name : null
}

output "logging_enabled" {
  description = "Whether WAF logging is enabled"
  value       = var.enable_waf_logging
}

output "waf_metrics_enabled" {
  description = "Whether WAF CloudWatch metrics are enabled"
  value       = true
}

output "production_features_enabled" {
  description = "Whether production-specific WAF features are enabled"
  value       = var.is_production
}