import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import { format, parseISO, isSameDay } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PublicIcon from '@mui/icons-material/Public';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Platform icon component
const PlatformIcon = ({ platform }) => {
  switch (platform?.toLowerCase()) {
    case 'facebook':
      return <FacebookIcon color="primary" />;
    case 'twitter':
      return <TwitterIcon color="info" />;
    case 'instagram':
      return <InstagramIcon color="secondary" />;
    case 'linkedin':
      return <LinkedInIcon color="primary" />;
    default:
      return <PublicIcon color="action" />;
  }
};

const DayDetailView = ({ 
  selectedDate, 
  schedules = [], 
  posts = [],
  onEdit,
  onDelete 
}) => {
  const theme = useTheme();
  
  if (!selectedDate) {
    return null;
  }
  
  // Filter schedules for selected date
  const daySchedules = schedules.filter(schedule => {
    const scheduleDate = parseISO(schedule.scheduledAt);
    return isSameDay(scheduleDate, selectedDate);
  });
  
  // Sort schedules by time
  const sortedSchedules = [...daySchedules].sort((a, b) => {
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
  });
  
  // Get post details by ID
  const getPostDetails = (postId) => {
    return posts.find(post => post.id === postId) || {};
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'h:mm a');
    } catch (error) {
      return '';
    }
  };
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mt: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </Typography>
        </Box>
        
        <Chip 
          label={`${sortedSchedules.length} post${sortedSchedules.length !== 1 ? 's' : ''} scheduled`}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>
      
      {sortedSchedules.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body1">
            No posts scheduled for this day
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Click the "Schedule Post" button to add content
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: '100%' }}>
          {sortedSchedules.map((schedule, index) => {
            const post = getPostDetails(schedule.postId);
            
            return (
              <React.Fragment key={schedule.id}>
                {index > 0 && <Divider component="li" variant="inset" />}
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <PlatformIcon platform={post.platform} />
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" component="span">
                          {post.title || 'Untitled Post'}
                        </Typography>
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={formatTime(schedule.scheduledAt)}
                          size="small"
                          sx={{ ml: 2 }}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'block', mt: 1 }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {post.excerpt || post.content?.substring(0, 120)}
                          {(post.excerpt?.length > 120 || post.content?.length > 120) ? '...' : ''}
                        </Typography>
                        
                        {post.platform && (
                          <Chip
                            label={post.platform}
                            size="small"
                            sx={{ mt: 1 }}
                            color="default"
                            variant="outlined"
                          />
                        )}
                      </React.Fragment>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="edit"
                      onClick={() => onEdit && onEdit(schedule.id)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => onDelete && onDelete(schedule.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default DayDetailView;