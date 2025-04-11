import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Badge, 
  Tooltip, 
  IconButton,
  useTheme
} from '@mui/material';
import { 
  DateCalendar, 
  PickersDay,
  LocalizationProvider 
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TodayIcon from '@mui/icons-material/Today';
import { format, isSameDay, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

// Custom Day Component with badges for scheduled content
const CustomDay = (props) => {
  const { 
    day, 
    schedules = [], 
    selectedDay,
    setSelectedDay,
    ...other 
  } = props;
  
  const theme = useTheme();
  
  // Find schedules for this day
  const schedulesForDay = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.scheduledAt);
    return isSameDay(scheduleDate, day);
  });
  
  // Check if this day has schedules
  const hasSchedules = schedulesForDay.length > 0;

  // Check if this day is selected
  const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
  
  // Get content for tooltip
  const getTooltipContent = () => {
    if (!hasSchedules) return '';
    return (
      <>
        <Typography variant="subtitle2">
          {format(day, 'MMMM d, yyyy')}
        </Typography>
        <Typography variant="body2">
          {schedulesForDay.length} post{schedulesForDay.length !== 1 ? 's' : ''}
        </Typography>
      </>
    );
  };
  
  // Handle day click
  const handleDayClick = () => {
    setSelectedDay(day);
  };
  
  return (
    <Tooltip title={getTooltipContent()} arrow placement="top" disableHoverListener={!hasSchedules}>
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={hasSchedules ? schedulesForDay.length : 0}
        color="primary"
      >
        <PickersDay 
          {...other} 
          day={day} 
          selected={isSelected}
          onClick={handleDayClick}
          sx={{
            ...(hasSchedules && {
              backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.primary.light + '40',
              color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.light
              }
            })
          }}
        />
      </Badge>
    </Tooltip>
  );
};

const CalendarView = ({ schedules = [], onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  
  // Filter schedules for current month view
  const monthSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.scheduledAt);
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    return isWithinInterval(scheduleDate, { start: monthStart, end: monthEnd });
  });
  
  // Handle month change
  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };
  
  // Handle previous month
  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };
  
  // Handle next month
  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };
  
  // Handle today
  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDay(new Date());
  };
  
  // Notify parent when selected day changes
  useEffect(() => {
    if (selectedDay && onDateSelect) {
      onDateSelect(selectedDay);
    }
  }, [selectedDay, onDateSelect]);
  
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Calendar View</Typography>
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
      
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          value={selectedDay}
          onChange={(newDate) => setSelectedDay(newDate)}
          onMonthChange={handleMonthChange}
          renderDay={(day, _selectedDays, pickersDayProps) => (
            <CustomDay 
              {...pickersDayProps}
              day={day}
              schedules={schedules}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          )}
          sx={{ 
            width: '100%', 
            '& .MuiDayCalendar-monthContainer': {
              overflow: 'visible'
            }
          }}
        />
      </LocalizationProvider>
    </Paper>
  );
};

export default CalendarView;
