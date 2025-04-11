#!/bin/bash
# Deployment script for Social Media Manager application

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

# Directory paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
TERRAFORM_DIR="$PROJECT_ROOT/terraform"
ANSIBLE_DIR="$PROJECT_ROOT/ansible"

# Log function
log() {
  local level="$1"
  local message="$2"
  local color="$RESET"
  
  case "$level" in
    "INFO") color="$BLUE" ;;
    "SUCCESS") color="$GREEN" ;;
    "WARNING") color="$YELLOW" ;;
    "ERROR") color="$RED" ;;
  esac
  
  echo -e "${color}[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message${RESET}"
}

# Check if a command exists
command_exists() {
  command -v "$1" &> /dev/null
}

# Check dependencies
check_dependencies() {
  log "INFO" "Checking dependencies..."
  
  if ! command_exists python3; then
    log "ERROR" "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
  fi
  
  if ! command_exists pip3; then
    log "ERROR" "pip is not installed. Please install pip and try again."
    exit 1
  fi
  
  if ! command_exists terraform; then
    log "ERROR" "Terraform is not installed. Please install Terraform and try again."
    exit 1
  fi
  
  if ! command_exists ansible; then
    log "ERROR" "Ansible is not installed. Please install Ansible and try again."
    exit 1
  fi
  
  log "SUCCESS" "All dependencies are installed."
}

# Initialize Terraform
terraform_init() {
  log "INFO" "Initializing Terraform..."
  cd "$TERRAFORM_DIR"
  terraform init
  log "SUCCESS" "Terraform initialized."
}

# Apply Terraform configuration
terraform_apply() {
  log "INFO" "Applying Terraform configuration..."
  cd "$TERRAFORM_DIR"
  terraform apply -auto-approve
  log "SUCCESS" "Terraform applied."
}

# Run Ansible playbook
ansible_run() {
  log "INFO" "Running Ansible playbook..."
  cd "$ANSIBLE_DIR"
  ansible-playbook site.yml
  log "SUCCESS" "Ansible playbook executed."
}

# Display help information
show_help() {
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  -h, --help           Show this help message and exit."
  echo "  -t, --terraform-only Run Terraform only."
  echo "  -a, --ansible-only   Run Ansible only."
  echo "  -i, --init-only      Initialize Terraform only."
  echo ""
  echo "Examples:"
  echo "  $0                   Run full deployment (Terraform + Ansible)."
  echo "  $0 -t                Run Terraform only."
  echo "  $0 -a                Run Ansible only."
  echo "  $0 -i                Initialize Terraform only."
}

# Main function
main() {
  # Process command-line options
  terraform_run=true
  ansible_run=true
  init_only=false
  
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -h|--help)
        show_help
        exit 0
        ;;
      -t|--terraform-only)
        ansible_run=false
        shift
        ;;
      -a|--ansible-only)
        terraform_run=false
        shift
        ;;
      -i|--init-only)
        init_only=true
        ansible_run=false
        shift
        ;;
      *)
        log "ERROR" "Unknown option: $1"
        show_help
        exit 1
        ;;
    esac
  done
  
  # Check dependencies
  check_dependencies
  
  # Execute deployment
  if [ "$terraform_run" = true ]; then
    terraform_init
    if [ "$init_only" = false ]; then
      terraform_apply
    fi
  fi
  
  if [ "$ansible_run" = true ]; then
    ansible_run
  fi
  
  log "SUCCESS" "Deployment completed successfully."
}

# Execute main function
main "$@"
