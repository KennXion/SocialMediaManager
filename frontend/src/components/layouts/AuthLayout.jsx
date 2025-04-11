import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Style components
const AuthBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  maxWidth: 500,
  width: '100%',
}));

const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

// Auth layout component
const AuthLayout = () => {
  return (
    <AuthBackground>
      <Container maxWidth="sm">
        <AuthPaper>
          <Logo>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
              Social Media Manager
            </Typography>
          </Logo>
          <Outlet />
        </AuthPaper>
      </Container>
    </AuthBackground>
  );
};

export default AuthLayout;
