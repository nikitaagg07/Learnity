import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  LinearProgress,
  Avatar,
  Chip,
  TextField,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/system';
import { 
  Dashboard as DashboardIcon,
  AssignmentTurnedIn as TasksIcon,
  Timeline as TimelineIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as IncompleteIcon,
  Schedule as PendingIcon,
  Flag as FlagIcon,
  Today as TodayIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as ReportIcon,
  AttachFile as AttachmentIcon,
  Comment as CommentIcon
} from '@mui/icons-material';

// Mock data for demo purposes
const DEMO_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with new branding',
    startDate: '2025-04-01',
    endDate: '2025-06-15',
    status: 'in-progress',
    progress: 45,
    priority: 'high',
    manager: 'user-1',
    team: ['user-1', 'user-2', 'user-3'],
    tags: ['design', 'development', 'marketing']
  },
  {
    id: 'proj-2',
    name: 'Mobile App Development',
    description: 'Create iOS and Android versions of our customer portal',
    startDate: '2025-03-15',
    endDate: '2025-07-30',
    status: 'in-progress',
    progress: 32,
    priority: 'high',
    manager: 'user-2',
    team: ['user-2', 'user-4', 'user-5', 'user-6'],
    tags: ['mobile', 'development', 'ux']
  },
  {
    id: 'proj-3',
    name: 'Q2 Marketing Campaign',
    description: 'Digital marketing campaign for Q2 product launch',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    status: 'not-started',
    progress: 0,
    priority: 'medium',
    manager: 'user-3',
    team: ['user-3', 'user-7', 'user-8'],
    tags: ['marketing', 'social', 'content']
  }
];

const DEMO_TASKS = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Wireframe Design',
    description: 'Create wireframes for all main pages',
    status: 'completed',
    priority: 'high',
    assigned: ['user-2'],
    dueDate: '2025-04-15',
    progress: 100,
    comments: 3,
    attachments: 2
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Design System',
    description: 'Develop a comprehensive design system for the website',
    status: 'in-progress',
    priority: 'high',
    assigned: ['user-2'],
    dueDate: '2025-04-30',
    progress: 65,
    comments: 5,
    attachments: 3
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    title: 'Front-end Development',
    description: 'Implement the front-end based on approved designs',
    status: 'in-progress',
    priority: 'medium',
    assigned: ['user-3'],
    dueDate: '2025-05-15',
    progress: 30,
    comments: 2,
    attachments: 1
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    title: 'Content Migration',
    description: 'Migrate content from old site to new CMS',
    status: 'not-started',
    priority: 'medium',
    assigned: ['user-1'],
    dueDate: '2025-05-30',
    progress: 0,
    comments: 0,
    attachments: 0
  },
  {
    id: 'task-5',
    projectId: 'proj-2',
    title: 'App Requirements',
    description: 'Document app requirements and user stories',
    status: 'completed',
    priority: 'high',
    assigned: ['user-2', 'user-4'],
    dueDate: '2025-03-30',
    progress: 100,
    comments: 4,
    attachments: 2
  },
  {
    id: 'task-6',
    projectId: 'proj-2',
    title: 'UI Design',
    description: 'Design user interface for all app screens',
    status: 'in-progress',
    priority: 'high',
    assigned: ['user-5'],
    dueDate: '2025-04-20',
    progress: 80,
    comments: 7,
    attachments: 5
  }
];

const DEMO_USERS = [
  { id: 'user-1', name: 'Alex Johnson', role: 'Project Manager', avatar: '/api/placeholder/30/30' },
  { id: 'user-2', name: 'Sam Taylor', role: 'Lead Designer', avatar: '/api/placeholder/30/30' },
  { id: 'user-3', name: 'Jordan Lee', role: 'Frontend Developer', avatar: '/api/placeholder/30/30' },
  { id: 'user-4', name: 'Casey Williams', role: 'Product Manager', avatar: '/api/placeholder/30/30' },
  { id: 'user-5', name: 'Morgan Brown', role: 'UI/UX Designer', avatar: '/api/placeholder/30/30' },
  { id: 'user-6', name: 'Riley Davis', role: 'iOS Developer', avatar: '/api/placeholder/30/30' },
  { id: 'user-7', name: 'Jamie Wilson', role: 'Content Manager', avatar: '/api/placeholder/30/30' },
  { id: 'user-8', name: 'Taylor Smith', role: 'Marketing Specialist', avatar: '/api/placeholder/30/30' }
];

// Styled components
const AppHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const SideNavigation = styled(Box)(({ theme }) => ({
  width: '240px',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'auto',
  padding: theme.spacing(3)
}));

