import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  CircularProgress, 
  Divider,
  Container,
  Paper,
  Fade,
  Grow,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QuizIcon from '@mui/icons-material/Quiz';

// Styled components
const ScoreCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '40px auto',
  padding: theme.spacing(3),
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  borderRadius: 16,
  overflow: 'visible',
  backgroundColor: '#ffffff'
}));

const ScoreChip = styled(Chip)(({ theme, score }) => ({
  fontSize: '1.2rem',
  padding: theme.spacing(3),
  height: 'auto',
  fontWeight: 'bold',
  backgroundColor: 
    score >= 80 ? theme.palette.success.light :
    score >= 60 ? theme.palette.warning.light :
    theme.palette.error.light,
  color: 
    score >= 80 ? theme.palette.success.contrastText :
    score >= 60 ? theme.palette.warning.contrastText :
    theme.palette.error.contrastText,
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  minWidth: 120
}));

const Scorecard = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        console.log("Fetching attempt with ID:", attemptId);
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/attempts/${attemptId}`);
        setAttempt(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scorecard:', error);
        setError('Failed to load quiz results. Please try again.');
        setLoading(false);
      }
    };
    
    fetchScorecard();
  }, [attemptId]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToDashboard}
            sx={{ mt: 2 }}
          >
            Back to HomePage
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Fade in={!loading} timeout={800}>
        <Container maxWidth="md">
        {attempt ? (
          <ScoreCard>
            <Grow in={!loading} timeout={1000}>
              <Box sx={{ textAlign: 'center' }}>
                <EmojiEventsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom>
                  Quiz Results
                </Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  {attempt.quizId?.title || 'Quiz'}
                </Typography>
              </Box>
            </Grow>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Grow in={!loading} timeout={1500}>
                <ScoreChip 
                  label={`${attempt.score}%`}
                  score={attempt.score}
                  icon={<EmojiEventsIcon />}
                />
              </Grow>
            </Box>
            
            <StatsContainer>
              <Grow in={!loading} timeout={1800}>
                <StatItem>
                  <QuizIcon color="primary" sx={{ fontSize: 28, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Total Questions
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, color: 'primary.main' }}>
                    {attempt.correctAnswers + attempt.wrongAnswers}
                  </Typography>
                </StatItem>
              </Grow>
              
              <Grow in={!loading} timeout={2000}>
                <StatItem>
                  <CheckCircleIcon color="success" sx={{ fontSize: 28, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Correct Answers
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, color: 'success.main' }}>
                    {attempt.correctAnswers}
                  </Typography>
                </StatItem>
              </Grow>
              
              <Grow in={!loading} timeout={2200}>
                <StatItem>
                  <CancelIcon color="error" sx={{ fontSize: 28, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Wrong Answers
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, color: 'error.main' }}>
                    {attempt.wrongAnswers}
                  </Typography>
                </StatItem>
              </Grow>
            </StatsContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToDashboard}
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: 3,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 6,
                    transition: 'all 0.3s'
                  }
                }}
              >
                Back to Dashboard
              </Button>
            </Box>
          </ScoreCard>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress size={60} />
          </Box>
        )}
      </Container>
    </Fade>
    </Box>
  );
};

export default Scorecard;