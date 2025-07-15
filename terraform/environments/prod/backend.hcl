bucket         = "cineverse-terraform-state-prod"
key            = "frontend/prod/terraform.tfstate"
region         = "eu-west-1"
encrypt        = true
dynamodb_table = "cineverse-terraform-locks"