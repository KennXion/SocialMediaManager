import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async actions
export const fetchSchedules = createAsyncThunk(
  'schedules/fetchSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/schedules');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch schedules');
    }
  }
);

export const createSchedule = createAsyncThunk(
  'schedules/createSchedule',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/schedules', scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create schedule');
    }
  }
);

export const updateSchedule = createAsyncThunk(
  'schedules/updateSchedule',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/schedules/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update schedule');
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  'schedules/deleteSchedule',
  async (scheduleId, { rejectWithValue }) => {
    try {
      await api.delete(`/schedules/${scheduleId}`);
      return scheduleId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete schedule');
    }
  }
);

// Initial state
const initialState = {
  schedules: [],
  currentSchedule: null,
  loading: false,
  saving: false,
  error: null
};

// Create slice
const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    clearScheduleError: (state) => {
      state.error = null;
    },
    setCurrentSchedule: (state, action) => {
      state.currentSchedule = action.payload;
    },
    clearCurrentSchedule: (state) => {
      state.currentSchedule = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create schedule
      .addCase(createSchedule.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.saving = false;
        state.schedules.push(action.payload);
        state.currentSchedule = action.payload;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Update schedule
      .addCase(updateSchedule.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.schedules.findIndex(schedule => schedule.id === action.payload.id);
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
        state.currentSchedule = action.payload;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Delete schedule
      .addCase(deleteSchedule.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.saving = false;
        state.schedules = state.schedules.filter(schedule => schedule.id !== action.payload);
        if (state.currentSchedule && state.currentSchedule.id === action.payload) {
          state.currentSchedule = null;
        }
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  }
});

export const { clearScheduleError, setCurrentSchedule, clearCurrentSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
