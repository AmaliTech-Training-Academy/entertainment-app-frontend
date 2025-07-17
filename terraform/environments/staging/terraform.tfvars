environment        = "staging"
aws_region         = "eu-west-1"
project_name       = "cineverse"
domain_name        = "staging.cineverse.com"  # Example staging domain
enable_waf         = true
enable_waf_logging = true
enable_monitoring  = true
api_endpoint       = "https://api-staging.cineverse.com"  # Staging API
# Or use ALB domain directly: "https://dev-api-alb-123456789.eu-west-1.elb.amazonaws.com"
# api_endpoint = "https://staging-api-alb-123.eu-west-1.elb.amazonaws.com"
