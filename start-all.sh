#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Social Media Manager (Full Stack)...${NC}"

# Create memlog entry
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "# Full Stack Start Log - $TIMESTAMP" >> memlog/setup_log.txt

# Check if ports are already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Port 8000 is already in use. Please stop the other service first.${NC}"
    echo "Error: Port 8000 is already in use." >> memlog/setup_log.txt
    exit 1
fi

if lsof -Pi :9500 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Port 9500 is already in use. Please stop the other service first.${NC}"
    echo "Error: Port 9500 is already in use." >> memlog/setup_log.txt
    exit 1
fi

# Check for required directories and files
echo -e "${YELLOW}Checking required directories and files...${NC}"

# Ensure public directory exists
if [ ! -d "frontend/public" ]; then
    echo -e "${YELLOW}Creating missing public directory...${NC}"
    mkdir -p frontend/public
    echo "Created missing public directory at $(date +"%Y-%m-%d %H:%M:%S")" >> memlog/setup_log.txt
fi

# Ensure required files exist
if [ ! -f "frontend/public/index.html" ]; then
    echo -e "${RED}Required file missing: frontend/public/index.html${NC}"
    echo "Error: Required file missing: frontend/public/index.html" >> memlog/setup_log.txt
    exit 1
fi

if [ ! -f "frontend/public/manifest.json" ]; then
    echo -e "${RED}Required file missing: frontend/public/manifest.json${NC}"
    echo "Error: Required file missing: frontend/public/manifest.json" >> memlog/setup_log.txt
    exit 1
fi

# Kill any existing node processes
echo -e "${YELLOW}Checking for existing server processes...${NC}"
pkill -f "node.*server.js" 2>/dev/null
pkill -f "nodemon.*server.js" 2>/dev/null

echo -e "${YELLOW}Stopped any existing server processes.${NC}"
echo "Stopped existing server processes at $(date +"%Y-%m-%d %H:%M:%S")" >> memlog/setup_log.txt

# Start the backend in the background
echo -e "${YELLOW}Starting backend server on port 9500...${NC}"
echo "Starting backend server on port 9500..." >> memlog/setup_log.txt

# Navigate to simple-backend directory and start
cd simple-backend
NODE_ENV=development node server.js &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 2

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}Failed to start the backend server.${NC}"
    echo "Error: Failed to start the backend server." >> ../memlog/setup_log.txt
    exit 1
fi

echo -e "${GREEN}Backend server started successfully on port 9500!${NC}"
echo "Backend server started successfully on port 9500." >> ../memlog/setup_log.txt

# Go back to the root directory
cd ..

# Now start the frontend
echo -e "${YELLOW}Starting frontend on port 8000...${NC}"
echo "Starting frontend on port 8000..." >> memlog/setup_log.txt

# Navigate to frontend directory and start
cd frontend
echo -e "${YELLOW}Installing any missing dependencies...${NC}"
npm install --quiet
echo -e "${YELLOW}Starting React app on port 8000...${NC}"
PORT=8000 npm start &
FRONTEND_PID=$!

# Wait a moment for the frontend to start
sleep 5

# Check if frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${RED}Failed to start the frontend.${NC}"
    echo "Error: Failed to start the frontend." >> ../memlog/setup_log.txt
    
    # Kill the backend if the frontend fails
    kill $BACKEND_PID
    exit 1
fi

echo -e "${GREEN}Application is now running!${NC}"
echo -e "Access the frontend at: ${YELLOW}http://localhost:8000${NC}"
echo -e "Backend API is available at: ${YELLOW}http://localhost:9500/api${NC}"
echo "Application started successfully." >> memlog/setup_log.txt

# Trap SIGINT (Ctrl+C) to clean up when stopping the servers
trap "echo -e '${YELLOW}Stopping servers...${NC}'; kill $BACKEND_PID $FRONTEND_PID; echo 'Servers stopped.' >> memlog/setup_log.txt; exit" INT

# Keep the script running to allow Ctrl+C to work
wait