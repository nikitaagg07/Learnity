// // LandingPage.js
// import React from 'react';
// import { 
//   AppBar, 
//   Box, 
//   Button, 
//   Card, 
//   CardContent, 
//   Container, 
//   Grid, 
//   Typography, 
//   useTheme, 
//   useMediaQuery,
//   Paper
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { 
//   School, 
//   People, 
//   EmojiEvents, 
//   PlayArrow, 
//   ArrowForward,
//   Psychology,
//   Timeline,
//   Assignment
// } from '@mui/icons-material';

// // Styled components
// const HeroSection = styled(Box)(({ theme }) => ({
//   backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/hero-bg.jpg")',
//   backgroundSize: 'cover',
//   backgroundPosition: 'center',
//   color: theme.palette.common.white,
//   padding: theme.spacing(15, 0),
//   position: 'relative',
//   [theme.breakpoints.down('md')]: {
//     padding: theme.spacing(10, 0),
//   },
// }));

// const GradientTypography = styled(Typography)(({ theme }) => ({
//   background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
//   WebkitBackgroundClip: 'text',
//   WebkitTextFillColor: 'transparent',
// }));

// const FeatureCard = styled(Card)(({ theme }) => ({
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//   '&:hover': {
//     transform: 'translateY(-10px)',
//     boxShadow: theme.shadows[10],
//   },
// }));

// const StatsSection = styled(Box)(({ theme }) => ({
//   background: theme.palette.grey[100],
//   padding: theme.spacing(8, 0),
// }));

// const LandingPage = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   return (
//     <Box>
//       {/* Hero Section */}
//       <HeroSection>
//         <Container maxWidth="lg">
//           <Grid container spacing={4} justifyContent="center" alignItems="center">
//             <Grid item xs={12} md={8} textAlign="center">
//               <GradientTypography variant={isMobile ? 'h3' : 'h2'} component="h1" gutterBottom>
//                 Transform Your Learning Journey
//               </GradientTypography>
//               <Typography variant="h5" paragraph>
//                 Discover a world of knowledge with our interactive learning platform
//               </Typography>
//               <Box mt={4} display="flex" gap={2} justifyContent="center">
//                 <Button 
//                   variant="contained" 
//                   size="large" 
//                   endIcon={<ArrowForward />}
//                   sx={{ px: 4 }}
//                 >
//                   Get Started
//                 </Button>
//                 <Button 
//                   variant="outlined" 
//                   size="large" 
//                   color="inherit"
//                   startIcon={<PlayArrow />}
//                   sx={{ px: 4 }}
//                 >
//                   Watch Demo
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </Container>
//       </HeroSection>

//       {/* Features Section */}
//       <Container maxWidth="lg" sx={{ py: 8 }}>
//         <Typography variant="h3" align="center" gutterBottom>
//           Why Choose Our Platform?
//         </Typography>
//         <Grid container spacing={4} sx={{ mt: 4 }}>
//           {features.map((feature, index) => (
//             <Grid item xs={12} md={4} key={index}>
//               <FeatureCard>
//                 <CardContent sx={{ textAlign: 'center', p: 4 }}>
//                   {feature.icon}
//                   <Typography variant="h5" component="h3" sx={{ mt: 2, mb: 1 }}>
//                     {feature.title}
//                   </Typography>
//                   <Typography color="text.secondary">
//                     {feature.description}
//                   </Typography>
//                 </CardContent>
//               </FeatureCard>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       {/* Stats Section */}
//       <StatsSection>
//         <Container maxWidth="lg">
//           <Grid container spacing={4}>
//             {stats.map((stat, index) => (
//               <Grid item xs={6} md={3} key={index}>
//                 <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
//                   <Typography variant="h3" color="primary" gutterBottom>
//                     {stat.number}
//                   </Typography>
//                   <Typography variant="h6" color="text.secondary">
//                     {stat.label}
//                   </Typography>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </StatsSection>

//       {/* CTA Section */}
//       <Box sx={{ bgcolor: theme.palette.primary.main, color: 'white', py: 8 }}>
//         <Container maxWidth="md" sx={{ textAlign: 'center' }}>
//           <Typography variant="h4" gutterBottom>
//             Ready to Begin Your Learning Journey?
//           </Typography>
//           <Typography variant="h6" sx={{ mb: 4 }}>
//             Join thousands of successful learners today
//           </Typography>
//           <Button 
//             variant="contained" 
//             size="large" 
//             color="secondary"
//             sx={{ px: 6 }}
//           >
//             Start Learning Now
//           </Button>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// const features = [
//   {
//     icon: <Psychology sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
//     title: 'AI-Powered Learning',
//     description: 'Personalized learning paths adapted to your unique style and pace'
//   },
//   {
//     icon: <People sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
//     title: 'Expert Instructors',
//     description: 'Learn from industry professionals with real-world experience'
//   },
//   {
//     icon: <EmojiEvents sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
//     title: 'Recognized Certificates',
//     description: 'Earn valuable credentials respected by employers worldwide'
//   }
// ];

// const stats = [
//   { number: '50K+', label: 'Active Learners' },
//   { number: '1000+', label: 'Expert Instructors' },
//   { number: '2500+', label: 'Courses Available' },
//   { number: '98%', label: 'Success Rate' }
// ];

// export default LandingPage;

// File: src/components/Homepage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import {


  Typography,
  Button,
  // CalendarMonthIcon,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  TextField,
  Pagination,
  InputAdornment,
  Box,
  Avatar,
  IconButton,


  Paper,
  Chip,


  ThemeProvider,
  Skeleton,
  createTheme,
  CssBaseline,
  CircularProgress,
  Divider,
  Fab,
  alpha,
  CardActions,
  useMediaQuery,
  Fade,
  Grow
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Tooltip from '@mui/material/Tooltip';
import { keyframes } from '@emotion/react';

import {

  CalendarMonth as CalendarIcon,
  Create as PenIcon,
  Code as CodeIcon,
  Storage as DatabaseIcon,
  ArrowForward as ArrowRightIcon,
  Settings as SettingsIcon,
  Layers as LayersIcon,
  Chat as ChatIcon,


  ChevronRight as NextIcon,
  ChevronLeft as PrevIcon,
  Star as StarIcon,

  Verified as VerifiedIcon,
  ArrowForward as ArrowForwardIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  VideoCall as VideoCallIcon
  // Assignment as AssignmentIcon
} from '@mui/icons-material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
//import LinkedInIcon from '@mui/icons-material/LinkedIn';
//import FacebookIcon from '@mui/icons-material/Facebook';
//import InstagramIcon from '@mui/icons-material/Instagram';
//import EmailIcon from '@mui/icons-material/Email';


// Optional: bounce or pulse animation
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;



// Create an enhanced theme instance with better aesthetic appeal
const theme = createTheme({
  palette: {
    primary: {
      light: '#4dabf5',
      main: '#1976d2',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f73378',
      main: '#e91e63',
      dark: '#c2185b',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff'
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568'
    },
    grey: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em'
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem'
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem'
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
    '0 3px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1)',
    '0 10px 20px rgba(0,0,0,0.05), 0 3px 6px rgba(0,0,0,0.1)',
    '0 15px 25px rgba(0,0,0,0.05), 0 5px 10px rgba(0,0,0,0.1)',
    ...Array(20).fill('none') // Fill the rest with placeholder values
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        }
      }
    }
  },
});

