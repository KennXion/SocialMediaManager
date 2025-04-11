import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchPreferences, updatePreferences, updateTheme, setTheme } from '../../store/slices/uiSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { theme, preferences, loading, error } = useSelector((state) => state.ui);
  
  // Local state
  const [settings, setSettings] = useState({
    theme: 'light',
    defaultPlatforms: [],
    notifications: {
      email: true,
      push: true,
      postPublishing: true,
      analyticsReports: false
    }
  });
  
  // Load preferences from Redux
  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);
  
  // Update local state when preferences change
  useEffect(() => {
    if (preferences) {
      setSettings({
        theme: theme,
        defaultPlatforms: preferences.defaultPlatforms || [],
        notifications: {
          ...settings.notifications,
          ...preferences.notifications
        }
      });
    }
  }, [preferences, theme]);
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    setSettings({
      ...settings,
      theme: newTheme
    });
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (name) => (event) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: event.target.checked
      }
    });
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    // Update theme
    if (settings.theme !== theme) {
      dispatch(updateTheme(settings.theme));
    }
    
    // Update other preferences
    dispatch(updatePreferences({
      defaultPlatforms: settings.defaultPlatforms,
      notifications: settings.notifications
    }));
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Settings'}
        </Button>
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {theme === 'light' ? (
                  <LightModeIcon sx={{ mr: 2 }} />
                ) : (
                  <DarkModeIcon sx={{ mr: 2 }} />
                )}
                <Typography>
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </Typography>
              </Box>
              
              <Switch
                checked={theme === 'dark'}
                onChange={handleThemeToggle}
                inputProps={{ 'aria-label': 'Theme toggle' }}
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.notifications.email}
                    onChange={handleNotificationToggle('email')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive notifications in browser"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.notifications.push}
                    onChange={handleNotificationToggle('push')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Post Publishing Notifications"
                  secondary="Get notified when posts are published"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.notifications.postPublishing}
                    onChange={handleNotificationToggle('postPublishing')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Analytics Reports"
                  secondary="Receive weekly analytics reports"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.notifications.analyticsReports}
                    onChange={handleNotificationToggle('analyticsReports')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Default Platform Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Default Platforms
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography paragraph>
              Select the platforms that will be selected by default when creating new content.
            </Typography>
            
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Default Platforms</InputLabel>
              <Select
                multiple
                value={settings.defaultPlatforms}
                onChange={(e) => setSettings({ ...settings, defaultPlatforms: e.target.value })}
                renderValue={(selected) => selected.join(', ')}
                label="Default Platforms"
              >
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
                <MenuItem value="tiktok">TikTok</MenuItem>
                <MenuItem value="youtube">YouTube</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        
        {/* Account Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Change Password"
                  secondary="Update your account password"
                />
                <ListItemSecondaryAction>
                  <Button size="small" variant="outlined">
                    Change
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Delete Account"
                  secondary="Permanently delete your account and all data"
                />
                <ListItemSecondaryAction>
                  <Button size="small" color="error" variant="outlined">
                    Delete
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Success message */}
      {settings !== preferences && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Settings;
