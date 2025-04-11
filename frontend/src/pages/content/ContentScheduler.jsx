import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Divider,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ViewListIcon from '@mui/icons-material/ViewList';
import DoneIcon from '@mui/icons-material/Done';

// Import calendar components
import EventCalendar from '../../components/calendar/EventCalendar';

import { fetchPosts, fetchPost, updatePost } from '../../store/slices/postSlice';
import { fetchSchedules, createSchedule, updateSchedule, deleteSchedule } from '../../store/slices/scheduleSlice';

const ContentScheduler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get query params
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get('postId');
  
  // Get data from Redux
  const { posts, currentPost, loading: postsLoading } = useSelector((state) => state.posts);
  const schedulesState = useSelector((state) => state.schedules);
  
  // Handle possible null or undefined schedules with defensive programming
  const schedules = Array.isArray(schedulesState.schedules) ? schedulesState.schedules : [];
  const { saving: scheduleSaving, loading: scheduleLoading, error: scheduleError } = schedulesState;
  
  // Local state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [schedulingError, setSchedulingError] = useState('');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  
  // Fetch data on component mount
  useEffect(() => {
    // Fetch posts and schedules
    dispatch(fetchPosts());
    dispatch(fetchSchedules());
    
    // If post ID is provided in query params, fetch specific post
    if (postId) {
      dispatch(fetchPost(postId));
    }
  }, [dispatch, postId]);
  
  // Set selected post when current post changes
  useEffect(() => {
    if (postId && currentPost) {
      setSelectedPost(postId);
    }
  }, [postId, currentPost]);
  
  // Handle view mode change
  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };
  
  // Handle calendar date selection
  const handleCalendarDateSelect = (date) => {
    setSelectedDate(date);
  };
  
  // Handle event click
  const handleEventClick = (event) => {
    handleOpenDialog(event.id);
  };
  
  // Handle slot selection
  const handleSlotSelect = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    handleOpenDialog();
  };
  
  // Handle range change
  const handleRangeChange = (range) => {
    // Could be used to fetch events for the visible range
    console.log('Range changed:', range);
  };
  
  // Handle date change for date picker
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  
  // Handle post selection
  const handlePostSelection = (e) => {
    setSelectedPost(e.target.value);
  };
  
  // Open schedule dialog
  const handleOpenDialog = (scheduleId) => {
    if (scheduleId) {
      // If editing an existing schedule
      const schedule = schedules.find(s => s.id === scheduleId);
      if (schedule) {
        setEditingSchedule(schedule);
        setSelectedPost(schedule.postId);
        setSelectedDate(new Date(schedule.scheduledAt));
      }
    } else {
      // If creating a new schedule
      setEditingSchedule(null);
    }
    
    setDialogOpen(true);
  };
  
  // Close schedule dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSchedule(null);
    setSchedulingError('');
    
    // Reset selected post if not provided in URL
    if (!postId) {
      setSelectedPost('');
    }
  };
  
  // Handle scheduling
  const handleSchedule = () => {
    // Validate form
    if (!selectedPost) {
      setSchedulingError('Please select a post');
      return;
    }
    
    if (!selectedDate) {
      setSchedulingError('Please select a date and time');
      return;
    }
    
    const scheduleData = {
      postId: selectedPost,
      scheduledAt: selectedDate.toISOString()
    };
    
    if (editingSchedule) {
      // Update existing schedule
      dispatch(updateSchedule({ id: editingSchedule.id, data: scheduleData }))
        .then((action) => {
          if (!action.error) {
            // Also update post status
            dispatch(updatePost({ 
              id: selectedPost, 
              data: { 
                status: 'scheduled',
                scheduledFor: selectedDate.toISOString()
              } 
            }));
            handleCloseDialog();
          }
        });
    } else {
      // Create new schedule
      dispatch(createSchedule(scheduleData))
        .then((action) => {
          if (!action.error) {
            // Also update post status
            dispatch(updatePost({ 
              id: selectedPost, 
              data: { 
                status: 'scheduled',
                scheduledFor: selectedDate.toISOString()
              } 
            }));
            handleCloseDialog();
          }
        });
    }
  };
  
  // Handle delete schedule
  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this scheduled post?')) {
      dispatch(deleteSchedule(scheduleId));
    }
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/content');
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Get post title by ID
  const getPostTitle = (postId) => {
    const post = posts.find(p => p.id === postId);
    return post ? post.title : 'Unknown Post';
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
            Content Scheduler
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Schedule Post
        </Button>
      </Box>
      
      {/* Error message */}
      {scheduleError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {scheduleError}
        </Alert>
      )}
      
      {/* View mode tabs */}
      <Tabs
        value={viewMode}
        onChange={handleViewModeChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab 
          value="calendar" 
          label="Calendar View" 
          icon={<CalendarTodayIcon />} 
          iconPosition="start"
        />
        <Tab 
          value="list" 
          label="List View" 
          icon={<ViewListIcon />} 
          iconPosition="start"
        />
      </Tabs>
      
      {/* Loading indicator */}
      {(postsLoading || scheduleLoading) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : viewMode === 'calendar' ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <EventCalendar
              events={schedules.map(schedule => {
                // Find the associated post
                const post = posts.find(p => p.id === schedule.postId) || {};
                
                return {
                  ...schedule,
                  title: post.title || 'Untitled Post',
                  platform: post.platform || 'default'
                };
              })}
              onEventClick={handleEventClick}
              onSelectSlot={handleSlotSelect}
              onRangeChange={handleRangeChange}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Scheduled Posts
              </Typography>
              
              {schedules.length === 0 ? (
                <Alert severity="info">
                  No posts are currently scheduled. Click "Schedule Post" to schedule a post.
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {schedules.map((schedule) => (
                    <Grid item xs={12} sm={6} md={4} key={schedule.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(schedule.scheduledAt)}
                            </Typography>
                          </Box>
                          
                          <Typography variant="h6" gutterBottom>
                            {getPostTitle(schedule.postId)}
                          </Typography>
                          
                          <Box sx={{ mt: 2 }}>
                            <Chip 
                              label="Scheduled" 
                              color="primary" 
                              size="small" 
                              icon={<DoneIcon />} 
                            />
                          </Box>
                        </CardContent>
                        
                        <CardActions>
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenDialog(schedule.id)}
                            title="Edit Schedule"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            title="Delete Schedule"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Schedule Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSchedule ? 'Edit Schedule' : 'Schedule Post'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={schedulingError === 'Please select a post'}>
                <InputLabel>Select Post</InputLabel>
                <Select
                  value={selectedPost}
                  onChange={handlePostSelection}
                  label="Select Post"
                  disabled={!!postId || scheduleSaving}
                >
                  <MenuItem value="">
                    <em>Select a post</em>
                  </MenuItem>
                  {posts
                    .filter(post => post.status !== 'published')
                    .map((post) => (
                      <MenuItem key={post.id} value={post.id}>
                        {post.title}
                      </MenuItem>
                    ))}
                </Select>
                {schedulingError === 'Please select a post' && (
                  <Typography variant="caption" color="error">
                    {schedulingError}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Schedule Date & Time"
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(props) => (
                    <TextField 
                      {...props} 
                      fullWidth 
                      error={schedulingError === 'Please select a date and time'} 
                      helperText={schedulingError === 'Please select a date and time' ? schedulingError : props.helperText}
                    />
                  )}
                  disabled={scheduleSaving}
                  minDateTime={new Date()}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={scheduleSaving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSchedule} 
            variant="contained" 
            disabled={scheduleSaving || !selectedPost}
          >
            {scheduleSaving ? <CircularProgress size={24} /> : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentScheduler;