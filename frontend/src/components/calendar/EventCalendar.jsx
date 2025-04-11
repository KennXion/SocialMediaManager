import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { 
  Paper, 
  Button, 
  Box, 
  Typography, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

// Date-fns localizer setup
const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

// Custom toolbar component
const CustomToolbar = ({ label, onNavigate, onView, views }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center',
        mb: 2,
        gap: 1
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
          variant="outlined" 
          onClick={() => onNavigate('PREV')}
          size="small"
        >
          Previous
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => onNavigate('TODAY')}
          size="small"
        >
          Today
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => onNavigate('NEXT')}
          size="small"
        >
          Next
        </Button>
      </Box>
      
      <Typography variant="h6" sx={{ textAlign: isMobile ? 'center' : 'left' }}>
        {label}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        justifyContent: isMobile ? 'center' : 'flex-end' 
      }}>
        {views.map(view => (
          <Button 
            key={view} 
            variant="outlined"
            onClick={() => onView(view)}
            size="small"
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

// Custom event component
const CustomEvent = ({ event }) => {
  const theme = useTheme();
  const platformColors = {
    'facebook': theme.palette.info.main,
    'twitter': theme.palette.primary.main,
    'instagram': theme.palette.secondary.main,
    'linkedin': theme.palette.success.main,
    'youtube': theme.palette.error.main,
    'tiktok': theme.palette.grey[800],
    'default': theme.palette.grey[600]
  };
  
  const color = platformColors[event.platform] || platformColors.default;
  
  return (
    <Box 
      sx={{ 
        height: '100%', 
        backgroundColor: `${color}20`, // 20% opacity
        borderLeft: `4px solid ${color}`,
        p: 0.5,
        borderRadius: '0 4px 4px 0',
        overflow: 'hidden',
        fontSize: event.allDay ? '0.85rem' : '0.75rem',
        fontWeight: 500
      }}
    >
      <Typography 
        variant="caption" 
        component="div" 
        sx={{ 
          fontWeight: 'bold',
          color: theme.palette.getContrastText(`${color}20`),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {event.title}
      </Typography>
      {!event.allDay && (
        <Typography 
          variant="caption" 
          component="div" 
          color="text.secondary"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {event.platform && `${event.platform.charAt(0).toUpperCase() + event.platform.slice(1)}`}
        </Typography>
      )}
    </Box>
  );
};

// Day cell component
const CustomDayCell = ({ children, value, ...props }) => {
  const theme = useTheme();
  
  return (
    <div
      {...props}
      style={{
        ...props.style,
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        height: '100%'
      }}
    >
      <div style={{ height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

const EventCalendar = ({ events = [], onEventClick, onRangeChange, onSelectSlot }) => {
  const theme = useTheme();
  const [view, setView] = useState('month');
  
  const calendarEvents = events.map(event => ({
    ...event,
    start: new Date(event.scheduledAt),
    end: new Date(event.scheduledAt),
    allDay: false,
  }));
  
  // Custom event styling
  const eventPropGetter = (event) => {
    const platformColors = {
      'facebook': theme.palette.info.main,
      'twitter': theme.palette.primary.main, 
      'instagram': theme.palette.secondary.main,
      'linkedin': theme.palette.success.main,
      'youtube': theme.palette.error.main,
      'tiktok': theme.palette.grey[800],
      'default': theme.palette.grey[600]
    };
    
    const color = platformColors[event.platform] || platformColors.default;
    
    return {
      style: {
        backgroundColor: `${color}20`,
        color: theme.palette.getContrastText(`${color}20`),
        borderLeft: `3px solid ${color}`,
        borderRight: '0px',
        borderTop: '0px',
        borderBottom: '0px',
        borderRadius: '2px',
      }
    };
  };
  
  // Custom slot styling
  const slotPropGetter = (date) => {
    return {
      style: {
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider
      }
    };
  };
  
  return (
    <Paper
      elevation={1}
      sx={{
        height: 'calc(100vh - 220px)', // Adjust the height as needed
        p: 2,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day', 'agenda']}
        step={30}
        defaultView="month"
        view={view}
        onView={(newView) => setView(newView)}
        eventPropGetter={eventPropGetter}
        slotPropGetter={slotPropGetter}
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent,
          dateCellWrapper: CustomDayCell
        }}
        selectable
        onSelectEvent={onEventClick}
        onRangeChange={onRangeChange}
        onSelectSlot={onSelectSlot}
        popup
      />
    </Paper>
  );
};

export default EventCalendar;