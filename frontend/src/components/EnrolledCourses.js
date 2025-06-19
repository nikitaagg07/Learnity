
import React, { useEffect, useState } from 'react';
import courseGridBg from '../assets/course4.jpg'; // Adjust the path

import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, CircularProgress, Box, CardMedia, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = ({ learnerId }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (learnerId) {
      const fetchEnrolledCourses = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/learners/enrolled/${learnerId}`);
          setEnrolledCourses(response.data);
        } catch (error) {
          setError('Error fetching enrolled courses');
        } finally {
          setLoading(false);
        }
      };
      fetchEnrolledCourses();
    } else {
      setLoading(false);
    }
  }, [learnerId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!learnerId) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          No learner ID found. Please log in again.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      //  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1 )), url(${courseGridBg})`, 
      //  backgroundSize: 'cover',backgroundPosition: 'center', backgroundRepeat: 'no-repeat', 
      padding: 4, backgroundColor: '#eef2f3', minHeight: '100vh',paddingY:10 }}>
      <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
        Your Learning Dashboard
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
        Track your progress and continue your learning journey.
      </Typography>
      <Grid container spacing={4}>
        {enrolledCourses.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ width: '100%',paddingY:5  }}>
            You haven't enrolled in any courses yet.
          </Typography>
        ) : (
          enrolledCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card sx={{
                borderRadius: 2,
                boxShadow: 5,
                transition: '0.3s',
                '&:hover': { boxShadow: 8, transform: 'scale(1.03)' },
                overflow: 'hidden',
                backgroundColor: '#ffffff',
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={course.image || 'https://via.placeholder.com/300'}
                  alt={course.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {course.title}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Chip label={course.category || 'No Category'} color="primary" size="small" />
                    <Typography variant="body2" fontWeight="bold" color="secondary">
                      Level: {course.level || 'N/A'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {course.description || 'No description available'}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ py: 1.2, fontSize: '1rem', fontWeight: 'bold' }}
                    onClick={() => navigate(`/course-display/${course._id}`)}
                  >
                    Resume Course
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default EnrolledCourses;
