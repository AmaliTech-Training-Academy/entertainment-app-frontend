# Backend configuration for tfstate

terraform {
  backend "s3" {
    # These values will be provided via backend config files
    # bucket         = "cineverse-terraform-state"
    # key            = "frontend/${environment}/terraform.tfstate"
    # region         = "eu-west-1"
    # encrypt        = true
    # dynamodb_table = "cineverse-terraform-locks"
  }
}