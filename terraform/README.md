# CineVerse Frontend Infrastructure

## Overview

CineVerse is a full-stack entertainment web application with Angular frontend. This repository contains Infrastructure as Code (IaC) for deploying the frontend to AWS using Terraform.

**Key Features:**
- Multi-environment support (dev, staging, prod)
- Global content delivery via CloudFront
- WAF security protection
- Cost-optimized configurations
- Automated CI/CD with GitHub Actions
- Comprehensive monitoring

## Architecture

**Core Components:**
- **S3**: Static website hosting
- **CloudFront**: Global CDN with caching
- **WAF**: Web Application Firewall (staging/prod)
- **CloudWatch**: Monitoring and alerting
- **CloudTrail**: Audit logging (prod only)

**Request Flow:**
```
User → CloudFront → WAF → S3 (Origin)
              ↓
         CloudWatch (Metrics)
```

## Environment Configuration

| Feature | Dev | Staging | Prod |
|---------|-----|---------|------|
| WAF Protection | Disabled | Enabled | Enabled |
| S3 Versioning | Disabled | Enabled | Enabled |
| CloudFront Price Class | 100 | 200 | All |
| Monitoring Period | 5 min | 5 min | 1 min |
| CloudTrail | Disabled | Disabled | Enabled |
| Rate Limiting | 10k/5min | 5k/5min | 2k/5min |

## Prerequisites

**Required Tools:**
- AWS CLI (v2.0+) with configured credentials
- Terraform (v1.0+)
- Node.js (v18+) and npm
- jq (for automation scripts)

**AWS Permissions:**
- S3, CloudFront, WAF, CloudWatch, DynamoDB full access
- IAM read-only access

## Quick Start

### 1. Bootstrap Setup (One-time)
```bash
# Clone repository
git clone <repository-url>
cd cineverse

# Bootstrap Terraform backend
make bootstrap
```

### 2. Deploy to Environment
```bash
# Deploy to development
make deploy ENV=dev

# Deploy to staging
make deploy ENV=staging

# Deploy to production
make deploy ENV=prod
```

### 3. Verify Deployment
```bash
cd terraform
terraform output cloudfront_domain_name
curl -I https://[cloudfront-domain]
```

## File Structure

```
terraform/
├── modules/
│   ├── s3-website/          # S3 hosting configuration
│   ├── cloudfront/          # CDN configuration
│   ├── waf/                 # Security protection
│   └── monitoring/          # CloudWatch setup
├── environments/            # Environment configs
│   ├── dev/
│   ├── staging/
│   └── prod/
├── bootstrap/              # State backend setup
├── main.tf                 # Root configuration
├── variables.tf            # Global variables
├── outputs.tf              # Infrastructure outputs
└── backend.tf              # Backend template
```

## Deployment Process

### Manual Deployment
```bash
# Build application
cd frontend && npm run build:prod

# Deploy infrastructure
cd terraform
terraform init -backend-config="environments/prod/backend.hcl"
terraform plan -var-file="environments/prod/terraform.tfvars"
terraform apply

# Deploy content
aws s3 sync ../frontend/dist/ s3://[bucket-name]/
aws cloudfront create-invalidation --distribution-id [id] --paths "/*"
```

### Automated Deployment
Push to specific branches triggers automatic deployment:
- `dev` branch → Development environment
- `staging` branch → Staging environment
- `prod` branch → Production environment

## CI/CD Pipeline

**Workflow Stages:**
1. **Quality Check**: Linting, unit tests, e2e tests, security scan
2. **Build**: Environment-specific Angular builds
3. **Infrastructure**: Terraform validation and planning
4. **Deploy**: Infrastructure provisioning and content deployment

**Environment Protection:**
- Dev: Auto-deploy, no approval required
- Staging: Auto-deploy, optional approval
- Prod: Auto-deploy, mandatory approval (configurable)

## Security

**Network Security:**
- HTTPS enforcement
- Security headers (HSTS, CSP, X-Frame-Options)
- Origin Access Control (S3 private)

**Application Security:**
- WAF with AWS managed rules
- Rate limiting per IP
- Content Security Policy
- Encrypted storage

**Security Headers:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'...
```

## Monitoring

**CloudWatch Dashboards include:**
- Request count and bandwidth
- Error rates (4xx/5xx)
- Cache hit ratio
- WAF metrics

**Automated Alerts:**
- High error rates (>5% for 4xx, >1% for 5xx)
- Performance degradation
- Security events

**Access Monitoring:**
```bash
# View dashboard
make plan ENV=prod | grep dashboard_url

# Check metrics
aws cloudwatch get-metric-statistics --namespace AWS/CloudFront
```

## Cost Optimization

**Environment-Specific Settings:**
- **CloudFront Price Classes**: Dev (100), Staging (200), Prod (All)
- **S3 Intelligent Tiering**: Production only
- **Lifecycle Policies**: Auto-delete old versions (7-30 days)
- **Monitoring Frequency**: Reduced for non-production

**Estimated Monthly Costs:**
- Development: $2-5
- Staging: $5-15
- Production: $15-50 (traffic dependent)

## Operations

### Available Commands
```bash
# Infrastructure
make bootstrap          # One-time setup
make deploy ENV=dev     # Full deployment
make plan ENV=staging   # Plan changes
make destroy ENV=dev    # Destroy environment

# Development
make build ENV=prod     # Build application
make test              # Run tests
make lint              # Code linting
make clean             # Clean artifacts
```

### Manual Operations
```bash
# Infrastructure status
terraform show
terraform state list
terraform output -json

# CloudFront operations
aws cloudfront list-distributions
aws cloudfront create-invalidation --distribution-id [id] --paths "/*"

# S3 operations
aws s3 ls s3://[bucket] --recursive
aws s3 sync ./dist/ s3://[bucket]/ --delete
```

## Troubleshooting

### Common Issues

**1. State Lock Errors**
```bash
# Check existing locks
aws dynamodb scan --table-name cineverse-terraform-locks

# Force unlock (caution)
terraform force-unlock [LOCK_ID]
```

**2. Bucket Name Conflicts**
- Bucket names include random suffixes for uniqueness
- If persistent, regenerate random string resource

**3. CloudFront Propagation**
- Changes take 15-20 minutes to propagate globally
- Use invalidations for immediate updates
- Check status: `aws cloudfront get-distribution --id [id]`

**4. WAF False Positives**
```bash
# Check WAF logs
aws logs filter-log-events \
  --log-group-name /aws/wafv2/cineverse-prod \
  --start-time $(date -d '1 hour ago' +%s)000
```

**5. Build Failures**
- Verify Node.js version compatibility
- Check npm dependency locks
- Test build locally with same environment

### Health Checks
```bash
# Infrastructure health
make plan ENV=prod  # Should show "No changes"

# Application health
curl -I https://$(cd terraform && terraform output -raw cloudfront_domain_name)

# Performance test
curl -w "%{time_total}" -o /dev/null -s [cloudfront-url]
```

## Development Workflow

**Setup:**
1. Fork and clone repository
2. Create feature branch: `git checkout -b feature/description`
3. Make changes following standards
4. Test locally
5. Submit pull request

**Standards:**
- Follow Terraform and Angular style guides
- Update documentation for infrastructure changes
- Include tests for new functionality
- Consider security implications

**PR Requirements:**
- All tests pass
- Documentation updated
- Code review approval
- No conflicts with target branch

