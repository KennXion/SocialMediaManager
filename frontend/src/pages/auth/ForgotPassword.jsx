import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

const ForgotPassword = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [validation, setValidation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value);
    setValidation('');
    setError(null);
  };
  
  // Validate form
  const validateForm = () => {
    if (!email) {
      setValidation('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidation('Invalid email format');
      return false;
    }
    return true;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      // Simulate API call for password reset
      setTimeout(() => {
        // For demo, always succeed
        setIsLoading(false);
        setSuccess(true);
      }, 1500);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: 'sm', mx: 'auto' }}>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Forgot Password
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" paragraph>
        Enter your email address and we'll send you a link to reset your password
      </Typography>
      
      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Success message */}
      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          A password reset link has been sent to your email address. Please check your inbox.
        </Alert>
      ) : (
        <>
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
            value={email}
            onChange={handleChange}
            error={!!validation}
            helperText={validation}
            disabled={isLoading}
          />
          
          {/* Submit button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </>
      )}
      
      {/* Links */}
      <Box textAlign="center" mt={2}>
        <Link component={RouterLink} to="/login" variant="body2">
          Remember your password? Sign in
        </Link>
      </Box>
      
      {/* Demo mode notice */}
      <Box mt={3}>
        <Alert severity="info">
          <Typography variant="body2">
            This is a demo application. Password reset is simulated.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
