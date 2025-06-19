// HomePage.js (Course Listing)
import React, { useEffect, useState } from 'react';
import courseGridBg from '../assets/course4.jpg'; // Adjust the path

import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  CircularProgress, 
  Box,
  Chip,
  IconButton,
  Paper,
  styled
} from '@mui/material';
import { 
  Language, 
  SignalCellularAlt, 
  AccessTime, 
  BookmarkBorder,
  Star
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
  },
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url("/assets/course3.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: theme.palette.common.white,
  padding: theme.spacing(2, 0),
  marginBottom: theme.spacing(6),
}));

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      backgroundImage: `linear-gradient(to bottom right, rgba(238, 246, 246, 0.8), rgba(231, 237, 239, 0.8))`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat', 
      minHeight: '100vh', // Ensure it covers the entire screen height
      display: 'flex',
      paddingY:0.2,
      flexDirection: 'column',
    }}>
      <HeroSection>
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom align="center">
            Explore Top Courses
          </Typography>
          <Typography variant="h5" align="center">
            Learn from world-class instructors and enhance your skills
          </Typography>
        </Container>
      </HeroSection>

      {/* Course Grid */}
      <Container maxWidth="lg" 
  sx={{ 
    // py: 1, 
  }}>
        <Grid container spacing={4}>
          {courses.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ width: "100%" }}>
              No courses available
            </Typography>
          ) : (
            courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <StyledCard>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={course.image || "https://via.placeholder.com/300"}
                      alt={course.title}
                    />
                    <PriceChip label={`₹${course.pricing || 'Free'}`} />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {course.subtitle || "No description available"}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <Language sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            {course.primaryLanguage || "English"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <SignalCellularAlt sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            {course.level || "All Levels"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Button
                      variant="outlined"
                      fullWidth
                      component={Link}
                      to={`/course/${course._id}`}
                      sx={{ mb: 1 }}
                    >
                      View Course
                    </Button>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to={`/payment/${course._id}`}
                      sx={{ mt: 1 }}
                    >
                      Enroll Now
                    </Button>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;