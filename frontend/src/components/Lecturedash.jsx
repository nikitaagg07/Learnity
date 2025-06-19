import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  Chip,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
  useTheme,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  LinearProgress
} from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';
import SubjectIcon from '@mui/icons-material/Subject';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const Lecturedash = () => {
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [bookmarkedLectures, setBookmarkedLectures] = useState([]);
  const [lectureDetailsOpen, setLectureDetailsOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [reminderSet, setReminderSet] = useState([]);
  const theme = useTheme();
  
  const learnerId = localStorage.getItem("userId") || '';
  const userType = localStorage.getItem("role") || 'learner';

  useEffect(() => {
    const fetchLectures = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/lecture/');
        // Sort lectures by date and time
        const sortedLectures = response.data.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB;
        });
        setLectures(sortedLectures);
        setFilteredLectures(sortedLectures);
        setError(null);
        
        // Load bookmarked lectures from localStorage
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedLectures') || '[]');
        setBookmarkedLectures(savedBookmarks);
        
        // Load reminder settings
        const savedReminders = JSON.parse(localStorage.getItem('lectureReminders') || '[]');
        setReminderSet(savedReminders);
      } catch (error) {
        console.error('Error fetching lectures:', error);
        setError('Failed to load lectures. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLectures();
  }, [learnerId]);

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns = {};
      lectures.forEach((lecture) => {
        const lectureTime = new Date(`${lecture.date} ${lecture.time}`).getTime();
        const now = new Date().getTime();
        const difference = lectureTime - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          
          if (days > 0) {
            newCountdowns[lecture._id] = `${days}d ${hours}h ${minutes}m`;
          } else {
            newCountdowns[lecture._id] = `${hours}h ${minutes}m ${seconds}s`;
          }
        } else {
          // Check if the lecture is still ongoing (within 1 hour)
          const lectureEndTime = lectureTime + (lecture.duration ? lecture.duration * 60 * 1000 : 60 * 60 * 1000);
          if (now < lectureEndTime) {
            newCountdowns[lecture._id] = 'Live Now';
          } else {
            newCountdowns[lecture._id] = 'Completed';
          }
        }
      });
      setCountdowns(newCountdowns);
    };

    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [lectures]);

  useEffect(() => {
    // Apply filters and search
    let result = [...lectures];
    
    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(lecture => 
        lecture.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lecture.description && lecture.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lecture.instructor && lecture.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lecture.category && lecture.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(lecture => {
        const lectureTime = new Date(`${lecture.date} ${lecture.time}`).getTime();
        const now = new Date().getTime();
        const difference = lectureTime - now;
        
        if (filterStatus === 'upcoming' && difference > 0) return true;
        if (filterStatus === 'live' && countdowns[lecture._id] === 'Live Now') return true;
        if (filterStatus === 'completed' && countdowns[lecture._id] === 'Completed') return true;
        if (filterStatus === 'bookmarked' && bookmarkedLectures.includes(lecture._id)) return true;
        return false;
      });
    }
    
    // Apply tab filter
    if (tabValue === 1) { // Bookmarked tab
      result = result.filter(lecture => bookmarkedLectures.includes(lecture._id));
    }
    
    setFilteredLectures(result);
  }, [searchTerm, filterStatus, lectures, countdowns, tabValue, bookmarkedLectures]);

  const getLectureStatusColor = (lectureId) => {
    if (!countdowns[lectureId]) return theme.palette.grey[500];
    
    if (countdowns[lectureId] === 'Live Now') {
      return theme.palette.error.main;
    } else if (countdowns[lectureId] === 'Completed') {
      return theme.palette.text.disabled;
    } else {
      return theme.palette.primary.main;
    }
  };

  const getLectureStatusBg = (lectureId) => {
    if (!countdowns[lectureId]) return theme.palette.grey[100];
    
    if (countdowns[lectureId] === 'Live Now') {
      return theme.palette.error.light;
    } else if (countdowns[lectureId] === 'Completed') {
      return theme.palette.grey[200];
    } else {
      return theme.palette.primary.light;
    }
  };

  const handleJoinLecture = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  const handleToggleBookmark = (lectureId) => {
    let newBookmarks = [...bookmarkedLectures];
    
    if (newBookmarks.includes(lectureId)) {
      newBookmarks = newBookmarks.filter(id => id !== lectureId);
      showSnackbar('Lecture removed from bookmarks');
    } else {
      newBookmarks.push(lectureId);
      showSnackbar('Lecture added to bookmarks');
    }
    
    setBookmarkedLectures(newBookmarks);
    localStorage.setItem('bookmarkedLectures', JSON.stringify(newBookmarks));
  };

  const handleToggleReminder = (lectureId) => {
    let newReminders = [...reminderSet];
    
    if (newReminders.includes(lectureId)) {
      newReminders = newReminders.filter(id => id !== lectureId);
      showSnackbar('Reminder canceled');
    } else {
      newReminders.push(lectureId);
      showSnackbar('Reminder set for 15 minutes before the lecture');
    }
    
    setReminderSet(newReminders);
    localStorage.setItem('lectureReminders', JSON.stringify(newReminders));
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    
    // Auto-close snackbar after 3 seconds
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 3000);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenLectureDetails = (lecture) => {
    setSelectedLecture(lecture);
    setLectureDetailsOpen(true);
  };

  const handleCloseLectureDetails = () => {
    setLectureDetailsOpen(false);
  };

  const copyMeetingLink = (link) => {
    navigator.clipboard.writeText(link);
    showSnackbar('Meeting link copied to clipboard');
  };

  const getDateFromString = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return new Date(year, month - 1, day);
  };

  const formatDate = (dateStr) => {
    const date = getDateFromString(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (dateStr) => {
    const today = new Date();
    const lectureDate = getDateFromString(dateStr);
    return (
      today.getDate() === lectureDate.getDate() &&
      today.getMonth() === lectureDate.getMonth() &&
      today.getFullYear() === lectureDate.getFullYear()
    );
  };

  const calculateProgress = (lectureId) => {
    if (!countdowns[lectureId]) return 0;
    
    if (countdowns[lectureId] === 'Live Now') {
      // Estimate progress within the live session
      const lecture = lectures.find(l => l._id === lectureId);
      if (!lecture) return 0;
      
      const lectureStartTime = new Date(`${lecture.date} ${lecture.time}`).getTime();
      const now = new Date().getTime();
      const elapsed = now - lectureStartTime;
      const totalDuration = (lecture.duration || 60) * 60 * 1000; // Duration in milliseconds
      
      return Math.min(100, Math.round((elapsed / totalDuration) * 100));
    } else if (countdowns[lectureId] === 'Completed') {
      return 100;
    }
    
    return 0;
  };

  const downloadCalendarInvite = (lecture) => {
    // In a real app, this would generate and download an .ics file
    showSnackbar('Calendar invitation downloaded');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
            Loading your lectures...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}22, ${theme.palette.secondary.main}22)`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <VideocamIcon sx={{ fontSize: 42, mr: 2, color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Live Lectures Dashboard
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                View your upcoming lectures and join them with a single click
              </Typography>
            </Box>
          </Box>
          <Box>
            <Chip 
              icon={<EventAvailableIcon />} 
              label={`Today: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`} 
              color="primary" 
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" mt={3}>
          <TextField
            placeholder="Search lectures..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: { xs: 2, sm: 0 }, width: { xs: '100%', sm: '50%' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <Box display="flex" alignItems="center" width={{ xs: '100%', sm: 'auto' }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter"
                startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Lectures</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="live">Live Now</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="bookmarked">Bookmarked</MenuItem>
              </Select>
            </FormControl>
            
            <Badge 
              badgeContent={bookmarkedLectures.length} 
              color="primary"
              sx={{ ml: 1 }}
            >
              <Chip 
                icon={<BookmarkIcon />} 
                label="Bookmarked" 
                color={tabValue === 1 ? "primary" : "default"}
                onClick={() => setTabValue(tabValue === 0 ? 1 : 0)}
                variant={tabValue === 1 ? "filled" : "outlined"}
              />
            </Badge>
          </Box>
        </Box>
      </Paper>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ mb: 3 }}
        variant="fullWidth"
      >
        <Tab 
          icon={<VideocamIcon />} 
          label="All Lectures" 
          iconPosition="start"
        />
        <Tab 
          icon={<BookmarkIcon />} 
          label="Bookmarked" 
          iconPosition="start"
        />
      </Tabs>

      {error && (
        <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: theme.palette.error.light, color: theme.palette.error.contrastText }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      {filteredLectures.length === 0 && !loading && !error ? (
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <EventBusyIcon sx={{ fontSize: 60, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {tabValue === 1 
                ? "You haven't bookmarked any lectures yet." 
                : (searchTerm 
                  ? "No lectures match your search criteria." 
                  : "No upcoming lectures are scheduled at this time.")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto', mt: 1 }}>
              {tabValue === 1 
                ? "Bookmark lectures that interest you to access them quickly later." 
                : "Check back later for new lecture announcements or try different search criteria."}
            </Typography>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredLectures.map((lecture) => {
            const isLive = countdowns[lecture._id] === 'Live Now';
            const isCompleted = countdowns[lecture._id] === 'Completed';
            const isBookmarked = bookmarkedLectures.includes(lecture._id);
            const isReminderSet = reminderSet.includes(lecture._id);
            const progress = calculateProgress(lecture._id);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={lecture._id}>
                <Card
                  elevation={isLive ? 6 : 3}
                  sx={{
                    borderRadius: 2,
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 8,
                    },
                    position: "relative",
                    overflow: "visible",
                    border: isLive
                      ? `1px solid ${theme.palette.error.main}`
                      : "none",
                    opacity: isCompleted ? 0.8 : 1,
                  }}
                >
                  {isLive && (
                    <Chip
                      label="LIVE NOW"
                      color="error"
                      sx={{
                        position: "absolute",
                        top: -12,
                        right: 20,
                        fontWeight: "bold",
                        px: 1,
                      }}
                    />
                  )}

                  {isToday(lecture.date) && !isLive && !isCompleted && (
                    <Chip
                      label="TODAY"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: -12,
                        right: 20,
                        fontWeight: "bold",
                        px: 1,
                      }}
                    />
                  )}

                  {/* ✅ Lecture Image */}
                  <Box
                    sx={{
                      height: 180,
                      backgroundImage: `url(${
                        lecture.image ||
                        "https://via.placeholder.com/400x180?text=Lecture+Image"
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: getLectureStatusBg(lecture._id),
                      color: getLectureStatusColor(lecture._id),
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      noWrap
                      sx={{ 
                        maxWidth: "80%", 
                        color: "#000000" // or simply 'black'
                      }}
                    >
                      {lecture.topic}
                    </Typography>

                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleBookmark(lecture._id)}
                        sx={{
                          color: isBookmarked ? "warning.main" : "inherit",
                        }}
                      >
                        {isBookmarked ? (
                          <BookmarkIcon />
                        ) : (
                          <BookmarkBorderIcon />
                        )}
                      </IconButton>
                    </Box>
                  </Box>

                  {isLive && (
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      color="error"
                      sx={{ height: 4 }}
                    />
                  )}

                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      {lecture.category && (
                        <Chip
                          size="small"
                          label={lecture.category}
                          color="secondary"
                          variant="outlined"
                          icon={<SchoolIcon />}
                        />
                      )}

                      {!isCompleted && (
                        <Tooltip
                          title={
                            isReminderSet ? "Cancel reminder" : "Set reminder"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleToggleReminder(lecture._id)}
                            sx={{
                              color: isReminderSet
                                ? "primary.main"
                                : "text.secondary",
                            }}
                          >
                            <NotificationsIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    {lecture.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                        }}
                      >
                        {lecture.description}
                      </Typography>
                    )}

                    <Box display="flex" alignItems="center" mb={1.5}>
                      <CalendarTodayIcon
                        sx={{
                          mr: 1,
                          color: theme.palette.text.secondary,
                          fontSize: 20,
                        }}
                      />
                      <Typography variant="body2">
                        {formatDate(lecture.date)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1.5}>
                      <AccessTimeIcon
                        sx={{
                          mr: 1,
                          color: theme.palette.text.secondary,
                          fontSize: 20,
                        }}
                      />
                      <Typography variant="body2">
                        {lecture.time}{" "}
                        {lecture.duration ? `(${lecture.duration} mins)` : ""}
                      </Typography>
                    </Box>

                    {lecture.instructor && (
                      <Box display="flex" alignItems="center" mb={1.5}>
                        <PersonIcon
                          sx={{
                            mr: 1,
                            color: theme.palette.text.secondary,
                            fontSize: 20,
                          }}
                        />
                        <Typography variant="body2">
                          {lecture.instructor}
                        </Typography>
                      </Box>
                    )}

                    {lecture.attendees && (
                      <Box display="flex" alignItems="center" mb={1.5}>
                        <GroupIcon
                          sx={{
                            mr: 1,
                            color: theme.palette.text.secondary,
                            fontSize: 20,
                          }}
                        />
                        <Typography variant="body2">
                          {lecture.attendees} registered
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                          color: getLectureStatusColor(lecture._id),
                          fontWeight: "bold",
                        }}
                      >
                        <ScheduleIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" fontWeight="bold">
                          {countdowns[lecture._id]}
                        </Typography>
                      </Box>

                      <Box>
                        <Tooltip title="View lecture details">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenLectureDetails(lecture)}
                            sx={{ mr: 1 }}
                          >
                            <InfoOutlinedIcon />
                          </IconButton>
                        </Tooltip>

                        <Button
                          variant={isLive ? "contained" : "outlined"}
                          color={isLive ? "error" : "primary"}
                          onClick={() => handleJoinLecture(lecture.meetingLink)}
                          disabled={isCompleted}
                          startIcon={<VideocamIcon />}
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        >
                          {isLive
                            ? "Join Now"
                            : isCompleted
                            ? "Completed"
                            : "Join"}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      
      {/* Lecture Details Dialog */}
      <Dialog 
        open={lectureDetailsOpen} 
        onClose={handleCloseLectureDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedLecture && (
          <>
            <DialogTitle sx={{ 
              bgcolor: getLectureStatusBg(selectedLecture._id),
              color: getLectureStatusColor(selectedLecture._id),
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" component="div" fontWeight="bold">
                {selectedLecture.topic}
              </Typography>
              
              <Box>
                {countdowns[selectedLecture._id] === 'Live Now' && (
                  <Chip 
                    label="LIVE NOW" 
                    color="error"
                    size="small"
                    sx={{ fontWeight: 'bold', mr: 1 }}
                  />
                )}
                <IconButton 
                  size="small" 
                  onClick={() => handleToggleBookmark(selectedLecture._id)}
                  sx={{ color: bookmarkedLectures.includes(selectedLecture._id) ? 'warning.main' : 'inherit' }}
                >
                  {bookmarkedLectures.includes(selectedLecture._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" gutterBottom>
                    Lecture Information
                  </Typography>
                  
                  {selectedLecture.description && (
                    <Box display="flex" sx={{ mb: 2 }}>
                      <DescriptionIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      <Typography variant="body1" paragraph>
                        {selectedLecture.description}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box display="flex" sx={{ mb: 2 }}>
                    <SubjectIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1">
                        {selectedLecture.category || 'General'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" sx={{ mb: 2 }}>
                    <PersonIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Instructor
                      </Typography>
                      <Typography variant="body1">
                        {selectedLecture.instructor || 'Not specified'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" sx={{ mb: 2 }}>
                    <GroupIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Attendees
                      </Typography>
                      <Typography variant="body1">
                        {selectedLecture.attendees || '0'} registered participants
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" sx={{ mb: 2 }}>
                    <StarIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Prerequisites
                      </Typography>
                      <Typography variant="body1">
                        {selectedLecture.prerequisites || 'None'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {selectedLecture.materials && (
                    <Box display="flex" sx={{ mb: 2 }}>
                      <AttachFileIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Materials
                        </Typography>
                        <Box>
                          {selectedLecture.materials.map((material, index) => (
                            <Chip 
                              key={index}
                              label={material.name} 
                              size="small"
                              variant="outlined"
                              onClick={() => window.open(material.url, '_blank')}
                              sx={{ mr: 1, mt: 1 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={5}>
                  <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper', mb: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Date & Time Details
                    </Typography>
                    
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                      <CalendarTodayIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedLecture.date)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                      <AccessTimeIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Time
                        </Typography>
                        <Typography variant="body1">
                          {selectedLecture.time}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                      <ScheduleIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body1">
                          {selectedLecture.duration ? `${selectedLecture.duration} minutes` : 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <CameraAltIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Meeting Link
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Typography 
                            variant="body2"
                            sx={{ 
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              maxWidth: '70%',
                              mr: 1
                            }}
                          >
                            {selectedLecture.meetingLink}
                          </Typography>
                          <Tooltip title="Copy link">
                            <IconButton 
                              size="small" 
                              onClick={() => copyMeetingLink(selectedLecture.meetingLink)}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => downloadCalendarInvite(selectedLecture)}
                      size="small"
                      fullWidth
                      sx={{ mr: 1 }}
                    >
                      Add to Calendar
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<NotificationsIcon />}
                      onClick={() => handleToggleReminder(selectedLecture._id)}
                      size="small"
                      fullWidth
                      color={reminderSet.includes(selectedLecture._id) ? "primary" : "inherit"}
                    >
                      {reminderSet.includes(selectedLecture._id) ? "Cancel Reminder" : "Set Reminder"}
                    </Button>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                      variant={countdowns[selectedLecture._id] === 'Live Now' ? "contained" : "outlined"}
                      color={countdowns[selectedLecture._id] === 'Live Now' ? "error" : "primary"}
                      onClick={() => handleJoinLecture(selectedLecture.meetingLink)}
                      disabled={countdowns[selectedLecture._id] === 'Completed'}
                      startIcon={<VideocamIcon />}
                      fullWidth
                      size="large"
                      sx={{ fontWeight: 'bold', py: 1.5 }}
                    >
                      {countdowns[selectedLecture._id] === 'Live Now' 
                        ? "Join Live Session Now" 
                        : (countdowns[selectedLecture._id] === 'Completed' 
                          ? "Lecture Completed" 
                          : "Join Lecture")}
                    </Button>
                    
                    {countdowns[selectedLecture._id] !== 'Completed' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: getLectureStatusColor(selectedLecture._id) }} />
                        <Typography variant="body2" fontWeight="medium" color={getLectureStatusColor(selectedLecture._id)}>
                          {countdowns[selectedLecture._id]}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleCloseLectureDetails}>Close</Button>
              {countdowns[selectedLecture._id] !== 'Completed' && (
                <Button 
                  onClick={() => {
                    handleToggleBookmark(selectedLecture._id);
                    handleCloseLectureDetails();
                  }}
                  startIcon={bookmarkedLectures.includes(selectedLecture._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  color={bookmarkedLectures.includes(selectedLecture._id) ? "warning" : "primary"}
                >
                  {bookmarkedLectures.includes(selectedLecture._id) ? "Remove Bookmark" : "Bookmark Lecture"}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Lecturedash;