import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { fetchAnalytics, fetchPlatformAnalytics, setPeriod } from '../../store/slices/analyticsSlice';
import { fetchPlatforms } from '../../store/slices/platformSlice';

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Analytics = () => {
  const dispatch = useDispatch();
  const { platformId } = useParams();
  
  // Get data from Redux
  const { data, platformData, loading, error, period } = useSelector((state) => state.analytics);
  const { platforms } = useSelector((state) => state.platforms);
  
  // Local state
  const [selectedPlatform, setSelectedPlatform] = useState(platformId || 'all');
  const [chartType, setChartType] = useState('line');
  
  // Fetch data on component mount
  useEffect(() => {
    // Fetch platforms
    dispatch(fetchPlatforms());
    
    // Fetch analytics based on selected platform
    if (selectedPlatform === 'all') {
      dispatch(fetchAnalytics());
    } else {
      dispatch(fetchPlatformAnalytics(selectedPlatform));
    }
  }, [dispatch, selectedPlatform]);
  
  // Handle platform change
  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };
  
  // Handle period change
  const handlePeriodChange = (e) => {
    dispatch(setPeriod(e.target.value));
  };
  
  // Handle chart type change
  const handleChartTypeChange = (e, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };
  
  // Format percentage change
  const formatPercentChange = (value) => {
    const formattedValue = Math.abs(value).toFixed(1) + '%';
    return value >= 0 ? `+${formattedValue}` : `-${formattedValue}`;
  };
  
  // Get trend icon
  const getTrendIcon = (value) => {
    return value >= 0 
      ? <TrendingUpIcon color="success" sx={{ fontSize: 20 }} /> 
      : <TrendingDownIcon color="error" sx={{ fontSize: 20 }} />;
  };
  
  // Get analytics data
  const getAnalyticsData = () => {
    return selectedPlatform === 'all' ? data : platformData;
  };
  
  // If no analytics data, show placeholder data for demo
  const engagementData = [
    { date: '2025-04-04', likes: 1242, comments: 342, shares: 156 },
    { date: '2025-04-05', likes: 1536, comments: 456, shares: 234 },
    { date: '2025-04-06', likes: 1798, comments: 523, shares: 287 },
    { date: '2025-04-07', likes: 1654, comments: 489, shares: 267 },
    { date: '2025-04-08', likes: 2103, comments: 567, shares: 324 },
    { date: '2025-04-09', likes: 1892, comments: 498, shares: 298 },
    { date: '2025-04-10', likes: 2156, comments: 543, shares: 312 }
  ];
  
  const platformEngagement = [
    { name: 'Twitter', value: 4526 },
    { name: 'Instagram', value: 7892 },
    { name: 'Facebook', value: 3456 },
    { name: 'LinkedIn', value: 2987 },
    { name: 'TikTok', value: 8965 },
    { name: 'YouTube', value: 3245 }
  ];
  
  // Render metric card
  const renderMetricCard = (title, value, change, icon) => (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="h4" component="div">
          {value.toLocaleString()}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {icon || getTrendIcon(change)}
          <Typography
            variant="body2"
            sx={{ ml: 0.5 }}
            color={change >= 0 ? 'success.main' : 'error.main'}
          >
            {formatPercentChange(change)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analytics Dashboard
        </Typography>
      </Box>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Platform</InputLabel>
              <Select
                value={selectedPlatform}
                onChange={handlePlatformChange}
                label="Platform"
              >
                <MenuItem value="all">All Platforms</MenuItem>
                {platforms.map((platform) => (
                  <MenuItem 
                    key={platform.id} 
                    value={platform.id}
                    disabled={platform.status !== 'connected'}
                  >
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={period}
                onChange={handlePeriodChange}
                label="Time Period"
              >
                <MenuItem value="day">Last 24 Hours</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="year">Last 12 Months</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              fullWidth
            >
              <ToggleButton value="line">Line</ToggleButton>
              <ToggleButton value="bar">Bar</ToggleButton>
              <ToggleButton value="pie">Pie</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading indicator */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Metric Cards */}
          <Grid item xs={12} sm={6} md={3}>
            {renderMetricCard('Total Followers', 103200, 5.2, <CalendarTodayIcon sx={{ fontSize: 20 }} />)}
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            {renderMetricCard('Engagement', 31071, 8.7)}
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            {renderMetricCard('Reach', 245600, -2.1)}
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            {renderMetricCard('Impressions', 492300, 12.3)}
          </Grid>
          
          {/* Engagement Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Engagement Over Time
              </Typography>
              
              <ResponsiveContainer width="100%" height={400}>
                {chartType === 'line' ? (
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="likes" stroke="#8884d8" name="Likes" />
                    <Line type="monotone" dataKey="comments" stroke="#82ca9d" name="Comments" />
                    <Line type="monotone" dataKey="shares" stroke="#ffc658" name="Shares" />
                  </LineChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="likes" fill="#8884d8" name="Likes" />
                    <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
                    <Bar dataKey="shares" fill="#ffc658" name="Shares" />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={platformEngagement}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {platformEngagement.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* Platform Comparison */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Platform Comparison
              </Typography>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Engagement" fill="#8884d8">
                    {platformEngagement.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* Top Performing Content */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Performing Content
              </Typography>
              
              <Box>
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Product Launch Announcement
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Platforms: Twitter, Facebook
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        Published: Apr 5, 2025
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mt: 1 }}>
                      <Box sx={{ mr: 3 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Likes
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {(Math.random() * 1000).toFixed(0)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mr: 3 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Comments
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {(Math.random() * 200).toFixed(0)}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Shares
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {(Math.random() * 100).toFixed(0)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          
          {/* Audience Demographics */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Audience Demographics
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Age Distribution
                  </Typography>
                  
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: '18-24', value: 25 },
                          { name: '25-34', value: 35 },
                          { name: '35-44', value: 20 },
                          { name: '45-54', value: 12 },
                          { name: '55+', value: 8 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Gender Distribution
                  </Typography>
                  
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Male', value: 42 },
                          { name: 'Female', value: 56 },
                          { name: 'Other', value: 2 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Location
                  </Typography>
                  
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'United States', value: 45 },
                          { name: 'Europe', value: 25 },
                          { name: 'Asia', value: 15 },
                          { name: 'Other', value: 15 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Analytics;
