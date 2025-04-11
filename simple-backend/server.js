const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { logger, requestLogger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 9500; // Use port in 9xxx range to avoid conflicts

// Create HTTP server
const server = http.createServer(app);

// Set environment variables
const isDev = process.env.NODE_ENV === 'development';

// Middleware
app.use(cors());
app.use(morgan('dev')); // Console logging
app.use(requestLogger); // File logging
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Sample data
const posts = [
  {
    id: '1',
    title: 'Product Launch Announcement',
    content: 'We are excited to announce our newest product! Stay tuned for more details.',
    platforms: ['twitter', 'facebook', 'linkedin'],
    scheduledFor: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Customer Success Story',
    content: 'Check out how our product helped this customer achieve amazing results!',
    platforms: ['instagram', 'facebook'],
    scheduledFor: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
    status: 'scheduled'
  },
  {
    id: '3',
    title: 'Industry Tips',
    content: 'Here are 5 tips to improve your productivity today!',
    platforms: ['twitter', 'linkedin'],
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
    status: 'published'
  }
];

const analytics = {
  engagement: {
    twitter: 4526,
    instagram: 7892,
    facebook: 3456,
    linkedin: 2987,
    tiktok: 8965,
    youtube: 3245
  },
  followers: {
    twitter: 17200,
    instagram: 28300,
    facebook: 35600,
    linkedin: 14100,
    tiktok: 25400,
    youtube: 5800
  },
  recentEngagement: [
    { date: '2025-04-04', likes: 1242, comments: 342, shares: 156 },
    { date: '2025-04-05', likes: 1536, comments: 456, shares: 234 },
    { date: '2025-04-06', likes: 1798, comments: 523, shares: 287 },
    { date: '2025-04-07', likes: 1654, comments: 489, shares: 267 },
    { date: '2025-04-08', likes: 2103, comments: 567, shares: 324 },
    { date: '2025-04-09', likes: 1892, comments: 498, shares: 298 },
    { date: '2025-04-10', likes: 2156, comments: 543, shares: 312 }
  ]
};

const platforms = [
  {
    id: 'twitter',
    name: 'Twitter',
    status: 'connected',
    handle: '@YourBrand',
    followers: 16800,
    engagement: 4500
  },
  {
    id: 'instagram',
    name: 'Instagram',
    status: 'connected',
    handle: '@your_brand',
    followers: 28300,
    engagement: 7900
  },
  {
    id: 'facebook',
    name: 'Facebook',
    status: 'connected',
    handle: 'Your Brand Page',
    followers: 35600,
    engagement: 3400
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    status: 'connected',
    handle: 'Your Brand',
    followers: 14100,
    engagement: 3000
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    status: 'connected',
    handle: '@yourbrand',
    followers: 25400,
    views: 89700
  },
  {
    id: 'youtube',
    name: 'YouTube',
    status: 'disconnected',
    handle: '',
    followers: 0,
    views: 0
  }
];

// User preferences
let userPreferences = {
  theme: 'light',
  defaultPlatforms: ['twitter', 'instagram'],
  notifications: {
    email: true,
    push: true,
    postPublishing: true,
    analyticsReports: false
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'production', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
});

app.post('/api/posts', (req, res) => {
  const newPost = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content,
    platforms: req.body.platforms,
    status: req.body.schedule ? 'scheduled' : 'published',
    createdAt: new Date().toISOString()
  };
  
  if (req.body.schedule) {
    newPost.scheduledFor = req.body.scheduledFor;
  } else {
    newPost.publishedAt = new Date().toISOString();
  }
  
  posts.unshift(newPost);
  res.status(201).json(newPost);
});

app.get('/api/analytics', (req, res) => {
  res.json(analytics);
});

app.get('/api/platforms', (req, res) => {
  res.json(platforms);
});

app.post('/api/platforms/connect', (req, res) => {
  const platform = platforms.find(p => p.id === req.body.platform);
  if (!platform) {
    return res.status(404).json({ message: 'Platform not found' });
  }
  
  platform.status = 'connected';
  platform.handle = req.body.handle || `@${req.body.platform}_account`;
  
  res.json(platform);
});

