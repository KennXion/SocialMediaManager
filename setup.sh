#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Social Media Manager development environment...${NC}"

# Create memlog entry
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "# Setup Log - $TIMESTAMP" > memlog/setup_log.txt
echo "Setting up development environment..." >> memlog/setup_log.txt

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js and npm before continuing.${NC}"
    echo "Error: Node.js not found. Installation aborted." >> memlog/setup_log.txt
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm before continuing.${NC}"
    echo "Error: npm not found. Installation aborted." >> memlog/setup_log.txt
    exit 1
fi

# Navigate to simple-backend directory
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd simple-backend

# Install backend dependencies
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install backend dependencies.${NC}"
    echo "Error: Failed to install backend dependencies." >> ../memlog/setup_log.txt
    exit 1
fi

echo -e "${GREEN}Backend dependencies installed successfully!${NC}"
echo "Backend dependencies installed successfully." >> ../memlog/setup_log.txt

# Set execute permissions for this script
chmod +x ../start.sh

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "Run ${YELLOW}./start.sh${NC} to start the server."
echo "Setup completed successfully." >> ../memlog/setup_log.txt
