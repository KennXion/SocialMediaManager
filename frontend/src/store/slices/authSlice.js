import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { setAuthToken, removeAuthToken, getAuthToken } from '../../services/auth';

// Development mode - enables bypass of actual authentication
const DEV_MODE = true; // Set to false for production
const DEMO_USER = {
  id: 1,
  full_name: 'Demo User',
  email: 'user@example.com',
  role: 'admin'
};

// Check if user is already authenticated
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // In development mode, auto-authenticate
      if (DEV_MODE) {
        // Set a dummy token if one doesn't exist
        if (!getAuthToken()) {
          setAuthToken('demo-token', 'demo-refresh-token');
        }
        return DEMO_USER;
      }
      
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      // Validate token by fetching current user
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      removeAuthToken();
      return rejectWithValue(error.response?.data?.detail || 'Authentication failed');
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // In development mode, bypass actual login
      if (DEV_MODE) {
        const demoToken = 'demo-token';
        const demoRefreshToken = 'demo-refresh-token';
        
        // Set auth token
        setAuthToken(demoToken, demoRefreshToken);
        
        return {
          user: DEMO_USER,
          tokens: {
            access: demoToken,
            refresh: demoRefreshToken
          }
        };
      }
      
      // Transform credentials to form data for FastAPI OAuth compatibility
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      
      const response = await api.post('/auth/login', formData);
      const { access_token, refresh_token } = response.data;
      
      // Set auth token
      setAuthToken(access_token, refresh_token);
      
      // Fetch user details
      const userResponse = await api.get('/users/me');
      return {
        user: userResponse.data,
        tokens: {
          access: access_token,
          refresh: refresh_token
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // After successful registration, log the user in
      await dispatch(login({
        email: userData.email,
        password: userData.password
      }));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Registration failed');
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // No need to call API for logout, just remove token
      removeAuthToken();
      return null;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/me', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Profile update failed');
    }
  }
);

// Initial state
const initialState = {
  user: null,
  tokens: {
    access: null,
    refresh: null
  },
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        // Login handling is done by the login thunk called inside register
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = {
          access: null,
          refresh: null
        };
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { resetAuthError } = authSlice.actions;
export default authSlice.reducer;
