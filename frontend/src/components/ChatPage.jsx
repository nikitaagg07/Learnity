// AcademicForumApp.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  ThemeProvider, createTheme, useTheme, alpha,
  Box, Typography, Avatar, IconButton, Drawer, AppBar, 
  Toolbar, List, ListItem, ListItemText, ListItemAvatar, 
  ListItemIcon, Badge, Paper, InputBase, CircularProgress,
  Divider, Tab, Tabs, Menu, MenuItem, Tooltip, Collapse, 
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  FormControl, FormControlLabel, InputLabel, Select, Switch,
  TextField, Button, Chip, Snackbar, Alert, LinearProgress,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  ButtonBase, RadioGroup, Radio, AlertTitle
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Icons - Import as needed from Material UI
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ForumIcon from '@mui/icons-material/Forum';
import AddIcon from '@mui/icons-material/Add';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PinIcon from '@mui/icons-material/PushPin';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClassIcon from '@mui/icons-material/Class';
import ReportIcon from '@mui/icons-material/Report';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpIcon from '@mui/icons-material/Help';
import ArticleIcon from '@mui/icons-material/Article';
import VerifiedIcon from '@mui/icons-material/Verified';
import QuizIcon from '@mui/icons-material/Quiz';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LinkIcon from '@mui/icons-material/Link';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FlagIcon from '@mui/icons-material/Flag';
import GradeIcon from '@mui/icons-material/Grade';
import InsightsIcon from '@mui/icons-material/Insights';
import BlockIcon from '@mui/icons-material/Block';
import WarningIcon from '@mui/icons-material/Warning';

// Mock data and utilities
import { getAvatarColor, getInitials, formatDate, formatTime } from '../lib/utils';
import socket from '../services/socket';

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const StyledBadge = styled(Badge)(({ theme, status }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: status === 'online' ? '#44b700' : '#ccc',
    color: status === 'online' ? '#44b700' : '#ccc',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: status === 'online' ? 'ripple 1.2s infinite ease-in-out' : 'none',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const RoomListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
  '&:hover': {
    backgroundColor: active ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.04),
  }
}));

const ServerSidebarItem = styled(IconButton)(({ theme, active }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  marginBottom: theme.spacing(1),
  backgroundColor: active ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.04),
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : alpha(theme.palette.text.primary, 0.08),
  },
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.short,
  }),
}));

const ChannelCategory = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const DateDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(2, 0),
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& > *': {
    margin: theme.spacing(0, 1),
  },
}));

const MessageBubble = styled(Box)(({ theme, isCurrentUser, mentioned }) => ({
  display: 'flex',
  padding: theme.spacing(1, 0),
  marginBottom: theme.spacing(0.5),
  backgroundColor: mentioned ? alpha(theme.palette.info.main, 0.05) : 'transparent',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.1),
  },
}));

// Helper function to determine if a message is academic relevant
const isAcademicRelevant = (content, academicKeywords) => {
  const lowerContent = content.toLowerCase();
  return academicKeywords.some(keyword => lowerContent.includes(keyword.toLowerCase()));
};

