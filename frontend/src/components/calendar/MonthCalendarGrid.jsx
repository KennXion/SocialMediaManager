import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  IconButton,
  Tooltip,
  Button,
  MenuItem,
  Select,
  FormControl,
  useTheme
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PublicIcon from '@mui/icons-material/Public';

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from 'date-fns';

// Platform icon component
const PlatformIcon = ({ platform }) => {
  switch (platform?.toLowerCase()) {
    case 'facebook':
      return <FacebookIcon fontSize="small" />;
    case 'twitter':
      return <TwitterIcon fontSize="small" />;
    case 'instagram':
      return <InstagramIcon fontSize="small" />;
    case 'linkedin':
      return <LinkedInIcon fontSize="small" />;
    case 'youtube':
      return <YouTubeIcon fontSize="small" />;
    case 'tiktok':
      return <Typography variant="caption" fontWeight="bold">TikTok</Typography>;
    default:
      return <PublicIcon fontSize="small" />;
  }
};

// Platform background colors
const getPlatformStyle = (platform) => {
  switch (platform?.toLowerCase()) {
    case 'facebook':
      return { 
        backgroundColor: '#e8f0fb',
        borderLeft: '3px solid #4267B2'
      };
    case 'twitter':
      return { 
        backgroundColor: '#e8f5fd',
        borderLeft: '3px solid #1da1f2'
      };
    case 'instagram':
      return { 
        backgroundColor: '#fce3f0',
        borderLeft: '3px solid #c13584'
      };
    case 'linkedin':
      return { 
        backgroundColor: '#e1f0f9',
        borderLeft: '3px solid #0077b5'
      };
    case 'youtube':
      return { 
        backgroundColor: '#ffebee',
        borderLeft: '3px solid #FF0000'
      };
    case 'tiktok':
      return { 
        backgroundColor: '#f0f0f0',
        borderLeft: '3px solid #000000'
      };
    default:
      return { 
        backgroundColor: '#f5f5f5',
        borderLeft: '3px solid #757575'
      };
  }
};

const MonthCalendarGrid = ({ 
  schedules = [], 
  posts = [], 
  onDateSelect, 
  onAddClick 
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  
  // Get days for calendar grid
  const getDaysForCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };
  
  // Get schedules for a specific day
  const getSchedulesForDay = (day) => {
    return schedules.filter(schedule => {
      const scheduleDate = parseISO(schedule.scheduledAt);
      return isSameDay(scheduleDate, day);
    }).sort((a, b) => {
      return new Date(a.scheduledAt) - new Date(b.scheduledAt);
    });
  };
  
  // Get post details by ID
  const getPostDetails = (postId) => {
    return posts.find(post => post.id === postId) || {};
  };
  
  // Format time
  const formatTime = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'h:mm a');
    } catch (error) {
      return '';
    }
  };
  
  // Handle previous month
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Handle next month
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Handle reset to today
  const handleToday = () => {
    setCurrentMonth(new Date());
    handleSelectDate(new Date());
  };
  
  // Handle date selection
  const handleSelectDate = (day) => {
    setSelectedDate(day);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };
  
  // Handle add button click
  const handleAddClick = (day, e) => {
    e.stopPropagation();
    if (onAddClick) {
      onAddClick(day);
    }
  };
  
  // Handle view mode change
  const handleViewModeChange = (e) => {
    setViewMode(e.target.value);
  };
  
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = getDaysForCalendar();
  
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      {/* Calendar Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handlePrevMonth} size="small">
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h5" sx={{ mx: 2, fontWeight: 500 }}>
            {format(currentMonth, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRightIcon />
          </IconButton>
        </Box>
        
        <Box>
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleToday}
            startIcon={<TodayIcon />}
            sx={{ mr: 1 }}
          >
            Today
          </Button>
          
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={viewMode}
              onChange={handleViewModeChange}
              variant="outlined"
            >
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="list">List</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {/* Weekday Headers */}
      <Grid container sx={{ mb: 1 }}>
        {weekdays.map((day) => (
          <Grid item xs key={day} sx={{ textAlign: 'center' }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 500, 
                color: theme.palette.text.secondary 
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
      
      {/* Calendar Grid */}
      <Grid container spacing={1}>
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelectedDay = isSameDay(day, selectedDate);
          const daySchedules = getSchedulesForDay(day);
          const isTodayDate = isToday(day);
          
          return (
            <Grid item xs key={day.toString()}>
              <Paper
                elevation={0}
                onClick={() => handleSelectDate(day)}
                sx={{
                  height: 120,
                  border: isSelectedDay 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 1,
                  backgroundColor: !isCurrentMonth
                    ? theme.palette.mode === 'dark' 
                      ? 'rgba(0, 0, 0, 0.1)'
                      : 'rgba(0, 0, 0, 0.02)'
                    : theme.palette.background.paper,
                  opacity: !isCurrentMonth ? 0.7 : 1,
                  cursor: 'pointer',
                  ...(isTodayDate && {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(144, 202, 249, 0.1)' 
                      : 'rgba(33, 150, 243, 0.06)',
                  }),
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.03)',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Day Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 0.5
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: isTodayDate ? 'bold' : 'normal',
                      color: isTodayDate
                        ? theme.palette.primary.main
                        : !isCurrentMonth
                          ? theme.palette.text.disabled
                          : theme.palette.text.primary
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>
                  
                  <IconButton 
                    size="small" 
                    sx={{ 
                      p: 0.2,
                      color: theme.palette.primary.main,
                      opacity: isCurrentMonth ? 1 : 0.5
                    }}
                    onClick={(e) => handleAddClick(day, e)}
                  >
                    <AddCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                {/* Scheduled Items */}
                <Box sx={{ overflow: 'auto', flex: 1 }}>
                  {daySchedules.map(schedule => {
                    const post = getPostDetails(schedule.postId);
                    const platformStyles = getPlatformStyle(post.platform);
                    
                    return (
                      <Box
                        key={schedule.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mb: 0.5,
                          py: 0.3,
                          px: 0.5,
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          borderRadius: 0.5,
                          ...platformStyles
                        }}
                      >
                        <Box sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
                          <PlatformIcon platform={post.platform} />
                        </Box>
                        <Typography 
                          variant="caption" 
                          noWrap
                          sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {post.title || 'Untitled'}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default MonthCalendarGrid;