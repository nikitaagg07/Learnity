// File: src/components/profile/LearnerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Chip,
  Badge,
  useTheme,
  TextField,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as TrophyIcon,
  BookmarkBorder as BookmarkIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Category as CategoryIcon,
  CalendarMonth as CalendarIcon,
  Home as HomeIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';

// Import the EditProfileModal component
import EditProfileModal from './LearnerEditProfileModal';

// Navigation menus configuration
const navMenus = {
  courses: [
    { label: 'All Courses', path: '/courses' },
    { label: 'My Enrolled Courses', path: '/my-courses' },
    { label: 'Completed Courses', path: '/completed-courses' },
    { label: 'Saved Courses', path: '/saved-courses' }
  ],
  explore: [
    { label: 'Programming', path: '/explore/programming' },
    { label: 'Data Science', path: '/explore/data-science' },
    { label: 'Web Development', path: '/explore/web-development' },
    { label: 'Mobile Development', path: '/explore/mobile-development' }
  ]
};

const LearnerProfile = () => {

    const { courseId } = useParams();
    
  // Get learner ID from auth context or localStorage
  const learnerId = localStorage.getItem('userId') || '123456789012'; // Example ID    

  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mobile menu states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // User dropdown menu state
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [navMenuAnchor, setNavMenuAnchor] = useState(null);
  const [navMenuType, setNavMenuType] = useState('');

   // Add state for EditProfile modal
   const [editProfileOpen, setEditProfileOpen] = useState(false);
   const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
   
  
  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get user profile
        const profileResponse = await axios.get(`/api/learners/me?learnerId=${learnerId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log('Profile API Response:', profileResponse.data);
        
        // Check if we have the expected data structure
        if (profileResponse.data && profileResponse.data.data) {
          setUserProfile(profileResponse.data.data); // "data" is the learner object        
            console.log('Set user profile:', profileResponse.data.data.learners);
        } else {
            console.error('Unexpected API response structure:', profileResponse.data);
            // Try to get user data from localStorage as fallback
            const storedUser = localStorage.getItem('user-profile');
            if (storedUser) {
                setUserProfile(JSON.parse(storedUser));
                console.log('Using stored user profile:', JSON.parse(storedUser));
            }
        }
        
        // Get enrolled courses (✅ corrected here)
      const coursesResponse = await axios.get(`http://localhost:5000/api/learners/enrolled/${learnerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setEnrolledCourses(coursesResponse.data); // directly array

        
        // Get achievements
        // const achievementsResponse = await axios.get('/api/achievements', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        
        // setAchievements(achievementsResponse.data.data.achievements);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [courseId,learnerId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleNavMenuOpen = (event, type) => {
    setNavMenuAnchor(event.currentTarget);
    setNavMenuType(type);
  };
  
 // Updated handleOpenEditProfile function in LearnerProfile.jsx
const handleOpenEditProfile = () => {
  console.log('Opening edit profile modal with data:', userProfile);
  setEditProfileOpen(true);
  // We'll proceed even if userProfile is null - the modal will handle this
};
  
  const handleCloseEditProfile = () => {
    setEditProfileOpen(false);
  };
  
  const handleProfileUpdate = (updatedData) => {
    // Update the user profile in state
    setUserProfile(updatedData);
    
    // Show success notification
    setNotification({
      open: true,
      message: 'Profile updated successfully!',
      severity: 'success'
    });
  };

  const handleNavMenuClose = () => {
    setNavMenuAnchor(null);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    handleNavMenuClose();
    handleUserMenuClose();
  };
  
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      

      {/* Profile Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Profile Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                mb: 3,
                textAlign: "center",
              }}
            >
              <Avatar
                src={userProfile?.avatar || localStorage.getItem('user-avatar')}
                alt={userProfile?.name}
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  border: `4px solid ${theme.palette.primary.light}`,
                }}
              >
                {userProfile?.name.charAt(0)}
              </Avatar>

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {userProfile?.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" paragraph>
                {userProfile?.bio || "No bio added yet"}
              </Typography>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleOpenEditProfile}
                fullWidth
                sx={{ mb: 2 }}
              >
                Edit Profile
              </Button>

               {/* Edit Profile Modal */}
               {/* // Make sure this part of your render code is correct */}
{/* Edit Profile Modal */}
<EditProfileModal
  open={editProfileOpen}
  onClose={handleCloseEditProfile}
  userData={userProfile || {}}
  onSave={handleProfileUpdate}
/>

              <Divider sx={{ my: 2 }} />

              <List>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Enrolled Courses"
                    secondary={enrolledCourses.length || "0"}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Courses Completed"
                    secondary={
                      enrolledCourses.filter((c) => c.completed).length || "0"
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <TrophyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Achievements"
                    secondary={achievements.length || "0"}
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Learning Stats
              </Typography>

              <Box sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Hours Spent Learning
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{ position: "relative", display: "inline-flex", mr: 2 }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={75}
                      size={56}
                      thickness={5}
                      color="secondary"
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        component="div"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        75%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      45 hrs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This month
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Current Course Progress
              </Typography>

              <Box sx={{ my: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Python Masterclass</Typography>
                  <Typography variant="body2" color="text.secondary">
                    67%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "background.default",
                    borderRadius: 5,
                    height: 10,
                  }}
                >
                  <Box
                    sx={{
                      width: "67%",
                      bgcolor: theme.palette.primary.main,
                      height: 10,
                      borderRadius: 5,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ my: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">React Advanced</Typography>
                  <Typography variant="body2" color="text.secondary">
                    42%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "background.default",
                    borderRadius: 5,
                    height: 10,
                  }}
                >
                  <Box
                    sx={{
                      width: "42%",
                      bgcolor: theme.palette.secondary.main,
                      height: 10,
                      borderRadius: 5,
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={1} sx={{ borderRadius: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="My Courses" />
                <Tab label="Achievements" />
                <Tab label="Saved Courses" />
              </Tabs>

              {/* My Courses Tab */}
              {tabValue === 0 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    My Enrolled Courses
                  </Typography>

                  {enrolledCourses.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <SchoolIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Typography>
                        You haven't enrolled in any courses yet.
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => handleNavigation("/courses")}
                      >
                        Browse Courses
                      </Button>
                    </Box>
                  ) : (
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      {enrolledCourses.map((course) => (
                        <Grid item xs={12} sm={6} key={course._id}>
                          <Card
                            elevation={1}
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              transition: "transform 0.2s",
                              "&:hover": { transform: "translateY(-4px)" },
                            }}
                          >
                                <CardMedia
                                component="img"
                                height="140"
                                image={course.image || "/api/placeholder/400/140"}
                                alt={course.title}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                <Box
                                    sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                    }}
                                >
                                    <Typography variant="h6" component="div" noWrap>
                                    {course.title}
                                    </Typography>
                                    <Chip
                                    size="small"
                                    label={
                                        course.completed
                                        ? "Completed"
                                        : "In Progress"
                                    }
                                    color={
                                        course.completed ? "success" : "primary"
                                    }
                                    variant="outlined"
                                    />
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    By {course.instructorName}
                                </Typography>

                                <Box sx={{ mt: 2 }}>
                                    <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 0.5,
                                    }}
                                    >
                                    <Typography variant="body2">
                                        Progress
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {course.progress}%
                                    </Typography>
                                    </Box>
                                    <Box
                                    sx={{
                                        width: "100%",
                                        bgcolor: "background.default",
                                        borderRadius: 5,
                                        height: 8,
                                    }}
                                    >
                                    <Box
                                        sx={{
                                        width: `${course.progress}%`,
                                        bgcolor: course.completed
                                            ? theme.palette.success.main
                                            : theme.palette.primary.main,
                                        height: 8,
                                        borderRadius: 5,
                                        }}
                                    />
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                    mt: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    }}
                                >
                                    <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={() =>
                                        handleNavigation(
                                        `/course/${course.course._id}`
                                        )
                                    }
                                    >
                                    Continue
                                    </Button>
                                    <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    >
                                    Last accessed:{" "}
                                    {new Date(
                                        course.lastAccessed
                                    ).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                </CardContent>
                            </Card>
                            </Grid>
                        ))}
                        </Grid>
                    )}
                    </Box>
                )}

              {/* Achievements Tab */}
              {tabValue === 1 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    My Achievements
                  </Typography>

                  {achievements.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <TrophyIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Typography>
                        You haven't earned any achievements yet.
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Complete courses and challenges to earn achievements!
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      {achievements.map((achievement) => (
                        <Grid item xs={12} sm={6} md={4} key={achievement._id}>
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderRadius: 2,
                              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 64,
                                height: 64,
                                mx: "auto",
                                mb: 2,
                                bgcolor:
                                  achievement.color ||
                                  theme.palette.primary.main,
                              }}
                            >
                              {achievement.icon ? (
                                <achievement.icon />
                              ) : (
                                <TrophyIcon />
                              )}
                            </Avatar>

                            <Typography variant="h6" fontWeight="bold">
                              {achievement.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              {achievement.description}
                            </Typography>

                            <Chip
                              label={`Earned on ${new Date(
                                achievement.earnedDate
                              ).toLocaleDateString()}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {/* Saved Courses Tab */}
              {tabValue === 2 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Saved Courses
                  </Typography>

                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <BookmarkIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                    />
                    <Typography>You haven't saved any courses yet.</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleNavigation("/courses")}
                    >
                      Browse Courses
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LearnerProfile;