output "rollback_artifacts_bucket" {
  description = "S3 bucket name for rollback artifacts"
  value       = aws_s3_bucket.rollback_artifacts.bucket
}

output "lambda_function_arn" {
  description = "Rollback handler Lambda function ARN"
  value       = aws_lambda_function.rollback_handler.arn
}

output "rollback_decision_lambda_arn" {
  description = "Rollback decision Lambda function ARN"
  value       = aws_lambda_function.rollback_decision.arn
}

output "rollback_alarm_arn" {
  description = "Auto-rollback trigger alarm ARN"
  value       = aws_cloudwatch_metric_alarm.auto_rollback_trigger.arn
}

output "rollback_sns_topic_arn" {
  description = "Rollback alerts SNS topic ARN"
  value       = aws_sns_topic.rollback_alerts.arn
}