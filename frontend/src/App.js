import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Layout components
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ContentManager from './pages/content/ContentManager';
import ContentCreator from './pages/content/ContentCreator';
import ContentScheduler from './pages/content/ContentScheduler';
import PlatformsList from './pages/platforms/PlatformsList';
import PlatformDetail from './pages/platforms/PlatformDetail';
import PlatformConnect from './pages/platforms/PlatformConnect';
import Analytics from './pages/analytics/Analytics';
import AiGenerator from './pages/ai/AiGenerator';
import Settings from './pages/settings/Settings';
import UserProfile from './pages/settings/UserProfile';
import NotFound from './pages/NotFound';

// Auth
import { checkAuth } from './store/slices/authSlice';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Content */}
          <Route path="/content" element={<ContentManager />} />
          <Route path="/content/create" element={<ContentCreator />} />
          <Route path="/content/edit/:id" element={<ContentCreator />} />
          <Route path="/content/schedule" element={<ContentScheduler />} />
          
          {/* Platforms */}
          <Route path="/platforms" element={<PlatformsList />} />
          <Route path="/platforms/:id" element={<PlatformDetail />} />
          <Route path="/platforms/connect" element={<PlatformConnect />} />
          
          {/* Analytics */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics/:platformId" element={<Analytics />} />
          
          {/* AI Generator */}
          <Route path="/ai-generator" element={<AiGenerator />} />
          
          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
