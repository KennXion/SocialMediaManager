# Social Media Manager - Deployment Instructions

This document provides detailed instructions for deploying the Social Media Manager application using Terraform and Ansible.

## Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.10+
- pip (Python package manager)
- Terraform 1.0.0+
- Ansible 2.9+
- Git
- Docker and Docker Compose (for local development)

## Project Structure

```
Social_Media_Manager/
├── ansible/                  # Ansible configuration and playbooks
│   ├── roles/                # Ansible roles
│   │   ├── common/           # Common server setup
│   │   ├── backend/          # Backend application deployment
│   │   └── frontend/         # Frontend application deployment
│   ├── inventory             # Inventory file listing servers
│   ├── ansible.cfg           # Ansible configuration
│   └── site.yml              # Main playbook
├── backend/                  # Backend application code
├── frontend/                 # Frontend application code
├── memlog/                   # Project logs and documentation
├── terraform/                # Terraform configuration
│   ├── providers.tf          # Provider configuration
│   ├── variables.tf          # Variable definitions
│   ├── main.tf               # Main infrastructure configuration
│   └── outputs.tf            # Output definitions
├── deploy.sh                 # Deployment script
├── docker-compose.yml        # Docker Compose configuration for local development
└── README.md                 # Project README
```

## Deployment Options

### 1. Local Development

For local development using Docker:

```bash
# Start the application with Docker Compose
cd /Volumes/CrucialMedia-4G/Social_Media_Manager
docker-compose up -d
```

This will start the backend, frontend, database, and Redis services locally.

### 2. Cloud Deployment

For deploying to cloud providers (AWS, Azure, or GCP):

#### Step 1: Configure Terraform

Edit the Terraform variables in `/terraform/variables.tf` to match your environment. Uncomment the desired cloud provider configuration in `/terraform/main.tf`.

#### Step 2: Configure Ansible

Update the Ansible inventory file in `/ansible/inventory` with your server information.

#### Step 3: Run the Deployment Script

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

This will:
1. Initialize Terraform
2. Apply the Terraform configuration to create infrastructure
3. Run the Ansible playbook to configure servers and deploy the application

## Custom Deployment Options

The deployment script supports several options:

```bash
# Initialize Terraform only
./deploy.sh -i

# Run Terraform only
./deploy.sh -t

# Run Ansible only
./deploy.sh -a

# Show help
./deploy.sh -h
```

## Adding New Social Media Platforms

To add support for new social media platforms:

1. Implement the platform integration in `/backend/app/integrations/`
2. Update the platform schema in `/backend/app/schemas/platform.py`
3. Add the platform credentials to the environment variables
4. Create the platform-specific UI components in the frontend

## Troubleshooting

### Common Issues

- **Database Connection Issues**: Verify the database connection string in your `.env` file.
- **API Authentication Issues**: Check the JWT configuration and ensure tokens are set up correctly.
- **Deployment Failures**: Check the logs in `/memlog/` for detailed error messages.

### Logs

Deployment logs are stored in `/memlog/setup_log.txt`.

## Security Considerations

- In production environments, use secret management services like AWS Secrets Manager, Azure Key Vault, or GCP Secret Manager.
- Replace default passwords and keys in all configuration files.
- Restrict network access to only necessary ports and IPs.
- Enable HTTPS for all production endpoints.

## Support

For additional assistance, check the project wiki or submit an issue in the project repository.