const assessmentCategories = [
  {
    name: 'Assignment',
    icon: <AssessmentIcon />,
    href: '/viewassignment',
  },

  {
    name: 'Quiz',
    icon: <CodeIcon />,
    href: '/dashboard',

  },
  // add your items
];



// Fallback course data in case API call fails
const fallbackCourses = [
  {
    _id: '1',
    title: 'Advanced JavaScript: Beyond the Basics',
    instructorName: 'John Doe',
    subtitle: 'Master modern JavaScript features and build professional web applications',
    pricing: '1999',
    image: '/api/placeholder/400/180',
    rating: 4.8,
    students: 12550,
    level: 'Intermediate'
  },
  {
    _id: '2',
    title: 'Python for Data Science & Machine Learning',
    instructorName: 'Jane Smith',
    subtitle: 'Learn Python programming with practical data science applications',
    pricing: '2499',
    image: '/api/placeholder/400/180',
    rating: 4.9,
    students: 18730,
    level: 'All Levels'
  },
  {
    _id: '3',
    title: 'React & Redux: Build Professional Applications',
    instructorName: 'Alex Johnson',
    subtitle: 'Create modern user interfaces with React and state management with Redux',
    pricing: '3299',
    image: '/api/placeholder/400/180',
    rating: 4.7,
    students: 9270,
    level: 'Advanced'
  },
  {
    _id: '4',
    title: 'Data Structures & Algorithms Masterclass',
    instructorName: 'Sarah Williams',
    subtitle: 'Master essential computer science concepts with hands-on problem solving',
    pricing: '4999',
    image: '/api/placeholder/400/180',
    rating: 4.8,
    students: 14890,
    level: 'Intermediate'
  },
  {
    _id: '5',
    title: 'Machine Learning A-Z: Complete ML & AI Guide',
    instructorName: 'Michael Brown',
    subtitle: 'Comprehensive introduction to machine learning algorithms and AI applications',
    pricing: '5999',
    image: '/api/placeholder/400/180',
    rating: 4.9,
    students: 25640,
    level: 'All Levels'
  },
  {
    _id: '6',
    title: 'Full Stack Development Bootcamp',
    instructorName: 'Emily Davis',
    subtitle: 'Become a complete web developer with MERN stack technologies',
    pricing: '7999',
    image: '/api/placeholder/400/180',
    rating: 4.8,
    students: 11230,
    level: 'Advanced'
  },
  {
    _id: '7',
    title: 'Flutter & Dart: Cross-Platform App Development',
    instructorName: 'David Wilson',
    subtitle: 'Create beautiful cross-platform mobile apps for iOS and Android',
    pricing: '4499',
    image: '/api/placeholder/400/180',
    rating: 4.7,
    students: 7650,
    level: 'Intermediate'
  },
  {
    _id: '8',
    title: 'DevOps Mastery: CI/CD, Docker & Kubernetes',
    instructorName: 'Robert Taylor',
    subtitle: 'Learn modern development operations practices for cloud-native applications',
    pricing: '6499',
    image: '/api/placeholder/400/180',
    rating: 4.8,
    students: 5980,
    level: 'Advanced'
  }
];

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(null);
  //const [setAnchorEl] = useState(null);
  const [events, setEvents] = useState([]);
  const [setUserMenuAnchor] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const coursesPerPage = 4;
  const carouselRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const pageSize = 4;

  const navigate = useNavigate();
  // const { pathname } = useLocation();

  const handleSubscribe = () => {
    // you could also add email validation here
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  useEffect(() => {
    // Fetch courses from backend when component mounts
    window.scrollTo(0, 0);

    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/lecture/');
        const eventsData = await response.json();

        if (Array.isArray(eventsData)) {
          const sortedEvents = eventsData.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateA - dateB;
          });
          setEvents(sortedEvents);
        } else {
          console.error('Events data is not an array:', eventsData);
        }

      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };



    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        console.log('Fetched Data:', data); // Check the structure here
        setCourses(Array.isArray(data) ? data : data.courses || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Call both functions
    fetchEvents();
    fetchCourses();

    // Auto carousel functionality
    const interval = setInterval(() => {
      if (!isTransitioning) {
        handleNextPage();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  // const handleMenuOpen = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleUserMenuOpen = (event) => {
  //   setUserMenuAnchor(event.currentTarget);
  // };

  // const handleUserMenuClose = () => {
  //   setUserMenuAnchor(null);
  // };

  const handleNextPage = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const displayCourses = courses.length > 0 ? courses : fallbackCourses;
    const maxPages = Math.ceil(displayCourses.length / coursesPerPage);

    setTimeout(() => {
      setCurrentPage(prev => (prev + 1) % maxPages);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevPage = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const displayCourses = courses.length > 0 ? courses : fallbackCourses;
    const maxPages = Math.ceil(displayCourses.length / coursesPerPage);

    setTimeout(() => {
      setCurrentPage(prev => (prev - 1 + maxPages) % maxPages);
      setIsTransitioning(false);
    }, 300);
  };

  // Function to handle direct page jumps for pagination dots
  const handlePageJump = (pageIndex) => {
    if (isTransitioning || pageIndex === currentPage) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(pageIndex);
      setIsTransitioning(false);
    }, 300);
  };

  // Function to render course cards with enhanced carousel
  const renderCourseCards = () => {

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress color="primary" size={60} thickness={4} />
        </Box>
      );
    }

    if (error && courses.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 6, color: 'error.main' }}>

          <Typography variant="h6">{error}</Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    const displayCourses = courses.length > 0 ? courses : fallbackCourses;

    if (displayCourses.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6">No courses available at the moment.</Typography>
        </Box>
      );
    }

    const startIndex = currentPage * coursesPerPage;
    const selectedCourses = displayCourses.slice(startIndex, startIndex + coursesPerPage);

    return (
      <Fade in={!isTransitioning} timeout={400}>
        <Grid container spacing={3}>
          {selectedCourses.map((course) => (
            <Grid item xs={12} sm={6} md={3} key={course._id}>
              <Grow in={!isTransitioning} timeout={600}>
                <Card elevation={2}
                  onClick={() => {
                    navigate(`/course/${course._id}`);
                    setTimeout(() => window.scrollTo(0, 0), 0); // Defer executionsetTimeout(() => window.scrollTo(0, 0), 0); // Defer execution
                  }
                  }>
                  <CardActionArea>
                    <Box sx={{ position: 'relative', height: 180 }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={course.image || "/api/placeholder/400/180"}
                        alt={course.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                          <Chip
                            label={course.level}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.85)',
                              color: 'text.primary',
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                        <DatabaseIcon sx={{ color: 'white', fontSize: 48, opacity: 0.9 }} />
                      </Box>
                    </Box>
                    <CardContent sx={{ px: 3, py: 2.5 }}>
                      <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1rem', lineHeight: 1.3, height: 42, overflow: 'hidden' }}>
                        {course.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{ width: 20, height: 20, fontSize: '0.75rem', bgcolor: theme.palette.primary.main, mr: 1 }}
                          >
                            {course.instructorName?.charAt(0) || ''}
                          </Avatar>
                          {course.instructorName}
                        </Typography>
                        {Math.random() > 0.5 && (
                          <VerifiedIcon sx={{ fontSize: 14, ml: 0.5, color: theme.palette.primary.main }} />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          height: 40,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          opacity: 0.9
                        }}
                      >
                        {course.subtitle}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StarIcon sx={{ color: 'orange', fontSize: 18, mr: 0.5 }} />
                          <Typography variant="body2" fontWeight="bold">
                            {course.rating || 4.8}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontSize: '0.75rem' }}>
                            {course && course.students && typeof course.students === 'number'
                              ? course.students.toLocaleString()
                              : '10K+'}
                          </Typography>

                        </Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          ₹{course.pricing}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Fade>
    );
  };



  // Function to render pagination indicators
  const renderPaginationDots = () => {
    const displayCourses = courses.length > 0 ? courses : fallbackCourses;
    const maxPages = Math.ceil(displayCourses.length / coursesPerPage);

    if (maxPages <= 1) return null;

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 1 }}>
        {Array.from({ length: maxPages }).map((_, index) => (
          <Box
            key={index}
            onClick={() => handlePageJump(index)}
            sx={{
              width: currentPage === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: currentPage === index ? theme.palette.primary.main : 'grey.300',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: currentPage === index ? 'primary.dark' : 'grey.400',
              }
            }}
          />
        ))}
      </Box>
    );
  };


  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get time in 12-hour format
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return timeString;
    }
  };

  // Calculate if an event is happening soon (within 48 hours)
  const isHappeningSoon = (dateStr, timeStr) => {
    const eventDate = new Date(`${dateStr} ${timeStr}`);
    const now = new Date();
    const diffHours = (eventDate - now) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 48;
  };

  // Generate a background gradient based on the event topic
  const getCardBackground = (topic) => {
    const hashCode = topic.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const hue = Math.abs(hashCode % 360);
    return `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(${hue}, ${Math.abs(hashCode % 100) + 155}, ${Math.abs((hashCode * 13) % 100) + 155}, 0.1) 100%)`;
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedEvents = events.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(events.length / pageSize);


  // Enhanced quick link cards
  const quickLinks = [
    {
      title: 'COURSES',
      icon: <PenIcon />,
      description: 'Courses by top Coder instructors.',
      color: theme.palette.secondary.main,
      bgColor: 'rgba(233, 30, 99, 0.05)',
      href: '/displayCourse', // Updated for routing,
      bigIcon: <PenIcon sx={{ fontSize: 120 }} />
    },
    {
      title: 'LIVE LECTURE',
      icon: <CalendarIcon />,
      description: 'Attend live lectures by top Coder instructors',
      color: theme.palette.primary.main,
      bgColor: 'rgba(25, 118, 210, 0.05)',
      href: '/fetchlecture',
      bigIcon: <CalendarIcon sx={{ fontSize: 120 }} />
    },
    {
      title: 'ASSIGNMENT',
      icon: <LayersIcon />,
      description: 'When in doubt, solve. Practise.',
      color: theme.palette.success.main,
      bgColor: 'rgba(76, 175, 80, 0.05)',
      href: '/viewassignment',
      bigIcon: <LayersIcon sx={{ fontSize: 120 }} />
    },
    {
      title: 'TOOLS',
      icon: <SettingsIcon />,
      description: 'Every tool a developer needs.',
      color: theme.palette.secondary.dark,
      bgColor: 'rgba(233, 30, 99, 0.05)',
      href: '#tools',
      bigIcon: <SettingsIcon sx={{ fontSize: 120 }} />
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage: 'linear-gradient(to bottom, rgba(236, 240, 243, 0.8), rgba(236, 240, 243, 0))',
        backgroundSize: '100% 100vh',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Header would typically go here */}

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Hero Section */}
          <Box sx={{
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            height: { xs: 340, md: 400 },
            mb: 6,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <Box sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #051937, #004d7a, #008793, #00bf72)',
              zIndex: 0
            }} />

            {/* Abstract shapes */}
            <Box sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.1,
              background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 20%), radial-gradient(circle at 75% 80%, rgba(255,255,255,0.2) 0%, transparent 15%)',
              zIndex: 1
            }} />

            <Container maxWidth="lg" sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2,
              px: { xs: 3, md: 8 }
            }}>
              <Typography
                variant="h2"
                color="white"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  mb: 2
                }}
              >
                Enhance Your Coding Skills Today
              </Typography>

              <Typography
                variant="h6"
                color="white"
                sx={{
                  opacity: 0.9,
                  maxWidth: 600,
                  textShadow: '0 1px 5px rgba(0,0,0,0.1)',
                  mb: 4
                }}
              >
                Explore courses, challenges, and tools designed to accelerate your programming journey
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem'
                  }}
                  onClick={() => {
                    navigate('/recommendations');
                    window.scrollTo(0, 0);

                  }}
                >
                  Explore Courses
                </Button>

                {/* <Button 
                      variant="outlined" 
                      sx={{ 
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem', 
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      View Pathway
                    </Button> */}
              </Box>
            </Container>
          </Box>


          <Tooltip title="Any Doubts? Ask me!" placement="left">
            <Box
              onClick={() => navigate('/FAQ')}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 999,
                background: 'linear-gradient(135deg,rgb(212, 48, 108),rgb(240, 176, 214))',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                animation: `${pulse} 2s infinite`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 0 20px rgba(90, 228, 168, 0.7)',
                  transform: 'scale(1.08)',
                },
              }}
            >
              <SmartToyIcon sx={{ color: 'white', fontSize: 34 }} />
            </Box>
          </Tooltip>


          {/* Section 1: Quick Links - Enhanced Design */}
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {quickLinks.map((link, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: link.bgColor,
                    borderRadius: 3,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'transparent',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                      borderColor: alpha(link.color, 0.3)
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ bgcolor: link.color, mr: 2 }}>
                      {link.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{link.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {link.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    endIcon={<ArrowRightIcon />}
                    sx={{
                      mt: 6,
                      color: 'text.primary',
                      '&:hover': { color: link.color },
                      position: 'relative',
                      zIndex: 2
                    }}
                    href={link.href}

                  >
                    View {link.title.toLowerCase()}
                  </Button>

                  <Box sx={{
                    position: 'absolute',
                    bottom: -10,
                    right: -10,
                    opacity: 0.1,
                    color: link.color
                  }}>
                    {link.bigIcon}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Section 2: Featured Courses with Enhanced Carousel */}
          <Box sx={{ mb: 10 }} id="courses" ref={carouselRef}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  width: 6,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: theme.palette.secondary.main,
                  mr: 2
                }} />
                <Typography variant="h4" fontWeight="bold">
                  Courses by Top Instructors
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handlePrevPage}
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  disabled={isTransitioning}
                >
                  <PrevIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleNextPage}
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  disabled={isTransitioning}
                >
                  <NextIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 4,
              pb: 1
            }}>
              {renderCourseCards()}
            </Box>

            {renderPaginationDots()}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<ArrowRightIcon />}
                sx={{
                  borderRadius: 8,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600
                }}
                onClick={() => {
                  navigate('/displayCourse');
                  window.scrollTo(0, 0);
                }
                }
              >
                View All Courses
              </Button>
            </Box>
          </Box>

          {/* Section 3: Enhanced Skill Assessment */}
          <Box sx={{ mb: 10 }} id="skill-assessment">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
                }}
              >
                <PenIcon sx={{ color: 'white', fontSize: 36 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Skill Assessment Center
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}
              >
                Evaluate your programming skills across various domains and get personalized improvement suggestions.
              </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
              {assessmentCategories.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                        '& .icon-container': {
                          transform: 'scale(1.1)',
                        }
                      }
                    }}
                  >
                    <Box
                      className="icon-container"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        bgcolor: `rgba(${index * 30}, ${150 - index * 10}, ${200 - index * 20}, 0.1)`,
                        color: `rgb(${index * 30}, ${150 - index * 10}, ${200 - index * 20})`,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      {category.icon && React.cloneElement(category.icon, { sx: { fontSize: 28 } })}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.count} assessments
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2 }}
                      fullWidth
                      onClick={() => {
                        navigate(category.href);
                        window.scrollTo(0, 0);
                      }
                      }
                    >
                      Take Assessment
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Section 4: Upcoming Events */}
          <Box sx={{ mb: 10, py: 4 }} id="events">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 5,
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 45,
                    borderRadius: 1,
                    bgcolor: theme.palette.primary.main,
                    mr: 2
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Upcoming Live Events
                </Typography>
              </Box>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  fontWeight: 600,
                  borderRadius: 8,
                  px: 3,
                  py: 1,
                  boxShadow: theme.shadows[4],
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    boxShadow: theme.shadows[8],
                  }
                }}
                onClick={() => navigate('/fetchlecture')}
              >
                View All Events
              </Button>
            </Box>

            {loading ? (
              <Grid container spacing={3}>
                {[...Array(4)].map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                      <CardContent>
                        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2, mb: 2 }} />
                        <Skeleton variant="text" height={28} width="80%" />
                        <Skeleton variant="text" height={20} width="60%" />
                        <Skeleton variant="text" height={20} width="40%" />
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 18 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : paginatedEvents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <EventIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No events scheduled yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                  Check back later for upcoming live events and webinars, or sign up for our newsletter to get notified.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {paginatedEvents.map((event) => {
                  const happening = isHappeningSoon(event.date, event.time);
                  return (
                    <Grid item xs={12} sm={6} md={3} key={event._id}>
                      <Card
                        elevation={3}
                        sx={{
                          borderRadius: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          background: getCardBackground(event.topic),
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: theme.shadows[10],
                          },
                          position: 'relative',
                          overflow: 'visible'
                        }}
                      >
                        {happening && (
                          <Chip
                            label="Happening Soon"
                            color="secondary"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: -10,
                              right: 16,
                              fontWeight: 'bold',
                              px: 1,
                              boxShadow: theme.shadows[3]
                            }}
                          />
                        )}

                        <CardMedia
                          component="div"
                          sx={{
                            height: 140,
                            bgcolor: 'rgba(0,0,0,0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottom: `1px solid ${theme.palette.divider}`
                          }}
                        >
                          <VideoCallIcon sx={{ fontSize: 60, color: theme.palette.primary.main, opacity: 0.8 }} />
                        </CardMedia>

                        <CardContent sx={{ p: 3, flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                            sx={{
                              mb: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: 1.3,
                            }}
                          >
                            {event.topic}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              height: 60
                            }}
                          >
                            {event.description}
                          </Typography>

                          <Divider sx={{ my: 2 }} />

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon sx={{ fontSize: 18, mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="body2" fontWeight="medium">
                              {formatDate(event.date)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon sx={{ fontSize: 18, mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="body2" fontWeight="medium">
                              {formatTime(event.time)}
                            </Typography>
                          </Box>

                          {event.speaker && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Avatar
                                sx={{ width: 20, height: 20, mr: 1, backgroundColor: theme.palette.primary.light }}
                              >
                                <PersonIcon sx={{ fontSize: 14 }} />
                              </Avatar>
                              <Typography variant="body2" fontWeight="medium">
                                {event.speaker}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>

                        <CardActions sx={{ p: 3, pt: 0 }}>
                          <Button
                            href={event.meetingLink}
                            target="_blank"
                            variant="contained"
                            fullWidth
                            sx={{
                              borderRadius: 6,
                              textTransform: 'none',
                              py: 1,
                              fontWeight: 600
                            }}
                            startIcon={<VideoCallIcon />}
                          >
                            Join Meeting
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {!loading && events.length > 0 && (
              <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  siblingCount={1}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 'medium',
                    }
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Section 5: Join Community */}
          <Box sx={{ mb: 10 }}>
            <Paper
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Abstract background elements */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.1,
                background: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.5) 0%, transparent 25%), radial-gradient(circle at 85% 60%, rgba(255,255,255,0.5) 0%, transparent 20%)'
              }} />

              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color="white"
                      sx={{
                        mb: 2,
                        fontSize: { xs: '1.75rem', md: '2.25rem' }
                      }}
                    >
                      Join Our Global Developer Community
                    </Typography>
                    <Typography
                      variant="h6"
                      color="white"
                      sx={{
                        mb: 4,
                        opacity: 0.9,
                        fontWeight: 'normal'
                      }}
                    >
                      Connect with 500,000+ developers, participate in code challenges, and attend
                      exclusive webinars. Accelerate your growth with peer learning opportunities.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          bgcolor: '#FFB84C', // Warm amber/gold color that contrasts with blue
                          color: '#1A1A1A', // Dark text for contrast against the light button
                          fontWeight: 'bold',
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          boxShadow: '0 4px 12px rgba(255, 184, 76, 0.4)',
                          '&:hover': {
                            bgcolor: '#F7A922', // Darker shade for hover state
                          }
                        }}
                        startIcon={<ChatIcon />}
                        onClick={() => {
                          navigate('/chat');
                          window.scrollTo(0, 0);
                        }}
                      >
                        Join Community
                      </Button>
                      {/* <Button 
                        variant="outlined" 
                        sx={{ 
                          borderColor: 'white',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                      >
                        Learn More
                      </Button> */}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: 280,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Box sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {/* <CodeIcon sx={{ fontSize: 60, color: 'white' }} /> */}
                      <img
    src="https://cdn-icons-png.flaticon.com/512/1370/1370907.png" // Example image
    alt="Chat Community"
    style={{ width: '70%', height: '70%' }}
  />


                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Section 6: Tools Section */}
          <Box sx={{ mb: 10 }} id="tools">
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  width: 6,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: theme.palette.secondary.dark,
                  mr: 2
                }} />
                <Typography variant="h4" fontWeight="bold">
                  Developer Tools
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {[
                {
                  title: 'Code Editor',
                  description: 'Online IDE with support for 40+ programming languages',
                  icon: <CodeIcon />,
                  color: '#3f51b5',
                  path: '/tools/CodeEditor'
                },
                {
                  title: 'Database Designer',
                  description: 'Visual tool to create and manage database schemas',
                  icon: <DatabaseIcon />,
                  color: '#00bcd4',
                  path: '/tools/DatabaseDesigner'
                },
                {
                  title: 'API Tester',
                  description: 'Test RESTful APIs with a simple interface',
                  icon: <LayersIcon />,
                  color: '#ff5722',
                  path: '/tools/ApiTester '
                },
                {
                  title: 'Project Management',
                  description: 'Plan & Manage Your Projects!',
                  icon: <CodeIcon />,
                  color: '#4caf50',
                  path: '/tools/GithubIntegration'
                }
              ].map((tool, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      borderTop: '4px solid',
                      borderColor: tool.color,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(tool.color, 0.1), color: tool.color, mr: 2 }}>
                        {tool.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {tool.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 'auto', pb: 2 }}>
                      {tool.description}
                    </Typography>
                    <Button
                      variant="text"
                      color="primary"
                      sx={{ alignSelf: 'flex-start' }}
                      endIcon={<ArrowRightIcon />}
                      onClick={() => navigate(tool.path)}
                    >
                      Launch Tool
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              Subscribed successfully!
            </Alert>
          </Snackbar>


          {/* Section 7: Newsletter Subscription */}
          <Box sx={{ mb: 6 }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 6 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Stay Updated with Latest Courses
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Subscribe to our newsletter and get notified about new courses, events, and developer resources.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <TextField
                      placeholder="Enter your email address"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'white'
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        px: 4,
                        whiteSpace: 'nowrap'
                      }}
                      onClick={handleSubscribe}
                    >
                      Subscribe
                    </Button>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    By subscribing, you agree to our Privacy Policy. No spam, ever.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                  <Box sx={{
                    width: '100%',
                    maxWidth: 300,
                    height: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CalendarIcon sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2, opacity: 0.8 }} />
                    <Typography variant="h6" color="text.secondary" align="center">
                      Weekly updates on new courses & tutorials
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Container>

        {/* Footer */}
        <Box sx={{ bgcolor: 'background.paper', py: 6, borderTop: '1px solid', borderColor: 'grey.200' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                  Learnity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your one-stop platform to learn coding, practice skills, and connect with developers worldwide.
                </Typography>
                {/*<Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Social Media Icons */}
                {/* {['#', '#', '#', '#'].map((link, i) => (
                    <IconButton 
                      key={i} 
                      size="small"
                      sx={{ 
                        bgcolor: 'grey.100',
                        '&:hover': { bgcolor: theme.palette.primary.main, color: 'white' }
                      }}
                    >
                      <ChatIcon fontSize="small" />
                    </IconButton>
                  ))}
                </Box> */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Social Media Icons */}
                  {[
                    { icon: <LinkedInIcon fontSize="small" />, link: 'https://linkedin.com' },
                    { icon: <EmailIcon fontSize="small" />, link: 'https://gmail.com' },
                    { icon: <FacebookIcon fontSize="small" />, link: 'https://facebook.com' },
                    { icon: <TwitterIcon fontSize="small" />, link: 'https://twitter.com' }
                  ].map((item, i) => (
                    <IconButton
                      key={i}
                      size="small"
                      href={item.link}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        bgcolor: 'grey.100',
                        '&:hover': { bgcolor: theme.palette.primary.main, color: 'white' }
                      }}
                    >
                      {item.icon}
                    </IconButton>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={6} sm={3} md={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Courses
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {[{ name: 'Web Development', link: 'https://www.upgrad.com/bootcamps/fullstack-development/?utm_source=GOOGLE&utm_medium=NBSEARCH&utm_campaign=IND_ACQ_WEB_GOOGLE_NBSEARCH_BU_UPG_APSE_MSV_Phrase_KH_25_34&utm_content=Web-Development-Full-Course&utm_term=web%20development%20courses&gad_source=1&gbraid=0AAAAACuBnVViq0vJS4zLb3AYwAhFiKcZ5&gclid=Cj0KCQjwoNzABhDbARIsALfY8VPv8Dlwh9FtCuh-E7vMCgLnfIcL8ZCEw3-DbFx18-wdDGYeIc_e-7saAhIsEALw_wcB' },
                  { name: 'Data Science', link: 'https://excelr.in/data_science_course_delhi/?utm_source=GoogleAds&utm_medium=Search&utm_term=data%20science%20courses&utm_content=590353845732&utm_device=c&utm_campaign=Search-DataScience-Delhi&utm_adgroup=Search-DataScience-Course-Exact&utm_location=Delhi&utm_channel=CPC&utm_variety=Text&gad_source=1&gbraid=0AAAAACwq9hQ_AMyG9dIRpJlzzvZqdhpqP&gclid=Cj0KCQjwoNzABhDbARIsALfY8VOfcy47iPkjr--wX-qMfuNreiANnUxG3y77pQxdBRKZWLal1t9pW5IaAnklEALw_wcB' },
                  { name: 'Mobile Development', link: 'https://www.niit.com/india/course/full-stack-development-with-genai-honours-program?utm_source=google&utm_medium=search&utm_campaign=SE_MetroCity__Elv_SECourse&utm_term=learn%20software%20engineering&utm_content=169527982057&gad_source=1&gbraid=0AAAAADfGzf5eeySnjyiTfwLo30P_92Qf-&gclid=Cj0KCQjwoNzABhDbARIsALfY8VOiJWDIP-ekDYua1K5_x2BvaMO7oAXHISJN3raf3WG90AwKl5gUjrcaAvMCEALw_wcB' },
                  { name: 'DevOps', link: 'https://staragile.com/devops/devops-certification-training?utm_source=google_search&utm_medium=cpc&utm_India-Search-DevOps-Exact&gad_source=1&gbraid=0AAAAADPiHN_RgmciLy8uFM6rWKjmQfzhA&gclid=Cj0KCQjwoNzABhDbARIsALfY8VNm2Xs_qTqTxCSRCXQi75mvEzzJZbO5ILycVr3trOIzJY6iM0SnjBAaArdMEALw_wcB' }
                   /* 'Web Development', 'Data Science', 'Mobile Development', 'DevOps'*/].map((item, i) => (
                    <Box component="li" key={i} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        component="a"
                        href={item.link}
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': { color: theme.palette.primary.main }
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={6} sm={3} md={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Resources
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {[{ name: 'Tutorials', link: 'https://www.codingninjas.com/job-bootcamp-web-development?utm_source=google&utm_medium=%5Bsearch%5D&utm_campaign=21025321648_161919826034_b_coding%20classes%20online__700570749749_c____9216963&gad_source=1&gbraid=0AAAAADKwKV0yT4_ApK8mrFTSDyXYRQARG&gclid=Cj0KCQjwoNzABhDbARIsALfY8VMNom28_PTZPtn6y584yF5x3DsM6KqQZNDzKFfzuClMbL6C6tQRlZ0aAu_WEALw_wcB' },
                  { name: 'Documentation', link: 'https://www.altexsoft.com/blog/how-to-write-code-documentation/' },
                  { name: 'Community', link: 'https://codeinstitute.net/global/blog/whats-the-coding-community-like/' },
                  { name: 'Blog', link: 'https://blog.codingblocks.com/' }
                    /*'Tutorials', 'Documentation', 'Community', 'Blog']*/].map((item, i) => (
                    <Box component="li" key={i} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        component="a"
                        href={item.link}
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': { color: theme.palette.primary.main }
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={6} sm={3} md={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Company
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {[{ name: 'About Us', link: '' },
                  { name: 'Careers', link: 'https://www.careergirls.org/careers/computer-programmer/?gad_source=1&gbraid=0AAAAADlc6HPrVm6Qf2OLCzuyo2utlDLCl&gclid=Cj0KCQjwoNzABhDbARIsALfY8VMjMYAFM91v5Tlw4DmlyUP9jYIw7tX5oyw9654sSdVatTRHtZWItisaAqOeEALw_wcB' },
                  { name: 'Press', link: 'https://www.ohr.int/ohr_archive/press-code/' },
                  { name: 'Contact', link: '' }].map((item, i) => (
                    <Box component="li" key={i} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        component="a"
                        href={item.link}
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': { color: theme.palette.primary.main }
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={6} sm={3} md={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Support
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {[{ name: 'Help Center', link: '' },
                  { name: 'Terms of Service', link: 'https://www.lmsportals.com/terms-of-service' },
                  { name: 'Privacy Policy', link: '' },
                  { name: 'FAQ', link: '' }].map((item, i) => (
                    <Box component="li" key={i} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        component="a"
                        href={item.link}
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': { color: theme.palette.primary.main }
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'grey.200', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} CodeLearner. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    component="a"
                    href="#"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': { color: theme.palette.primary.main }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Floating Action Button for Mobile */}
        <Box sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          display: { xs: 'block', md: 'none' },
          zIndex: 5
        }}>
          <Fab
            color="primary"
            aria-label="help"
            sx={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <ChatIcon />
          </Fab>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;