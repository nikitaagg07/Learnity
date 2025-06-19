import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Toolbar, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HelpIcon from "@mui/icons-material/Help";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People"; 

const drawerWidth = 240;
const collapsedWidth = 60;

const InstructorNavBar = ({ onLogout, open, setOpen, children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            transition: "width 0.3s ease",
            overflowX: "hidden",
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Box sx={{ height: "64px", display: "flex", alignItems: "center", px: 1 }}>
          <IconButton onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/updateCourse">
              <ListItemIcon><EditIcon /></ListItemIcon>
              {open && <ListItemText primary="Manage Courses" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/createCourse">
              <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
              {open && <ListItemText primary="Create Course" />}
            </ListItemButton>
          </ListItem>

          {/* 🔥 New List Item for Learner Tracking */}
          <ListItem disablePadding>
  <ListItemButton component={Link} to={`/trackLearners?courseId=678d538a6b9082ea2255c4ec`}> 
    <ListItemIcon><PeopleIcon /></ListItemIcon>
    {open && <ListItemText primary="Track Learners" />}
  </ListItemButton>
</ListItem>

<ListItem disablePadding>
  <ListItemButton component={Link} to={`/createquiz`}> 
    <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
    {open && <ListItemText primary="Create Quiz" />}
  </ListItemButton>
</ListItem>

<ListItem disablePadding>
  <ListItemButton component={Link} to={`/createassignment`}> 
    <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
    {open && <ListItemText primary="Create Assignment" />}
  </ListItemButton>
</ListItem>

<ListItem disablePadding>
            <ListItemButton component={Link} to="/creates">
              <ListItemIcon><EditIcon /></ListItemIcon>
              {open && <ListItemText primary="Update Quiz" />}
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
  <ListItemButton component={Link} to={`/lecture`}> 
    <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
    {open && <ListItemText primary="Schedule Live Lecture" />}
  </ListItemButton>
</ListItem>

<ListItem disablePadding>
  <ListItemButton component={Link} to={`/view`}> 
    <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
    {open && <ListItemText primary="Upcomming Live Lecture" />}
  </ListItemButton>
</ListItem>

{/* <ListItem disablePadding>
  <ListItemButton component={Link} to={`/instchat`}> 
    <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
    {open && <ListItemText primary="join Community" />}
  </ListItemButton>
</ListItem> */}


<ListItem disablePadding>
  <ListItemButton component={Link} to={`/support`}> 
    <ListItemIcon><HelpIcon /></ListItemIcon>
    {open && <ListItemText primary="Support" />}
  </ListItemButton>
</ListItem>


          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><ExitToAppIcon color="error" /></ListItemIcon>
              {open && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
          
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
          transition: "width 0.3s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default InstructorNavBar;
