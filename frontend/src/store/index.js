import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import platformReducer from './slices/platformSlice';
import postReducer from './slices/postSlice';
import scheduleReducer from './slices/scheduleSlice';
import analyticsReducer from './slices/analyticsSlice';
import aiReducer from './slices/aiSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    platforms: platformReducer,
    posts: postReducer,
    schedules: scheduleReducer,
    analytics: analyticsReducer,
    ai: aiReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginSuccess', 'auth/logout'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user.createdAt', 'auth.user.updatedAt'],
      },
    }),
});

export default store;
