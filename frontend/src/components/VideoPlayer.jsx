import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  LinearProgress,
  styled,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  PlayCircleOutline,
  Lock,
  ExpandMore,
  Bookmark,
  BookmarkBorder,
  Note,
  Quiz,
  AttachFile,
  FormatQuote,
  CloudDownload,
  ArrowForward,
  FilterList,
  Search,
  School
} from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Properly styled LinearProgress with fixed syntax
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.MuiLinearProgress-determinate`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
  },
}));

// Properly styled LessonCard with fixed syntax
const LessonCard = styled(Card)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[5],
    transform: "translateY(-3px)",
  }
}));

// Corrected TabPanel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

// Main VideoPlayer component with progress tracking
const VideoPlayer = () => {
  const { courseId, lessonIndex } = useParams();
  const navigate = useNavigate();
  const currentLessonIdx = parseInt(lessonIndex);
  
  // State variables
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    completedLessons: [],
    progressPercentage: 0
  });
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [accessDenied, setAccessDenied] = useState(false);
  const [progressUpdated, setProgressUpdated] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [bookmarked, setBookmarked] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(true);

  // Get user ID
  const learnerId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

  // Start time for tracking time spent
  let startTime = null;

  // Mock quiz data
  const quizQuestions = [
    {
      id: 1,
      question: "What is the main benefit of this lesson?",
      options: ["Improved knowledge", "Better skills", "Career advancement", "All of the above"],
      correctAnswer: 3
    },
    {
      id: 2,
      question: "Which concept was covered in this lesson?",
      options: ["Database design", "UI patterns", "Algorithm complexity", "Network protocols"],
      correctAnswer: 1
    }
  ];

  // Mock resources data
  const resources = [
    { id: 1, title: "Supplementary Reading", type: "PDF", url: "/downloads/er-1.pdf" },
    { id: 2, title: "Practice Exercises", type: "DOC", url: "/downloads/er-2.pdf" },
    { id: 3, title: "Code Examples", type: "ZIP", url: "/downloads/er-3.pdf" }
  ];

  // Fetch progress data
  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await axios.get(`/api/progress/${learnerId}/${courseId}`);
        setProgressData(res.data);
        
        // Update local state with fetched data
        if (res.data && res.data.completedLessons) {
          setCompletedLessons(res.data.completedLessons);
          if (course && course.curriculum) {
            const progressPercentage = (res.data.completedLessons.length / course.curriculum.length) * 100;
            setProgress(progressPercentage);
          }
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    }
    
    if (learnerId && courseId) {
      fetchProgress();
    }
  }, [learnerId, courseId, course]);

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}?learnerId=${learnerId}`);

        if (!response.ok) throw new Error("Failed to fetch course data");
        
        const data = await response.json();
        setCourse(data);

        const isLocked = data.curriculum[lessonIndex] && !data.curriculum[lessonIndex].freePreview;
        setAccessDenied(isLocked && !learnerId);

        // Try to fetch progress from server first
        if (learnerId) {
          try {
            const progressResponse = await fetch(`http://localhost:5000/api/progress/${learnerId}/${courseId}`);
            if (progressResponse.ok) {
              const progressData = await progressResponse.json();
              setCompletedLessons(progressData.completedLessons || []);
              if (data.curriculum && data.curriculum.length > 0) {
                setProgress((progressData.completedLessons.length / data.curriculum.length) * 100);
              }

              // Load saved notes
              const storedNotes = localStorage.getItem(`notes_${courseId}_${learnerId}`) || "{}";
              setSavedNotes(JSON.parse(storedNotes));
              setNotes(JSON.parse(storedNotes)[currentLessonIdx] || "");

              // Load bookmarks
              const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${courseId}_${learnerId}`) || "[]");
              setBookmarked(bookmarks.includes(currentLessonIdx));

              return;
            }
          } catch (err) {
            console.log("Falling back to local storage for progress");
          }
        }

        // Fallback to local storage
        const storedProgress = JSON.parse(localStorage.getItem(`progress_${courseId}`)) || [];
        setCompletedLessons(storedProgress);
        if (data.curriculum && data.curriculum.length > 0) {
          setProgress((storedProgress.length / data.curriculum.length) * 100);
        }
        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
    // Initialize timer when component mounts
    startTimer();
  }, [courseId, lessonIndex, learnerId, currentLessonIdx]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Start timer function
  const startTimer = () => {
    startTime = new Date().getTime();
  };

  // Mark lesson as complete
  const markAsComplete = async (index) => {
    if (!learnerId) {
      console.error("❌ Error: learnerId is missing! User must be logged in to track progress.");
      return;
    }
  
    if (!completedLessons.includes(index)) {
      const updatedLessons = [...completedLessons, index];
      setCompletedLessons(updatedLessons);
      
      // Only update progress if we have course data
      if (course && course.curriculum) {
        setProgress((updatedLessons.length / course.curriculum.length) * 100);
      }
  
      // Update local storage for immediate feedback
      localStorage.setItem(`progress_${courseId}`, JSON.stringify(updatedLessons));
  
      // Track time spent on the lesson
      const endTime = new Date().getTime();
      const timeSpent = Math.floor((endTime - (startTime || endTime)) / 1000); // in seconds
  
      try {
        console.log("Sending progress update:", { learnerId, courseId, lessonIndex: index, timeSpent });
  
        const response = await fetch("http://localhost:5000/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            learnerId, 
            courseId, 
            lessonIndex: index,
            timeSpent
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update progress on the server");
        }
  
        setProgressUpdated(true);
        console.log("✅ Progress updated successfully!");
  
        // Auto-hide the success message after 3 seconds
        setTimeout(() => {
          setProgressUpdated(false);
        }, 3000);
      } catch (err) {
        console.error("❌ Failed to update progress:", err);
      }
    }
  };

  // Handle lesson click
  const handleLessonClick = (index) => {
    if (course && course.curriculum && (course.curriculum[index].freePreview || learnerId)) {
      navigate(`/video/${courseId}/${index}`);
    }
  };

  // Get embed URL for videos
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const fileId = url.split("/d/")[1]?.split("/")[0];
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
  };

  // Save notes
  const saveNotes = () => {
    const updatedNotes = { ...savedNotes, [currentLessonIdx]: notes };
    setSavedNotes(updatedNotes);
    localStorage.setItem(`notes_${courseId}_${learnerId}`, JSON.stringify(updatedNotes));
    
    // Show temporary success message
    setProgressUpdated(true);
    setTimeout(() => setProgressUpdated(false), 3000);
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${courseId}_${learnerId}`) || "[]");
    let updatedBookmarks;
    
    if (bookmarks.includes(currentLessonIdx)) {
      updatedBookmarks = bookmarks.filter(idx => idx !== currentLessonIdx);
      setBookmarked(false);
    } else {
      updatedBookmarks = [...bookmarks, currentLessonIdx];
      setBookmarked(true);
    }
    
    localStorage.setItem(`bookmarks_${courseId}_${learnerId}`, JSON.stringify(updatedBookmarks));
  };

  // Handle quiz submission
  const handleQuizSubmit = () => {
    // In a real app, you would send this to your backend
    console.log("Quiz answers submitted:", quizAnswers);
    setShowQuiz(false);
    
    // Show success message
    setProgressUpdated(true);
    setTimeout(() => setProgressUpdated(false), 3000);
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" height="100vh">
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2 }}>Loading course material...</Typography>
    </Box>
  );
  
  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>Error Loading Course</Typography>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Paper>
    </Box>
  );
  
  if (!course) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Course Not Found</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/courses")}>
          Browse Courses
        </Button>
      </Paper>
    </Box>
  );
  
  if (accessDenied) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <School sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>Premium Content</Typography>
          <Alert severity="warning" sx={{ mb: 3 }}>
            You need to enroll in this course to access this lesson.
          </Alert>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate(`/course-display/${courseId}`)}
          >
            View Course Details
          </Button>
        </Paper>
      </Container>
    );
  }

  const currentLesson = course.curriculum[currentLessonIdx];

  // Calculate if there are any saved notes to display
  const hasSavedNotes = Object.keys(savedNotes).length > 0;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8}}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">{course.title}</Typography>
        </Box>
        
        <Box>
          <Tooltip title={bookmarked ? "Remove Bookmark" : "Add Bookmark"}>
            <IconButton onClick={toggleBookmark} color={bookmarked ? "primary" : "default"}>
              {bookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Progress Section */}
      <Paper elevation={2} sx={{ p: 1, mb: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body1" fontWeight="medium">Course Progress</Typography>
          <Typography variant="body2" color="text.secondary">
            {completedLessons.length}/{course.curriculum.length} lessons completed
          </Typography>
        </Box>
        
        {/* Use Material UI's LinearProgress */}
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            '& .MuiLinearProgress-bar': {
              background: (theme) => 
                `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`
            }
          }}
        />
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}% Complete
          </Typography>
          <Chip 
            label={
              progress < 25 ? "Just Started" : 
              progress < 50 ? "Making Progress" : 
              progress < 75 ? "Well Underway" : 
              progress < 100 ? "Almost There" : "Completed"
            }
            color={
              progress < 25 ? "default" : 
              progress < 50 ? "info" : 
              progress < 75 ? "primary" : 
              progress < 100 ? "warning" : "success"
            }
            size="small"
          />
        </Box>
      </Paper>

      <Grid container spacing={4} sx={{ height: '90vh' }}>
        {/* Main Content Area */}
        <Grid item xs={12} md={8} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ mb: 3, overflow: 'hidden', flexGrow: 1 }}>
            <Paper sx={{ p: 2, backgroundColor: 'rgb(55, 189, 238)', color: 'white' }}>
              <Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
              {currentLesson?.title || "Lesson"}</Typography>
            </Paper>
            
            <Box sx={{ width: '100%', height: '60vh', display: 'flex', justifyContent: 'center' }}>
              <iframe 
                src={getEmbedUrl(currentLesson?.videoUrl)} 
                style={{ 
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen 
                title="Lesson Video"
              ></iframe>
            </Box>
            
            <Box display="flex" justifyContent="space-between" p={2} flexWrap="wrap">
              <Button 
                variant="outlined" 
                disabled={currentLessonIdx === 0}
                onClick={() => handleLessonClick(currentLessonIdx - 1)}
                startIcon={<ArrowBack />}
                sx={{ minWidth: '120px', mb: { xs: 1, sm: 0 } }}
              >
                Previous
              </Button>
              
              <Button 
                variant="contained" 
                color="success" 
                onClick={() => markAsComplete(currentLessonIdx)}
                disabled={!learnerId}
                endIcon={<CheckCircle />}
                sx={{ minWidth: '180px', mb: { xs: 1, sm: 0 } }}
              >
                {completedLessons.includes(currentLessonIdx) ? "Completed" : "Mark as Complete"}
              </Button>
              
              <Button 
                variant="outlined" 
                disabled={currentLessonIdx === course.curriculum.length - 1}
                onClick={() => handleLessonClick(currentLessonIdx + 1)}
                endIcon={<ArrowBack sx={{ transform: 'rotate(180deg)' }} />}
                sx={{ minWidth: '120px' }}
              >
                Next
              </Button>
            </Box>
          </Card>

          {/* Tabs for additional content */}
          <Paper sx={{ mb: 4 }}>
            {/* Import Tabs from MUI */}
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                width: '100%'
              }}
            >
              <Box
                role="tablist"
                sx={{
                  display: 'flex',
                  width: '100%'
                }}
              >
                <Button
                  role="tab"
                  onClick={(e) => handleTabChange(e, 0)}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    color: tabValue === 0 ? 'primary.main' : 'text.secondary',
                    fontWeight: tabValue === 0 ? 'bold' : 'normal',
                    borderBottom: tabValue === 0 ? 2 : 0,
                    borderColor: 'primary.main',
                    p: 2
                  }}
                  startIcon={<Note />}
                >
                  Notes
                </Button>
                <Button
                  role="tab"
                  onClick={(e) => handleTabChange(e, 1)}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    color: tabValue === 1 ? 'primary.main' : 'text.secondary',
                    fontWeight: tabValue === 1 ? 'bold' : 'normal',
                    borderBottom: tabValue === 1 ? 2 : 0,
                    borderColor: 'primary.main',
                    p: 2
                  }}
                  startIcon={<Quiz />}
                >
                  Quiz
                </Button>
                <Button
                  role="tab"
                  onClick={(e) => handleTabChange(e, 2)}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    color: tabValue === 2 ? 'primary.main' : 'text.secondary',
                    fontWeight: tabValue === 2 ? 'bold' : 'normal',
                    borderBottom: tabValue === 2 ? 2 : 0,
                    borderColor: 'primary.main',
                    p: 2
                  }}
                  startIcon={<AttachFile />}
                >
                  Resources
                </Button>
              </Box>
            </Box>
            
            {/* Notes Tab */}
            <TabPanel value={tabValue} index={0}>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder="Take notes for this lesson..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button 
                  variant="contained" 
                  onClick={saveNotes}
                  disabled={!learnerId}
                >
                  Save Notes
                </Button>
              </Box>
            </TabPanel>
            
            {/* Quiz Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box textAlign="center" py={2}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Quiz />}
                  onClick={() => setShowQuiz(true)}
                  disabled={!learnerId}
                >
                  Take Lesson Quiz
                </Button>
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Test your understanding of this lesson with a short quiz
                </Typography>
              </Box>
              
              {/* Quiz Dialog */}
              <Dialog open={showQuiz} onClose={() => setShowQuiz(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                  <Typography variant="h5">Lesson Quiz</Typography>
                </DialogTitle>
                <DialogContent dividers>
                  {quizQuestions.map((q, i) => (
                    <Box key={q.id} mb={4}>
                      <Typography variant="h6" gutterBottom>
                        {i + 1}. {q.question}
                      </Typography>
                      <Grid container spacing={2}>
                        {q.options.map((option, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Card 
                              variant="outlined" 
                              sx={{
                                p: 2,
                                cursor: 'pointer',
                                bgcolor: quizAnswers[q.id] === index ? 'primary.light' : 'background.paper',
                                '&:hover': {
                                  bgcolor: quizAnswers[q.id] === index ? 'primary.light' : 'action.hover',
                                }
                              }}
                              onClick={() => setQuizAnswers({...quizAnswers, [q.id]: index})}
                            >
                              <Typography>{option}</Typography>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowQuiz(false)}>Cancel</Button>
                  <Button variant="contained" color="primary" onClick={handleQuizSubmit}>
                    Submit Answers
                  </Button>
                </DialogActions>
              </Dialog>
            </TabPanel>
            
            {/* Resources Tab */}
            <TabPanel value={tabValue} index={2}>
  <List>
    {resources.map(resource => (
      <ListItem key={resource.id}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Box display="flex" alignItems="center">
            <ListItemText 
              primary={resource.title}
              secondary={`Resource Type: ${resource.type}`}
            />
          </Box>

          {/* Button wrapped in <a> for download */}
          <a 
            href={resource.url}
            download
            style={{ textDecoration: 'none' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudDownload />}
              disabled={!learnerId}
            >
              Download
            </Button>
          </a>
        </Paper>
      </ListItem>
    ))}
  </List>
</TabPanel>

          </Paper>
          
          {/* Lesson Description */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Lesson Description</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                {currentLesson?.description || 
                "This lesson covers key concepts related to the topic. Watch the video carefully and complete the associated activities to get the most out of this material."}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <FormatQuote sx={{ fontSize: 15, transform: 'rotate(180deg)', mr: 1 }} />
                Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.
                <FormatQuote sx={{ fontSize: 15, ml: 1 }} />
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, mb: 4, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">Lessons</Typography>
                <Chip 
                  label={`${completedLessons.length}/${course.curriculum.length}`} 
                  color="primary" 
                  size="small" 
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <List sx={{ maxHeight: '500px', overflow: 'auto' }}>
                {course.curriculum.map((lesson, index) => (
                  <Box key={index} mb={1}>
                    <LessonCard
                      sx={{
                        borderLeft: parseInt(lessonIndex) === index ? 
                          '4px solid #f57c00' : // Orange highlight for current lesson
                          completedLessons.includes(index) ? 
                            '4px solid #4caf50' : // Green for completed lessons
                            '4px solid #1976d2', // Blue for other lessons
                        backgroundColor: parseInt(lessonIndex) === index ? '#fff8e1' : 'transparent',
                        cursor: lesson.freePreview || learnerId ? 'pointer' : 'not-allowed',
                        opacity: (!lesson.freePreview && !learnerId) ? 0.7 : 1
                      }}
                      onClick={() => handleLessonClick(index)}
                    >
                      <ListItem>
                        <Box display="flex" alignItems="center" width="100%">
                          <Box mr={1}>
                            {completedLessons.includes(index) ? (
                              <CheckCircle color="success" />
                            ) : parseInt(lessonIndex) === index ? (
                              <PlayCircleOutline color="warning" />
                            ) : !lesson.freePreview && !learnerId ? (
                              <Lock color="disabled" />
                            ) : (
                              <PlayCircleOutline color="primary" />
                            )}
                          </Box>
                          
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                noWrap
                                sx={{
                                  fontWeight: parseInt(lessonIndex) === index ? 'bold' : 'normal',
                                  maxWidth: '180px'
                                }}
                              >
                                {index + 1}. {lesson.title}
                              </Typography>
                            }
                            secondary={
                              !lesson.freePreview && !learnerId ? 
                                "Locked - Enroll to unlock" : 
                                lesson.duration ? `Duration: ${lesson.duration}` : ""
                            }
                          />
                        
                          {/* Display badges for bookmarked lessons */}
                          {JSON.parse(localStorage.getItem(`bookmarks_${courseId}_${learnerId}`) || "[]").includes(index) && (
                            <Bookmark fontSize="small" color="primary" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      </ListItem>
                    </LessonCard>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
          {/* sidebar end grid below */}
          
{/* Notes Panel - Placed Below Sidebar */}
{showNotesPanel && hasSavedNotes && (
  <Box 
    sx={{ 
      // paddingY:14,
      mt: 2, 
      width: '100%',
      maxHeight: '400px',
      overflowY: 'auto'
    }}
  >
    <Card sx={{ boxShadow: 4, borderRadius: 2, overflow: 'hidden' }}>
      <CardHeader
        title="Your Notes"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 1.5
        }}
        action={
          <Tooltip title="Download All Notes">
            <IconButton color="inherit">
              <CloudDownload />
            </IconButton>
          </Tooltip>
        }
      />
      
      <List sx={{ px: 0 }}>
        {Object.entries(savedNotes).length > 0 ? (
          Object.entries(savedNotes).map(([lessonIdx, noteText]) => {
            if (!noteText) return null;
            const lessonIndex = parseInt(lessonIdx);
            const lessonTitle = course.curriculum[lessonIndex]?.title || `Lesson ${Number(lessonIndex) + 1}`;
            
            return (
              <ListItem 
                key={lessonIdx}
                divider
                sx={{ 
                  display: 'block',
                  px: 2,
                  py: 1.5,
                  bgcolor: currentLessonIdx === lessonIndex ? 'action.hover' : 'transparent'
                }}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleLessonClick(lessonIndex)}>
                    <ArrowForward />
                  </IconButton>
                }
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%',
                      bgcolor: lessonIndex === currentLessonIdx ? 'warning.main' : 'primary.main',
                      mr: 1
                    }} 
                  />
                  <Typography variant="subtitle1" fontWeight="medium" noWrap>
                    {lessonTitle}
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    bgcolor: 'grey.50',
                    p: 1.5,
                    borderRadius: 1,
                    mb: 1,
                    maxHeight: 150,
                    overflow: 'hidden',
                    position: 'relative',
                    '&::after': noteText.length > 150 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 40,
                      background: 'linear-gradient(transparent, rgba(255,255,255,0.9))'
                    } : {}
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {noteText.substring(0, 250)}
                    {noteText.length > 250 && '...'}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    {/* {formatDate(lessonIndex)} */}
                  </Typography>
                  <Chip 
                    label={lessonIndex === currentLessonIdx ? "Current" : "Jump to lesson"} 
                    size="small"
                    color={lessonIndex === currentLessonIdx ? "warning" : "primary"} 
                    variant={lessonIndex === currentLessonIdx ? "filled" : "outlined"}
                    onClick={() => handleLessonClick(lessonIndex)}
                    sx={{ height: 24 }}
                  />
                </Box>
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <ListItemText 
              primary="No notes saved yet" 
              secondary="Take notes during lessons and they'll appear here"
            />
          </ListItem>
        )}
      </List>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5, bgcolor: 'grey.50' }}>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<FilterList />}
        >
          Filter
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<Search />}
        >
          Search Notes
        </Button>
      </CardActions>
    </Card>
  </Box>
)}

        </Grid> 

                {/* above main content grid  */}
      </Grid>
      
      {/* Success notification */}
      {progressUpdated && (
        <Alert 
          severity="success"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            zIndex: 9999,
            boxShadow: 3,
            width: '300px'
          }}
        >
          Successfully saved your progress!
        </Alert>
      )}
    </Container>
  );
};

export default VideoPlayer;
