#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Social Media Manager development server...${NC}"

# Create memlog entry
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "# Server Start Log - $TIMESTAMP" >> memlog/setup_log.txt

# Kill any existing node processes
echo -e "${YELLOW}Checking for existing server processes...${NC}"

# More thorough process killing
pkill -f "node.*server.js" 2>/dev/null
pkill -f "nodemon.*server.js" 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo -e "${YELLOW}Stopped any existing server processes.${NC}"
echo "Stopped existing server processes at $(date +"%Y-%m-%d %H:%M:%S")" >> memlog/setup_log.txt

# Navigate to simple-backend directory
cd simple-backend

# Start the server
echo -e "${YELLOW}Starting backend server...${NC}"
echo "Starting backend server..." >> ../memlog/setup_log.txt

# Check if nodemon is installed
if command -v nodemon &> /dev/null; then
    # Start with nodemon for auto-reloading during development
    echo -e "${YELLOW}Starting server with nodemon...${NC}"
    NODE_ENV=development nodemon server.js &
else
    # Fall back to regular node if nodemon is not available
    echo -e "${YELLOW}Nodemon not found, starting with node...${NC}"
    NODE_ENV=development node server.js &
fi

SERVER_PID=$!

# Check if server started successfully
sleep 2
if ! ps -p $SERVER_PID > /dev/null; then
    echo -e "${RED}Failed to start the server.${NC}"
    echo "Error: Failed to start the server." >> ../memlog/setup_log.txt
    exit 1
fi

echo -e "${GREEN}Server started successfully!${NC}"
echo -e "Access the application at: ${YELLOW}http://localhost:8000${NC}"
echo -e "Press Ctrl+C to stop the server."
echo "Server started successfully." >> ../memlog/setup_log.txt

# Trap SIGINT (Ctrl+C) to clean up when stopping the server
trap "echo -e '${YELLOW}Stopping server...${NC}'; kill $SERVER_PID; echo 'Server stopped.' >> ../memlog/setup_log.txt; exit" INT

# Keep the script running to allow Ctrl+C to work
wait $SERVER_PID
