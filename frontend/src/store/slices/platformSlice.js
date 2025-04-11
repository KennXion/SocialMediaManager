import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async actions
export const fetchPlatforms = createAsyncThunk(
  'platforms/fetchPlatforms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/platforms');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch platforms');
    }
  }
);

export const connectPlatform = createAsyncThunk(
  'platforms/connectPlatform',
  async (platformData, { rejectWithValue }) => {
    try {
      const response = await api.post('/platforms/connect', platformData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to connect platform');
    }
  }
);

// Initial state
const initialState = {
  platforms: [],
  loading: false,
  error: null,
  connectingPlatform: false
};

// Create slice
const platformSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    clearPlatformError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch platforms
      .addCase(fetchPlatforms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.loading = false;
        state.platforms = action.payload;
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Connect platform
      .addCase(connectPlatform.pending, (state) => {
        state.connectingPlatform = true;
        state.error = null;
      })
      .addCase(connectPlatform.fulfilled, (state, action) => {
        state.connectingPlatform = false;
        
        // Update existing platform or add new one
        const index = state.platforms.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.platforms[index] = action.payload;
        } else {
          state.platforms.push(action.payload);
        }
      })
      .addCase(connectPlatform.rejected, (state, action) => {
        state.connectingPlatform = false;
        state.error = action.payload;
      });
  }
});

export const { clearPlatformError } = platformSlice.actions;
export default platformSlice.reducer;
