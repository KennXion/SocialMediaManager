import axios from 'axios';

// Local storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Set authentication tokens in local storage
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export const setAuthToken = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Get access token from local storage
 * @returns {string|null} JWT access token
 */
export const getAuthToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from local storage
 * @returns {string|null} JWT refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Remove authentication tokens from local storage
 */
export const removeAuthToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Refresh authentication token
 * @returns {Promise<string|null>} New access token
 */
export const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }
  
  try {
    const response = await axios.post('/api/auth/refresh', {
      refresh_token: refreshToken
    });
    
    const { access_token, refresh_token } = response.data;
    setAuthToken(access_token, refresh_token);
    
    return access_token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    removeAuthToken();
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};
