/**
 * API Adapter for the Simple Express backend
 * This adapter translates between the FastAPI structure expected by the React app
 * and the simple Express backend endpoints
 */

import axios from 'axios';
import { getAuthToken } from './auth';

// Create axios instance for simple backend
const simpleApi = axios.create({
  baseURL: 'http://localhost:9500/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
simpleApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Map FastAPI endpoints to Simple Backend endpoints
 * This allows the React app to use the same API calls
 * but they'll be redirected to the correct Simple Backend endpoints
 */
const apiAdapter = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      // For development/demo, just return mock data
      return {
        data: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          user: {
            id: 1,
            full_name: 'Demo User',
            email: credentials.email,
            role: 'admin'
          }
        }
      };
    },
    register: async (userData) => {
      // Mock registration
      return {
        data: {
          id: 1,
          full_name: userData.full_name,
          email: userData.email
        }
      };
    },
    refresh: async () => {
      // Mock token refresh
      return {
        data: {
          access_token: 'mock-access-token-refreshed',
          refresh_token: 'mock-refresh-token-refreshed'
        }
      };
    }
  },

  // User endpoints
  users: {
    getCurrentUser: async () => {
      // Mock current user
      return {
        data: {
          id: 1,
          full_name: 'Demo User',
          email: 'user@example.com',
          role: 'admin'
        }
      };
    },
    updateProfile: async (userData) => {
      // Mock update profile
      return {
        data: {
          ...userData,
          id: 1
        }
      };
    }
  },

  // Post endpoints
  posts: {
    getPosts: async () => {
      // Get posts from simple backend
      const response = await simpleApi.get('/posts');
      return response;
    },
    getPost: async (id) => {
      // Get post by ID from simple backend
      const response = await simpleApi.get(`/posts/${id}`);
      return response;
    },
    createPost: async (postData) => {
      // Create post with simple backend
      const response = await simpleApi.post('/posts', postData);
      return response;
    },
    updatePost: async (id, postData) => {
      // Update post in simple backend (mock for now)
      return {
        data: {
          id,
          ...postData,
          updatedAt: new Date().toISOString()
        }
      };
    },
    deletePost: async (id) => {
      // Delete post (mock for now)
      return { data: { success: true } };
    }
  },

  // Platform endpoints
  platforms: {
    getPlatforms: async () => {
      // Get platforms from simple backend
      const response = await simpleApi.get('/platforms');
      return response;
    },
    connectPlatform: async (platformData) => {
      // Connect platform with simple backend
      const response = await simpleApi.post('/platforms/connect', platformData);
      return response;
    }
  },

  // Analytics endpoints
  analytics: {
    getAnalytics: async () => {
      // Get analytics from simple backend
      const response = await simpleApi.get('/analytics');
      return response;
    }
  },

  // Settings/preferences endpoints
  preferences: {
    getPreferences: async () => {
      // Get preferences from simple backend
      const response = await simpleApi.get('/preferences');
      return response;
    },
    updatePreferences: async (preferences) => {
      // Update preferences with simple backend
      const response = await simpleApi.post('/preferences', preferences);
      return response;
    },
    updateTheme: async (theme) => {
      // Update theme with simple backend
      const response = await simpleApi.post('/preferences/theme', { theme });
      return response;
    }
  },

  // AI content generation
  ai: {
    generateContent: async (params) => {
      // Generate content with simple backend
      const response = await simpleApi.post('/ai/generate', params);
      return response;
    }
  }
};

export default apiAdapter;
