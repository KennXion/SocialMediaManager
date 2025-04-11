# Social Media Manager

A comprehensive social media management system with AI-powered content creation, scheduling, and analytics capabilities.

## Features

- **Multi-Platform Management**: Connect and manage multiple social media platforms from a single interface (Twitter/X, Facebook, Instagram, LinkedIn, TikTok, YouTube)
- **AI-Powered Content Creation**: Generate platform-specific content using AI with customizable tone, length, and style
- **Advanced Scheduling**: Schedule posts across all platforms with timezone support and recurrence options
- **Analytics Dashboard**: Track engagement, followers, and content performance across platforms
- **Sleek, Intuitive Interface**: Modern UI for easy navigation and management
- **Extensible Design**: Plugin architecture to easily add support for new platforms

## Quick Start for Testing the GUI

### Option 1: Using the Simple Backend Server (Recommended)

This is the recommended approach as it provides real API endpoints to interact with:

1. Make sure you have Node.js installed
2. Run the setup script to install dependencies:
   ```
   chmod +x setup.sh
   ./setup.sh
   ```
3. Start the development server:
   ```
   ./start.sh
   ```
4. Access the application at http://localhost:8000

This will start a simple Express.js server that hosts the HTML mockups and provides API endpoints for testing the functionality.

### Option 2: HTML Files Only

If you just want to view the UI without any backend interaction:

1. Navigate to the `frontend` directory
2. Open any of the following HTML files directly in your browser:
   - `index.html` - Dashboard overview
   - `content.html` - Content creation page
   - `scheduler.html` - Post scheduling calendar
   - `analytics.html` - Analytics dashboard
   - `platforms.html` - Platform connection management
   - `ai-generator.html` - AI content generation tool

These mockups demonstrate the user interface and functionality without requiring the backend to be running.

## Development Setup

### Simple Backend (for UI Testing)

The project includes a simple Express.js backend that serves the HTML mockups and provides basic API endpoints for testing:

1. Navigate to the `simple-backend` directory:
   ```
   cd simple-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   node server.js
   ```

The server will be available at http://localhost:8000. It provides the following API endpoints:

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `GET /api/analytics` - Get analytics data
- `GET /api/platforms` - Get connected platforms
- `POST /api/platforms/connect` - Connect a platform
- `POST /api/ai/generate` - Generate AI content

### Full Stack Setup

For full development with React and FastAPI:

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

5. Configure your database and API keys in the `.env` file

6. Run database migrations:
   ```
   alembic upgrade head
   ```

7. Start the development server:
   ```
   uvicorn app.main:app --reload
   ```

The API will be available at http://localhost:8000 and the Swagger documentation at http://localhost:8000/api/docs

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend will be available at http://localhost:3000

## Local Development with Docker

You can also use Docker Compose to start the entire application stack:

```
docker-compose up -d
```

This will start the backend, frontend, database, and Redis services. The frontend will be available at http://localhost:3000 and the backend at http://localhost:8000.

## Social Media API Integration

To connect with social media platforms, you'll need to obtain API keys:

1. **Twitter/X**: Create a developer account at https://developer.twitter.com
2. **Facebook/Instagram**: Create an app at https://developers.facebook.com
3. **LinkedIn**: Register an app at https://www.linkedin.com/developers
4. **TikTok**: Create an app at https://developers.tiktok.com
5. **YouTube**: Get an API key from https://console.developers.google.com

Once you have your API keys, add them to the `.env` file in the backend directory.

## Modifying the Backend Server

When implementing new features or fixing bugs in the backend:

1. Modify the appropriate files in the `simple-backend` directory
2. The server will automatically reload if you started it with `nodemon`
3. If not using nodemon, restart the server after making changes:
   ```
   ./start.sh
   ```

This is useful for testing the interaction between the frontend and backend without having to implement the full FastAPI backend right away.

## Modifying the Frontend

When implementing new features or fixing bugs in the frontend:

1. Modify the HTML files in the `frontend` directory
2. Refresh the browser to see your changes
3. For more substantial changes, consider implementing proper React components

## AI Content Generation

This project uses OpenAI's API for content generation. You'll need to:

1. Get an API key from https://platform.openai.com
2. Add the key to your `.env` file

## Full Deployment

### Backend

The backend can be deployed as a Docker container or on platforms like Heroku or AWS:

```
# Build Docker image
docker build -t social-media-manager-api ./backend

# Run container
docker run -p 8000:8000 social-media-manager-api
```

### Frontend

The frontend can be deployed on Netlify, Vercel, or any static site host:

```
# Build production version
cd frontend
npm run build
```

## Project Structure

```
Social_Media_Manager/
├── ansible/                  # Configuration management (future)
├── backend/                  # FastAPI backend application
│   ├── app/                  # Application code
│   │   ├── ai/               # AI integration
│   │   ├── api/              # API endpoints
│   │   ├── core/             # Core functionality
│   │   ├── integrations/     # Social media platform integrations
│   │   ├── models/           # Database models
│   │   └── schemas/          # Pydantic schemas
│   ├── .env                  # Environment variables
│   └── requirements.txt      # Python dependencies
├── frontend/                 # Frontend application
│   ├── src/                  # React application source (future)
│   └── *.html                # HTML mockups for testing
├── memlog/                   # Project logs and documentation
├── simple-backend/           # Simple Express.js backend for testing
│   ├── server.js             # Server entry point
│   └── package.json          # Node.js dependencies
├── docker-compose.yml        # Docker Compose configuration
├── setup.sh                  # Setup script
├── start.sh                  # Start script
└── README.md                 # This file
```

## License

[MIT License](LICENSE)

## Acknowledgments

- [OpenAI](https://openai.com/) for the AI content generation
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://reactjs.org/) and [Material UI](https://mui.com/) for the frontend interface
- [Express.js](https://expressjs.com/) for the simple backend implementation
