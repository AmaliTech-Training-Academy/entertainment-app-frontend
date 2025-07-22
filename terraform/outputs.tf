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

output "application_url" {
  description = "Application URL (CloudFront domain)"
  value       = "https://${module.cloudfront.distribution_domain_name}"
}

output "api_base_url" {
  description = "API base URL through CloudFront"
  value       = "https://${module.cloudfront.distribution_domain_name}/api"
}

output "waf_web_acl_id" {
  description = "WAF Web ACL ID"
  value       = var.enable_waf ? module.waf[0].web_acl_id : null
}

output "dashboard_url" {
  description = "CloudWatch dashboard URL"
  value       = var.enable_monitoring ? module.monitoring[0].dashboard_url : null
}
