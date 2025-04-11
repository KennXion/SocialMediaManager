import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async actions
export const generateContent = createAsyncThunk(
  'ai/generateContent',
  async (generationParams, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/generate', generationParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to generate content');
    }
  }
);

// Initial state
const initialState = {
  generatedContent: null,
  loading: false,
  error: null,
  // History of generated content
  history: [],
  // Settings for AI generation
  settings: {
    defaultTone: 'professional',
    defaultNumVariants: 3,
    brandVoiceGuidelines: '',
    restrictedWords: []
  }
};

// Create slice
const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAiError: (state) => {
      state.error = null;
    },
    clearGeneratedContent: (state) => {
      state.generatedContent = null;
    },
    updateAiSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload
      };
    },
    addToHistory: (state, action) => {
      // Add to history with timestamp
      state.history.unshift({
        ...action.payload,
        timestamp: new Date().toISOString()
      });
      // Keep history at reasonable size
      if (state.history.length > 50) {
        state.history = state.history.slice(0, 50);
      }
    },
    clearHistory: (state) => {
      state.history = [];
    },
    removeFromHistory: (state, action) => {
      // Remove by index or id
      if (typeof action.payload === 'number') {
        state.history.splice(action.payload, 1);
      } else {
        state.history = state.history.filter(item => item.id !== action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate content
      .addCase(generateContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedContent = action.payload;
        
        // Add to history automatically
        state.history.unshift({
          ...action.payload,
          timestamp: new Date().toISOString()
        });
        
        // Keep history at reasonable size
        if (state.history.length > 50) {
          state.history = state.history.slice(0, 50);
        }
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearAiError, 
  clearGeneratedContent, 
  updateAiSettings,
  addToHistory,
  clearHistory,
  removeFromHistory
} = aiSlice.actions;

export default aiSlice.reducer;
