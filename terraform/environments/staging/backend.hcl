bucket         = "cineverse-terraform-state-staging"
key            = "frontend/staging/terraform.tfstate"
region         = "eu-west-1"
encrypt        = true
dynamodb_table = "cineverse-terraform-locks"
