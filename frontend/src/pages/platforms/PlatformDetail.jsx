import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { fetchPlatforms, connectPlatform } from '../../store/slices/platformSlice';

const PlatformDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get data from Redux
  const { platforms, loading, error, connectingPlatform } = useSelector((state) => state.platforms);
  
  // Local state
  const [platform, setPlatform] = useState(null);
  const [settings, setSettings] = useState({
    autoSchedule: false,
    notifications: true,
    analyticsReports: false
  });
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  
  // Fetch platforms on component mount
  useEffect(() => {
    dispatch(fetchPlatforms());
  }, [dispatch]);
  
  // Update platform state when platforms change
  useEffect(() => {
    if (platforms.length > 0 && id) {
      const foundPlatform = platforms.find(p => p.id === id);
      if (foundPlatform) {
        setPlatform(foundPlatform);
        
        // Set initial settings based on platform
        setSettings({
          autoSchedule: foundPlatform.autoSchedule || false,
          notifications: foundPlatform.notifications || true,
          analyticsReports: foundPlatform.analyticsReports || false
        });
      }
    }
  }, [platforms, id]);
  
  // Handle setting change
  const handleSettingChange = (e) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      [name]: checked
    });
    
    // In a real app, you would dispatch an action to update the platform settings
    console.log(`Setting ${name} changed to ${checked}`);
  };
  
  // Handle disconnect platform
  const handleDisconnect = () => {
    setConfirmDisconnect(true);
  };
  
  // Confirm disconnect
  const confirmDisconnectPlatform = () => {
    // In a real app, you would dispatch an action to disconnect the platform
    console.log(`Disconnecting platform ${id}`);
    setConfirmDisconnect(false);
    
    // Simulate disconnected platform
    if (platform) {
      const updatedPlatform = { ...platform, status: 'disconnected' };
      setPlatform(updatedPlatform);
    }
  };
  
  // Cancel disconnect
  const cancelDisconnect = () => {
    setConfirmDisconnect(false);
  };
  
  // Handle reconnect platform
  const handleReconnect = () => {
    // Navigate to connect page with platform ID
    navigate(`/platforms/connect?platform=${id}`);
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/platforms');
  };
  
  // Get platform icon
  const getPlatformIcon = (platformId) => {
    switch (platformId) {
      case 'twitter':
        return <TwitterIcon fontSize="large" />;
      case 'instagram':
        return <InstagramIcon fontSize="large" />;
      case 'facebook':
        return <FacebookIcon fontSize="large" />;
      case 'linkedin':
        return <LinkedInIcon fontSize="large" />;
      case 'youtube':
        return <YouTubeIcon fontSize="large" />;
      case 'tiktok':
        return <MusicNoteIcon fontSize="large" />;
      default:
        return null;
    }
  };
  
  // Get status chip
  const getStatusChip = (status) => {
    switch (status) {
      case 'connected':
        return <Chip label="Connected" color="success" />;
      case 'disconnected':
        return <Chip label="Disconnected" color="error" />;
      case 'pending':
        return <Chip label="Pending" color="warning" />;
      default:
        return <Chip label={status} />;
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        
        <Typography variant="h4" component="h1">
          Platform Details
        </Typography>
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading indicator */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : !platform ? (
        <Alert severity="error">
          Platform not found
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Platform overview */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ mr: 2 }}>
                  {getPlatformIcon(platform.id)}
                </Box>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {platform.name}
                  </Typography>
                  {getStatusChip(platform.status)}
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Account
                </Typography>
                <Typography variant="body1">
                  {platform.handle || 'Not connected'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {platform.status === 'connected' ? (
                    <>
                      <LinkIcon color="success" sx={{ mr: 1 }} />
                      <Typography>
                        Connected since {new Date().toLocaleDateString()}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <LinkOffIcon color="error" sx={{ mr: 1 }} />
                      <Typography>
                        Disconnected
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {platform.status === 'connected' ? (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LinkOffIcon />}
                  onClick={handleDisconnect}
                  fullWidth
                >
                  Disconnect Platform
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<LinkIcon />}
                  onClick={handleReconnect}
                  fullWidth
                >
                  Reconnect Platform
                </Button>
              )}
            </Paper>
          </Grid>
          
          {/* Platform metrics */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Platform Metrics
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Followers
                      </Typography>
                      <Typography variant="h4">
                        {platform.followers ? platform.followers.toLocaleString() : 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Engagement
                      </Typography>
                      <Typography variant="h4">
                        {platform.engagement ? platform.engagement.toLocaleString() : 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Posts
                      </Typography>
                      <Typography variant="h4">
                        {platform.posts || 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Platform settings */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Platform Settings
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="autoSchedule"
                      checked={settings.autoSchedule}
                      onChange={handleSettingChange}
                      disabled={platform.status !== 'connected'}
                    />
                  }
                  label="Auto-schedule posts"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
                  Automatically schedule posts for optimal engagement times
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="notifications"
                      checked={settings.notifications}
                      onChange={handleSettingChange}
                      disabled={platform.status !== 'connected'}
                    />
                  }
                  label="Receive notifications"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
                  Get notified about important platform events and metrics
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="analyticsReports"
                      checked={settings.analyticsReports}
                      onChange={handleSettingChange}
                      disabled={platform.status !== 'connected'}
                    />
                  }
                  label="Weekly analytics reports"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
                  Receive weekly analytics reports for this platform
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Disconnect confirmation dialog */}
      <Dialog
        open={confirmDisconnect}
        onClose={cancelDisconnect}
      >
        <DialogTitle>
          Disconnect {platform?.name}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to disconnect this platform? You'll need to reconnect your account to continue using it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDisconnect}>
            Cancel
          </Button>
          <Button onClick={confirmDisconnectPlatform} color="error" variant="contained">
            Disconnect
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlatformDetail;
