import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Box,
  Button,
  Divider
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useNavigate } from 'react-router-dom';

// Sample data for charts
const engagementData = [
  { name: 'Jan', twitter: 4000, facebook: 2400, instagram: 2400 },
  { name: 'Feb', twitter: 3000, facebook: 1398, instagram: 2210 },
  { name: 'Mar', twitter: 2000, facebook: 9800, instagram: 2290 },
  { name: 'Apr', twitter: 2780, facebook: 3908, instagram: 2000 },
  { name: 'May', twitter: 1890, facebook: 4800, instagram: 2181 },
  { name: 'Jun', twitter: 2390, facebook: 3800, instagram: 2500 },
  { name: 'Jul', twitter: 3490, facebook: 4300, instagram: 2100 },
];

const platformStats = [
  { name: 'Twitter', followers: 12500, posts: 320, engagement: 3.2 },
  { name: 'Facebook', followers: 8700, posts: 180, engagement: 2.8 },
  { name: 'Instagram', followers: 15800, posts: 210, engagement: 4.5 },
  { name: 'LinkedIn', followers: 5200, posts: 95, engagement: 1.9 },
];

const upcomingPosts = [
  { id: 1, platform: 'Twitter', content: 'Check out our latest product update!', scheduledAt: '2023-06-02T10:00:00Z' },
  { id: 2, platform: 'Instagram', content: 'Behind the scenes at our office...', scheduledAt: '2023-06-03T14:30:00Z' },
  { id: 3, platform: 'Facebook', content: 'We\'re hiring! Join our team...', scheduledAt: '2023-06-04T09:00:00Z' },
];

// Format date
const formatDate = (dateString) => {
  const options = { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Dashboard component
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Handle navigation
  const handleCreatePost = () => {
    navigate('/content/create');
  };
  
  const handleViewSchedule = () => {
    navigate('/content/schedule');
  };
  
  return (
    <>
      {/* Welcome header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your social media performance
        </Typography>
      </Box>
      
      {/* Quick action buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleCreatePost}
        >
          Create New Post
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<ScheduleIcon />}
          onClick={handleViewSchedule}
        >
          View Schedule
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Platform Stats */}
        {platformStats.map((platform) => (
          <Grid item xs={12} sm={6} md={3} key={platform.name}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {platform.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Followers
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {platform.followers.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Posts
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {platform.posts}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Engagement
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {platform.engagement > 3 ? (
                      <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                    ) : (
                      <TrendingDownIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                    )}
                    <Typography 
                      variant="body1" 
                      fontWeight="bold"
                      color={platform.engagement > 3 ? 'success.main' : 'error.main'}
                    >
                      {platform.engagement}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {/* Engagement Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Engagement Over Time" />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={engagementData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="twitter"
                    name="Twitter"
                    stroke="#1DA1F2"
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="facebook" 
                    name="Facebook" 
                    stroke="#4267B2" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="instagram" 
                    name="Instagram" 
                    stroke="#C13584" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Upcoming Posts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Upcoming Posts" 
              action={
                <Button 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={handleCreatePost}
                >
                  Add
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {upcomingPosts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  No upcoming posts scheduled
                </Typography>
              ) : (
                <Box>
                  {upcomingPosts.map((post) => (
                    <Box key={post.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 0.5
                      }}>
                        <Typography 
                          variant="body2" 
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          {post.platform}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(post.scheduledAt)}
                        </Typography>
                      </Box>
                      <Typography variant="body1" noWrap>
                        {post.content}
                      </Typography>
                    </Box>
                  ))}
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      size="small"
                      variant="text"
                      onClick={handleViewSchedule}
                    >
                      View All Scheduled Posts
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Performance by Platform */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Performance by Platform" />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={platformStats}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="followers" 
                    name="Followers" 
                    fill="#8884d8" 
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="posts" 
                    name="Posts" 
                    fill="#82ca9d" 
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
