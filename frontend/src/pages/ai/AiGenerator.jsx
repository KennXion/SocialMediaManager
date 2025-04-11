import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import api from '../../services/api';

// Content templates
const CONTENT_TEMPLATES = [
  { id: 'general', name: 'General Post', description: 'Standard social media post with engaging content' },
  { id: 'announcement', name: 'Announcement', description: 'Announce news, events, or product launches' },
  { id: 'promotion', name: 'Promotion', description: 'Promote products, services, or special offers' },
  { id: 'tips', name: 'Tips & Advice', description: 'Share helpful tips related to your industry' },
  { id: 'question', name: 'Question/Poll', description: 'Engage your audience with questions' },
  { id: 'story', name: 'Story', description: 'Tell a compelling story about your brand' }
];

// Tone options
const TONE_OPTIONS = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual', name: 'Casual' },
  { id: 'friendly', name: 'Friendly' },
  { id: 'humorous', name: 'Humorous' },
  { id: 'inspiring', name: 'Inspiring' },
  { id: 'educational', name: 'Educational' }
];

// Platform options
const PLATFORM_OPTIONS = [
  { id: 'twitter', name: 'Twitter', icon: 'tag' },
  { id: 'instagram', name: 'Instagram', icon: 'photo_camera' },
  { id: 'facebook', name: 'Facebook', icon: 'thumb_up' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'business' },
  { id: 'tiktok', name: 'TikTok', icon: 'music_note' },
  { id: 'youtube', name: 'YouTube', icon: 'play_arrow' }
];

