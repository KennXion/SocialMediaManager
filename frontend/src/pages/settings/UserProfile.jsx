import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../store/slices/authSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    company: user?.company || '',
    job_title: user?.job_title || '',
    bio: user?.bio || ''
  });
  
  // Validation state
  const [validation, setValidation] = useState({
    full_name: '',
    email: ''
  });
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation errors on input change
    if (validation[name]) {
      setValidation({
        ...validation,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newValidation = { full_name: '', email: '' };
    
    // Validate name
    if (!formData.full_name.trim()) {
      newValidation.full_name = 'Name is required';
      isValid = false;
    }
    
    // Validate email
    if (!formData.email) {
      newValidation.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newValidation.email = 'Invalid email format';
      isValid = false;
    }
    
    setValidation(newValidation);
    return isValid;
  };
  
  // Handle save profile
  const handleSaveProfile = () => {
    if (validateForm()) {
      dispatch(updateProfile(formData));
    }
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/settings');
  };
  
  // Handle profile picture upload
  const handleProfilePictureUpload = () => {
    // Mock implementation - would trigger file input in real app
    console.log('Upload profile picture');
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
          Back to Settings
        </Button>
        <Typography variant="h4" component="h1">
          User Profile
        </Typography>
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Picture */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user?.avatar_url}
                alt={user?.full_name}
                sx={{ width: 150, height: 150 }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
                onClick={handleProfilePictureUpload}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Box>
            
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              {user?.full_name || 'User Name'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {user?.job_title ? `${user.job_title}, ` : ''}
              {user?.company || ''}
            </Typography>
          </Grid>
          
          {/* Profile Form */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  error={!!validation.full_name}
                  helperText={validation.full_name}
                  disabled={isLoading}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!validation.email}
                  helperText={validation.email}
                  disabled={isLoading}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={24} /> : <SaveIcon />}
                onClick={handleSaveProfile}
                disabled={isLoading}
              >
                Save Profile
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfile;
