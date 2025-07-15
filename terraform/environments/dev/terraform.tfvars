environment       = "dev"
aws_region        = "eu-west-1"
project_name      = "cineverse"
domain_name       = ""    # No custom domain for dev
enable_waf        = false # Cost optimization for dev
enable_monitoring = true
api_endpoint      = "https://api-dev.cineverse.dev"
# Or use ALB domain directly: "https://dev-api-alb-123456789.eu-west-1.elb.amazonaws.com"
use_existing_resources = true