const AiGenerator = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    platforms: ['instagram', 'linkedin'],
    template: 'general',
    tone: 'professional',
    context: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle platform toggle
  const handlePlatformToggle = (platformId) => {
    const platforms = [...formData.platforms];
    
    if (platforms.includes(platformId)) {
      // Remove platform if already selected
      setFormData({
        ...formData,
        platforms: platforms.filter(id => id !== platformId)
      });
    } else {
      // Add platform if not selected
      setFormData({
        ...formData,
        platforms: [...platforms, platformId]
      });
    }
  };
  
  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    setFormData({
      ...formData,
      template: templateId
    });
  };
  
  // Generate content
  const handleGenerateContent = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a content topic');
      return;
    }
    
    if (formData.platforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/ai/generate', formData);
      setGeneratedContent(response.data);
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Failed to generate content. Please try again.');
      
      // Simulate content generation for demo
      simulateContentGeneration();
    }
    
    setLoading(false);
  };
  
  // Simulate content generation for demo
  const simulateContentGeneration = () => {
    setTimeout(() => {
      const templates = {
        general: `Looking to improve your approach to ${formData.topic}? You're not alone!\n\nWe've been researching the most effective strategies in the industry, and we're excited to share what we've learned.\n\nCheck out our latest blog post for a comprehensive guide that will help you navigate the complexities of ${formData.topic} with confidence.`,
        announcement: `🎉 BIG ANNOUNCEMENT 🎉\n\nWe are thrilled to unveil our latest innovation in ${formData.topic}! After months of development and testing, we're finally ready to share it with the world.\n\nThis game-changing solution will help you:\n• Save valuable time\n• Increase efficiency\n• Achieve better results\n\nStay tuned for the official launch next week!`,
        promotion: `LIMITED TIME OFFER: Transform your ${formData.topic} experience today!\n\nFor a limited time, we're offering an exclusive discount on our premium ${formData.topic} solution. Don't miss this opportunity to elevate your results and stand out from the competition.\n\nUse code SPECIAL25 for 25% off!`,
        tips: `Here are 5 game-changing tips for mastering ${formData.topic}:\n\n1. Start with a clear strategy\n2. Focus on measurable results\n3. Leverage available tools\n4. Learn from industry leaders\n5. Consistently review and adapt\n\nWhich tip will you implement first?`,
        question: `We're curious: What's your biggest challenge when it comes to ${formData.topic}?\n\nA) Finding the right tools\nB) Developing an effective strategy\nC) Staying consistent\nD) Measuring results\n\nShare your answer in the comments!`,
        story: `Our journey with ${formData.topic} began three years ago when we noticed a gap in the market.\n\nFaced with the same challenges you're experiencing, we developed a solution that has transformed how our clients approach ${formData.topic}.\n\nToday, we're proud to share that success with you. Here's how we can help you write your own success story.`
      };
      
      const tone = formData.tone || 'professional';
      let template = templates[formData.template] || templates.general;
      
      // Adjust for tone
      if (tone === 'casual') {
        template = template.replace("We are thrilled", "We are super excited")
                          .replace("comprehensive guide", "easy-to-follow guide")
                          .replace("game-changing", "awesome");
      } else if (tone === 'humorous') {
        template = template.replace("You're not alone", "Don't worry, we've all been there!")
                          .replace("After months of development", "After countless coffee-fueled nights")
                          .replace("Transform your", "Stop pulling your hair out over your");
      }
      
      const variants = [
        `Have you been struggling with ${formData.topic} lately? We get it - it's a complex challenge.\n\nOur team has developed a streamlined approach that makes ${formData.topic} management easier than ever. The results speak for themselves: improved efficiency, better outcomes, and happier teams.`,
        `${formData.topic.charAt(0).toUpperCase() + formData.topic.slice(1)} doesn't have to be complicated! 💡\n\nWe've broken down the process into three simple steps that anyone can follow:\n\n1️⃣ Analyze your current approach\n2️⃣ Identify opportunities for improvement\n3️⃣ Implement targeted solutions`,
        `"The biggest challenge with ${formData.topic} is knowing where to start."\n\nWe hear this from clients all the time. That's why we've created a beginner-friendly guide that walks you through everything you need to know.\n\nFrom fundamental concepts to advanced strategies, we've got you covered.`
      ];
      
      setGeneratedContent({
        primaryContent: template,
        variants: variants,
        topic: formData.topic,
        platforms: formData.platforms,
        template: formData.template,
        tone: tone
      });
      
      setLoading(false);
    }, 1500);
  };
  
  // Use generated content
  const handleUseContent = (content) => {
    // Store content in localStorage for usage in content page
    localStorage.setItem('draft_content', content);
    localStorage.setItem('draft_title', formData.topic);
    
    enqueueSnackbar('Content added to your drafts!', { variant: 'success' });
    
    // Navigate to content page
    navigate('/content');
  };
  
  // Regenerate content
  const handleRegenerate = () => {
    handleGenerateContent();
  };
  
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Content Generator
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Create engaging content for your social media platforms using AI assistance.
      </Typography>
      
      {/* Content Generation Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Content Topic/Campaign"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="What would you like to create content about?"
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Target Platforms
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {PLATFORM_OPTIONS.map((platform) => (
                <Chip
                  key={platform.id}
                  label={platform.name}
                  clickable
                  color={formData.platforms.includes(platform.id) ? 'primary' : 'default'}
                  onClick={() => handlePlatformToggle(platform.id)}
                  icon={<span className="material-icons">{platform.icon}</span>}
                  sx={{ pl: 0.5 }}
                />
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Content Type
            </Typography>
            <Grid container spacing={2}>
              {CONTENT_TEMPLATES.map((template) => (
                <Grid item xs={12} sm={6} md={4} key={template.id}>
                  <Card 
                    variant="outlined"
                    sx={{ 
                      cursor: 'pointer',
                      borderColor: formData.template === template.id ? 'primary.main' : 'divider',
                      bgcolor: formData.template === template.id ? 'action.hover' : 'background.paper',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" component="div">
                          {template.name}
                        </Typography>
                        {formData.template === template.id && (
                          <CheckIcon color="primary" />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {template.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Tone of Voice</InputLabel>
              <Select
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                label="Tone of Voice"
              >
                {TONE_OPTIONS.map((tone) => (
                  <MenuItem key={tone.id} value={tone.id}>
                    {tone.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Context/Details"
              name="context"
              value={formData.context}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Add any specific details, keywords, or context for the AI to consider"
            />
          </Grid>
          
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerateContent}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Generated Content */}
      {generatedContent && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Generated Content
            </Typography>
            <Box>
              <Button 
                variant="outlined" 
                onClick={handleRegenerate}
                sx={{ mr: 1 }}
                disabled={loading}
              >
                Regenerate
              </Button>
              <Button 
                variant="contained"
                onClick={() => handleUseContent(generatedContent.primaryContent)}
                disabled={loading}
              >
                Use Content
              </Button>
            </Box>
          </Box>
          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {generatedContent.primaryContent}
              </Typography>
            </CardContent>
          </Card>
          
          <Typography variant="h6" gutterBottom>
            Alternative Versions
          </Typography>
          
          {generatedContent.variants.map((variant, index) => (
            <Card 
              key={index} 
              variant="outlined" 
              sx={{ 
                mb: 2, 
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => handleUseContent(variant)}
            >
              <CardContent>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {variant}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}
    </>
  );
};

export default AiGenerator;
