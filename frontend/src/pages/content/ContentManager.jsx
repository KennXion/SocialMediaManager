import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PublishIcon from '@mui/icons-material/Publish';
import { fetchPosts, deletePost } from '../../store/slices/postSlice';

const ContentManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.posts);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  // Fetch posts on component mount
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);
  
  // Filter posts when search term or posts change
  useEffect(() => {
    if (posts.length > 0) {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [posts, searchTerm]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page on search
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle create new post
  const handleCreatePost = () => {
    navigate('/content/create');
  };
  
  // Handle edit post
  const handleEditPost = (postId) => {
    navigate(`/content/edit/${postId}`);
  };
  
  // Handle delete post
  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(postId));
    }
  };
  
  // Handle schedule post
  const handleSchedulePost = (postId) => {
    navigate(`/content/schedule?postId=${postId}`);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Get status chip
  const getStatusChip = (status) => {
    switch (status) {
      case 'draft':
        return <Chip label="Draft" color="default" size="small" />;
      case 'scheduled':
        return <Chip label="Scheduled" color="primary" size="small" />;
      case 'published':
        return <Chip label="Published" color="success" size="small" />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // Get platform icons/names
  const getPlatformsChips = (platforms) => {
    if (!platforms || platforms.length === 0) return 'None';
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {platforms.map(platform => (
          <Chip 
            key={platform} 
            label={platform.charAt(0).toUpperCase() + platform.slice(1)} 
            size="small" 
            variant="outlined" 
          />
        ))}
      </Box>
    );
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Content Manager
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePost}
        >
          Create New Post
        </Button>
      </Box>
      
      {/* Search and filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search Content"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
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
        /* Content table */
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Platforms</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {searchTerm ? 'No posts match your search' : 'No posts available'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{getPlatformsChips(post.platforms)}</TableCell>
                        <TableCell>{getStatusChip(post.status)}</TableCell>
                        <TableCell>
                          {post.status === 'published' 
                            ? formatDate(post.publishedAt) 
                            : (post.status === 'scheduled' 
                              ? formatDate(post.scheduledFor) 
                              : formatDate(post.createdAt))}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditPost(post.id)}
                            title="Edit"
                          >
                            <EditIcon />
                          </IconButton>
                          
                          {post.status !== 'published' && (
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleSchedulePost(post.id)}
                              title="Schedule"
                            >
                              <ScheduleIcon />
                            </IconButton>
                          )}
                          
                          {post.status === 'draft' && (
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => console.log('publish post', post.id)}
                              title="Publish Now"
                            >
                              <PublishIcon />
                            </IconButton>
                          )}
                          
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeletePost(post.id)}
                            title="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPosts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default ContentManager;
