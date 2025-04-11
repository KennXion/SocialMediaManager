#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Social Media Manager frontend...${NC}"

# Create memlog entry
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "# Frontend Start Log - $TIMESTAMP" >> ../memlog/setup_log.txt

# Check if the port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Port 8000 is already in use. Please stop the other service first.${NC}"
    echo "Error: Port 8000 is already in use." >> ../memlog/setup_log.txt
    exit 1
fi

# Set PORT environment variable to change React's default port
echo -e "${YELLOW}Checking for dependencies...${NC}"
npm install --quiet

echo -e "${YELLOW}Starting React development server on port 8000...${NC}"
echo "Starting React development server on port 8000..." >> ../memlog/setup_log.txt

# Start React app on port 8000
PORT=8000 npm start

# Note: This will stay in the foreground with the server running
