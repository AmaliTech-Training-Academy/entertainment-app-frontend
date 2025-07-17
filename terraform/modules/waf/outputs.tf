output "web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = aws_wafv2_web_acl.main.arn
}

output "waf_log_group_arn" {
  description = "ARN of the WAF CloudWatch Log Group"
  value       = aws_cloudwatch_log_group.waf.arn
}
