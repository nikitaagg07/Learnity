import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Button } from '@mui/material';

const ApprovedCoursesDisplay = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/courses?status=published');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        setError(err.message || 'Error fetching courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }

  if (!courses.length) {
    return (
      <Box textAlign="center" py={6}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No Courses"
          style={{ width: 120, marginBottom: 24, opacity: 0.7 }}
        />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No approved courses found.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2, px: { xs: 0, md: 0 }, background: 'transparent' }}>
      <Typography variant="h3" align="center" fontWeight={700} mb={4} color="primary">
        Explore Our Courses
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
            <Card
              sx={{ cursor: 'pointer', height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)', boxShadow: 6 } }}
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              <CardMedia
                component="img"
                height="180"
                image={course.image || 'https://via.placeholder.com/400x180?text=No+Image'}
                alt={course.title}
                sx={{ objectFit: 'cover', borderRadius: 2 }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom noWrap>{course.title}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>{course.subtitle}</Typography>
                <Typography variant="h6" color="secondary" mt={2}>
                  ₹{course.pricing}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ApprovedCoursesDisplay; 