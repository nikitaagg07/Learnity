import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Container,
  CssBaseline,
  Badge,
  Popper
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

// Custom Theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#e91e63' },
    background: { default: '#f8f9fa' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: { fontWeight: 600, fontSize: '1.75rem' },
    h3: { fontWeight: 600, fontSize: '1.5rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
        },
      },
    },
  },
});

const NavBar = ({ onLogout, learnerId }) => {
  const navigate = useNavigate();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  
  // Anchors for dropdown menus
  const [coursesAnchor, setCoursesAnchor] = useState(null);
  const [exploreAnchor, setExploreAnchor] = useState(null);
  const [spaceAnchor, setSpaceAnchor] = useState(null);

    const [userProfile, setUserProfile] = useState(null);
  
  
  // References to store button elements
  const coursesButtonRef = useRef(null);
  const exploreButtonRef = useRef(null);
  const spaceButtonRef = useRef(null);

  // Navigation menu structure
  const navMenus = {
    courses: [
      { label: 'My Courses', path: `/enrolled/${learnerId}` },
      { label: 'My Assignment', path: '/viewassignment' },
      { label: 'Live Lecture', path: '/fetchlecture' }
    ],
    explore: [
      { label: 'Recommendations', path: '/recommendations' },
    ],
    yourSpace: [
      { label: 'Dashboard', path: '/profile' },
      { label: 'Support', path: '/support' }
    ]
  };

  // Menu handlers
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  
  const handleCoursesOpen = (event) => {
    setCoursesAnchor(coursesAnchor ? null : event.currentTarget);
    setExploreAnchor(null);
    setSpaceAnchor(null);
  };
  
  const handleExploreOpen = (event) => {
    setExploreAnchor(exploreAnchor ? null : event.currentTarget);
    setCoursesAnchor(null);
    setSpaceAnchor(null);
  };
  
  const handleSpaceOpen = (event) => {
    setSpaceAnchor(spaceAnchor ? null : event.currentTarget);
    setCoursesAnchor(null);
    setExploreAnchor(null);
  };
  
  const handleCloseAllMenus = () => {
    setCoursesAnchor(null);
    setExploreAnchor(null);
    setSpaceAnchor(null);
  };
  
  const handleMobileMenuOpen = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseAllMenus();
    handleMobileMenuClose();
  };

  // Custom Dropdown component to ensure proper positioning
  const DropdownMenu = ({ anchor, open, items, onClose }) => {
    return (
      <Popper
        open={Boolean(open)}
        anchorEl={anchor}
        placement="bottom-start"
        style={{
          zIndex: 1300,
          width: 220
        }}
        modifiers={[
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              boundary: 'viewport',
            },
          },
        ]}
      >
        <Box
          sx={{
            mt: 1,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {items.map((item) => (
            <MenuItem 
              key={item.label} 
              onClick={() => {
                handleNavigation(item.path);
                onClose();
              }}
              sx={{ py: 1, px: 2 }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Box>
      </Popper>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" color="default" sx={{ bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  background: 'linear-gradient(45deg, #1976d2 30%, #e91e63 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mr: { xs: 1, md: 3 }
                }}
              >
                Learnity
              </Typography>
              
              {/* Mobile Menu Button */}
              <IconButton 
                color="inherit" 
                sx={{ display: { xs: 'flex', md: 'none' } }}
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/land"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  mx: 1,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Home
              </Button>
              
              {/* Courses Button & Dropdown */}
              <Button
                ref={coursesButtonRef}
                onClick={handleCoursesOpen}
                sx={{
                  color: Boolean(coursesAnchor) ? 'primary.main' : 'text.primary',
                  fontWeight: 600,
                  mx: 1,
                  '&:hover': { color: 'primary.main' },
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Courses
                <KeyboardArrowDownIcon 
                  fontSize="small" 
                  sx={{ 
                    ml: 0.5, 
                    transform: Boolean(coursesAnchor) ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
              </Button>
              <DropdownMenu
                anchor={coursesAnchor}
                open={Boolean(coursesAnchor)}
                items={navMenus.courses}
                onClose={handleCloseAllMenus}
              />
              
              {/* Explore Button & Dropdown */}
              <Button
                ref={exploreButtonRef}
                onClick={handleExploreOpen}
                sx={{
                  color: Boolean(exploreAnchor) ? 'primary.main' : 'text.primary',
                  fontWeight: 600,
                  mx: 1,
                  '&:hover': { color: 'primary.main' },
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Explore
                <KeyboardArrowDownIcon 
                  fontSize="small" 
                  sx={{ 
                    ml: 0.5, 
                    transform: Boolean(exploreAnchor) ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
              </Button>
              <DropdownMenu
                anchor={exploreAnchor}
                open={Boolean(exploreAnchor)}
                items={navMenus.explore}
                onClose={handleCloseAllMenus}
              />
              
              {/* Your Space Button & Dropdown */}
              <Button
                ref={spaceButtonRef}
                onClick={handleSpaceOpen}
                sx={{
                  color: Boolean(spaceAnchor) ? 'primary.main' : 'text.primary',
                  fontWeight: 600,
                  mx: 1,
                  '&:hover': { color: 'primary.main' },
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Your Space
                <KeyboardArrowDownIcon 
                  fontSize="small" 
                  sx={{ 
                    ml: 0.5, 
                    transform: Boolean(spaceAnchor) ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
              </Button>
              <DropdownMenu
                anchor={spaceAnchor}
                open={Boolean(spaceAnchor)}
                items={navMenus.yourSpace}
                onClose={handleCloseAllMenus}
              />
            </Box>

            {/* Search + Profile (Desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <TextField
                placeholder="Search"
                size="small"
                variant="outlined"
                sx={{ 
                  mr: 2, 
                  width: 180,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Notifications */}
              <IconButton sx={{ mr: 1 }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Profile Avatar */}
              <IconButton onClick={handleUserMenuOpen} sx={{ mr: 2 }}>
                <Avatar 
                  src={userProfile?.avatar || localStorage.getItem('user-avatar')}

                sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
              </IconButton>

              {/* User Dropdown */}
              <Popper
                open={Boolean(userMenuAnchor)}
                anchorEl={userMenuAnchor}
                placement="bottom-end"
                style={{
                  zIndex: 1300,
                  width: 200
                }}
              >
                <Box
                  sx={{
                    mt: 1,
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <MenuItem onClick={() => {
                    handleUserMenuClose();
                  handleNavigation('/profile');
                  }
                }>My Profile</MenuItem>
                  {/* <MenuItem onClick={handleUserMenuClose}>Account Settings</MenuItem> */}
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    Logout
                  </MenuItem>
                </Box>
              </Popper>

              <Button
                variant="contained"
                color="primary"
                disableElevation
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: 'bold',
                  px: 2
                }}
              >
                Experience Coder
              </Button>
            </Box>

            {/* Mobile Menu */}
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              PaperProps={{
                sx: { width: '90%', maxWidth: 350 }
              }}
              disablePortal
              slotProps={{
                backdrop: {
                  style: {
                    position: 'absolute'
                  }
                }
              }}
            >
              <MenuItem onClick={() => handleNavigation('/')}>
                Home
              </MenuItem>
              
              <Divider />
              
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Courses
              </Typography>
              
              {navMenus.courses.map((item) => (
                <MenuItem 
                  key={item.label} 
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </MenuItem>
              ))}
              
              <Divider />
              
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Explore
              </Typography>
              
              {navMenus.explore.map((item) => (
                <MenuItem 
                  key={item.label} 
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </MenuItem>
              ))}
              
              <Divider />
              
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Your Space
              </Typography>
              
              {navMenus.yourSpace.map((item) => (
                <MenuItem 
                  key={item.label} 
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </MenuItem>
              ))}
              
              <Divider />
              
              <MenuItem 
                onClick={handleLogout}
                sx={{ color: 'error.main' }}
              >
                Logout
              </MenuItem>
              
              <Box sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disableElevation
                  sx={{ 
                    borderRadius: 2, 
                    fontWeight: 'bold',
                    py: 1
                  }}
                >
                  Experience Coder
                </Button>
              </Box>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default NavBar;