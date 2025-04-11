import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LinkIcon from '@mui/icons-material/Link';
import { fetchPlatforms, connectPlatform } from '../../store/slices/platformSlice';

// Platform information
const platformInfo = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <TwitterIcon sx={{ fontSize: 40 }} />,
    description: 'Connect your Twitter account to schedule tweets and track engagement.',
    requiresAPI: true,
    steps: [
      'Create a Twitter Developer account',
      'Create a Twitter app and get API credentials',
      'Enter your API keys and authorize the connection'
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <InstagramIcon sx={{ fontSize: 40 }} />,
    description: 'Connect your Instagram account to schedule posts and track followers.',
    requiresAPI: false,
    steps: [
      'Log in to your Instagram account',
      'Authorize access for the Social Media Manager',
      'Set content permissions'
    ]
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <FacebookIcon sx={{ fontSize: 40 }} />,
    description: 'Connect your Facebook pages to schedule posts and track engagement.',
    requiresAPI: false,
    steps: [
      'Log in to your Facebook account',
      'Select the pages you want to manage',
      'Set posting and analytics permissions'
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <LinkedInIcon sx={{ fontSize: 40 }} />,
    description: 'Connect your LinkedIn profile or pages to share professional content.',
    requiresAPI: false,
    steps: [
      'Log in to your LinkedIn account',
      'Choose profile or pages to connect',
      'Set permissions for posting and analytics'
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <YouTubeIcon sx={{ fontSize: 40 }} />,
    description: 'Connect your YouTube channel to schedule videos and track analytics.',
    requiresAPI: true,
    steps: [
      'Create a Google Cloud project',
      'Enable the YouTube Data API',
      'Set up OAuth credentials and authorize access'
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: <MusicNoteIcon sx={{ fontSize: 40 }} />,
    description: 'Connect your TikTok account to schedule videos and track performance.',
    requiresAPI: true,
    steps: [
      'Apply for TikTok Developer account',
      'Create a TikTok app and get API credentials',
      'Enter your API keys and authorize the connection'
    ]
  }
];

const PlatformConnect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get query params
  const queryParams = new URLSearchParams(location.search);
  const preSelectedPlatform = queryParams.get('platform');
  
  // Get data from Redux
  const { connectingPlatform, error } = useSelector((state) => state.platforms);
  
  // Local state
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    refreshToken: '',
    handle: ''
  });
  const [connectSuccess, setConnectSuccess] = useState(false);
  
  // Set pre-selected platform
  useEffect(() => {
    if (preSelectedPlatform) {
      const platform = platformInfo.find(p => p.id === preSelectedPlatform);
      if (platform) {
        setSelectedPlatform(platform);
      }
    }
  }, [preSelectedPlatform]);
  
  // Handle platform selection
  const handleSelectPlatform = (platform) => {
    setSelectedPlatform(platform);
    setActiveStep(0);
    setConnectSuccess(false);
  };
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    if (activeStep === 0 && selectedPlatform) {
      setSelectedPlatform(null);
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };
  
  // Handle connect platform
  const handleConnect = () => {
    if (selectedPlatform) {
      // Prepare platform data
      const platformData = {
        platform: selectedPlatform.id,
        handle: formData.handle,
        // Add other credentials if needed
        credentials: {
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret,
          accessToken: formData.accessToken,
          refreshToken: formData.refreshToken
        }
      };
      
      // Connect platform
      dispatch(connectPlatform(platformData))
        .then((action) => {
          if (!action.error) {
            setConnectSuccess(true);
          }
        });
    }
  };
  
  // Handle navigation back to platforms list
  const handleNavigateBack = () => {
    navigate('/platforms');
  };
  
  // Handle done
  const handleDone = () => {
    navigate('/platforms');
  };
  
  // Render platform selection
  const renderPlatformSelection = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Select a Platform to Connect
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {platformInfo.map((platform) => (
          <Grid item xs={12} sm={6} md={4} key={platform.id}>
            <Card>
              <CardActionArea onClick={() => handleSelectPlatform(platform)}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: 'primary.main', mr: 2 }}>
                      {platform.icon}
                    </Box>
                    <Typography variant="h6">
                      {platform.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    {platform.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
  
  // Render connection steps
  const renderConnectionSteps = () => {
    if (!selectedPlatform) return null;
    
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ color: 'primary.main', mr: 2 }}>
            {selectedPlatform.icon}
          </Box>
          <Typography variant="h5">
            Connect {selectedPlatform.name}
          </Typography>
        </Box>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {selectedPlatform.steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Step 1: {selectedPlatform.steps[0]}
            </Typography>
            
            <Typography paragraph>
              Follow these steps to set up your {selectedPlatform.name} connection:
            </Typography>
            
            <ol>
              <li>
                <Typography paragraph>
                  {selectedPlatform.requiresAPI ? (
                    <>
                      Go to the <Link href={`https://${selectedPlatform.id}.com/developer`} target="_blank" rel="noopener">
                        {selectedPlatform.name} Developer Portal
                      </Link> and create a developer account if you don't have one.
                    </>
                  ) : (
                    <>
                      Ensure you have admin access to your {selectedPlatform.name} account.
                    </>
                  )}
                </Typography>
              </li>
              
              <li>
                <Typography paragraph>
                  {selectedPlatform.requiresAPI ? (
                    <>Create a new app in the developer portal and note the API credentials.</>
                  ) : (
                    <>Prepare to authorize our application to access your account.</>
                  )}
                </Typography>
              </li>
            </ol>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleNext} variant="contained">
                Continue
              </Button>
            </Box>
          </Box>
        )}
        
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Step 2: {selectedPlatform.steps[1]}
            </Typography>
            
            {selectedPlatform.requiresAPI ? (
              <>
                <Typography paragraph>
                  Enter the API credentials for your {selectedPlatform.name} app:
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="API Key"
                      name="apiKey"
                      value={formData.apiKey}
                      onChange={handleChange}
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="API Secret"
                      name="apiSecret"
                      value={formData.apiSecret}
                      onChange={handleChange}
                      margin="normal"
                      type="password"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={`${selectedPlatform.name} Handle (e.g. @youraccount)`}
                      name="handle"
                      value={formData.handle}
                      onChange={handleChange}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Typography paragraph>
                  Click the button below to authorize our application to access your {selectedPlatform.name} account.
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={selectedPlatform.icon}
                  sx={{ mt: 2 }}
                >
                  Authorize with {selectedPlatform.name}
                </Button>
                
                <Typography paragraph sx={{ mt: 3 }}>
                  After authorization, please enter your {selectedPlatform.name} handle:
                </Typography>
                
                <TextField
                  fullWidth
                  label={`${selectedPlatform.name} Handle (e.g. @youraccount)`}
                  name="handle"
                  value={formData.handle}
                  onChange={handleChange}
                  margin="normal"
                />
              </>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} variant="contained">
                Continue
              </Button>
            </Box>
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Step 3: {selectedPlatform.steps[2]}
            </Typography>
            
            <Typography paragraph>
              Review your connection details:
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1">
                {selectedPlatform.name} Account
              </Typography>
              <Typography>
                {formData.handle || 'No handle provided'}
              </Typography>
              
              {selectedPlatform.requiresAPI && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">
                    API Credentials
                  </Typography>
                  <Typography>
                    API Key: {formData.apiKey ? '••••••••' : 'Not provided'}
                  </Typography>
                  <Typography>
                    API Secret: {formData.apiSecret ? '••••••••' : 'Not provided'}
                  </Typography>
                </Box>
              )}
            </Paper>
            
            <Typography paragraph>
              Click "Connect" to complete the setup and connect your {selectedPlatform.name} account.
            </Typography>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button 
                onClick={handleConnect} 
                variant="contained" 
                color="primary"
                disabled={connectingPlatform || !formData.handle}
              >
                {connectingPlatform ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Connect'
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    );
  };
  
  // Render success view
  const renderSuccess = () => (
    <Box textAlign="center">
      <Typography variant="h5" gutterBottom color="primary">
        Connection Successful!
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Box sx={{ color: 'success.main', fontSize: 80 }}>
          <LinkIcon sx={{ fontSize: 80 }} />
        </Box>
      </Box>
      
      <Typography variant="h6" gutterBottom>
        {selectedPlatform.name} has been connected successfully.
      </Typography>
      
      <Typography paragraph>
        You can now schedule posts and manage your {selectedPlatform.name} account from the dashboard.
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleDone}
          size="large"
        >
          Done
        </Button>
      </Box>
    </Box>
  );
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleNavigateBack}
          sx={{ mr: 2 }}
        >
          Back to Platforms
        </Button>
        
        <Typography variant="h4" component="h1">
          Connect Platform
        </Typography>
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        {connectSuccess ? (
          renderSuccess()
        ) : (
          selectedPlatform ? renderConnectionSteps() : renderPlatformSelection()
        )}
      </Paper>
    </Box>
  );
};

export default PlatformConnect;
