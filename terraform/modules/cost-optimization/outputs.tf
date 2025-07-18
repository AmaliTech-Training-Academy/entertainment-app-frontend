output "budget_name" {
  description = "AWS Budget name"
  value       = aws_budgets_budget.cost_budget.name
}

output "budget_arn" {
  description = "AWS Budget ARN"
  value       = aws_budgets_budget.cost_budget.arn
}

output "cost_dashboard_url" {
  description = "Cost monitoring dashboard URL"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${var.project_name}-${var.environment}-costs"
}

output "cost_optimizer_lambda_arn" {
  description = "Cost optimizer Lambda function ARN"
  value       = aws_lambda_function.cost_optimizer.arn
}

output "cost_optimizer_lambda_name" {
  description = "Cost optimizer Lambda function name"
  value       = aws_lambda_function.cost_optimizer.function_name
}