variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for notifications (leave empty to disable Slack notifications)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "notification_emails" {
  description = "List of email addresses for notifications (empty strings and invalid emails will be filtered out automatically)"
  type        = list(string)
  default     = []
  
  validation {
    condition = alltrue([
      for email in var.notification_emails : 
      email == "" || can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", email))
    ])
    error_message = "All notification emails must be valid email addresses or empty strings. Invalid emails will be automatically filtered out."
  }
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}