environment        = "dev"
aws_region         = "eu-west-1"
project_name       = "cineverse"
domain_name        = "cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com"  # No custom domain for dev
enable_waf         = false  # Cost optimization for dev
enable_monitoring  = true
api_endpoint       = " http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com"
# Or use ALB domain directly: "https://dev-api-alb-123456789.eu-west-1.elb.amazonaws.com"
