output "s3_bucket_name" {
  description = "S3 bucket name for website hosting"
  value       = module.s3_website.bucket_id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.cloudfront.distribution_domain_name
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = module.s3_website.bucket_arn
}

output "website_url" {
  description = "Website URL"
  value       = "https://${module.cloudfront.distribution_domain_name}"
}

output "waf_web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = var.enable_waf ? module.waf[0].web_acl_arn : null
}

output "dashboard_url" {
  description = "CloudWatch dashboard URL"
  value       = var.enable_monitoring ? module.monitoring[0].dashboard_url : null
}

# New outputs for production features
output "rum_app_monitor_id" {
  description = "CloudWatch RUM App Monitor ID"
  value       = var.enable_monitoring && local.env_config[var.environment].enable_rum ? module.monitoring[0].rum_app_monitor_id : null
}

output "sns_topic_arn" {
  description = "SNS topic ARN for notifications"
  value       = module.notifications.sns_topic_arn
}

output "access_logs_bucket" {
  description = "S3 bucket for access logs"
  value       = local.env_config[var.environment].enable_access_logging ? module.logging[0].access_logs_bucket : null
}

output "rollback_lambda_arn" {
  description = "Rollback Lambda function ARN"
  value       = local.is_production ? module.rollback[0].lambda_function_arn : null
}

output "cost_budget_name" {
  description = "AWS Budget name for cost monitoring"
  value       = local.env_config[var.environment].enable_cost_alerts ? module.cost_optimization[0].budget_name : null
}

output "infrastructure_summary" {
  description = "Infrastructure deployment summary"
  value = {
    environment                = var.environment
    project_name              = var.project_name
    website_url               = "https://${module.cloudfront.distribution_domain_name}"
    s3_bucket                 = module.s3_website.bucket_id
    cloudfront_distribution   = module.cloudfront.distribution_id
    waf_enabled              = var.enable_waf
    monitoring_enabled       = var.enable_monitoring
    rum_enabled              = local.env_config[var.environment].enable_rum
    cost_alerts_enabled      = local.env_config[var.environment].enable_cost_alerts
    access_logging_enabled   = local.env_config[var.environment].enable_access_logging
    rollback_enabled         = local.is_production
  }
}