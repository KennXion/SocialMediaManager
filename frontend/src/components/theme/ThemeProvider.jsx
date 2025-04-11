import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';

// Import base theme
import baseTheme from '../../theme';

const ThemeProvider = ({ children }) => {
  // Get theme from Redux state
  const themeMode = useSelector((state) => state.ui.theme);
  
  // Create theme based on current mode
  const theme = useMemo(() => {
    // Deep clone the base theme
    const newTheme = { ...baseTheme };
    
    // Apply dark mode styles if theme is 'dark'
    if (themeMode === 'dark') {
      newTheme.palette = {
        ...newTheme.palette,
        mode: 'dark',
        primary: {
          ...newTheme.palette.primary
        },
        secondary: {
          ...newTheme.palette.secondary
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e'
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
          disabled: 'rgba(255, 255, 255, 0.5)'
        },
        action: {
          active: 'rgba(255, 255, 255, 0.7)',
          hover: 'rgba(255, 255, 255, 0.1)',
          selected: 'rgba(255, 255, 255, 0.2)',
          disabled: 'rgba(255, 255, 255, 0.3)',
          disabledBackground: 'rgba(255, 255, 255, 0.12)'
        }
      };
      
      // Add component overrides for dark mode
      if (!newTheme.components) {
        newTheme.components = {};
      }
      
      // Override icon buttons in dark mode
      newTheme.components.MuiIconButton = {
        ...newTheme.components.MuiIconButton,
        styleOverrides: {
          root: {
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)'
            }
          }
        }
      };
      
      // Override SVG icons in dark mode
      newTheme.components.MuiSvgIcon = {
        ...newTheme.components.MuiSvgIcon,
        styleOverrides: {
          root: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }
      };
    }
    
    return createTheme(newTheme);
  }, [themeMode]);
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
