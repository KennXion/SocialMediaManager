import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid,
  IconButton,
  Chip,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TodayIcon from '@mui/icons-material/Today';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  addMonths,
  subMonths,
  getDay
} from 'date-fns';

// Platform icon component
const PlatformIcon = ({ platform }) => {
  switch (platform?.toLowerCase()) {
    case 'facebook':
      return <FacebookIcon fontSize="small" color="primary" />;
    case 'twitter':
      return <TwitterIcon fontSize="small" color="info" />;
    case 'instagram':
      return <InstagramIcon fontSize="small" color="secondary" />;
    case 'linkedin':
      return <LinkedInIcon fontSize="small" color="primary" />;
    default:
      return <PublicIcon fontSize="small" color="action" />;
  }
};

const CalendarGrid = ({ schedules = [], posts = [], onSelectDate, onEditSchedule }) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get all days for the current month view
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
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
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
    if (onSelectDate) {
      onSelectDate(day);
    }
  };
  
  // Create days for the calendar
  const days = getDaysForCalendar();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <Paper elevation={0} sx={{ p: 2, height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      {/* Calendar header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <Box>
          <IconButton onClick={handlePrevMonth} size="small" aria-label="Previous month">
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={handleToday} size="small" aria-label="Today">
            <TodayIcon />
          </IconButton>
          <IconButton onClick={handleNextMonth} size="small" aria-label="Next month">
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Weekday headers */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {weekdays.map((day) => (
          <Grid item xs key={day} sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
      
      {/* Calendar grid */}
      <Grid container spacing={1} sx={{ height: 'calc(100% - 80px)' }}>
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const daySchedules = getSchedulesForDay(day);
          const hasSchedules = daySchedules.length > 0;
          
          return (
            <Grid item xs key={day.toString()} sx={{ height: 'calc(100% / 6)' }}>
              <Paper
                elevation={0}
                onClick={() => handleSelectDate(day)}
                sx={{
                  height: '100%',
                  p: 1,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  ...(isSelected && {
                    border: `2px solid ${theme.palette.primary.main}`,
                  }),
                  ...(isToday(day) && {
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(144, 202, 249, 0.1)' 
                      : 'rgba(33, 150, 243, 0.08)',
                  }),
                  ...(!isCurrentMonth && {
                    opacity: 0.4,
                  }),
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Day number */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: hasSchedules ? 0.5 : 0
                  }}
                >
                  <Typography 
                    variant="body2" 
                    fontWeight={isToday(day) ? 'bold' : 'normal'}
                    color={
                      isToday(day) 
                        ? 'primary.main'
                        : 'text.primary'
                    }
                  >
                    {format(day, 'd')}
                  </Typography>
                  
                  {hasSchedules && (
                    <Chip 
                      label={daySchedules.length}
                      color="primary"
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        '& .MuiChip-label': {
                          px: 0.8,
                        }
                      }}
                    />
                  )}
                </Box>
                
                {/* Scheduled content */}
                <Box sx={{ overflow: 'auto', flex: 1, mt: 0.5, maxHeight: '100%' }}>
                  {hasSchedules && daySchedules.slice(0, 5).map((schedule) => {
                    const post = getPostDetails(schedule.postId);
                    return (
                      <Box
                        key={schedule.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          p: 0.5,
                          borderRadius: 1,
                          mb: 0.5,
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.02)',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.08)'
                              : 'rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <PlatformIcon platform={post.platform} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                          <Typography 
                            variant="caption" 
                            sx={{
                              fontWeight: 'bold',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {post.title || 'Untitled'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon sx={{ fontSize: '0.75rem', marginRight: '2px' }} />
                            <Typography variant="caption">{formatTime(schedule.scheduledAt)}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                  
                  {daySchedules.length > 5 && (
                    <Typography 
                      variant="caption" 
                      color="primary"
                      sx={{
                        display: 'block',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        p: 0.5,
                      }}
                    >
                      +{daySchedules.length - 5} more
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default CalendarGrid;