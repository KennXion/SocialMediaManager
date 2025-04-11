import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  IconButton
} from '@mui/material';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import { clearNotifications, removeNotification } from '../../store/slices/uiSlice';

// Get icon based on notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon color="success" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'info':
    default:
      return <InfoIcon color="info" />;
  }
};

// Format notification time
const formatTime = (timestamp) => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  
  // Time difference in milliseconds
  const diff = now - notificationTime;
  
  // Convert to minutes
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  } else {
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
};

// Notifications menu component
const NotificationsMenu = ({ anchorEl, open, onClose }) => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.ui);
  
  // Handle clear all
  const handleClearAll = () => {
    dispatch(clearNotifications());
    onClose();
  };
  
  // Handle dismiss notification
  const handleDismiss = (id, e) => {
    e.stopPropagation();
    dispatch(removeNotification(id));
  };
  
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          width: 320,
          maxHeight: 400,
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        px: 2, 
        py: 1 
      }}>
        <Typography variant="h6">Notifications</Typography>
        {notifications.length > 0 && (
          <IconButton size="small" onClick={handleClearAll}>
            <ClearAllIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      {/* Notification items */}
      {notifications.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <NotificationImportantIcon color="disabled" sx={{ fontSize: 40 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            No notifications
          </Typography>
        </Box>
      ) : (
        notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={onClose}>
            <ListItemIcon>
              {getNotificationIcon(notification.type)}
            </ListItemIcon>
            <ListItemText 
              primary={notification.message} 
              secondary={formatTime(notification.id)}
            />
            <IconButton size="small" onClick={(e) => handleDismiss(notification.id, e)}>
              <ClearAllIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))
      )}
    </Menu>
  );
};

export default NotificationsMenu;