// Theme function
const getTheme = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#1565c0', // A professional blue
    },
    secondary: {
      main: '#2e7d32', // Academic green
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f5f5',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
    success: {
      main: '#2e7d32', // Academic green
    },
    info: {
      main: '#0288d1',
    },
    warning: {
      main: '#ed6c02',
    },
    academic: {
      main: '#2e7d32', // Academic green
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    nonacademic: {
      main: '#d32f2f', // Warning red
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff',
    }
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Mock academic channels categorized by subjects
const academicCategories = [
  { id: '1', name: 'General Course Announcements', type: 'announcement', icon: <SchoolIcon /> },
  { id: '2', name: 'Assignments & Projects', type: 'assignment', icon: <AssignmentIcon /> },
  { id: '3', name: 'Readings & Resources', type: 'resource', icon: <MenuBookIcon /> },
  { id: '4', name: 'Conceptual Questions', type: 'question', icon: <HelpIcon /> },
  { id: '5', name: 'Lecture Discussions', type: 'lecture', icon: <ClassIcon /> },
  { id: '6', name: 'Study Groups', type: 'group', icon: <GroupIcon /> },
  { id: '7', name: 'Exams & Quizzes', type: 'exam', icon: <QuizIcon /> },
  { id: '8', name: 'Research Discussions', type: 'research', icon: <ArticleIcon /> },
];

// Academic subjects
const subjects = [
  { id: '1', name: 'Computer Science', icon: '💻', keyword: 'computer science|cs|programming|coding' },
  { id: '2', name: 'Mathematics', icon: '🧮', keyword: 'math|mathematics|calculus|algebra' },
  { id: '3', name: 'Biology', icon: '🧬', keyword: 'biology|bio|life science|genetics' },
  { id: '4', name: 'Chemistry', icon: '⚗️', keyword: 'chemistry|chem|organic|inorganic' },
  { id: '5', name: 'Physics', icon: '⚛️', keyword: 'physics|mechanics|quantum|thermodynamics' },
  { id: '6', name: 'Literature', icon: '📚', keyword: 'literature|english|writing|poetry' },
  { id: '7', name: 'History', icon: '🏛️', keyword: 'history|historical|ancient|modern' },
  { id: '8', name: 'Economics', icon: '📊', keyword: 'economics|econ|finance|business' },
];

// Academic relevance keywords - these are used to identify academic content
const academicKeywords = [
  'assignment', 'exam', 'quiz', 'lecture', 'course', 'homework', 'project', 'study', 'research', 'coding',
  'theory', 'concept', 'deadline', 'textbook', 'reading', 'paper', 'professor', 'instructor',
  'class', 'syllabus', 'module', 'learning', 'academic', 'education', 'analysis', 'problem',
  'solution', 'question', 'answer', 'hypothesis', 'thesis', 'discussion', 'topic', 'subject'
];

// Main component
const AcademicForumApp = () => {
  // Theme
  const [darkMode, setDarkMode] = useState(true);
  const appliedTheme = createTheme(getTheme(darkMode ? 'dark' : 'light'));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // Core state from original component
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomUsers, setRoomUsers] = useState([]);
  const [newRoomType, setNewRoomType] = useState('');
  const [newRoomIsGroupChat, setNewRoomIsGroupChat] = useState(false);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [flagComment, setFlagComment] = useState('');

  // UI state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userListOpen, setUserListOpen] = useState(!isMobile);
  const [currentSubject, setCurrentSubject] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false);
  const [messageToReply, setMessageToReply] = useState(null);
  const [expandedDate, setExpandedDate] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [showGuidelinesDialog, setShowGuidelinesDialog] = useState(false);
  const [filterMenu, setFilterMenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [learningObjective, setLearningObjective] = useState('');
  const [showAcademicScoreDialog, setShowAcademicScoreDialog] = useState(false);
  const [academicScore, setAcademicScore] = useState(0);
  const [flaggedMessage, setFlaggedMessage] = useState(null);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [showLowScoreWarning, setShowLowScoreWarning] = useState(false);
  const [lowScoreActionTaken, setLowScoreActionTaken] = useState(false);

  // Academic-specific state
  const [moderationEnabled, setModerationEnabled] = useState(true);
  const [academicOnly, setAcademicOnly] = useState(true);
  const [currentCourse, setCurrentCourse] = useState({
    id: '101',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Smith'
  });

  // Refs
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. Load user info
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    setCurrentUserId(userId);
    setCurrentUserRole(role);
    
    // Determine if user is an instructor
    setIsInstructor(role?.toLowerCase() === 'instructor' || role?.toLowerCase() === 'professor' || role?.toLowerCase() === 'teacher');
  }, []);

  // 2. Fetch available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const learners = await axios.get('http://localhost:5000/api/learners');
        const combined = [...learners.data].filter(
          u => u._id !== currentUserId
        );
        setAvailableUsers(combined);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setLoading(false);
        showSnackbar('Failed to load users', 'error');
      }
    };

    if (currentUserId) fetchUsers();
  }, [currentUserId]);

  // 3. Fetch All Chat Rooms (where user is a member)
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchRooms();
    }
  }, []);

  // 4. Listen to incoming messages
  useEffect(() => {
    socket.on('messageReceived', (newMessage) => {
      // Analyze message for academic relevance
      const isAcademic = isAcademicRelevant(newMessage.content, academicKeywords);
      
      // If academic only mode is enabled and message is not academic,
      // don't show it unless user is an instructor
      if (academicOnly && !isAcademic && !isInstructor) {
        showSnackbar('A message was filtered due to non-academic content', 'warning');
        return;
      }
      
      setMessages((prev) => [...prev, {...newMessage, isAcademic}]);
      
      if (newMessage.senderId !== currentUserId) {
        showSnackbar(`New message from ${newMessage.sender?.name || 'User'}`, 'info');
      }
    });

    socket.on('typing', ({ roomId: typingRoomId, user }) => {
      if (typingRoomId === roomId) {
        setTypingUser(user);
        setIsTyping(true);
      }
    });

    socket.on('stopTyping', ({ roomId: typingRoomId }) => {
      if (typingRoomId === roomId) {
        setIsTyping(false);
      }
    });

    socket.on('messageModerated', (messageId) => {
      // Remove moderated message from display
      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
      showSnackbar('A message has been removed by moderation', 'warning');
    });

    return () => {
      socket.off('messageReceived');
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('messageModerated');
    };
  }, [roomId, currentUserId, academicOnly, isInstructor]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize academic score on room change
  useEffect(() => {
    if (roomId) {
      const score = calculateRoomAcademicScore();
      setAcademicScore(score);
      
      // Check if score is critically low
      if (score < 35 && !lowScoreActionTaken) {
        setShowLowScoreWarning(true);
        setLowScoreActionTaken(true);
        showSnackbar('Warning: Forum academic score is critically low. Non-academic messages will be restricted.', 'error');
      }
    }
  }, [roomId, messages, lowScoreActionTaken]);

  // Group messages by date for better display
  const messagesByDate = React.useMemo(() => {
    const grouped = {};
    
    messages.forEach(msg => {
      const date = msg.createdAt ? formatDate(msg.createdAt) : 'Unknown Date';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });
    
    return grouped;
  }, [messages]);

  // Helper for calculating academic score of room (0-100)
  const calculateRoomAcademicScore = () => {
    if (messages.length === 0) return 100;
    
    const academicMessages = messages.filter(msg => isAcademicRelevant(msg.content, academicKeywords));
    const score = Math.round((academicMessages.length / messages.length) * 100);
    
    // If score is critically low, trigger additional actions
    if (score < 35) {
      // Enable strict academic mode if not already enabled
      if (!academicOnly) {
        setAcademicOnly(true);
      }
      
      // If user is an instructor, show special warning
      if (isInstructor) {
        showSnackbar('Warning: Forum academic score is critically low. Consider moderating non-academic content.', 'warning');
      }
    }
    
    return score;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const { data } = await axios.get(`http://localhost:5000/api/chat/chatrooms/${userId}`);
      
      // For academic forums, we attach room types from our categories
      const enhancedRooms = data.map(room => {
        const category = academicCategories.find(cat => 
          room.name.toLowerCase().includes(cat.name.toLowerCase())
        );
        return {
          ...room,
          type: category?.type || 'discussion',
          icon: category?.icon || <ForumIcon />
        };
      });
      
      setRooms(enhancedRooms);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      setLoading(false);
      showSnackbar('Failed to load chat rooms', 'error');
    }
  };

  // Join a Room
  const joinRoom = async (id, roomName, roomType) => {
    if (!id) {
      console.error('Room ID is missing');
      return;
    }
    setRoomId(id);
    setSelectedRoomName(roomName);
    setSelectedRoomType(roomType || 'discussion');
    socket.emit('joinRoom', id);
    
    if (isMobile) {
      setMobileDrawerOpen(false);
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/chat/messages/${id}`);
      
      // Process messages to add academic relevance flag
      const processedMessages = data.map(msg => ({
        ...msg,
        isAcademic: isAcademicRelevant(msg.content, academicKeywords)
      }));
      
      setMessages(processedMessages);
      setLoading(false);
      
      // Reset UI states when joining a new room
      setMessageToReply(null);
      setAttachedFiles([]);
      setShowEmojiPicker(false);
      
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
      setLoading(false);
      showSnackbar('Failed to load messages', 'error');
    }
  };

  // Send Message with academic checks
  const sendMessage = async () => {
    if (!message.trim() && attachedFiles.length === 0) {
      return;
    }
    
    if (!roomId || !currentUserId || !currentUserRole) {
      console.error('Missing required fields for sending message');
      showSnackbar('Cannot send message, missing information', 'error');
      return;
    }

    // Check if message is academic relevant
    const isAcademic = isAcademicRelevant(message, academicKeywords);
    
    // Enhanced checks for low academic score
    if (academicScore < 35) {
      if (!isAcademic && !isInstructor) {
        showSnackbar('Message blocked: Forum academic score is critically low. Only academic content is allowed.', 'error');
        setShowAcademicScoreDialog(true);
        return;
      }
    } else if (academicOnly && !isAcademic && !isInstructor) {
      showSnackbar('Please ensure your message is related to the course or academic content', 'warning');
      setShowAcademicScoreDialog(true);
      return;
    }

    socket.emit('stopTyping', { roomId });

    try {
      // Add learning objective if available
      let enhancedMessage = message;
      if (learningObjective) {
        enhancedMessage = `[Objective: ${learningObjective}] ${message}`;
      }
      
      const { data } = await axios.post('http://localhost:5000/api/chat/send-message', {
        chatRoomId: roomId,
        senderId: currentUserId,
        senderRole: currentUserRole.toLowerCase(),
        content: enhancedMessage,
        replyTo: messageToReply?._id,
        isAcademic,
        category: selectedCategory || 'general',
        // In a real app, you would handle file uploads here
      });

      socket.emit('newMessage', data);
      setMessage('');
      setMessageToReply(null);
      setAttachedFiles([]);
      setLearningObjective('');
      setSelectedCategory(null);
      
      // Focus back on the input after sending
      messageInputRef.current?.focus();
      
      // Update academic score
      setAcademicScore(calculateRoomAcademicScore());
      
    } catch (error) {
      console.error('Failed to send message:', error);
      showSnackbar('Failed to send message', 'error');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { roomId, user: currentUserRole });
  };

  // Option 1: Convert string ID to ObjectId in the handleCreateChatRoom function
const handleCreateChatRoom = async () => {
  if (!newRoomName) {
    showSnackbar('Please provide a name for the forum', 'warning');
    return;
  }
  
  if (!newRoomType) {
    showSnackbar('Please select a category for this forum', 'warning');
    return;
  }
  
  try {
    setLoading(true);
    
    // Prepare users array with current user only
    const users = [
      {
        userId: currentUserId,
        role: (currentUserRole || 'learner').toLowerCase()
      }
    ];
    
    const category = academicCategories.find(c => c.type === newRoomType) || { name: 'General', type: 'discussion' };
    const formattedName = `${category?.name || 'Discussion'}: ${newRoomName}`;
    
    // Create request payload
    const payload = {
      users,
      isGroupChat: newRoomIsGroupChat,
      name: formattedName,
      type: newRoomType,
      academicOnly: true
    };
    
    // Only add courseId if it's a valid ObjectId format
    if (currentCourse && currentCourse.id) {
      // Check if currentCourse.id is already a valid ObjectId
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(currentCourse.id);
      
      if (isValidObjectId) {
        payload.courseId = currentCourse.id;
      } else {
        // Skip adding courseId if it's not a valid ObjectId
        console.log('Warning: currentCourse.id is not a valid ObjectId format, omitting from request');
      }
    }
    
    const { data } = await axios.post('http://localhost:5000/api/chat/chatrooms', payload);
    
    showSnackbar('Academic forum created successfully!', 'success');
    setNewRoomName('');
    setNewRoomType('discussion');
    setNewRoomIsGroupChat(false);
    setShowCreateRoomDialog(false);
    fetchRooms();
    setLoading(false);
    
    // Join the newly created room
    joinRoom(data._id, data.name, data.type);
    
  } catch (error) {
    console.error('Failed to create academic forum:', error);
    showSnackbar('Error: ' + (error.response?.data?.message || 'Unknown error'), 'error');
    setLoading(false);
  }
};
  

  // Flag message for moderation
  const handleFlagMessage = (msg) => {
    setFlaggedMessage(msg);
    setShowFlagDialog(true);
  };
  
  // Submit flag for moderation
  const submitFlag = async () => {
    if (!flaggedMessage || !flagReason) {
      showSnackbar('Please provide a reason for flagging this message', 'warning');
      return;
    }
    
    try {
      // In a real app, send to backend
      /*
      await axios.post('http://localhost:5000/api/moderation/flag', {
        messageId: flaggedMessage._id,
        reason: flagReason,
        reporterId: currentUserId
      });
      */
      
      showSnackbar('Message has been flagged for instructor review', 'success');
      setShowFlagDialog(false);
      setFlaggedMessage(null);
      setFlagReason('');
    } catch (error) {
      console.error('Failed to flag message:', error);
      showSnackbar('Error flagging message', 'error');
    }
  };

  // UI Helper Functions
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachedFiles(files => files.filter((_, i) => i !== index));
  };

  const togglePinMessage = (msg) => {
    if (pinnedMessages.some(m => m._id === msg._id)) {
      setPinnedMessages(pins => pins.filter(m => m._id !== msg._id));
      showSnackbar('Message unpinned', 'info');
    } else {
      setPinnedMessages(pins => [...pins, msg]);
      showSnackbar('Message pinned', 'success');
    }
  };

  const handleReply = (msg) => {
    setMessageToReply(msg);
    messageInputRef.current?.focus();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleOpenFilterMenu = (event) => {
    setFilterMenu(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenu(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleDate = (date) => {
    if (expandedDate === date) {
      setExpandedDate(null);
    } else {
      setExpandedDate(date);
    }
  };

  // Get icon for different forum types
  const getRoomIcon = (type) => {
    const category = academicCategories.find(cat => cat.type === type);
    return category?.icon || <ForumIcon />;
  };

  // Filter rooms by subject
  const filteredRooms = React.useMemo(() => {
    return rooms.filter(room => {
      // Filter by search query
      const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by category
      const matchesCategory = categoryFilter === 'all' || room.type === categoryFilter;
      
      // Filter by subject if one is selected
      const matchesSubject = !currentSubject || 
        subjects.find(subject => subject.id === currentSubject)?.keyword
          .split('|')
          .some(keyword => room.name.toLowerCase().includes(keyword.toLowerCase()));
      
      // For direct messages tab, show only non-group chats
      if (currentTab === 0) {
        return !room.isGroupChat && matchesSearch && matchesCategory && matchesSubject;
      }
      
      // For group forums tab, show only group chats
      if (currentTab === 1) {
        return room.isGroupChat && matchesSearch && matchesCategory && matchesSubject;
      }
      
      return matchesSearch && matchesCategory && matchesSubject;
    });
  }, [rooms, searchQuery, categoryFilter, currentTab, currentSubject]);

  // Message display filtered by academic relevance
  const displayMessages = React.useMemo(() => {
    // If academic only mode is enabled and user is not an instructor,
    // filter out non-academic messages
    if (academicOnly && !isInstructor) {
      return messages.filter(msg => msg.isAcademic);
    }
    return messages;
  }, [messages, academicOnly, isInstructor]);

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    const cat = academicCategories.find(c => c.type === category);
    return cat?.icon || <ForumIcon />;
  };

  return (
    <ThemeProvider theme={appliedTheme}>
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        {/* Side Navigation - Shows server/course icons */}
        <Box sx={{ 
          width: 72, 
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 2,
          borderRight: 1,
          borderColor: 'divider',
          boxShadow: 1,
          zIndex: 1100
        }}>
          {/* App Logo */}
          <ServerSidebarItem active={true}>
            <SchoolIcon />
          </ServerSidebarItem>
          
          <Divider sx={{ width: '50%', my: 2 }} />
          
          {/* Subject Icons */}
          {subjects.map(subject => (
            <Tooltip key={subject.id} title={subject.name} placement="right">
              <ServerSidebarItem 
                active={currentSubject === subject.id}
                onClick={() => {
                  setCurrentSubject(subject.id);
                  setSearchQuery(''); // Clear search when changing subjects
                  setCategoryFilter('all'); // Reset category filter
                  setCurrentTab(1); // Switch to forums tab
                }}
              >
                <Typography variant="body1">{subject.icon}</Typography>
              </ServerSidebarItem>
            </Tooltip>
          ))}
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Settings and Profile */}
          <Tooltip title="Settings" placement="right">
            <ServerSidebarItem onClick={handleMenuOpen}>
              <SettingsIcon />
            </ServerSidebarItem>
          </Tooltip>
          
          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"} placement="right">
            <ServerSidebarItem onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ServerSidebarItem>
          </Tooltip>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              setAcademicOnly(!academicOnly);
              handleMenuClose();
              showSnackbar(`Academic-only mode ${!academicOnly ? 'enabled' : 'disabled'}`, 'info');
            }}>
              <ListItemIcon>
                <MenuBookIcon color={academicOnly ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText>Academic-Only Mode</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              setModerationEnabled(!moderationEnabled);
              handleMenuClose();
              showSnackbar(`Moderation ${!moderationEnabled ? 'enabled' : 'disabled'}`, 'info');
            }}>
              <ListItemIcon>
                <VerifiedIcon color={moderationEnabled ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText>Enable Moderation</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              setShowGuidelinesDialog(true);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText>Forum Guidelines</ListItemText>
            </MenuItem>
          </Menu>
        </Box>

        {/* Room List Sidebar */}
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          open={isMobile ? mobileDrawerOpen : true}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              position: isMobile ? 'fixed' : 'relative',
              height: '100%',
              zIndex: isMobile ? 1200 : 1000,
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              {currentCourse.code}: {currentCourse.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Instructor: {currentCourse.instructor}
            </Typography>
          </Box>
          
          <Box sx={{ p: 1 }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search forums…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Search>
          </Box>
          
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              variant="fullWidth"
              sx={{ mb: 1 }}
            >
              <Tab label="Direct" />
              <Tab label="Forums" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon />}
              onClick={handleOpenFilterMenu}
            >
              Filter
            </Button>
            
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateRoomDialog(true)}
            >
              New Forum
            </Button>
          </Box>
          
          <Menu
            anchorEl={filterMenu}
            open={Boolean(filterMenu)}
            onClose={handleCloseFilterMenu}
          >
            <MenuItem 
              onClick={() => {
                setCategoryFilter('all');
                handleCloseFilterMenu();
              }}
              selected={categoryFilter === 'all'}
            >
              <ListItemText>All Categories</ListItemText>
            </MenuItem>
            <Divider />
            {academicCategories.map(category => (
              <MenuItem 
                key={category.id}
                onClick={() => {
                  setCategoryFilter(category.type);
                  handleCloseFilterMenu();
                }}
                selected={categoryFilter === category.type}
              >
                <ListItemIcon>{category.icon}</ListItemIcon>
                <ListItemText>{category.name}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
          
          <List sx={{ overflow: 'auto', flexGrow: 1, p: 1 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <CircularProgress />
              </Box>
            ) : filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <RoomListItem
                  key={room._id}
                  active={roomId === room._id}
                  onClick={() => joinRoom(room._id, room.name, room.type)}
                  secondaryAction={
                    room.unreadCount > 0 && (
                      <Badge badgeContent={room.unreadCount} color="primary" />
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: room.isGroupChat ? 'primary.main' : getAvatarColor(room.name),
                        color: 'white'
                      }}
                    >
                      {room.isGroupChat 
                        ? getRoomIcon(room.type) 
                        : getInitials(room.users?.find(u => u.userId !== currentUserId)?.name || room.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography noWrap variant="body1">
                        {room.name}
                      </Typography>
                    }
                    secondary={
                      room.latestMessage ? (
                        <Typography 
                          variant="body2" 
                          noWrap 
                          color={room.latestMessage.isAcademic ? 'academic.main' : 'text.secondary'}
                        >
                          {room.latestMessage.content}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No messages yet
                        </Typography>
                      )
                    }
                  />
                </RoomListItem>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography color="text.secondary">No forums found</Typography>
              </Box>
            )}
          </List>
          
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                status="online"
              >
                <Avatar sx={{ bgcolor: isInstructor ? 'secondary.main' : 'primary.main' }}>
                  {currentUserRole ? currentUserRole[0].toUpperCase() : 'U'}
                </Avatar>
              </StyledBadge>
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2">
                  {currentUserRole || 'User'} 
                  {isInstructor && <VerifiedIcon fontSize="small" color="secondary" sx={{ ml: 0.5 }} />}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isInstructor ? 'Course Instructor' : 'Student'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Drawer>

        {/* Main Chat Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          {/* Top App Bar */}
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setMobileDrawerOpen(true)}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                  {getRoomIcon(selectedRoomType)}
                </Avatar>
                <Typography variant="h6" noWrap>
                  {selectedRoomName || 'Select a Forum'}
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              {roomId && (
                <>
                  <Tooltip title="Academic Score">
                    <Chip 
                      icon={<GradeIcon />}
                      label={`${academicScore}%`}
                      color={academicScore > 70 ? "success" : academicScore > 40 ? "warning" : "error"}
                      sx={{ mr: 1 }}
                      onClick={() => setShowAcademicScoreDialog(true)}
                    />
                  </Tooltip>
                  
                  <Tooltip title="Pinned Messages">
                    <IconButton 
                      color={showPinnedMessages ? "primary" : "default"}
                      onClick={() => setShowPinnedMessages(!showPinnedMessages)}
                    >
                      <PinIcon />
                      {pinnedMessages.length > 0 && (
                        <Badge badgeContent={pinnedMessages.length} color="primary" />
                      )}
                    </IconButton>
                  </Tooltip>

                  {!isMobile && (
                    <Tooltip title="User List">
                      <IconButton 
                        color={userListOpen ? "primary" : "default"}
                        onClick={() => setUserListOpen(!userListOpen)}
                      >
                        <GroupIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Toolbar>
          </AppBar>

          {/* Chat Content Area */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            p: 0,
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Main Messages Area */}
            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Pinned Messages */}
              <Collapse in={showPinnedMessages}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Pinned Messages
                  </Typography>
                  
                  {pinnedMessages.length > 0 ? (
                    <List dense>
                      {pinnedMessages.map(msg => (
                        <ListItem 
                          key={msg._id}
                          secondaryAction={
                            <IconButton size="small" onClick={() => togglePinMessage(msg)}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={msg.content}
                            secondary={`${msg.sender?.name || 'User'} - ${formatDate(msg.createdAt)}`}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: { fontWeight: msg.isAcademic ? 'bold' : 'normal' } 
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No pinned messages yet
                    </Typography>
                  )}
                </Paper>
              </Collapse>
              
              {/* Message List */}
              <Box sx={{ 
                p: 2, 
                flexGrow: 1, 
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : roomId ? (
                  Object.keys(messagesByDate).length > 0 ? (
                    Object.entries(messagesByDate).map(([date, msgs]) => (
                      <Box key={date}>
                        <DateDivider>
                          <Typography variant="body2" color="text.secondary">
                            {date}
                          </Typography>
                          <IconButton size="small" onClick={() => toggleDate(date)}>
                            {expandedDate === date ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </DateDivider>
                        
                        <Collapse in={expandedDate === date || expandedDate === null}>
                          {msgs.map((msg) => {
                            const isCurrentUser = msg.senderId === currentUserId;
                            const mentioned = msg.mentions?.includes(currentUserId);
                            const isPinned = pinnedMessages.some(m => m._id === msg._id);
                            
                            // Skip non-academic messages in academic-only mode
                            // unless the user is an instructor
                            if (academicOnly && !msg.isAcademic && !isInstructor) {
                              return null;
                            }
                            
                            return (
                              <MessageBubble 
                                key={msg._id} 
                                isCurrentUser={isCurrentUser}
                                mentioned={mentioned}
                              >
                                <Avatar 
                                  sx={{ 
                                    mr: 2, 
                                    bgcolor: getAvatarColor(msg.sender?.name || 'User') 
                                  }}
                                >
                                  {getInitials(msg.sender?.name || 'User')}
                                </Avatar>
                                
                                <Box sx={{ flexGrow: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <Typography 
                                      variant="subtitle2" 
                                      sx={{ fontWeight: 'bold', mr: 1 }}
                                    >
                                      {msg.sender?.name || 'User'}
                                    </Typography>
                                    
                                    {msg.sender?.role === 'instructor' && (
                                      <Chip 
                                        label="Instructor" 
                                        size="small" 
                                        color="secondary" 
                                        sx={{ height: 20, mr: 1 }} 
                                      />
                                    )}
                                    
                                    {msg.isAcademic && (
                                      <Chip 
                                        label="Academic" 
                                        size="small" 
                                        color="academic" 
                                        sx={{ height: 20, mr: 1 }} 
                                      />
                                    )}
                                    
                                    {isPinned && (
                                      <PinIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                                    )}
                                    
                                    <Typography variant="caption" color="text.secondary">
                                      {formatTime(msg.createdAt)}
                                    </Typography>
                                  </Box>
                                  
                                  {msg.replyTo && (
                                    <Box 
                                      sx={{ 
                                        p: 1, 
                                        mb: 1, 
                                        borderLeft: 3, 
                                        borderColor: 'primary.main',
                                        bgcolor: 'action.hover',
                                        borderRadius: 1
                                      }}
                                    >
                                      <Typography variant="body2" color="text.secondary">
                                        {msg.replyTo.content}
                                      </Typography>
                                    </Box>
                                  )}
                                  
                                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                    {msg.content}
                                  </Typography>
                                  
                                  {/* Message Actions */}
                                  <Box sx={{ 
                                    display: 'flex', 
                                    mt: 1,
                                    opacity: 0.5,
                                    '&:hover': { opacity: 1 },
                                    transition: 'opacity 0.2s'
                                  }}>
                                    <Tooltip title="Reply">
                                      <IconButton size="small" onClick={() => handleReply(msg)}>
                                        <ReplyIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    
                                    <Tooltip title={isPinned ? "Unpin" : "Pin"}>
                                      <IconButton size="small" onClick={() => togglePinMessage(msg)}>
                                        <PinIcon fontSize="small" color={isPinned ? "primary" : "inherit"} />
                                      </IconButton>
                                    </Tooltip>
                                    
                                    <Tooltip title="Flag">
                                      <IconButton size="small" onClick={() => handleFlagMessage(msg)}>
                                        <FlagIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    
                                    {isInstructor && (
                                      <Tooltip title="Mark as Important">
                                        <IconButton size="small">
                                          <PriorityHighIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </Box>
                              </MessageBubble>
                            );
                          })}
                        </Collapse>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      height: '100%' 
                    }}>
                      <ForumIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No messages yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Be the first to start the academic discussion!
                      </Typography>
                    </Box>
                  )
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%' 
                  }}>
                    <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Welcome to Academic Forum
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select a forum or create a new one to start discussing
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => setShowCreateRoomDialog(true)}
                    >
                      Create Forum
                    </Button>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>
              
              {/* Reply Preview */}
              <Collapse in={Boolean(messageToReply)}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: 'background.default',
                    borderTop: 1,
                    borderColor: 'divider'
                  }}
                >
                  <ReplyIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ flexGrow: 1, mr: 1 }} noWrap>
                    Replying to: {messageToReply?.content}
                  </Typography>
                  <IconButton size="small" onClick={() => setMessageToReply(null)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Collapse>
              
              {/* Category or Learning Objective */}
              <Collapse in={Boolean(selectedCategory) || Boolean(learningObjective)}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: 'background.default',
                    borderTop: Boolean(messageToReply) ? 0 : 1,
                    borderColor: 'divider'
                  }}
                >
                  {selectedCategory && (
                    <Chip 
                      icon={academicCategories.find(c => c.id === selectedCategory)?.icon}
                      label={academicCategories.find(c => c.id === selectedCategory)?.name}
                      color="primary"
                      onDelete={() => setSelectedCategory(null)}
                      sx={{ mr: 1 }}
                    />
                  )}
                  
                  {learningObjective && (
                    <Chip 
                      icon={<MenuBookIcon />}
                      label={`Objective: ${learningObjective}`}
                      color="academic"
                      onDelete={() => setLearningObjective('')}
                    />
                  )}
                </Paper>
              </Collapse>
              
              {/* Attachments Preview */}
              <Collapse in={attachedFiles.length > 0}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    borderTop: (Boolean(messageToReply) || Boolean(selectedCategory) || Boolean(learningObjective)) ? 0 : 1,
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Attachments:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {attachedFiles.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => removeAttachment(index)}
                        icon={<AttachFileIcon />}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              </Collapse>
              
              {/* Message Input */}
              {roomId && (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 2, 
                    borderRadius: theme => ({ 
                      borderBottomLeftRadius: 0, 
                      borderBottomRightRadius: 0 
                    }) 
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    {isInstructor && (
                      <Tooltip title="Add Learning Objective">
                        <IconButton 
                          color={learningObjective ? "primary" : "default"}
                          onClick={() => {
                            const objective = prompt("Enter a learning objective for this message:");
                            if (objective) setLearningObjective(objective);
                          }}
                          sx={{ mr: 1 }}
                        >
                          <MenuBookIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    <Tooltip title="Add Attachment">
                      <IconButton 
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ mr: 1 }}
                      >
                        <AttachFileIcon />
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          onChange={handleFileSelect}
                          multiple
                        />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Add Category">
                      <IconButton 
                        color={selectedCategory ? "primary" : "default"}
                        onClick={handleOpenFilterMenu}
                        sx={{ mr: 1 }}
                      >
                        <ClassIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder={academicOnly ? "Enter academic message..." : "Type a message..."}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      onKeyUp={handleTyping}
                      inputRef={messageInputRef}
                      InputProps={{
                        endAdornment: (
                          <IconButton 
                            color="primary" 
                            onClick={sendMessage}
                            disabled={!message.trim() && attachedFiles.length === 0}
                          >
                            <SendIcon />
                          </IconButton>
                        ),
                      }}
                      variant="outlined"
                    />
                  </Box>
                  
                  {isTyping && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {typingUser} is typing...
                    </Typography>
                  )}
                </Paper>
              )}
            </Box>
            
            {/* User List Sidebar */}
            {roomId && !isMobile && userListOpen && (
              <Paper 
                sx={{ 
                  width: 240, 
                  borderLeft: 1, 
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
                elevation={0}
              >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle2">
                    Forum Participants
                  </Typography>
                </Box>
                
                <List sx={{ overflow: 'auto', flexGrow: 1 }}>
                  {/* Instructors Group */}
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Instructors" 
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                  
                  {/* Instructor User */}
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemAvatar>
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        status="online"
                      >
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {getInitials(currentCourse.instructor)}
                        </Avatar>
                      </StyledBadge>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={currentCourse.instructor}
                      secondary="Course Instructor"
                      secondaryTypographyProps={{
                        variant: 'caption',
                      }}
                    />
                  </ListItem>
                  
                  {/* Students Group */}
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Students" 
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                  
                  {/* Student Users */}
                  {roomUsers.filter(user => user.role === 'student').map(user => (
                    <ListItem key={user.userId} sx={{ pl: 4 }}>
                      <ListItemAvatar>
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          status={user.status || 'offline'}
                        >
                          <Avatar sx={{ bgcolor: getAvatarColor(user.name) }}>
                            {getInitials(user.name)}
                          </Avatar>
                        </StyledBadge>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={user.name}
                        secondary={user.isTyping ? "Typing..." : "Student"}
                        secondaryTypographyProps={{
                          variant: 'caption',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    {roomUsers.length} participants
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
      
      {/* Create Room Dialog */}
      <Dialog 
        open={showCreateRoomDialog} 
        onClose={() => setShowCreateRoomDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create New Forum</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Create a new discussion forum for academic topics or group projects.
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            label="Forum Name"
            fullWidth
            variant="outlined"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Forum Type</InputLabel>
            <Select
              value={newRoomType}
              onChange={(e) => setNewRoomType(e.target.value)}
              label="Forum Type"
            >
              {academicCategories.map(category => (
                <MenuItem key={category.id} value={category.type}>
                  <ListItemIcon>{category.icon}</ListItemIcon>
                  <ListItemText>{category.name}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch 
                checked={newRoomIsGroupChat} 
                onChange={(e) => setNewRoomIsGroupChat(e.target.checked)} 
              />
            }
            label="Group Discussion"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateRoomDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateChatRoom} 
            variant="contained"
            disabled={!newRoomName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Academic Score Dialog */}
      <Dialog 
        open={showAcademicScoreDialog} 
        onClose={() => setShowAcademicScoreDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Academic Content Analysis</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Forum Academic Score: {academicScore}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={academicScore} 
              color={academicScore > 70 ? "success" : academicScore > 40 ? "warning" : "error"}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            This score represents the academic relevance of the forum content. A higher score indicates more course-relevant discussions.
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(categoryBreakdown).map(([category, data]) => (
                  <TableRow key={category}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getCategoryIcon(category)}
                        <Typography sx={{ ml: 1 }}>{category}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{data.count}</TableCell>
                    <TableCell align="right">{data.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAcademicScoreDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Community Guidelines Dialog */}
      <Dialog 
        open={showGuidelinesDialog} 
        onClose={() => setShowGuidelinesDialog(false)}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>Academic Forum Guidelines</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            Purpose of Academic Forums
          </Typography>
          <Typography paragraph>
            Academic forums are designed to facilitate course-related discussions, collaborative learning, and knowledge sharing among students and instructors.
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            General Guidelines
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Maintain Academic Focus" 
                secondary="Discussions should relate to course content and learning objectives."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Respect Intellectual Property" 
                secondary="Properly cite sources and give credit to original authors."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Constructive Feedback" 
                secondary="Provide helpful and supportive comments to peers."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Use Appropriate Categories" 
                secondary="Select the correct category for your discussion topic."
              />
            </ListItem>
          </List>
          
          <Typography variant="h6" gutterBottom>
            Content Moderation
          </Typography>
          <Typography paragraph>
            Our forum uses academic content detection to identify and promote course-relevant discussions. Messages are analyzed based on:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <MenuBookIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Academic Language" 
                secondary="Use of course terminology and academic vocabulary."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ClassIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Topic Relevance" 
                secondary="Connection to course syllabus and learning objectives."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InsightsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Critical Thinking" 
                secondary="Depth of analysis and evidence-based reasoning."
              />
            </ListItem>
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>Academic-Only Mode</AlertTitle>
            When enabled, Academic-Only Mode filters out non-academic messages, allowing you to focus on course-relevant content.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGuidelinesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Flag Message Dialog */}
      <Dialog 
        open={showFlagDialog} 
        onClose={() => setShowFlagDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Flag Message</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please select a reason for flagging this message. Flagged messages will be reviewed by instructors.
          </DialogContentText>
          
          <FormControl component="fieldset">
            <RadioGroup value={flagReason} onChange={(e) => setFlagReason(e.target.value)}>
              <FormControlLabel value="inappropriate" control={<Radio />} label="Inappropriate content" />
              <FormControlLabel value="off-topic" control={<Radio />} label="Off-topic discussion" />
              <FormControlLabel value="incorrect" control={<Radio />} label="Factually incorrect" />
              <FormControlLabel value="other" control={<Radio />} label="Other reason" />
            </RadioGroup>
          </FormControl>
          
          {flagReason === 'other' && (
            <TextField
              margin="dense"
              label="Specify reason"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              value={flagComment}
              onChange={(e) => setFlagComment(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFlagDialog(false)}>Cancel</Button>
          <Button 
            onClick={submitFlag} 
            variant="contained"
            color="error"
            disabled={flagReason === 'other' && !flagComment.trim()}
          >
            Submit Flag
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Low Score Warning Dialog */}
      <Dialog 
        open={showLowScoreWarning} 
        onClose={() => setShowLowScoreWarning(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Critical Academic Score Warning</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Forum Academic Score: {academicScore}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={academicScore} 
              color="error"
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Critical Warning</AlertTitle>
            The forum's academic score has dropped below 35%. This indicates a significant amount of non-academic content.
          </Alert>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            To maintain academic standards, the following restrictions are now in place:
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemIcon>
                <BlockIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Non-academic messages are restricted" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <VerifiedIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Only instructors can post non-academic content" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Messages will be subject to increased moderation" />
            </ListItem>
          </List>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            To improve the academic score:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="Focus on course-related discussions" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="Use academic terminology and concepts" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="Reference course materials and assignments" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLowScoreWarning(false)}>Close</Button>
          <Button 
            onClick={() => {
              setShowLowScoreWarning(false);
              setShowAcademicScoreDialog(true);
            }}
            variant="contained"
            color="primary"
          >
            View Details
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default AcademicForumApp;