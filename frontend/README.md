# Social Media Manager - Frontend

This directory contains the frontend application for the Social Media Manager system.

## Quick Start for Testing the GUI

The frontend includes HTML mockups that can be viewed directly in your browser without needing to run a server:

1. Navigate to the `frontend` directory
2. Open any of the following HTML files in your browser:
   - `index.html` - Dashboard overview
   - `content.html` - Content creation page
   - `scheduler.html` - Post scheduling calendar
   - `analytics.html` - Analytics dashboard
   - `platforms.html` - Platform connection management
   - `ai-generator.html` - AI content generation tool

## Development Setup

For full development with React:

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

```bash
# Install dependencies
npm install
```

### Running the Development Server

```bash
# Start the development server
npm start
```

This will start the development server at http://localhost:3000

## Building for Production

```bash
# Build the production version
npm run build
```

## Project Structure

```
frontend/
├── public/           # Static files
├── src/              # React source code
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── store/        # Redux store
│   ├── App.js        # Main application component
│   └── index.js      # Application entry point
├── .env              # Environment variables
├── package.json      # Project dependencies
├── README.md         # This file
└── *.html            # HTML mockups for testing
```

## HTML Mockups

The HTML mockups are included for quick testing and demonstration of the user interface. These files are not part of the React application but provide a way to visualize the UI without running the full development environment.

## Connecting to the Backend

The React application is configured to connect to the backend API at `http://localhost:8000/api` by default. This can be changed by modifying the proxy setting in `package.json` or by setting the `REACT_APP_API_URL` environment variable.

## Features

- Dashboard with key metrics and activity overview
- Content creation with platform-specific formatting
- Post scheduling with calendar interface
- Analytics dashboard with charts and reporting
- Platform connection management
- AI-powered content generation

## Browser Support

The application supports the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