// User preferences routes
app.get('/api/preferences', (req, res) => {
  res.json(userPreferences);
});

app.post('/api/preferences', (req, res) => {
  userPreferences = { ...userPreferences, ...req.body };
  res.json(userPreferences);
});

app.post('/api/preferences/theme', (req, res) => {
  if (req.body.theme) {
    userPreferences.theme = req.body.theme;
  }
  res.json({ theme: userPreferences.theme });
});

app.post('/api/ai/generate', (req, res) => {
  // Mock AI response
  setTimeout(() => {
    const templates = {
      general: `Looking to improve your approach to ${req.body.topic}? You're not alone!\n\nWe've been researching the most effective strategies in the industry, and we're excited to share what we've learned.\n\nCheck out our latest blog post for a comprehensive guide that will help you navigate the complexities of ${req.body.topic} with confidence.`,
      announcement: `🎉 BIG ANNOUNCEMENT 🎉\n\nWe are thrilled to unveil our latest innovation in ${req.body.topic}! After months of development and testing, we're finally ready to share it with the world.\n\nThis game-changing solution will help you:\n• Save valuable time\n• Increase efficiency\n• Achieve better results\n\nStay tuned for the official launch next week!`,
      promotion: `LIMITED TIME OFFER: Transform your ${req.body.topic} experience today!\n\nFor a limited time, we're offering an exclusive discount on our premium ${req.body.topic} solution. Don't miss this opportunity to elevate your results and stand out from the competition.\n\nUse code SPECIAL25 for 25% off!`,
      tips: `Here are 5 game-changing tips for mastering ${req.body.topic}:\n\n1. Start with a clear strategy\n2. Focus on measurable results\n3. Leverage available tools\n4. Learn from industry leaders\n5. Consistently review and adapt\n\nWhich tip will you implement first?`,
      question: `We're curious: What's your biggest challenge when it comes to ${req.body.topic}?\n\nA) Finding the right tools\nB) Developing an effective strategy\nC) Staying consistent\nD) Measuring results\n\nShare your answer in the comments!`,
      story: `Our journey with ${req.body.topic} began three years ago when we noticed a gap in the market.\n\nFaced with the same challenges you're experiencing, we developed a solution that has transformed how our clients approach ${req.body.topic}.\n\nToday, we're proud to share that success with you. Here's how we can help you write your own success story.`
    };
    
    const tone = req.body.tone || 'professional';
    let template = templates[req.body.template] || templates.general;
    
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
      `Have you been struggling with ${req.body.topic} lately? We get it - it's a complex challenge.\n\nOur team has developed a streamlined approach that makes ${req.body.topic} management easier than ever. The results speak for themselves: improved efficiency, better outcomes, and happier teams.`,
      `${req.body.topic.charAt(0).toUpperCase() + req.body.topic.slice(1)} doesn't have to be complicated! 💡\n\nWe've broken down the process into three simple steps that anyone can follow:\n\n1️⃣ Analyze your current approach\n2️⃣ Identify opportunities for improvement\n3️⃣ Implement targeted solutions`,
      `"The biggest challenge with ${req.body.topic} is knowing where to start."\n\nWe hear this from clients all the time. That's why we've created a beginner-friendly guide that walks you through everything you need to know.\n\nFrom fundamental concepts to advanced strategies, we've got you covered.`
    ];
    
    res.json({
      primaryContent: template,
      variants: variants,
      topic: req.body.topic,
      platforms: req.body.platforms,
      template: req.body.template,
      tone: tone
    });
  }, 1500); // Simulate AI generation delay
});

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  // Check if the URL path corresponds to one of our HTML files
  const htmlPath = path.join(__dirname, '../frontend', req.path);
  
  if (fs.existsSync(htmlPath) && htmlPath.endsWith('.html')) {
    return res.sendFile(htmlPath);
  }
  
  // Otherwise, serve the index.html as a fallback
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use(notFoundHandler); // Handle 404 errors
app.use(errorHandler); // Handle all other errors

// Start server
server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'production'}`);
});

// Handle process termination
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err);
  server.close(() => {
    process.exit(1);
  });
});
