import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip
} from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ContentIcon from '@mui/icons-material/Article';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PlatformIcon from '@mui/icons-material/Language';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import AiIcon from '@mui/icons-material/Psychology';

// Main menu component
const MainMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Menu items
  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <DashboardIcon /> 
    },
    { 
      path: '/content', 
      label: 'Content', 
      icon: <ContentIcon /> 
    },
    { 
      path: '/content/schedule', 
      label: 'Schedule', 
      icon: <ScheduleIcon /> 
    },
    { 
      path: '/platforms', 
      label: 'Platforms', 
      icon: <PlatformIcon /> 
    },
    { 
      path: '/analytics', 
      label: 'Analytics', 
      icon: <AnalyticsIcon /> 
    },
    { 
      path: '/ai-generator', 
      label: 'AI Assistant', 
      icon: <AiIcon /> 
    },
  ];
  
  // Settings menu items
  const settingsItems = [
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: <SettingsIcon /> 
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: <PersonIcon /> 
    },
  ];
  
  // Check if menu item is active
  const isActive = (path) => location.pathname === path;
  
  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  return (
    <>
      <List component="nav">
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isActive(item.path)}
            onClick={() => handleNavigation(item.path)}
          >
            <Tooltip title={item.label} placement="right">
              <ListItemIcon>{item.icon}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        {settingsItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isActive(item.path)}
            onClick={() => handleNavigation(item.path)}
          >
            <Tooltip title={item.label} placement="right">
              <ListItemIcon>{item.icon}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
};

export default MainMenu;
