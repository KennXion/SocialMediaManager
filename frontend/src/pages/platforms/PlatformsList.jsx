import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { fetchPlatforms } from '../../store/slices/platformSlice';

const PlatformsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { platforms, loading, error } = useSelector((state) => state.platforms);
  
  // Fetch platforms on component mount
  useEffect(() => {
    dispatch(fetchPlatforms());
  }, [dispatch]);
  
  // Handle add platform
  const handleAddPlatform = () => {
    navigate('/platforms/connect');
  };
  
  // Handle platform detail
  const handlePlatformDetail = (platformId) => {
    navigate(`/platforms/${platformId}`);
  };
  
  // Get platform icon
  const getPlatformIcon = (platformId) => {
    switch (platformId) {
      case 'twitter':
        return <TwitterIcon />;
      case 'instagram':
        return <InstagramIcon />;
      case 'facebook':
        return <FacebookIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'youtube':
        return <YouTubeIcon />;
      case 'tiktok':
        return <MusicNoteIcon />;
      default:
        return null;
    }
  };
  
  // Get status chip
  const getStatusChip = (status) => {
    switch (status) {
      case 'connected':
        return <Chip label="Connected" color="success" size="small" />;
      case 'disconnected':
        return <Chip label="Disconnected" color="error" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Social Media Platforms
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPlatform}
        >
          Connect Platform
        </Button>
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
      ) : (
        <Grid container spacing={3}>
          {platforms.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                No platforms connected yet. Click "Connect Platform" to get started.
              </Alert>
            </Grid>
          ) : (
            platforms.map((platform) => (
              <Grid item xs={12} sm={6} md={4} key={platform.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2 }}>
                        {getPlatformIcon(platform.id)}
                      </Box>
                      <Box>
                        <Typography variant="h6">
                          {platform.name}
                        </Typography>
                        {getStatusChip(platform.status)}
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Account
                      </Typography>
                      <Typography variant="body1">
                        {platform.handle || 'Not connected'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Followers
                        </Typography>
                        <Typography variant="body1">
                          {platform.followers ? platform.followers.toLocaleString() : 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Engagement
                        </Typography>
                        <Typography variant="body1">
                          {platform.engagement ? platform.engagement.toLocaleString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<SettingsIcon />}
                      onClick={() => handlePlatformDetail(platform.id)}
                    >
                      Manage
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default PlatformsList;
