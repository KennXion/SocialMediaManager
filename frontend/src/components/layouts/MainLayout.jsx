import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  CssBaseline, 
  Toolbar, 
  IconButton,
  Typography
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MainMenu from '../navigation/MainMenu';
import UserMenu from '../navigation/UserMenu';
import NotificationsMenu from '../navigation/NotificationsMenu';

// Drawer width
const drawerWidth = 240;

// App Bar styling
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Drawer styling
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// Main content
const MainLayout = () => {
  const [open, setOpen] = useState(true);
  const [anchorNotifications, setAnchorNotifications] = useState(null);
  const [anchorUserMenu, setAnchorUserMenu] = useState(null);
  
  // Toggle drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  // Notifications menu
  const handleNotificationsOpen = (event) => {
    setAnchorNotifications(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setAnchorNotifications(null);
  };
  
  // User menu
  const handleUserMenuOpen = (event) => {
    setAnchorUserMenu(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setAnchorUserMenu(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="absolute" open={open}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Social Media Manager
          </Typography>
          
          {/* Notifications */}
          <IconButton color="inherit" onClick={handleNotificationsOpen}>
            <NotificationsIcon />
          </IconButton>
          <NotificationsMenu 
            anchorEl={anchorNotifications} 
            open={Boolean(anchorNotifications)} 
            onClose={handleNotificationsClose} 
          />
          
          {/* User Menu */}
          <IconButton color="inherit" onClick={handleUserMenuOpen}>
            <AccountCircle />
          </IconButton>
          <UserMenu 
            anchorEl={anchorUserMenu} 
            open={Boolean(anchorUserMenu)} 
            onClose={handleUserMenuClose} 
          />
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <MainMenu />
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
