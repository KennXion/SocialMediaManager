import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { format, isSameDay } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PublicIcon from '@mui/icons-material/Public';

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

const ScheduleList = ({ 
  selectedDate, 
  schedules = [], 
  posts = [], 
  onEdit, 
  onDelete 
}) => {
  const theme = useTheme();
  
  // Filter schedules for selected date
  const daySchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.scheduledAt);
    return selectedDate && isSameDay(scheduleDate, selectedDate);
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
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };
  
  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6">
            Scheduled Posts
          </Typography>
          {selectedDate && (
            <Typography variant="subtitle1" color="text.secondary">
              {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
          )}
        </Box>
        
        <Chip 
          icon={<EventNoteIcon />} 
          label={`${sortedSchedules.length} post${sortedSchedules.length !== 1 ? 's' : ''}`}
          color="primary"
          variant="outlined"
        />
      </Box>
      
      {sortedSchedules.length === 0 ? (
        <Box sx={{ 
          py: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          color: 'text.secondary'
        }}>
          <EventNoteIcon sx={{ fontSize: 48, mb: 2, opacity: 0.7 }} />
          <Typography variant="body1">
            No posts scheduled for this day
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: '100%' }}>
          {sortedSchedules.map((schedule, index) => {
            const post = getPostDetails(schedule.postId);
            
            return (
              <React.Fragment key={schedule.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <PlatformIcon platform={post.platform} />
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={post.title || 'Untitled Post'}
                    secondary={
                      <React.Fragment>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: theme.palette.text.secondary }} />
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            {formatTime(schedule.scheduledAt)}
                          </Typography>
                        </Box>
                        
                        {post.excerpt && (
                          <Typography
                            sx={{ display: 'block', mt: 1 }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            {post.excerpt.slice(0, 60)}
                            {post.excerpt.length > 60 ? '...' : ''}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="edit"
                      onClick={() => onEdit && onEdit(schedule.id)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => onDelete && onDelete(schedule.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
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

export default ScheduleList;
