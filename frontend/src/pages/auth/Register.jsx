import React, { useState } from 'react';
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
import { register, resetAuthError } from '../../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  // Validation state
  const [validation, setValidation] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: ''
  });
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'agreeTerms' ? checked : value
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
    const newValidation = { 
      full_name: '', 
      email: '', 
      password: '', 
      confirmPassword: '',
      agreeTerms: ''
    };
    
    // Validate full name
    if (!formData.full_name.trim()) {
      newValidation.full_name = 'Full name is required';
      isValid = false;
    }
    
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
    } else if (formData.password.length < 8) {
      newValidation.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Validate password confirmation
    if (!formData.confirmPassword) {
      newValidation.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newValidation.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    // Validate terms agreement
    if (!formData.agreeTerms) {
      newValidation.agreeTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }
    
    setValidation(newValidation);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(register({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      }));
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Create Account
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
        Create a free account to get started
      </Typography>
      
      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Full name field */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="full_name"
        label="Full Name"
        name="full_name"
        autoComplete="name"
        autoFocus
        value={formData.full_name}
        onChange={handleChange}
        error={!!validation.full_name}
        helperText={validation.full_name}
        disabled={isLoading}
      />
      
      {/* Email field */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
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
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        error={!!validation.password}
        helperText={validation.password}
        disabled={isLoading}
      />
      
      {/* Confirm password field */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!validation.confirmPassword}
        helperText={validation.confirmPassword}
        disabled={isLoading}
      />
      
      {/* Terms agreement checkbox */}
      <FormControlLabel
        control={
          <Checkbox 
            name="agreeTerms" 
            color="primary" 
            checked={formData.agreeTerms} 
            onChange={handleChange} 
            disabled={isLoading}
          />
        }
        label="I agree to the terms and conditions"
      />
      {validation.agreeTerms && (
        <Typography variant="caption" color="error" display="block">
          {validation.agreeTerms}
        </Typography>
      )}
      
      {/* Submit button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
      
      {/* Links */}
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link component={RouterLink} to="/login" variant="body2">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
      
      {/* Demo mode notice */}
      <Box mt={3}>
        <Alert severity="info">
          <Typography variant="body2">
            This is a demo application. Registration is simulated.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default Register;
