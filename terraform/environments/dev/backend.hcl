bucket         = "cineverse-terraform-state-dev"
key            = "frontend/dev/terraform.tfstate"
region         = "eu-west-1"
encrypt        = true
dynamodb_table = "cineverse-terraform-locks"