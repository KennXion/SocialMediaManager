import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async actions
export const fetchPreferences = createAsyncThunk(
  'ui/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/preferences');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch preferences');
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'ui/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await api.post('/preferences', preferences);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update preferences');
    }
  }
);

export const updateTheme = createAsyncThunk(
  'ui/updateTheme',
  async (theme, { rejectWithValue }) => {
    try {
      const response = await api.post('/preferences/theme', { theme });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update theme');
    }
  }
);

// Initial state
const initialState = {
  // Theme
  theme: localStorage.getItem('theme') || 'light', // 'light' or 'dark'
  
  // Sidebar
  sidebarOpen: true,
  
  // Notifications
  notifications: [],
  unreadNotifications: 0,
  
  // Preferences
  preferences: {
    defaultPlatforms: [],
    notifications: {
      email: true,
      push: true,
      postPublishing: true,
      analyticsReports: false
    }
  },
  
  // Loading and error states
  loading: false,
  error: null
};

// Create slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Notification actions
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now().toString(),
        read: false,
        timestamp: new Date().toISOString(),
        ...action.payload
      });
      state.unreadNotifications += 1;
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadNotifications -= 1;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => { n.read = true; });
      state.unreadNotifications = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadNotifications = 0;
    },
    removeNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadNotifications -= 1;
        }
        state.notifications.splice(index, 1);
      }
    },
    clearUiError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch preferences
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
        // If theme is in preferences, update theme
        if (action.payload.theme) {
          state.theme = action.payload.theme;
          localStorage.setItem('theme', action.payload.theme);
        }
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
        // If theme is in preferences, update theme
        if (action.payload.theme) {
          state.theme = action.payload.theme;
          localStorage.setItem('theme', action.payload.theme);
        }
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update theme
      .addCase(updateTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.theme = action.payload.theme;
        localStorage.setItem('theme', action.payload.theme);
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setTheme, 
  toggleSidebar, 
  setSidebarOpen,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  removeNotification,
  clearUiError
} = uiSlice.actions;

export default uiSlice.reducer;
