import axios from 'axios';
import { getAuthToken, refreshAuthToken, removeAuthToken } from './auth';
import apiAdapter from './apiAdapter';

// Check if using the simple backend
const useSimpleBackend = true; // Set to false when moving to the real backend

let api;

// Simple backend adapter API
if (useSimpleBackend) {
  // Use the adapter instead of the regular API
  api = {
    get: async (url, config) => {
      // Parse the URL path
      const urlParts = url.split('/');
      const resource = urlParts[1]; // e.g., 'users', 'posts', etc.
      
      // Handle various endpoints
      switch (resource) {
        case 'users':
          if (urlParts.includes('me')) {
            return apiAdapter.users.getCurrentUser();
          }
          break;
        case 'posts':
          if (urlParts.length === 2) {
            return apiAdapter.posts.getPosts();
          } else if (urlParts.length === 3) {
            return apiAdapter.posts.getPost(urlParts[2]);
          }
          break;
        case 'platforms':
          return apiAdapter.platforms.getPlatforms();
        case 'analytics':
          return apiAdapter.analytics.getAnalytics();
        case 'preferences':
          return apiAdapter.preferences.getPreferences();
        default:
          // Default fallback to regular axios for unmatched routes
          return axios.get(`http://localhost:9500/api${url}`, config);
      }
      
      // Default fallback
      return axios.get(`http://localhost:9500/api${url}`, config);
    },
    
    post: async (url, data, config) => {
      // Parse the URL path
      const urlParts = url.split('/');
      const resource = urlParts[1]; // e.g., 'auth', 'posts', etc.
      
      // Handle various endpoints
      switch (resource) {
        case 'auth':
          if (urlParts.includes('login')) {
            return apiAdapter.auth.login(data);
          } else if (urlParts.includes('register')) {
            return apiAdapter.auth.register(data);
          } else if (urlParts.includes('refresh')) {
            return apiAdapter.auth.refresh(data);
          }
          break;
        case 'posts':
          return apiAdapter.posts.createPost(data);
        case 'platforms':
          if (urlParts.includes('connect')) {
            return apiAdapter.platforms.connectPlatform(data);
          }
          break;
        case 'preferences':
          if (urlParts.includes('theme')) {
            return apiAdapter.preferences.updateTheme(data);
          }
          return apiAdapter.preferences.updatePreferences(data);
        case 'ai':
          if (urlParts.includes('generate')) {
            return apiAdapter.ai.generateContent(data);
          }
          break;
        default:
          // Default fallback to regular axios for unmatched routes
          return axios.post(`http://localhost:9500/api${url}`, data, config);
      }
      
      // Default fallback
      return axios.post(`http://localhost:9500/api${url}`, data, config);
    },
    
    put: async (url, data, config) => {
      // Parse the URL path
      const urlParts = url.split('/');
      const resource = urlParts[1]; // e.g., 'users', 'posts', etc.
      
      // Handle various endpoints
      switch (resource) {
        case 'users':
          if (urlParts.includes('me')) {
            return apiAdapter.users.updateProfile(data);
          }
          break;
        case 'posts':
          if (urlParts.length === 3) {
            return apiAdapter.posts.updatePost(urlParts[2], data);
          }
          break;
        default:
          // Default fallback to regular axios for unmatched routes
          return axios.put(`http://localhost:9500/api${url}`, data, config);
      }
      
      // Default fallback
      return axios.put(`http://localhost:9500/api${url}`, data, config);
    },
    
    delete: async (url, config) => {
      // Parse the URL path
      const urlParts = url.split('/');
      const resource = urlParts[1]; // e.g., 'posts', etc.
      
      // Handle various endpoints
      switch (resource) {
        case 'posts':
          if (urlParts.length === 3) {
            return apiAdapter.posts.deletePost(urlParts[2]);
          }
          break;
        default:
          // Default fallback to regular axios for unmatched routes
          return axios.delete(`http://localhost:9500/api${url}`, config);
      }
      
      // Default fallback
      return axios.delete(`http://localhost:9500/api${url}`, config);
    },
    
    defaults: {
      headers: {
        common: {}
      }
    },
    
    interceptors: {
      request: {
        use: () => {}
      },
      response: {
        use: () => {}
      }
    }
  };
} else {
  // Create axios instance
  api = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 (Unauthorized) and not a retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          const newToken = await refreshAuthToken();
          if (newToken) {
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
          
          // If refresh fails, log out
          removeAuthToken();
          window.location.href = '/login';
          return Promise.reject(error);
        } catch (refreshError) {
          // If refresh token fails, log out
          removeAuthToken();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
}

export default api;
