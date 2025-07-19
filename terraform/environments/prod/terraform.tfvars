# Production Environment Configuration
environment        = "prod"
aws_region         = "eu-west-1"
project_name       = "cineverse"

# Domain configuration
domain_name        = "cineverse-prod-service-alb-964667856.eu-west-1.elb.amazonaws.com"

# API configuration
api_endpoint       = "http://cineverse-prod-service-alb-964667856.eu-west-1.elb.amazonaws.com"

# Security configuration
enable_waf         = true
blocked_countries  = ["CN", "RU", "KP"]  # Example: Block certain countries for production

# Monitoring and observability
enable_monitoring  = true

# Cost management
cost_center        = "frontend-production"
owner             = "devops-team"

# Notifications (set these as environment variables or Terraform Cloud variables)
# slack_webhook_url   = "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
# notification_emails = ["devops@cineverse.com", "alerts@cineverse.com"]

# Advanced features
enable_drift_detection     = true
enable_rollback_automation = true

# Resource tagging
tags = {
  Environment = "prod"
  Project     = "CineVerse"
  CostCenter  = "frontend-production"
  Owner       = "devops-team"
  Backup      = "required"
  Compliance  = "required"
}