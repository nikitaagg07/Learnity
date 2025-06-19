// Frontend - ScheduleLecture.jsx
import { useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  InputAdornment
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  Title,
  Description,
  Videocam,
  ArrowBack
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScheduleLecture = () => {
  const navigate = useNavigate();
  
  const [lecture, setLecture] = useState({
    topic: "",
    description: "",
    date: "",
    time: "",
    meetingLink: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setLecture({ ...lecture, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create lecture data without image first to check if it's valid
      const lectureData = {
        ...lecture
      };

      // Fix for PayloadTooLargeError: If image exists and is large,
      // we can either:
      // 1. Send it separately as form data
      // 2. Compress it further
      // 3. Store it on the client temporarily and send a reference
      
      // For this solution, we'll further compress the image if it exists
      if (lecture.image) {
        // Further compress large images
        const base64Length = lecture.image.length;
        if (base64Length > 100000) { // If base64 string is large
          const img = new Image();
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 500;
            const MAX_HEIGHT = 300;
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Lower quality for even smaller size
            const compressedImage = canvas.toDataURL('image/jpeg', 0.5);
            lectureData.image = compressedImage;
            
            await submitLecture(lectureData);
          };
          img.src = lecture.image;
        } else {
          // Image is already small enough
          await submitLecture(lectureData);
        }
      } else {
        // No image to compress
        await submitLecture(lectureData);
      }
    } catch (error) {
      console.error("Error scheduling lecture:", error);
      setError(
        error.response?.data?.message || "Failed to schedule lecture. Please try again."
      );
      setLoading(false);
    }
  };

  const submitLecture = async (lectureData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/lecture/create",
        lectureData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          // Add timeout and maxBodyLength/maxContentLength for larger payloads
          timeout: 10000,
          maxContentLength: 2000000, // 2MB limit
          maxBodyLength: 2000000 // 2MB limit
        }
      );

      console.log("Lecture created successfully:", response.data);
      setSuccess(true);
      setLoading(false);

      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        setLecture({
          topic: "",
          description: "",
          date: "",
          time: "",
          meetingLink: "",
          image: "",
        });
        navigate("/updateCourse");
      }, 2000);
    } catch (error) {
      console.error("Error in submitLecture:", error);
      setError(
        error.response?.data?.message || "Failed to schedule lecture. Please try again."
      );
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0]; // formats as 'YYYY-MM-DD'
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess(false);
  };

  const handleBackButton = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Box sx={{ 
      py: 6, 
      px: 2, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      bgcolor: '#f5f5f5' 
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Left column with image */}
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  overflow: 'hidden', 
                  borderRadius: 2 
                }}
              >
                <Box sx={{ bgcolor: 'primary.main', p: 3, color: 'white' }}>
                  <Typography variant="h4" fontWeight="bold">
                    Schedule a Live Lecture
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                    Create engaging sessions for your students
                  </Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flexGrow: 1, position: 'relative', bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Replaced external placeholder with styled div to avoid API call */}
                    <Box sx={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center', 
                      flexDirection: 'column',
                      bgcolor: '#e0e0e0'
                    }}>
                      <Videocam sx={{ fontSize: 60, color: '#9e9e9e', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary">
                        Live Session Illustration
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        p: 2, 
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', 
                        color: 'white' 
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Videocam sx={{ mr: 1 }} />
                        <Typography variant="h6">Live Learning Experience</Typography>
                      </Box>
                      <Typography variant="body2">
                        Connect with your students in real-time through interactive lectures and discussions.
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                      Benefits of Live Lectures
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        "Real-time interaction with students",
                        "Immediate feedback and Q&A opportunities",
                        "Build stronger connections with your audience",
                        "Deliver complex topics with visual aids"
                      ].map((benefit, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              bgcolor: 'primary.main', 
                              mr: 1.5 
                            }} 
                          />
                          <Typography variant="body2">{benefit}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
          
          {/* Right column with form */}
          <Grid item xs={12} md={7}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3
                  }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={handleBackButton}
                  sx={{ mr: 2, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  Back
                </Button>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Schedule a Live Lecture
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fill in the details below to create a new lecture session
                  </Typography>
                </Box>
              </Box>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="lecture-topic" shrink>
                    Lecture Topic
                  </InputLabel>
                  <TextField
                    id="lecture-topic"
                    name="topic"
                    value={lecture.topic}
                    onChange={handleChange}
                    placeholder="Enter a clear and concise topic title"
                    required
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Title color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Enter a clear and concise topic title"
                  />
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel htmlFor="lecture-description" shrink>
                    Description
                  </InputLabel>
                  <TextField
                    id="lecture-description"
                    name="description"
                    value={lecture.description}
                    onChange={handleChange}
                    placeholder="Provide details about what will be covered in this lecture"
                    required
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    InputProps={{	
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Provide details about what will be covered in this lecture"
                  />
                </FormControl>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="lecture-date" shrink>
                        Date
                      </InputLabel>
                      <TextField
                        id="lecture-date"
                        name="date"
                        type="date"
                        value={lecture.date}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        inputProps={{ min: today }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        helperText="Select the date for your lecture"
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="lecture-time" shrink>
                        Time
                      </InputLabel>
                      <TextField
                        id="lecture-time"
                        name="time"
                        type="time"
                        value={lecture.time}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTime color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        helperText="Select the start time of your lecture"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                
                <FormControl fullWidth>
                  <InputLabel htmlFor="lecture-link" shrink>
                    Meeting Link (optional)
                  </InputLabel>
                  <TextField
                    id="lecture-link"
                    name="meetingLink"
                    type="url"
                    value={lecture.meetingLink}
                    onChange={handleChange}
                    placeholder="Add Zoom/Google Meet/Microsoft Teams link if available"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Videocam color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Add Zoom/Google Meet/Microsoft Teams link if available"
                  />
                </FormControl>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: 'bold',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    {loading ? "Processing..." : "Schedule Lecture"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar 
        open={success} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Lecture scheduled successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScheduleLecture;