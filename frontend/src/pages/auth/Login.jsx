import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { login, resetAuthError } from '../../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  // Form state
  const [formData, setFormData] = useState({
    email: 'demo@example.com', // Pre-filled for demo
    password: 'password123', // Pre-filled for demo
    rememberMe: false
  });
  
  // Validation state
  const [validation, setValidation] = useState({
    email: '',
    password: ''
  });
  
  // Auto submit form for demo version
  useEffect(() => {
    // Uncomment this to auto-login in development
    // if (process.env.NODE_ENV === 'development') {
    //   dispatch(login({
    //     email: formData.email,
    //     password: formData.password
    //   }));
    // }
    
    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, [dispatch]);
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
    
    // Clear validation errors on input change
    if (validation[name]) {
      setValidation({
        ...validation,
        [name]: ''
      });
    }
    
    // Clear auth error on input change
    if (error) {
      dispatch(resetAuthError());
    }
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newValidation = { email: '', password: '' };
    
    // Validate email
    if (!formData.email) {
      newValidation.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newValidation.email = 'Invalid email format';
      isValid = false;
    }
    
    // Validate password
    if (!formData.password) {
      newValidation.password = 'Password is required';
      isValid = false;
    }
    
    setValidation(newValidation);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(login({
        email: formData.email,
        password: formData.password
      }));
      
      // Save in localStorage if remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Log In
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
        Enter your credentials to access your account
      </Typography>
      
      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Email field */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
        error={!!validation.email}
        helperText={validation.email}
        disabled={isLoading}
      />
      
      {/* Password field */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={!!validation.password}
        helperText={validation.password}
        disabled={isLoading}
      />
      
      {/* Remember me checkbox */}
      <FormControlLabel
        control={
          <Checkbox 
            name="rememberMe" 
            color="primary" 
            checked={formData.rememberMe} 
            onChange={handleChange} 
            disabled={isLoading}
          />
        }
        label="Remember me"
      />
      
      {/* Submit button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Log In'}
      </Button>
      
      {/* Links */}
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to="/register" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
      
      {/* Demo mode notice */}
      <Box mt={3}>
        <Alert severity="info">
          <Typography variant="body2">
            This is a demo application. Use the pre-filled credentials to log in.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default Login;
