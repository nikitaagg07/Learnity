import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Paper,
  useTheme,
  Fade,
  Avatar,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
} from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventNoteIcon from "@mui/icons-material/EventNote";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/quiz/all");
        setQuizzes(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        // Add artificial delay for better loading UX
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    fetchData();
  }, []);

  // Dummy data for upcoming lectures section
  const upcomingLectures = [
    {
      id: 1,
      title: "Advanced Data Structures",
      instructor: "Dr. Maria Chen",
      time: "Today, 2:00 PM",
      status: "Live Now",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Backend Development with Node.js",
      instructor: "Prof. James Wilson",
      time: "Tomorrow, 10:00 AM",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1470&auto=format&fit=crop"
    }
  ];

  // Progress stats for user
  const userProgress = {
    completedQuizzes: 7,
    totalQuizzes: 12,
    averageScore: 85,
  };
  
  // Render lecture card
  const LectureCard = ({ lecture }) => {
    const isLive = lecture.status === "Live Now";
    
    return (
      <Card 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          boxShadow: isLive ? 
            `0 0 0 2px ${theme.palette.error.main}, 0 4px 20px rgba(0,0,0,0.1)` : 
            '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 2,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
      >
        <Box
          sx={{
            height: 180,
            backgroundImage: `url(${
              lecture.image ||
              "https://images.unsplash.com/photo-1557264337-e8a93017fe92?q=80&w=2070&auto=format&fit=crop"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: 'relative',
          }}
        >
          {/* Gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
            }}
          />
          
          {/* Status indicator */}
          {isLive && (
            <Chip
              icon={<LiveTvIcon fontSize="small" />}
              label="LIVE"
              color="error"
              size="small"
              sx={{ 
                position: 'absolute', 
                top: 12, 
                right: 12,
                fontWeight: 'bold',
                '& .MuiChip-icon': { color: 'inherit' }
              }}
            />
          )}
          
          {/* Time indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              color: 'white',
            }}
          >
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption" fontWeight="medium">
              {lecture.time}
            </Typography>
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
            {lecture.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {lecture.instructor}
          </Typography>
          
          <Button
            variant={isLive ? "contained" : "outlined"}
            color={isLive ? "error" : "primary"}
            fullWidth
            sx={{ mt: 2 }}
            startIcon={isLive ? <LiveTvIcon /> : <EventNoteIcon />}
          >
            {isLive ? "Join Now" : "Add to Calendar"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // Render quiz card with enhanced styling
  const QuizCard = ({ quiz }) => {
    // Generate a unique gradient for each quiz based on its ID
    const generateGradient = (id) => {
      const colors = [
        ['#4776E6', '#8E54E9'], // Blue to Purple
        ['#00c6ff', '#0072ff'], // Light Blue to Blue
        ['#f857a6', '#ff5858'], // Pink to Red
        ['#7F00FF', '#E100FF'], // Purple to Pink
        ['#11998e', '#38ef7d'], // Green
        ['#FF8008', '#FFC837'], // Orange to Yellow
      ];
      const index = parseInt(id.slice(-1), 16) % colors.length;
      return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
    };

    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s, box-shadow 0.3s",
          borderRadius: 2,
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardActionArea
          onClick={() => navigate(`/quiz/${quiz._id}`)}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <CardMedia
            component="div"
            sx={{
              height: 160,
              background: generateGradient(quiz._id),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "150%",
                height: "150%",
                opacity: 0.1,
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "15px 15px",
              }}
            />
            <AssignmentIcon sx={{ fontSize: 72, color: "white", opacity: 0.9 }} />
            
            {/* Quiz questions count */}
            <Chip
              label={`${quiz.questions?.length || 0} Questions`}
              size="small"
              sx={{
                position: "absolute",
                bottom: 12,
                right: 12,
                bgcolor: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(4px)",
                color: "white",
                fontWeight: "medium",
              }}
            />
          </CardMedia>
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                color: "text.primary",
                fontWeight: "bold",
                lineHeight: 1.3,
              }}
            >
              {quiz.title}
            </Typography>

            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {quiz.description ||
                `This assessment contains ${quiz.questions?.length || 0} questions to test your knowledge in this subject area.`}
            </Typography>
            
            {/* Difficulty indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" sx={{ mr: 1 }}>Difficulty:</Typography>
              <Chip 
                size="small" 
                label={quiz.difficulty || "Intermediate"} 
                color={
                  (quiz.difficulty === "Easy" && "success") ||
                  (quiz.difficulty === "Hard" && "error") || 
                  "primary"
                }
                variant="outlined"
              />
            </Box>
          </CardContent>
          <Box sx={{ p: 3, pt: 0 }}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/quiz/${quiz._id}`);
              }}
              sx={{ 
                borderRadius: 2, 
                py: 1,
                boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
              }}
            >
              Start Quiz
            </Button>
          </Box>
        </CardActionArea>
      </Card>
    );
  };

  // Skeleton loader for quiz cards
  const QuizCardSkeleton = () => (
    <Card sx={{ height: "100%", borderRadius: 2 }}>
      <Skeleton variant="rectangular" height={160} />
      <CardContent>
        <Skeleton variant="text" height={36} width="80%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} width="60%" />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" height={20} width="40%" />
        </Box>
      </CardContent>
      <Box sx={{ p: 3, pt: 0 }}>
        <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1 }} />
      </Box>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 6,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <Box sx={{ position: "relative" }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              sx={{
                bgcolor: "white",
                color: theme.palette.primary.main,
                width: 56,
                height: 56,
                mr: 2,
              }}
            >
              <SchoolIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Technical Assessment Hub
              </Typography>
              <Typography variant="subtitle1">
                Welcome back! Continue your learning journey and assessments
              </Typography>
            </Box>
          </Box>
{/*  */}
        </Box>
      </Paper>

      {/* Quizzes Section */}
      <Box mb={6}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <QuizIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
            <Typography variant="h5" color="text.primary" fontWeight="bold">
              Available Assessments
            </Typography>
          </Box>
          <Chip 
            label={`${quizzes.length} Available`} 
            color="primary" 
            size="small" 
            variant="outlined"
          />
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <QuizCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              my: 2, 
              borderRadius: 2,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}
          >
            {error}
          </Alert>
        ) : quizzes.length === 0 ? (
          <Alert 
            severity="info" 
            sx={{ 
              my: 2, 
              borderRadius: 2,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}
          >
            No quizzes available at the moment.
          </Alert>
        ) : (
          <Fade in={!loading} timeout={500}>
            <Grid container spacing={3}>
              {quizzes.map((quiz) => (
                <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                  <QuizCard quiz={quiz} />
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;