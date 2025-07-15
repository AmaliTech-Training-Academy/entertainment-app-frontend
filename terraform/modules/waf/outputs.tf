output "web_acl_id" {
  description = "WAF Web ACL ID"
  value       = var.enable_waf ? local.web_acl_id : ""
}

output "web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = var.enable_waf ? local.web_acl_arn : ""
}