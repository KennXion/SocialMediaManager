#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Social Media Manager server...${NC}"

# Kill any existing node processes running our server
echo -e "${YELLOW}Checking for existing server processes...${NC}"
pkill -f "node.*server.js" 2>/dev/null
pkill -f "nodemon.*server.js" 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo -e "${YELLOW}Any existing server processes have been stopped.${NC}"

# Create memlog entry
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "# Simple Server Start - $TIMESTAMP" >> "$(dirname "$0")/memlog/setup_log.txt"

# Navigate to simple-backend directory
cd "$(dirname "$0")/simple-backend"

# Start the server
echo -e "${YELLOW}Starting backend server...${NC}"
NODE_ENV=development node server.js

# Note: This script will remain in the foreground with the running server

# The script will remain running with the server
