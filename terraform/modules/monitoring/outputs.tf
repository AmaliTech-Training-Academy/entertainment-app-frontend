output "dashboard_url" {
  description = "CloudWatch dashboard URL"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${var.project_name}-${var.environment}-frontend"
}

output "cloudtrail_arn" {
  description = "CloudTrail ARN"
  value       = var.environment == "prod" ? aws_cloudtrail.main[0].arn : ""
}

# New outputs for enhanced monitoring
output "rum_app_monitor_id" {
  description = "CloudWatch RUM App Monitor ID"
  value       = var.enable_rum ? aws_rum_app_monitor.main[0].id : null
}

output "rum_app_monitor_name" {
  description = "CloudWatch RUM App Monitor Name"
  value       = var.enable_rum ? aws_rum_app_monitor.main[0].name : null
}

output "canary_arn" {
  description = "CloudWatch Synthetics Canary ARN"
  value       = var.environment == "prod" ? aws_synthetics_canary.health_check[0].arn : null
}

output "alarm_arns" {
  description = "List of CloudWatch alarm ARNs"
  value = compact([
    aws_cloudwatch_metric_alarm.high_4xx_error_rate.arn,
    aws_cloudwatch_metric_alarm.high_5xx_error_rate.arn,
    aws_cloudwatch_metric_alarm.low_cache_hit_rate.arn,
    var.enable_rum ? (length(aws_cloudwatch_metric_alarm.high_js_error_rate) > 0 ? aws_cloudwatch_metric_alarm.high_js_error_rate[0].arn : null) : null,
    var.enable_rum ? (length(aws_cloudwatch_metric_alarm.high_page_load_time) > 0 ? aws_cloudwatch_metric_alarm.high_page_load_time[0].arn : null) : null,
    var.enable_cost_alerts ? (length(aws_cloudwatch_metric_alarm.estimated_charges) > 0 ? aws_cloudwatch_metric_alarm.estimated_charges[0].arn : null) : null
  ])
}