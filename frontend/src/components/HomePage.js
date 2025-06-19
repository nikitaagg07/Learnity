import React, { useState, useRef } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Paper, 
  Menu, 
  MenuItem, 
  IconButton,
  Divider,
  useMediaQuery,
  Fade,
  Avatar,
  Chip
} from '@mui/material';
import { 
  School, 
  PlayCircleFilled, 
  Group, 
  TrendingUp, 
  ArrowDropDown,
  Menu as MenuIcon,
  KeyboardArrowRight
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ApprovedCoursesDisplay from './ApprovedCoursesDisplay';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Feature cards data
const features = [
  {
    icon: <School sx={{ fontSize: 48, color: '#3f51b5' }} />,
    title: 'Expert Instructors',
    description: 'Learn from industry professionals and top educators with years of experience.'
  },
  {
    icon: <PlayCircleFilled sx={{ fontSize: 48, color: '#f50057' }} />,
    title: 'Flexible Learning',
    description: 'Access courses anytime, anywhere, at your own pace on any device.'
  },
  {
    icon: <TrendingUp sx={{ fontSize: 48, color: '#00bcd4' }} />,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed analytics and achievements.'
  },
  {
    icon: <Group sx={{ fontSize: 48, color: '#4caf50' }} />,
    title: 'Community Support',
    description: 'Join a vibrant community of learners and instructors for collaboration.'
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [loginAnchorEl, setLoginAnchorEl] = useState(null);
  const [registerAnchorEl, setRegisterAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const howItWorksRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Menu handlers
  const handleLoginMenuOpen = (event) => setLoginAnchorEl(event.currentTarget);
  const handleLoginMenuClose = () => setLoginAnchorEl(null);
  const handleRegisterMenuOpen = (event) => setRegisterAnchorEl(event.currentTarget);
  const handleRegisterMenuClose = () => setRegisterAnchorEl(null);
  const handleMobileMenuOpen = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);
  
  // Scroll handler
  const scrollToHowItWorks = () => {
    if (howItWorksRef.current) {
      howItWorksRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Navbar */}
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 800, 
                letterSpacing: 1,
                background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Learnity
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/')}
                    sx={{ 
                      mx: 1, 
                      color: 'text.primary',
                      '&:hover': { color: 'primary.main' },
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s'
                      },
                      '&:hover::after': {
                        width: '80%'
                      }
                    }}
                  >
                    Home
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/courses')}
                    sx={{ 
                      mx: 1, 
                      color: 'text.primary',
                      '&:hover': { color: 'primary.main' },
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s'
                      },
                      '&:hover::after': {
                        width: '80%'
                      }
                    }}
                  >
                    Courses
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/about')}
                    sx={{ 
                      mx: 1, 
                      color: 'text.primary',
                      '&:hover': { color: 'primary.main' },
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s'
                      },
                      '&:hover::after': {
                        width: '80%'
                      }
                    }}
                  >
                    About
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/contact')}
                    sx={{ 
                      mx: 1, 
                      color: 'text.primary',
                      '&:hover': { color: 'primary.main' },
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s'
                      },
                      '&:hover::after': {
                        width: '80%'
                      }
                    }}
                  >
                    Contact
                  </Button>
                </Box>

                {/* Login Button */}
                <Button
                  variant="outlined"
                  endIcon={<ArrowDropDown />}
                  onClick={handleLoginMenuOpen}
                  sx={{ 
                    ml: 2,
                    borderRadius: 5,
                    px: 3,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(63, 81, 181, 0.05)'
                    }
                  }}
                >
                  Login
                </Button>
                <Menu
                  anchorEl={loginAnchorEl}
                  open={Boolean(loginAnchorEl)}
                  onClose={handleLoginMenuClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 3,
                    sx: { 
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 180,
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => { handleLoginMenuClose(); navigate('/AdminLogin'); }}
                    sx={{ py: 1.5, '&:hover': { bgcolor: 'rgba(63, 81, 181, 0.08)' } }}
                  >
                    <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                      <Typography>As Admin</Typography>
                      <KeyboardArrowRight fontSize="small" sx={{ opacity: 0.5 }} />
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    onClick={() => { handleLoginMenuClose(); navigate('/InstructorLogin'); }}
                    sx={{ py: 1.5, '&:hover': { bgcolor: 'rgba(63, 81, 181, 0.08)' } }}
                  >
                    <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                      <Typography>As Instructor</Typography>
                      <KeyboardArrowRight fontSize="small" sx={{ opacity: 0.5 }} />
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    onClick={() => { handleLoginMenuClose(); navigate('/login'); }}
                    sx={{ py: 1.5, '&:hover': { bgcolor: 'rgba(63, 81, 181, 0.08)' } }}
                  >
                    <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                      <Typography>As Learner</Typography>
                      <KeyboardArrowRight fontSize="small" sx={{ opacity: 0.5 }} />
                    </Box>
                  </MenuItem>
                </Menu>

                {/* Register Button */}
                <Button
                  variant="contained"
                  endIcon={<ArrowDropDown />}
                  onClick={handleRegisterMenuOpen}
                  sx={{ 
                    ml: 2,
                    borderRadius: 5,
                    px: 3,
                    background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
                    boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
                  }}
                >
                  Register
                </Button>
                <Menu
                  anchorEl={registerAnchorEl}
                  open={Boolean(registerAnchorEl)}
                  onClose={handleRegisterMenuClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 3,
                    sx: { 
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 180,
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => { handleRegisterMenuClose(); navigate('/AdminRegister'); }}
                    sx={{ py: 1.5, '&:hover': { bgcolor: 'rgba(63, 81, 181, 0.08)' } }}
                  >
                    <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                      <Typography>As Admin</Typography>
                      <KeyboardArrowRight fontSize="small" sx={{ opacity: 0.5 }} />
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    onClick={() => { handleRegisterMenuClose(); navigate('/InstructorRegister'); }}
                    sx={{ py: 1.5, '&:hover': { bgcolor: 'rgba(63, 81, 181, 0.08)' } }}
                  >
                    <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                      <Typography>As Instructor</Typography>
                      <KeyboardArrowRight fontSize="small" sx={{ opacity: 0.5 }} />
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    onClick={() => { handleRegisterMenuClose(); navigate('/register'); }}
                    sx={{ py: 1.5, '&:hover': { bgcolor: 'rgba(63, 81, 181, 0.08)' } }}
                  >
                    <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                      <Typography>As Learner</Typography>
                      <KeyboardArrowRight fontSize="small" sx={{ opacity: 0.5 }} />
                    </Box>
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* Mobile Navigation */}
            {isMobile && (
              <>
                <IconButton 
                  edge="end" 
                  color="inherit" 
                  aria-label="menu"
                  onClick={handleMobileMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={mobileMenuAnchor}
                  open={Boolean(mobileMenuAnchor)}
                  onClose={handleMobileMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { width: '70vw', maxWidth: 300 }
                  }}
                >
                  <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/'); }}>
                    Home
                  </MenuItem>
                  <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/courses'); }}>
                    Courses
                  </MenuItem>
                  <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/about'); }}>
                    About
                  </MenuItem>
                  <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/contact'); }}>
                    Contact
                  </MenuItem>
                  <Divider />
                  <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                    Login As
                  </Typography>
                  <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/AdminLogin'); }}>
                    Admin
                  </MenuItem>
                  <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/InstructorLogin'); }}>
                    Instructor
                  </MenuItem>
                  <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/login'); }}>
                    Learner
                  </MenuItem>
                  <Divider />
                  <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                    Register As
                  </Typography>
                  <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/AdminRegister'); }}>
                    Admin
                  </MenuItem>
                  <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/InstructorRegister'); }}>
                    Instructor
                  </MenuItem>
                  <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/register'); }}>
                    Learner
                  </MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          py: { xs: 8, md: 12 },
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #3f51b5 0%, #00bcd4 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
            opacity: 0.5,
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1, color: 'white' }}>
            <Box component="div" sx={{ mb: 2 }}>
              <Chip 
                label="The Ultimate Learning Platform" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  color: 'white',
                  backdropFilter: 'blur(5px)',
                  fontWeight: 500,
                  px: 1
                }} 
              />
            </Box>
            <Typography 
              variant="h1" 
              component={motion.h1}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              sx={{ 
                fontWeight: 800, 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                mb: 2,
                backgroundImage: 'linear-gradient(135deg, #fff 0%, #e0f7fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              Unlock Your Potential<br />with Learnity
            </Typography>
            <Typography 
              variant="h5" 
              component={motion.p}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              sx={{ 
                mb: 5, 
                maxWidth: '800px', 
                mx: 'auto',
                opacity: 0.9,
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Join thousands of learners and instructors. Explore top courses, learn new skills, 
              and advance your career with personalized learning paths.
            </Typography>
            <Box 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                size="large" 
                variant="contained" 
                onClick={scrollToHowItWorks}
                sx={{ 
                  borderRadius: 50, 
                  py: 1.5, 
                  px: 4, 
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  background: 'white',
                  color: '#3f51b5',
                  '&:hover': { 
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                How It Works
              </Button>
            </Box>
            
            {/* Stats Counter */}
            {/*<Box 
              sx={{ 
                mt: 8, 
                display: 'flex', 
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: { xs: 3, md: 5 }
              }}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {[
                { number: '500+', label: 'Courses' },
                { number: '50,000+', label: 'Students' },
                { number: '200+', label: 'Instructors' },
                { number: '99%', label: 'Satisfaction' }
              ].map((stat, index) => (
                <Box key={index} sx={{ textAlign: 'center', minWidth: '120px' }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.5,
                      backgroundImage: 'linear-gradient(135deg, #fff 0%, #e0f7fa 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.85 }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>*/}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            component={motion.h2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Why Choose Learnity?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary', 
              maxWidth: '700px', 
              mx: 'auto',
              fontWeight: 400
            }}
            component={motion.p}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Our platform offers unique features designed to enhance your learning experience
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Paper 
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 0, 0, 0.08)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 3, 
                      p: 2,
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    fontWeight={600} 
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box 
        ref={howItWorksRef} 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, rgba(244,247,252,1) 0%, rgba(255,255,255,1) 100%)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              component={motion.h2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              How It Works
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary', 
                maxWidth: '700px', 
                mx: 'auto',
                fontWeight: 400
              }}
              component={motion.p}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              Get started with Learnity in three simple steps
            </Typography>
          </Box>

          <Grid container spacing={6} justifyContent="center">
            {[
              {
                step: 1,
                title: "Sign Up",
                description: "Create your free account in seconds and personalize your learning profile.",
                color: "#3f51b5"
              },
              {
                step: 2,
                title: "Enroll",
                description: "Browse our catalog and enroll in courses that match your interests and goals.",
                color: "#f50057"
              },
              {
                step: 3,
                title: "Learn",
                description: "Start learning at your own pace and track your progress through interactive lessons.",
                color: "#00bcd4"
              }
            ].map((item, idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'visible',
                      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        backgroundColor: item.color,
                        fontSize: '2rem',
                        fontWeight: 700,
                        mb: 3,
                        boxShadow: `0 8px 20px -5px ${item.color}80`
                      }}
                    >
                      {item.step}
                    </Avatar>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                    
                    {idx < 2 && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: '25%', 
                          right: -30,
                          display: { xs: 'none', sm: 'block' },
                          zIndex: 1
                        }}
                      >
                        <KeyboardArrowRight sx={{ fontSize: 40, color: 'text.disabled' }} />
                      </Box>
                    )}
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                borderRadius: 50,
                py: 1.5,
                px: 4,
                background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
                boxShadow: '0 4px 20px rgba(63, 81, 181, 0.25)',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Popular Courses Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            component={motion.h2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Popular Courses
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary', 
              maxWidth: '700px', 
              mx: 'auto',
              fontWeight: 400,
              mb: 6
            }}
            component={motion.p}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Discover our most popular and highly-rated courses
          </Typography>
        </Box>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <ApprovedCoursesDisplay />
        </motion.div>
      </Container>
      
      {/* Testimonial Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, rgba(244,247,252,1) 0%, rgba(255,255,255,1) 100%)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2"
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              component={motion.h2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              What Our Students Say
            </Typography>
          </Box>
          
          {/*<Grid container spacing={4}>
            {[
              {
                name: "Alex Johnson",
                role: "Software Developer",
                image: "/api/placeholder/80/80",
                quote: "Learnity completely transformed my career path. The courses are comprehensive and the instructors are incredibly knowledgeable. I went from knowing basic coding to landing my dream job in just 6 months!"
              },
              {
                name: "Sarah Williams",
                role: "Data Scientist",
                image: "/api/placeholder/80/80",
                quote: "The data science track on Learnity provided me with all the skills I needed to transition into the field. The community support and career guidance were invaluable additions to the excellent course content."
              },
              {
                name: "Michael Chen",
                role: "UX Designer",
                image: "/api/placeholder/80/80",
                quote: "As someone who learns best by doing, I appreciated the hands-on approach of Learnity courses. The projects were challenging but rewarding, and I built a portfolio that impressed employers right away."
              }
            ].map((testimonial, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'white',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 4, 
                        fontStyle: 'italic',
                        color: 'text.secondary',
                        lineHeight: 1.6
                      }}
                    >
                      "{testimonial.quote}"
                    </Typography>
                    <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                      <Avatar src={testimonial.image} alt={testimonial.name} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>*/}
        </Container>
      </Box>

      {/* Call to Action */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 10 },
          background: 'linear-gradient(135deg, #3f51b5 0%, #00bcd4 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
            opacity: 0.5,
          }
        }}
      >
        <Container maxWidth="md">
          <Box 
            sx={{ 
              textAlign: 'center', 
              color: 'white',
              position: 'relative',
              zIndex: 1
            }}
          >
            <Typography 
              variant="h2" 
              fontWeight={700} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 3
              }}
            >
              
              Ready to Start Your Learning Journey?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 5, 
                opacity: 0.9,
                fontWeight: 400,
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Join thousands of satisfied students and take the first step toward your goals today.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  borderRadius: 50,
                  py: 1.5,
                  px: 4,
                  background: 'white',
                  color: '#3f51b5',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                Sign Up Now
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/courses')}
                sx={{
                  borderRadius: 50,
                  py: 1.5,
                  px: 4,
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Browse Courses
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ 
                  mb: 3,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.5rem'
                }}
              >
                Learnity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                Your one-stop platform to learn coding, practice skills, and connect with developers worldwide. We're dedicated to making education accessible and effective for everyone.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <IconButton 
                  aria-label="LinkedIn" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: '#0077B5',
                    '&:hover': { bgcolor: '#00669c' }
                  }}
                  size="small"
                  href="https://www.linkedin.com" 
                  target="_blank" 
                  rel="noopener"
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  aria-label="Facebook" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: '#3b5998',
                    '&:hover': { bgcolor: '#324b81' }
                  }}
                  size="small"
                  href="https://www.facebook.com" 
                  target="_blank" 
                  rel="noopener"
                >
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  aria-label="Instagram" 
                  sx={{ 
                    color: 'white', 
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    '&:hover': { opacity: 0.9 }
                  }}
                  size="small"
                  href="https://www.instagram.com" 
                  target="_blank" 
                  rel="noopener"
                >
                  <InstagramIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  aria-label="Email" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: '#ea4335',
                    '&:hover': { bgcolor: '#d33426' }
                  }}
                  size="small"
                  href="mailto:info@Learnity.com"
                >
                  <EmailIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
                Courses
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {['Web Development', 'Data Science', 'Mobile Development', 'DevOps'].map((item, i) => (
                  <Box component="li" key={i} sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      component="a" 
                      href="#"
                      sx={{ 
                        color: 'text.secondary',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        '&:hover': { 
                          color: 'primary.main',
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <KeyboardArrowRight sx={{ fontSize: 16, mr: 0.5, opacity: 0.6 }} />
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
                Resources
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {['Tutorials', 'Documentation', 'Community', 'Blog'].map((item, i) => (
                  <Box component="li" key={i} sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      component="a" 
                      href="#"
                      sx={{ 
                        color: 'text.secondary',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        '&:hover': { 
                          color: 'primary.main',
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <KeyboardArrowRight sx={{ fontSize: 16, mr: 0.5, opacity: 0.6 }} />
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
                Company
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {['About Us', 'Careers', 'Press', 'Contact'].map((item, i) => (
                  <Box component="li" key={i} sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      component="a" 
                      href="#"
                      sx={{ 
                        color: 'text.secondary',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        '&:hover': { 
                          color: 'primary.main',
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <KeyboardArrowRight sx={{ fontSize: 16, mr: 0.5, opacity: 0.6 }} />
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
                Support
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {['Help Center', 'Terms of Service', 'Privacy Policy', 'FAQ'].map((item, i) => (
                  <Box component="li" key={i} sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      component="a" 
                      href="#"
                      sx={{ 
                        color: 'text.secondary',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        '&:hover': { 
                          color: 'primary.main',
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <KeyboardArrowRight sx={{ fontSize: 16, mr: 0.5, opacity: 0.6 }} />
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 5 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Learnity. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: { xs: 2, sm: 4 } }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, i) => (
                <Typography 
                  key={i}
                  variant="body2" 
                  component="a" 
                  href="#"
                  sx={{ 
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;