const KanbanColumn = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  minHeight: '500px',
  display: 'flex',
  flexDirection: 'column'
}));

const TaskCard = styled(Card)(({ theme, priority }) => ({
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid ${
    priority === 'high' 
      ? theme.palette.error.main 
      : priority === 'medium' 
        ? theme.palette.warning.main 
        : theme.palette.success.main
  }`
}));

const ProjectProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    backgroundColor: 
      value < 30 
        ? theme.palette.error.main 
        : value < 70 
          ? theme.palette.warning.main 
          : theme.palette.success.main
  }
}));

// Helper functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'primary';
    case 'delayed':
      return 'error';
    case 'not-started':
    default:
      return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CompletedIcon color="success" />;
    case 'in-progress':
      return <PendingIcon color="primary" />;
    case 'delayed':
      return <FlagIcon color="error" />;
    case 'not-started':
    default:
      return <IncompleteIcon color="action" />;
  }
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return 'Normal';
  }
};

const getUserById = (id) => {
  return DEMO_USERS.find(user => user.id === id) || { name: 'Unknown User' };
};

/**
 * Main Project Management Component
 */
const ProjectManagement = ({ initialTab = 0 }) => {
  // State
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [users, setUsers] = useState(DEMO_USERS);
  
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterPriority, setFilterPriority] = useState([]);
  const [sortBy, setSortBy] = useState('dueDate');
  const [searchQuery, setSearchQuery] = useState('');

  // Effects
  useEffect(() => {
    // Set first project as selected by default if none is selected
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
  };

  const handleNewProject = () => {
    setEditingProject({
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'not-started',
      progress: 0,
      priority: 'medium',
      manager: '',
      team: [],
      tags: []
    });
    setProjectDialogOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectDialogOpen(true);
  };

  const handleSaveProject = (projectData) => {
    if (projectData.id) {
      // Update existing project
      setProjects(projects.map(p => p.id === projectData.id ? projectData : p));
    } else {
      // Add new project
      const newProject = {
        ...projectData,
        id: `proj-${Date.now()}`
      };
      setProjects([...projects, newProject]);
    }
    setProjectDialogOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
    setTasks(tasks.filter(t => t.projectId !== projectId));
    
    if (selectedProject === projectId) {
      setSelectedProject(projects.length > 1 ? projects[0].id : null);
    }
  };

  const handleNewTask = (projectId) => {
    setEditingTask({
      projectId: projectId,
      title: '',
      description: '',
      status: 'not-started',
      priority: 'medium',
      assigned: [],
      dueDate: new Date().toISOString().split('T')[0],
      progress: 0,
      comments: 0,
      attachments: 0
    });
    setTaskDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      // Update existing task
      setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    } else {
      // Add new task
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`
      };
      setTasks([...tasks, newTask]);
    }
    setTaskDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            status: newStatus, 
            progress: newStatus === 'completed' ? 100 : t.progress 
          } 
        : t
    ));
  };

  // Filter and sorting functions
  const filteredTasks = tasks.filter(task => {
    // Filter by project
    if (selectedProject && task.projectId !== selectedProject) {
      return false;
    }
    
    // Filter by status
    if (filterStatus.length > 0 && !filterStatus.includes(task.status)) {
      return false;
    }
    
    // Filter by priority
    if (filterPriority.length > 0 && !filterPriority.includes(task.priority)) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'status':
        const statusOrder = { 'not-started': 0, 'in-progress': 1, 'completed': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Group tasks by status for Kanban view
  const tasksByStatus = {
    'not-started': sortedTasks.filter(t => t.status === 'not-started'),
    'in-progress': sortedTasks.filter(t => t.status === 'in-progress'),
    'completed': sortedTasks.filter(t => t.status === 'completed')
  };

  // Current project data
  const currentProject = projects.find(p => p.id === selectedProject) || {};

  // Component rendering functions
  const renderDashboard = () => {
    return (
      <Box >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Project Dashboard</Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Projects</Typography>
                <Typography variant="h3">{projects.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Active Tasks</Typography>
                <Typography variant="h3">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Completed Tasks</Typography>
                <Typography variant="h3">
                  {tasks.filter(t => t.status === 'completed').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Team Members</Typography>
                <Typography variant="h3">{users.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Projects Overview */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Projects Overview</Typography>
              {projects.map(project => (
                <Box key={project.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">{project.name}</Typography>
                    <Chip 
                      label={project.status}
                      color={getStatusColor(project.status)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <ProjectProgressBar 
                        variant="determinate" 
                        value={project.progress} 
                      />
                    </Box>
                    <Typography variant="body2">{project.progress}%</Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
          
          {/* Recent Activity & Upcoming Tasks */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={getUserById('user-2').avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Task completed: Wireframe Design"
                    secondary="15 minutes ago by Sam Taylor"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={getUserById('user-5').avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Comment added to UI Design task"
                    secondary="2 hours ago by Morgan Brown"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={getUserById('user-1').avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary="New task created: Database Migration"
                    secondary="Yesterday by Alex Johnson"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Upcoming Tasks</Typography>
              <List>
                {tasks
                  .filter(t => t.status !== 'completed')
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .slice(0, 3)
                  .map(task => (
                    <ListItem key={task.id}>
                      <ListItemIcon>
                        {getStatusIcon(task.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={`Due: ${formatDate(task.dueDate)}`}
                      />
                      <ListItemSecondaryAction>
                        <Chip 
                          size="small"
                          label={getPriorityLabel(task.priority)}
                          color={task.priority === 'high' ? 'error' : 'default'}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                }
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderProjectDetails = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4">{currentProject.name}</Typography>
            <Typography color="textSecondary">{currentProject.description}</Typography>
          </Box>
          
          <Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => handleEditProject(currentProject)}
              sx={{ mr: 1 }}
            >
              Edit Project
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteProject(currentProject.id)}
            >
              Delete
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={3}>
          {/* Project Info */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Project Details</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Status</Typography>
                <Chip 
                  label={currentProject.status}
                  color={getStatusColor(currentProject.status)}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Timeline</Typography>
                <Typography>
                  {formatDate(currentProject.startDate)} - {formatDate(currentProject.endDate)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Priority</Typography>
                <Typography>{getPriorityLabel(currentProject.priority)}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 ,overflow: 'hidden'}}>
                <Typography variant="body2" color="textSecondary">Project Manager</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={getUserById(currentProject.manager).avatar}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Typography>{getUserById(currentProject.manager).name}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Progress</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <ProjectProgressBar 
                      variant="determinate" 
                      value={currentProject.progress} 
                    />
                  </Box>
                  <Typography>{currentProject.progress}%</Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary">Tags</Typography>
                <Box sx={{ mt: 1 }}>
                  {currentProject.tags.map(tag => (
                    <Chip 
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Statistics */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Project Statistics</Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Total Tasks</Typography>
                <Typography fontWeight="bold">
                  {tasks.filter(t => t.projectId === currentProject.id).length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Completed</Typography>
                <Typography fontWeight="bold">
                  {tasks.filter(t => t.projectId === currentProject.id && t.status === 'completed').length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>In Progress</Typography>
                <Typography fontWeight="bold">
                  {tasks.filter(t => t.projectId === currentProject.id && t.status === 'in-progress').length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Not Started</Typography>
                <Typography fontWeight="bold">
                  {tasks.filter(t => t.projectId === currentProject.id && t.status === 'not-started').length}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>High Priority Tasks</Typography>
                <Typography fontWeight="bold">
                  {tasks.filter(t => t.projectId === currentProject.id && t.priority === 'high').length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Days Remaining</Typography>
                <Typography fontWeight="bold">
                  {Math.max(0, Math.floor((new Date(currentProject.endDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderTasksList = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Tasks</Typography>
          
          <Box>
            <TextField
              placeholder="Search tasks..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ mr: 1 }}
            />
            
            <Button
              size="small"
              startIcon={<FilterIcon />}
              onClick={() => setFilterStatus(['not-started', 'in-progress', 'completed'])}
              sx={{ mr: 1 }}
            >
              Filter
            </Button>
            
            <Button
              size="small"
              startIcon={<SortIcon />}
              onClick={() => setSortBy('dueDate')}
              sx={{ mr: 1 }}
            >
              Sort
            </Button>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleNewTask(selectedProject)}
            >
              New Task
            </Button>
          </Box>
        </Box>
        
        <List>
          {sortedTasks.map(task => (
            <Paper key={task.id} sx={{ mb: 2 }}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton edge="end" onClick={() => handleEditTask(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon>
                  {getStatusIcon(task.status)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      {task.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Chip 
                          size="small" 
                          label={task.status} 
                          color={getStatusColor(task.status)}
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          size="small" 
                          label={getPriorityLabel(task.priority)}
                          color={task.priority === 'high' ? 'error' : 'default'}
                          sx={{ mr: 1 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          <TodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {formatDate(task.dueDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          <CommentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {task.comments}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachmentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {task.attachments}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption" sx={{ mr: 1 }}>Assigned to:</Typography>
                        <Box sx={{ display: 'flex' }}>
                          {task.assigned.map(userId => (
                            <Tooltip key={userId} title={getUserById(userId).name}>
                              <Avatar
                                src={getUserById(userId).avatar}
                                sx={{ width: 24, height: 24, mr: 0.5 }}
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              <Box sx={{ px: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <ProjectProgressBar 
                      variant="determinate" 
                      value={task.progress} 
                    />
                  </Box>
                  <Typography variant="body2">{task.progress}%</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </List>
      </Box>
    );
  };

  const renderKanbanBoard = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Kanban Board</Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleNewTask(selectedProject)}
          >
            New Task
          </Button>
        </Box>
        
        <Grid container spacing={2} sx={{ height: 'calc(100vh - 200px)' }}>
          <Grid item xs={12} md={4}>
            <KanbanColumn>
              <Typography variant="h6" gutterBottom>To Do</Typography>
              {tasksByStatus['not-started'].map(task => (
                <TaskCard key={task.id} priority={task.priority}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ mr: 1 }}>
                        {formatDate(task.dueDate)}
                      </Typography>
                      
                      <Chip 
                        size="small" 
                        label={getPriorityLabel(task.priority)}
                        color={task.priority === 'high' ? 'error' : 'default'}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {task.assigned.map(userId => (
                        <Tooltip key={userId} title={getUserById(userId).name}>
                          <Avatar
                            src={getUserById(userId).avatar}
                            sx={{ width: 24, height: 24, mr: 0.5 }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small"
                      onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                    >
                      Start
                    </Button>
                    <Button size="small" onClick={() => handleEditTask(task)}>
                      Edit
                    </Button>
                  </CardActions>
                </TaskCard>
              ))}
            </KanbanColumn>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <KanbanColumn>
              <Typography variant="h6" gutterBottom>In Progress</Typography>
              {tasksByStatus['in-progress'].map(task => (
                <TaskCard key={task.id} priority={task.priority}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {task.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1, mr: 1 }}>
                          <ProjectProgressBar 
                            variant="determinate" 
                            value={task.progress} 
                          />
                        </Box>
                        <Typography variant="body2">{task.progress}%</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ mr: 1 }}>
                        {formatDate(task.dueDate)}
                      </Typography>
                      
                      <Chip 
                        size="small" 
                        label={getPriorityLabel(task.priority)}
                        color={task.priority === 'high' ? 'error' : 'default'}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {task.assigned.map(userId => (
                        <Tooltip key={userId} title={getUserById(userId).name}>
                          <Avatar
                            src={getUserById(userId).avatar}
                            sx={{ width: 24, height: 24, mr: 0.5 }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small"
                      onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                    >
                      Complete
                    </Button>
                    <Button size="small" onClick={() => handleEditTask(task)}>
                      Edit
                    </Button>
                  </CardActions>
                </TaskCard>
              ))}
            </KanbanColumn>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <KanbanColumn>
              <Typography variant="h6" gutterBottom>Completed</Typography>
              {tasksByStatus['completed'].map(task => (
                <TaskCard key={task.id} priority={task.priority}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ mr: 1 }}>
                        {formatDate(task.dueDate)}
                      </Typography>
                      
                      <Chip 
                        size="small" 
                        label={getPriorityLabel(task.priority)}
                        color={task.priority === 'high' ? 'error' : 'default'}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {task.assigned.map(userId => (
                        <Tooltip key={userId} title={getUserById(userId).name}>
                          <Avatar
                            src={getUserById(userId).avatar}
                            sx={{ width: 24, height: 24, mr: 0.5 }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small"
                      onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                    >
                      Reopen
                    </Button>
                    <Button size="small" onClick={() => handleEditTask(task)}>
                      Edit
                    </Button>
                  </CardActions>
                </TaskCard>
              ))}
            </KanbanColumn>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderReports = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Reports</Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Project Status Summary</Typography>
              <Box sx={{ my: 3 }}>
                {/* Here would be a chart component */}
                {/* <Typography variant="body2" color="textSecondary" align="center">
                  (Chart visualization would be here)
                </Typography> */}
              </Box>
              <Box>
                <Typography variant="body2">
                  <strong>Status Breakdown:</strong>
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                  <Typography>Not Started:</Typography>
                  <Typography>
                    {projects.filter(p => p.status === 'not-started').length} projects
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                  <Typography>In Progress:</Typography>
                  <Typography>
                    {projects.filter(p => p.status === 'in-progress').length} projects
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                  <Typography>Completed:</Typography>
                  <Typography>
                    {projects.filter(p => p.status === 'completed').length} projects
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Task Completion Rate</Typography>
              <Box sx={{ my: 3 }}>
                {/* Here would be a chart component */}
                {/* <Typography variant="body2" color="textSecondary" align="center">
                  (Chart visualization would be here)
                </Typography> */}
              </Box>
              <Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Completion Summary:</strong>
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography gutterBottom>All Tasks:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(tasks.filter(t => t.status === 'completed').length / tasks.length) * 100}
                      />
                    </Box>
                    <Typography>
                      {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%
                    </Typography>
                  </Box>
                </Box>
                
                {projects.map(project => (
                  <Box key={project.id} sx={{ mb: 2 }}>
                    <Typography gutterBottom>{project.name}:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                        />
                      </Box>
                      <Typography>{project.progress}%</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          
          
        </Grid>
      </Box>
    );
  };

  // Dialogs for project and task creation/editing
  const renderTaskDialog = () => {
    return (
      <Dialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingTask?.id ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            type="text"
            fullWidth
            value={editingTask?.title || ''}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={editingTask?.description || ''}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingTask?.status || 'not-started'}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="not-started">Not Started</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editingTask?.priority || 'medium'}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Due Date"
                type="date"
                fullWidth
                value={editingTask?.dueDate || ''}
                onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Progress (%)</InputLabel>
                <Select
                  value={editingTask?.progress || 0}
                  onChange={(e) => setEditingTask({ ...editingTask, progress: e.target.value })}
                  label="Progress (%)"
                >
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(value => (
                    <MenuItem key={value} value={value}>{value}%</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Assigned To</InputLabel>
            <Select
              multiple
              value={editingTask?.assigned || []}
              onChange={(e) => setEditingTask({ ...editingTask, assigned: e.target.value })}
              label="Assigned To"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={getUserById(value).name} 
                      avatar={<Avatar src={getUserById(value).avatar} />}
                    />
                  ))}
                </Box>
              )}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={user.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography>{user.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleSaveTask(editingTask)} 
            variant="contained"
            disabled={!editingTask?.title}
          >
            Save Task
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderProjectDialog = () => {
    return (
      <Dialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingProject?.id ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            type="text"
            fullWidth
            value={editingProject?.name || ''}
            onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={editingProject?.description || ''}
            onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Start Date"
                type="date"
                fullWidth
                value={editingProject?.startDate || ''}
                onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="End Date"
                type="date"
                fullWidth
                value={editingProject?.endDate || ''}
                onChange={(e) => setEditingProject({ ...editingProject, endDate: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editingProject?.status || 'not-started'}
              onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="not-started">Not Started</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={editingProject?.priority || 'medium'}
              onChange={(e) => setEditingProject({ ...editingProject, priority: e.target.value })}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Manager</InputLabel>
            <Select
              value={editingProject?.manager || ''}
              onChange={(e) => setEditingProject({ ...editingProject, manager: e.target.value })}
              label="Manager"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={user.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography>{user.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Team Members</InputLabel>
            <Select
              multiple
              value={editingProject?.team || []}
              onChange={(e) => setEditingProject({ ...editingProject, team: e.target.value })}
              label="Team Members"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={getUserById(value).name}
                      avatar={<Avatar src={getUserById(value).avatar} />}
                    />
                  ))}
                </Box>
              )}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={user.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography>{user.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Tags (comma separated)"
            type="text"
            fullWidth
            value={editingProject?.tags?.join(', ') || ''}
            onChange={(e) =>
              setEditingProject({
                ...editingProject,
                tags: e.target.value.split(',').map((tag) => tag.trim())
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleSaveProject(editingProject)}
            variant="contained"
            disabled={!editingProject?.name}
          >
            Save Project
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Final Return
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SideNavigation>
        <AppHeader>
          <Typography variant="h6">Project Manager</Typography>
          <IconButton color="inherit" onClick={() => setFilterStatus(['not-started', 'in-progress', 'completed'])}>
            <MoreIcon />
          </IconButton>
        </AppHeader>
        <Tabs
          orientation="vertical"
          value={currentTab}
          onChange={handleTabChange}
          sx={{ flexGrow: 1 }}
        >
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<TasksIcon />} label="Tasks" />
          <Tab icon={<TimelineIcon />} label="Kanban" />
          <Tab icon={<ReportIcon />} label="Reports" />
        </Tabs>
      </SideNavigation>

      <MainContent>
        <Container maxWidth="xl">
          {currentTab === 0 && renderDashboard()}
          {currentTab === 1 && renderTasksList()}
          {currentTab === 2 && renderKanbanBoard()}
          {currentTab === 3 && renderReports()}
        </Container>
      </MainContent>

      {renderTaskDialog()}
      {renderProjectDialog()}
    </Box>
  );
};

export default ProjectManagement;
