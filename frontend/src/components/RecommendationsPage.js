import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CardMedia, 
  Button,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Pagination,
  Rating,
  Avatar,
  Paper,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SortIcon from '@mui/icons-material/Sort';

const RecommendationsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // States
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // Filter states
  const [interests, setInterests] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  
  // Available filter options
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const categories = ['Programming', 'Data Science', 'Business', 'Design', 'Marketing', 'Web Development', 'Mobile Development'];
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popularity', label: 'Most Popular' }
  ];
  
  const coursesPerPage = 8;
  
  // Get recommendations based on filters
  const fetchRecommendations = () => {
    setLoading(true);
    setError(null);
    
    // Build query parameters
    const params = new URLSearchParams();
    if (interests) params.append('interests', interests);
    if (level) params.append('level', level);
    if (category) params.append('category', category);
    params.append('sort', sortBy);
    params.append('page', page);
    params.append('limit', coursesPerPage);
    
    // API URL - using the correct port (5001)
    const apiUrl = `http://localhost:5001/api/recommendations${params.toString() ? `?${params.toString()}` : ''}`;
    
    // Fetch recommendations from the backend
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Server responded with status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        setRecommendations(data.courses || data);
        if (data.totalPages) {
          setTotalPages(data.totalPages);
        } else {
          // If backend doesn't provide page info, calculate based on array length
          setTotalPages(Math.ceil((data.courses || data).length / coursesPerPage));
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching recommendations:", error);
        setError(`Failed to load recommendations: ${error.message}`);
        setLoading(false);
      });
  };
  
  // Fetch recommendations on component mount and when filters or page changes
  useEffect(() => {
    fetchRecommendations();
  }, [page, sortBy]); // Auto-fetch when page or sort changes
  
  // Handle search button click for applying text search and filters
  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    fetchRecommendations();
  };
  
  // Handle saving/bookmarking a course
  const toggleSaveCourse = (courseId) => {
    if (savedCourses.includes(courseId)) {
      setSavedCourses(savedCourses.filter(id => id !== courseId));
      showNotification('Course removed from your saved list', 'info');
    } else {
      setSavedCourses([...savedCourses, courseId]);
      showNotification('Course saved for later', 'success');
    }
  };
  
  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // Show notification
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Handle filter toggle for mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Get course duration display
  const getCourseDuration = (hours) => {
    if (!hours) return "Self-paced";
    if (hours < 1) return "< 1 hour";
    if (hours === 1) return "1 hour";
    return `${hours} hours`;
  };
  
  return (
    <Container maxWidth="lg" sx={{ paddingY: 3 }}>
      {/* Header Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 700, 
          mb: 1,
          background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          Course Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Discover courses tailored to your interests and learning goals
        </Typography>
        <Divider />
      </Box>
      
      <Grid container spacing={3}>
        {/* Filters Panel */}
        <Grid item xs={12} md={3}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              mb: 2, 
              display: isMobile && !showFilters ? 'none' : 'block',
              position: { xs: 'static', md: 'sticky' },
              top: '20px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                <FilterListIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Filters
              </Typography>
              {isMobile && (
                <IconButton size="small" onClick={toggleFilters}>
                  <FilterListIcon />
                </IconButton>
              )}
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="What do you want to learn?"
                variant="outlined"
                size="small"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. web development, python"
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
              
              <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  label="Level"
                >
                  <MenuItem value=""><em>Any Level</em></MenuItem>
                  {levels.map((lvl) => (
                    <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value=""><em>Any Category</em></MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                  startAdornment={<SortIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={handleSearch}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              >
                Apply Filters
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Quick links */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Button 
                  color="inherit" 
                  size="small" 
                  sx={{ textTransform: 'none', justifyContent: 'flex-start', p: 0 }}
                  onClick={() => { setInterests(''); setLevel('Beginner'); setCategory(''); handleSearch(); }}
                >
                  Beginner Courses
                </Button>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Button 
                  color="inherit" 
                  size="small" 
                  sx={{ textTransform: 'none', justifyContent: 'flex-start', p: 0 }}
                  onClick={() => { setInterests('programming'); setLevel(''); setCategory(''); handleSearch(); }}
                >
                  Programming Courses
                </Button>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Button 
                  color="inherit" 
                  size="small" 
                  sx={{ textTransform: 'none', justifyContent: 'flex-start', p: 0 }}
                  onClick={() => { setInterests('data science'); setLevel(''); setCategory(''); handleSearch(); }}
                >
                  Data Science Courses
                </Button>
              </Box>
            </Box>
          </Paper>
          
          {/* Mobile filter toggle button */}
          {isMobile && (
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<FilterListIcon />} 
              onClick={toggleFilters}
              sx={{ mb: 2 }}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          )}
        </Grid>
        
        {/* Course Recommendations */}
        <Grid item xs={12} md={9}>
          {/* Error display */}
          {error && (
            <Alert severity="error" sx={{ marginBottom: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Main content area */}
          <Box>
            {/* Results summary */}
            {!loading && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {recommendations.length === 0 
                    ? 'No courses found' 
                    : `Showing ${recommendations.length} ${recommendations.length === 1 ? 'course' : 'courses'}`}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
                    Sort by:
                  </Typography>
                  <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      displayEmpty
                      disableUnderline
                    >
                      {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
            
            {/* Loading indicator */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <CircularProgress />
              </Box>
            )}
            
            {/* No results message */}
            {!loading && recommendations.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <SchoolIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6">No courses found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try adjusting your filters or search terms
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setInterests('');
                    setLevel('');
                    setCategory('');
                    setSortBy('relevance');
                    handleSearch();
                  }}
                >
                  Clear Filters
                </Button>
              </Paper>
            )}
            
            {/* Course grid */}
            {!loading && recommendations.length > 0 && (
              <Grid container spacing={2}>
                {recommendations.map((course, index) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={course.id || index}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                        },
                        position: 'relative',
                        overflow: 'visible'
                      }}
                    >
                      {/* Bookmark button */}
                      <IconButton 
                        size="small" 
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                        }}
                        onClick={() => toggleSaveCourse(course.id)}
                      >
                        {savedCourses.includes(course.id) ? 
                          <BookmarkIcon color="primary" /> : 
                          <BookmarkBorderIcon />
                        }
                      </IconButton>
                      
                      <CardMedia
                        component="img"
                        height="140"
                        image={course.image || `https://source.unsplash.com/random/300x140?${course.category?.toLowerCase() || 'education'}`}
                        alt={course.title}
                      />
                      
                      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                        {/* Course category chip */}
                        <Chip 
                          label={course.category || 'General'} 
                          size="small" 
                          sx={{ mb: 1 }}
                          color="primary"
                          variant="outlined"
                        />
                        
                        <Typography variant="h6" component="h2" sx={{ 
                          fontWeight: 600, 
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.2,
                          height: 'calc(1.2em * 2)'
                        }}>
                          {course.title}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            height: 'calc(1.5em * 3)'
                          }}
                        >
                          {course.description}
                        </Typography>
                        
                        {/* Course metadata */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {getCourseDuration(course.duration)}
                          </Typography>
                          <Box sx={{ mx: 1, color: 'text.disabled' }}>•</Box>
                          <SchoolIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.level || 'All Levels'}
                          </Typography>
                        </Box>
                        
                        {/* Instructor info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Avatar 
                            sx={{ width: 24, height: 24, mr: 1, fontSize: '0.875rem' }}
                            alt={course.instructorName}
                            src={course.instructorImage}
                          >
                            {course.instructorName?.charAt(0) || 'I'}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {course.instructorName || 'Instructor'}
                          </Typography>
                        </Box>
                        
                        {/* Rating if available */}
                        {course.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <Rating 
                              value={parseFloat(course.rating) || 0} 
                              precision={0.5} 
                              size="small" 
                              readOnly 
                            />
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              ({course.ratingCount || 0})
                            </Typography>
                          </Box>
                        )}
                        
                        <Button 
                          variant="contained" 
                          color="primary" 
                          fullWidth
                          href={course.url || '#'}
                          sx={{ 
                            mt: 'auto',
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: '0 4px 8px rgba(33, 150, 243, 0.3)'
                            }
                          }}
                        >
                          View Course
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Pagination */}
            {!loading && recommendations.length > 0 && totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      
      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecommendationsPage;



// // src/components/RecommendationsPage.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Card, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import StarRating from './StarRating';

// const RecommendationsPage = ({ learnerId, limit = 4, advanced = false }) => {
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [learnerProfile, setLearnerProfile] = useState(null);
//   const [recommendationType, setRecommendationType] = useState('');

//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       try {
//         setLoading(true);
//         const endpoint = advanced 
//           ? `/api/learner/advanced-recommendations/${learnerId}?limit=${limit}`
//           : `/api/learner/recommendations/${learnerId}?limit=${limit}`;
          
//         const response = await axios.get(endpoint);
        
//         setRecommendations(response.data.recommendations);
//         setRecommendationType(response.data.recommendationType);
        
//         // If advanced recommendations include learner profile
//         if (response.data.learnerProfile) {
//           setLearnerProfile(response.data.learnerProfile);
//         }
        
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching recommendations:', err);
//         setError('Failed to load recommended courses. Please try again later.');
//         setLoading(false);
//       }
//     };

//     if (learnerId) {
//       fetchRecommendations();
//     }
//   }, [learnerId, limit, advanced]);

//   const renderRecommendationTitle = () => {
//     if (recommendationType === 'popular') {
//       return 'Popular Courses You Might Like';
//     } else if (recommendationType === 'based_on_enrollment') {
//       return 'Recommended Based on Your Enrolled Courses';
//     } else if (recommendationType === 'personalized') {
//       return 'Personalized Recommendations for You';
//     }
//     return 'Recommended Courses';
//   };

//   const renderLearnerInsights = () => {
//     if (!learnerProfile) return null;
    
//     return (
//       <div className="learner-insights mb-4">
//         <h6 className="text-muted">Based on your learning patterns:</h6>
//         <div className="d-flex flex-wrap gap-2 mb-2">
//           {learnerProfile.topCategories.map((category, index) => (
//             <Badge key={index} bg="info" className="me-1">
//               {category}
//             </Badge>
//           ))}
//         </div>
//         {learnerProfile.suggestedNextLevel && (
//           <p className="small mb-0">
//             We recommend progressing to <strong>{learnerProfile.suggestedNextLevel}</strong> level courses
//           </p>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="text-center my-5">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-2">Loading recommendations...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Alert variant="danger">{error}</Alert>
//     );
//   }

//   if (recommendations.length === 0) {
//     return (
//       <Alert variant="info">
//         No recommendations available. Explore our course catalog to find courses you might be interested in.
//       </Alert>
//     );
//   }

//   return (
//     <div className="recommended-courses-section">
//       <h3 className="section-title mb-4">{renderRecommendationTitle()}</h3>
      
//       {advanced && renderLearnerInsights()}
      
//       <Row>
//         {recommendations.map((course) => (
//           <Col key={course._id} xs={12} md={6} lg={3} className="mb-4">
//             <Card className="h-100 course-card">
//               <div className="course-image-container">
//                 <img 
//                   src={course.image || '/placeholder-course.jpg'} 
//                   alt={course.title}
//                   className="card-img-top course-image"
//                 />
//                 {course.matchScore && (
//                   <Badge 
//                     bg="success" 
//                     className="match-score-badge"
//                     title="Relevance score based on your learning profile"
//                   >
//                     {Math.round((course.matchScore / 14) * 100)}% Match
//                   </Badge>
//                 )}
//               </div>
              
//               <Card.Body>
//                 <div className="d-flex justify-content-between">
//                   <Badge bg="secondary" className="mb-2">{course.category}</Badge>
//                   <Badge bg="info">{course.level}</Badge>
//                 </div>
                
//                 <Card.Title className="course-title">{course.title}</Card.Title>
                
//                 <div className="course-instructor mb-2">
//                   <small className="text-muted">By {course.instructorName}</small>
//                 </div>
                
//                 <StarRating rating={course.rating || 4.5} />
                
//                 <div className="mt-3">
//                   <Link to={`/courses/${course._id}`} className="btn btn-outline-primary btn-sm w-100">
//                     View Course
//                   </Link>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// export default RecommendationsPage;