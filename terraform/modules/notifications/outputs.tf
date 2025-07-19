output "sns_topic_arn" {
  description = "SNS topic ARN for alerts"
  value       = aws_sns_topic.alerts.arn
}

output "sns_topic_name" {
  description = "SNS topic name for alerts"
  value       = aws_sns_topic.alerts.name
}

output "deployment_topic_arn" {
  description = "SNS topic ARN for deployment notifications"
  value       = aws_sns_topic.deployments.arn
}

# Updated with null-safe conditions to match main.tf
output "slack_lambda_arn" {
  description = "Slack notifier Lambda function ARN"
  value       = var.slack_webhook_url != null && var.slack_webhook_url != "" ? aws_lambda_function.slack_notifier[0].arn : null
}

output "deployment_lambda_arn" {
  description = "Deployment notifier Lambda function ARN"
  value       = var.slack_webhook_url != null && var.slack_webhook_url != "" ? aws_lambda_function.deployment_notifier[0].arn : null
}

# New outputs for email validation and debugging
output "email_subscriptions_count" {
  description = "Number of valid email subscriptions created"
  value       = length(local.valid_emails)
}

output "total_emails_provided" {
  description = "Total number of emails provided in input"
  value       = length(var.notification_emails)
}

output "slack_notifications_enabled" {
  description = "Whether Slack notifications are enabled"
  value       = var.slack_webhook_url != null && var.slack_webhook_url != ""
}

# Debug outputs (remove these after confirming everything works)
output "debug_email_info" {
  description = "Debug information about email configuration (remove after deployment)"
  value = {
    raw_emails           = var.notification_emails
    raw_emails_length    = length(var.notification_emails)
    valid_emails         = local.valid_emails
    valid_emails_length  = length(local.valid_emails)
    filtered_out_count   = length(var.notification_emails) - length(local.valid_emails)
  }
}

output "debug_filtered_emails" {
  description = "Emails that were filtered out due to validation issues (remove after deployment)"
  value = [
    for email in var.notification_emails : email
    if email == null || email == "" || !can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", email))
  ]
}