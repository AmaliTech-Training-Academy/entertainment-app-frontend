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

output "slack_lambda_arn" {
  description = "Slack notifier Lambda function ARN"
  value       = var.slack_webhook_url != "" ? aws_lambda_function.slack_notifier[0].arn : null
}

output "deployment_lambda_arn" {
  description = "Deployment notifier Lambda function ARN"
  value       = var.slack_webhook_url != "" ? aws_lambda_function.deployment_notifier[0].arn : null
}