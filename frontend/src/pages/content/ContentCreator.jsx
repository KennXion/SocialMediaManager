import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Grid,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchPost, createPost, updatePost, clearCurrentPost } from '../../store/slices/postSlice';
import { fetchPlatforms } from '../../store/slices/platformSlice';

const ContentCreator = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
  // Get data from Redux
  const { currentPost, loading, saving, error } = useSelector((state) => state.posts);
  const { platforms } = useSelector((state) => state.platforms);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platforms: [],
    schedule: false
  });
  
  // Validation state
  const [validation, setValidation] = useState({
    title: '',
    content: '',
    platforms: ''
  });
  
  // Fetch data on component mount
  useEffect(() => {
    // Fetch platforms
    dispatch(fetchPlatforms());
    
    // If editing existing post
    if (id) {
      dispatch(fetchPost(id));
    }
    
    // Cleanup on component unmount
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);
  
  // Update form data when current post changes
  useEffect(() => {
    if (currentPost) {
      setFormData({
        title: currentPost.title || '',
        content: currentPost.content || '',
        platforms: currentPost.platforms || [],
        schedule: currentPost.status === 'scheduled'
      });
    }
  }, [currentPost]);
  
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
  
  // Handle platform selection
  const handlePlatformChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        platforms: [...formData.platforms, value]
      });
    } else {
      setFormData({
        ...formData,
        platforms: formData.platforms.filter(platform => platform !== value)
      });
    }
    
    // Clear platform validation error
    if (validation.platforms) {
      setValidation({
        ...validation,
        platforms: ''
      });
    }
  };
  
  // Handle schedule toggle
  const handleScheduleToggle = (e) => {
    setFormData({
      ...formData,
      schedule: e.target.checked
    });
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newValidation = { title: '', content: '', platforms: '' };
    
    // Validate title
    if (!formData.title.trim()) {
      newValidation.title = 'Title is required';
      isValid = false;
    }
    
    // Validate content
    if (!formData.content.trim()) {
      newValidation.content = 'Content is required';
      isValid = false;
    }
    
    // Validate platforms
    if (formData.platforms.length === 0) {
      newValidation.platforms = 'Select at least one platform';
      isValid = false;
    }
    
    setValidation(newValidation);
    return isValid;
  };
  
  // Handle save as draft
  const handleSaveAsDraft = () => {
    if (validateForm()) {
      const postData = {
        ...formData,
        status: 'draft'
      };
      
      if (id) {
        dispatch(updatePost({ id, data: postData }));
      } else {
        dispatch(createPost(postData));
      }
    }
  };
  
  // Handle schedule button
  const handleSchedule = () => {
    if (validateForm()) {
      // Save first, then navigate to scheduler
      const postData = {
        ...formData,
        status: 'draft'
      };
      
      if (id) {
        dispatch(updatePost({ id, data: postData })).then(() => {
          navigate(`/content/schedule?postId=${id}`);
        });
      } else {
        dispatch(createPost(postData)).then((action) => {
          if (!action.error) {
            navigate(`/content/schedule?postId=${action.payload.id}`);
          }
        });
      }
    }
  };
  
  // Handle publish now
  const handlePublishNow = () => {
    if (validateForm()) {
      const postData = {
        ...formData,
        status: 'published',
        publishedAt: new Date().toISOString()
      };
      
      if (id) {
        dispatch(updatePost({ id, data: postData }));
      } else {
        dispatch(createPost(postData));
      }
    }
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/content');
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            {id ? 'Edit Post' : 'Create New Post'}
          </Typography>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSaveAsDraft}
            disabled={saving}
            sx={{ mr: 1 }}
          >
            Save Draft
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ScheduleIcon />}
            onClick={handleSchedule}
            disabled={saving}
            sx={{ mr: 1 }}
          >
            Schedule
          </Button>
          
          <Button
            variant="contained"
            startIcon={<PublishIcon />}
            onClick={handlePublishNow}
            disabled={saving}
          >
            Publish Now
          </Button>
        </Box>
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
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Content
              </Typography>
              
              <TextField
                fullWidth
                label="Post Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                error={!!validation.title}
                helperText={validation.title}
                disabled={saving}
              />
              
              <TextField
                fullWidth
                label="Post Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={6}
                error={!!validation.content}
                helperText={validation.content}
                disabled={saving}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Publishing Options
              </Typography>
              
              <FormControl 
                component="fieldset" 
                sx={{ mb: 2 }}
                error={!!validation.platforms}
              >
                <FormLabel component="legend">Platforms</FormLabel>
                
                {validation.platforms && (
                  <Typography variant="caption" color="error">
                    {validation.platforms}
                  </Typography>
                )}
                
                <FormGroup>
                  {platforms.map((platform) => (
                    <FormControlLabel
                      key={platform.id}
                      control={
                        <Checkbox
                          checked={formData.platforms.includes(platform.id)}
                          onChange={handlePlatformChange}
                          value={platform.id}
                          disabled={saving || platform.status !== 'connected'}
                        />
                      }
                      label={
                        <Box component="span" sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: platform.status !== 'connected' ? 'text.disabled' : 'text.primary'
                        }}>
                          {platform.name}
                          {platform.status !== 'connected' && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              (Not connected)
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  ))}
                </FormGroup>
              </FormControl>
              
              <Divider sx={{ my: 2 }} />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.schedule}
                    onChange={handleScheduleToggle}
                    name="schedule"
                    disabled={saving}
                  />
                }
                label="Schedule for later"
              />
              
              {formData.schedule && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Click the "Schedule" button to set a date and time.
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Save indicator */}
      {saving && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Saving changes...
        </Alert>
      )}
    </Box>
  );
};

export default ContentCreator;
