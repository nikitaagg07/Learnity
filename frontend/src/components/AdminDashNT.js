import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import InstructorApprovalRequests from './InstructorApprovalRequests';
import CourseDetailView from './CourseDetailView';
import SupportDetailView from './SupportDetailView';
import LearnerList from './LearnerList';
import InstructorList from './InstructorList';
import AdminList from './AdminList';
import HomePage from './HomePage';

import {
  Box, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Typography, Container, Grid, Paper, Card, CardContent, CardHeader,
  Button, Divider, IconButton, Avatar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Chip, Menu, MenuItem,
  TextField, FormControl, InputLabel, Select, useTheme, Tab, Tabs, InputAdornment,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Book as BookIcon,
  AttachMoney as PaymentIcon,
  HelpOutline as SupportIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Reply as ReplyIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


// Custom styled components
const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  }),
);

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[10],
  },
}));

const StyledChip = styled(Chip)(({ theme, status }) => {
  let color;
  switch (status) {
    case 'completed':
    case 'published':
    case 'active':
      color = theme.palette.success;
      break;
    case 'pending':
      color = theme.palette.warning;
      break;
    case 'failed':
    case 'rejected':
      color = theme.palette.error;
      break;
    case 'in-progress':
      color = theme.palette.info;
      break;
    default:
      color = theme.palette.grey;
  }
  return {
    backgroundColor: color.light,
    color: color.dark,
    fontWeight: 500,
  };
});




const userActivityData = [
  { day: 'Mon', students: 40, instructors: 5 },
  { day: 'Tue', students: 30, instructors: 8 },
  { day: 'Wed', students: 50, instructors: 10 },
  { day: 'Thu', students: 45, instructors: 7 },
  { day: 'Fri', students: 60, instructors: 12 },
  { day: 'Sat', students: 75, instructors: 15 },
  { day: 'Sun', students: 62, instructors: 8 },
];

const courseDistributionData = [
  { name: 'Programming', value: 35 },
  { name: 'Design', value: 25 },
  { name: 'Business', value: 20 },
  { name: 'Marketing', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [userActivity, setUserActivity] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('adminActiveSection') || 'overview';
  });
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [showInstructorApprovals, setShowInstructorApprovals] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSupportTicket, setSelectedSupportTicket] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLearnerList, setShowLearnerList] = useState(false);
  const [learners, setLearners] = useState([]);
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [learnerCourses, setLearnerCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [showInstructorList, setShowInstructorList] = useState(false);
  const [showAdminList, setShowAdminList] = useState(false);
  const [admins, setAdmins] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    systemStats: {
      totalUsers: 0,
      totalCourses: 0,
      activeCourses: 0,
      pendingApprovals: 0,
      recentEnrollments: 0,
      totalRevenue: 0,
    },
    userManagementStats: {
      admins: 0,
      instructors: 0,
      learners: 0,
      newUserRequests: 0,
      activeUsersToday: 0,
      userGrowthRate: 0,
    },
    courseManagementStats: {
      totalCourses: 0,
      pendingCourses: 0,
      activeCategories: 0,
      completionRate: 0,
      averageRating: 0,
      recentlyAddedCourses: [],
      AddedCourses: [],

    },
    paymentStats: {
      totalRevenue: 0,
      pendingPayments: 0,
      monthlyRevenue: [],
      recentTransactions: []
    },
    supportRequests: []
  });

  const [userActivityData, setUserActivityData] = useState([]);
  const [error, setError] = useState(null);



  // Default data structure if the data isn't yet fetched or in case of errors
  const defaultData = [
    { category: 'Admins', count: 2 },
    { category: 'Instructors', count: 2 },
    { category: 'Learners', count: 4 }
  ];

  // Fetch user activity data from backend
  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/user-activity');
        const data = await response.json();

        console.log(data); // Check if data is an array and correctly formatted
        setUserActivity(response.data);
      } catch (error) {
        console.error('Error fetching user activity:', error);
        setUserActivity([]);
      }
    };

    fetchUserActivity();
  }, []);



  useEffect(() => {
    const fetchUserActivityData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/user-stats'); // Adjust this API endpoint based on your backend
        const data = await response.json();

        // Format the data to match the chart requirements
        const formattedData = [
          { category: 'Admins', count: data.totalAdmins },
          { category: 'Instructors', count: data.totalInstructors },
          { category: 'Learners', count: data.totalLearners }
        ];

        if (response.ok) {
          setUserActivityData(formattedData); // Set the formatted data
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivityData();
  }, []);


  // Fallback to default data in case of loading errors
  // 
  const dataToDisplay = loading ? defaultData : userActivityData;



  // Move fetchDashboardData here so it's available everywhere
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Replace these API endpoints 
      // Replace with your actual API URL
      const baseUrl = 'http://localhost:5000';
      // Replace these API endpoints with your actual backend endpoints
      const systemResponse = await fetch(`${baseUrl}/api/admin/system-stats`);
      const userResponse = await fetch(`${baseUrl}/api/admin/user-stats`);
      const courseResponse = await fetch(`${baseUrl}/api/admin/course-stats`);
      const recentCoursesResponse = await fetch(`${baseUrl}/api/admin/recent-courses`);
      const userActivityResponse = await fetch(`${baseUrl}/api/admin/user-activity`);
      
      const systemData = await systemResponse.json();
      const userData = await userResponse.json();
      const courseData = await courseResponse.json();
      const recentCoursesData = await recentCoursesResponse.json();
      const userActivityData = await userActivityResponse.json();

      // Calculate completion rate (if not provided by the API)
      const completionRate = courseData.totalCourses > 0 
        ? Math.round(((courseData.totalCourses - courseData.pendingCourses) / courseData.totalCourses) * 100) 
        : 0;

      setDashboardData({
        systemStats: systemData || {},
        userManagementStats: userData || { userGrowthData: [] },
        courseManagementStats: {
          totalCourses: courseData.totalCourses || 0,
          pendingCourses: courseData.pendingCourses || 0,
          activeCategories: courseData.activeCategories || 0,
          coursesThisMonth: courseData.coursesThisMonth || 0,
          completionRate: courseData.completionRate || 
            (courseData.totalCourses ? 
              Math.round(((courseData.totalCourses - courseData.pendingCourses) / courseData.totalCourses) * 100) : 0),
          recentlyAddedCourses: Array.isArray(recentCoursesData.recentCourses)
            ? recentCoursesData.recentCourses
            : [],
          AddedCourses: recentCoursesData || [],
        },
        paymentStats: {
          totalRevenue: 0,
          totalPayments: 0,
          recentTransactions: []
        },
        userActivityStats: userActivityData || {},
        supportRequests: []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        systemStats: {},
        userActivityStats : {},
        userManagementStats: { userGrowthData: [] },
        courseManagementStats: { totalCourses: 0,
          pendingCourses: 0,
          activeCategories: 0,
          coursesThisMonth: 0,
          completionRate: 0, AddedCourses:[],recentlyAddedCourses: [] },
        paymentStats: { totalRevenue: 0, pendingPayments: 0,  recentTransactions: [] },
        supportRequests: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data for specific sections when they become active
  useEffect(() => {
    if (activeSection === 'userManagement') {
      fetchUserData();
    } else if (activeSection === 'courseManagement') {
      fetchCourseData();
    } else if (activeSection === 'payments') {
      // Always fetch payment data when payments section is active
      fetchPaymentData({
        status: filterStatus,
        startDate: filterStartDate,
        endDate: filterEndDate
      });
    } else if (activeSection === 'support') {
      fetchSupportRequests();
    }
  }, [activeSection]);

  // Fetch payment data when payment section is activated or filters change
  useEffect(() => {
    if (activeSection === 'payments') {
      fetchPaymentData({
        status: filterStatus,
        startDate: filterStartDate,
        endDate: filterEndDate
      });
    }
  }, [activeSection, filterStatus, filterStartDate, filterEndDate]);


  const fetchUserData = async () => {
    setLoading(true);
    try {
      const baseUrl = 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/admin/user-stats`);
      const jsonData = await response.json();   // <<< ✅ Correctly parse JSON

      setDashboardData(prevData => ({
        ...prevData,
        userManagementStats: jsonData   // <<< ✅ Use parsed JSON
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  //Fetch all learners- User management
  const fetchLearners = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/learners');
      const data = await res.json();
      setLearners(data);
    } catch (error) {
      console.error('Error fetching learners', error);
    }
  };

  const fetchLearnerCourses = async (learnerId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/learners/${learnerId}/courses`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching learner courses:", err);
      return [];
    }
  };

  //view Instructors
  const fetchInstructors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/instructors/approved");
      const data = await res.json();
      setInstructors(data);
      setShowInstructorList(true);
    } catch (err) {
      console.error("Failed to fetch instructors", err);
    }
  };

  const fetchInstructorCourses = async (instructorId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/instructors/${instructorId}/courses`);
      return await res.json();
    } catch (err) {
      console.error("Error fetching instructor courses:", err);
      return [];
    }
  };

  //view all admins
  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/all-admins');
      const data = await res.json();
      setAdmins(data);
      setShowAdminList(true);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    }
  };

  const fetchCourseData = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }

      const response = await fetch(`http://localhost:5000/api/admin/courses?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      
      if (data.success && data.courses) {
        const formattedCourses = data.courses.map(course => ({
          id: course._id,
          title: course.title || 'Untitled Course',
          instructorName: course.instructorName || 'Unknown Instructor',
          instructorEmail: course.instructorEmail || 'Not available',
          category: course.category || 'Uncategorized',
          level: course.level || 'Not specified',
          primaryLanguage: course.primaryLanguage || 'Not specified',
          subtitle: course.subtitle || 'No subtitle available',
          description: course.description || 'No description available',
          pricing: course.pricing || 0,
          date: course.date || 'Not available',
          createdAt: course.createdAt || 'Not available',
          status: course.status || 'draft',
          totalEnrollments: course.totalEnrollments || 0,
          averageRating: course.averageRating || 0,
          totalReviews: course.totalReviews || 0,
          totalLessons: course.totalLessons || 0,
          requirements: course.requirements || []
        }));

        setDashboardData(prev => ({
          ...prev,
          courseManagementStats: {
            ...prev.courseManagementStats,
            recentlyAddedCourses: formattedCourses
          }
        }));
      } else {
        setDashboardData(prev => ({
          ...prev,
          courseManagementStats: {
            ...prev.courseManagementStats,
            recentlyAddedCourses: []
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setDashboardData(prev => ({
        ...prev,
        courseManagementStats: {
          ...prev.courseManagementStats,
          recentlyAddedCourses: []
        }
      }));
    } finally {
      setLoading(false);
    }
  };


  const fetchPaymentData = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Only append status if it's not 'all'
      if (filters.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }

      const response = await fetch(`http://localhost:5000/api/admin/payment-transactions?${queryParams.toString()}`);
      const paymentData = await response.json();

      if (response.ok) {
        setDashboardData(prevData => ({
          ...prevData,
          paymentStats: {
            ...prevData.paymentStats,
            recentTransactions: paymentData.recentTransactions || [],
            totalRevenue: paymentData.totalRevenue || 0,
            totalPayments: paymentData.totalPayments || 0,
          }
        }));
      } else {
        console.error('Error fetching payment data:', paymentData);
        // Set default values in case of error
        setDashboardData(prevData => ({
          ...prevData,
          paymentStats: {
            ...prevData.paymentStats,
            recentTransactions: [],
            totalRevenue: 0,
            totalPayments: 0,
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      // Set default values in case of error
      setDashboardData(prevData => ({
        ...prevData,
        paymentStats: {
          ...prevData.paymentStats,
          recentTransactions: [],
          totalRevenue: 0,
          totalPayments: 0,
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLogout = () => {
    // Implement secure logout
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    axios.post('/api/admin/logout')
      .then(() => navigate('/adminlogin'))
      .catch(err => {
        console.error('Logout error:', err);
        navigate('/adminlogin'); // Navigate anyway for better UX
      });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  // ⬇️ Add this **HERE**
  const revenueGrowth = dashboardData?.systemStats?.lastMonthRevenue
    ? ((dashboardData.systemStats.thisMonthRevenue - dashboardData.systemStats.lastMonthRevenue) / dashboardData.systemStats.lastMonthRevenue) * 100
    : 0;

  const userGrowthRate = dashboardData?.userManagementStats?.lastMonthUsers
    ? ((dashboardData.userManagementStats.thisMonthUsers - dashboardData.userManagementStats.lastMonthUsers) / dashboardData.userManagementStats.lastMonthUsers) * 100
    : 0;

  // Debug logs
  console.log('Revenue Growth:', {
    thisMonth: dashboardData?.systemStats?.thisMonthRevenue,
    lastMonth: dashboardData?.systemStats?.lastMonthRevenue,
    growth: revenueGrowth
  });

  console.log('User Growth:', {
    thisMonth: dashboardData?.userManagementStats?.thisMonthUsers,
    lastMonth: dashboardData?.userManagementStats?.lastMonthUsers,
    growth: userGrowthRate
  });

  // Sample chart data - would be replaced with API data
  const revenueData = [
    { month: 'Last Month', revenue: dashboardData?.systemStats?.lastMonthRevenue || 0 },
    { month: 'This Month', revenue: dashboardData?.systemStats?.thisMonthRevenue || 0 }
  ];

  const handleCourseFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
    setAnchorEl(null); // Close the menu
    fetchCourseData({ status: newStatus });
  };

  const handlePaymentFilterChange = () => {
    const filters = {
      status: filterStatus,
      startDate: filterStartDate,
      endDate: filterEndDate
    };
    fetchPaymentData(filters);
  };

  const handleSupportFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
    const filters = { status: newStatus };
    fetchSupportRequests(filters);
  };

  const renderOverviewContent = () => (
    <>
      <Grid container spacing={3} mb={4}>
        {/* Key Metrics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3" color="primary">
                {dashboardData.systemStats.totalUsers}
              </Typography>
              <Typography variant="body2" color={userGrowthRate > 0 ? 'success.main' : 'error.main'} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {userGrowthRate > 0 ? (
                  <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5, color: 'error.main' }} />
                )}
                {userGrowthRate > 0 ? `+${Math.abs(userGrowthRate).toFixed(1)}% vs last month` : `-${Math.abs(userGrowthRate).toFixed(1)}% vs last month`}
              </Typography>


            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Active Courses
              </Typography>
              <Typography variant="h3" color="primary">
                {dashboardData.systemStats.activeCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                of {dashboardData.systemStats.totalCourses} total courses
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Pending Approvals
              </Typography>
              <Typography variant="h3" color="error">
                {dashboardData.systemStats.pendingApprovals}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                sx={{ mt: 1 }}
                onClick={() => {
                  setActiveSection('userManagement');
                  setShowInstructorApprovals(true);
                }}
              >
                Review
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h3" color="primary">
                {dashboardData?.systemStats?.totalRevenue
                  ? `$${dashboardData.systemStats.totalRevenue.toLocaleString()}`
                  : '$0'}
              </Typography>

              <Typography
                variant="body2"
                color={revenueGrowth > 0 ? 'success.main' : 'error.main'}
                sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
              >
                {revenueGrowth > 0 ? (
                  <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5, color: 'error.main' }} />
                )}
                {revenueGrowth > 0 ? `+${Math.abs(revenueGrowth).toFixed(1)}% vs last month` : `-${Math.abs(revenueGrowth).toFixed(1)}% vs last month`}
              </Typography>


            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardHeader title="Revenue Overview" />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} fill={theme.palette.primary.light} />
                </AreaChart>
              </ResponsiveContainer>

            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardHeader title="Course Distribution" />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={courseDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name}) => name}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={1}
                  >
                    {courseDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader title="User Activity Overview" />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              {error && <Typography color="error">Error: {error}</Typography>}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataToDisplay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </>
  );

  // Fetch user statistics with month-by-month user data
  const fetchUserGrowthData = async () => {
    try {
      const baseUrl = 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/admin/user-stats`);
      const data = await response.json();


      // Assuming the response contains the userGrowthData
      const userGrowthData = data.userGrowthData;
      console.log('Last Month Users:', dashboardData?.userManagementStats?.lastMonthUsers);
      console.log('This Month Users:', dashboardData?.userManagementStats?.thisMonthUsers);
      console.log('Fetched User Stats:', data);

   
      // Now you can use userGrowthData in your chart component
      setUserGrowthData(userGrowthData); // Set the data for the chart
    } catch (error) {
      console.error('Error fetching user growth data:', error);
    }
  };

  // In your component, call this function
  useEffect(() => {
    fetchUserGrowthData();
  }, []);

  // Fetch user activity data from backend
  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/user-activity');
        const data = await response.json();

        console.log(data); // Check if data is an array and correctly formatted
        setUserActivity(response.data);
      } catch (error) {
        console.error('Error fetching user activity:', error);
        setUserActivity([]);
      }
    };

    fetchUserActivity();
  }, []);


  const renderUserManagementContent = () => {

    console.log("dashboardData:", dashboardData);
    console.log("userManagementStats:", dashboardData?.userManagementStats);


    if (showInstructorApprovals) {
      return <InstructorApprovalRequests onBack={() => setShowInstructorApprovals(false)} />;
    }

    if (showLearnerList) {
      return (
        <LearnerList
          learners={learners}
          fetchLearnerCourses={fetchLearnerCourses}
          onBack={() => setShowLearnerList(false)}
        />
      );
    }

    if (showInstructorList) {
      return (
        <InstructorList
          instructors={instructors}
          fetchInstructorCourses={fetchInstructorCourses}
          onBack={() => setShowInstructorList(false)}
        />
      );
    }

    if (showAdminList) {
      return (
        <AdminList
          admins={admins}
          onBack={() => setShowAdminList(false)}
        />
      );
    }


    // Check if userManagementStats exists at all
    if (!dashboardData?.userManagementStats) {
      return <Typography>No user management data available</Typography>;
    }

    // Calculate the growth rate based on data from the backend
    const userGrowthRate = dashboardData?.userManagementStats?.lastMonthUsers
      ? ((dashboardData.userManagementStats.thisMonthUsers - dashboardData.userManagementStats.lastMonthUsers) / dashboardData.userManagementStats.lastMonthUsers) * 100
      : 0;


    return (

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">User Management</Typography>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  onClick={() => setShowInstructorApprovals(true)}
                  sx={{ ml: 1 }}
                >
                  Approval Requests ({dashboardData.userManagementStats.newUserRequests})
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Admins</Typography>
                    <Typography variant="h3" color="primary">{dashboardData.userManagementStats.admins}</Typography>
                    <Button
                      size="small"
                      variant="text"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setActiveSection('userManagement');
                        fetchAdmins();
                      }}
                    >
                      View Admins
                    </Button>

                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Instructors</Typography>
                    <Typography variant="h3" color="primary">{dashboardData.userManagementStats.instructors}</Typography>
                    <Button
                      size="small"
                      variant="text"
                      sx={{ mt: 1 }}
                      onClick={fetchInstructors}
                    >
                      View Instructors
                    </Button>


                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Learners</Typography>
                    <Typography variant="h3" color="primary">{dashboardData.userManagementStats.learners}</Typography>
                    <Button
                      size="small"
                      variant="text"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setActiveSection('userManagement');  
                        setShowLearnerList(true);             
                        fetchLearners();                      
                      }}
                    >
                      View Learners
                    </Button>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>User Growth</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke={theme.palette.primary.main}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>


            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent User Activity (This Month)</Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Last Activity</TableCell>
                    <TableCell>Status</TableCell>
                    {/* <TableCell>Actions</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(dashboardData.userActivityStats || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <TableRow key={user.name} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{user.name[0]}</Avatar>
                          {user.name}
                        </Box>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{new Date(user.lastActivity).toLocaleString()}</TableCell>
                      <TableCell>
                        <StyledChip status={user.status}>
                          {user.status}
                        </StyledChip>
                      </TableCell>
                      {/* <TableCell>
                        {user.actions
                          .filter(action => action.label !== 'Edit') // 🔥 Remove only "Edit" actions
                          .map((action, idx) => (
                            <Button key={idx} size="small" variant="outlined" href={action.url} sx={{ mr: 1 }}>
                              {action.label}
                            </Button>
                          ))
                        }
                      </TableCell> */}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <TablePagination
        component="div"
        count={userActivity.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderCourseManagementContent = () => {
    if (selectedCourse) {
      return (
        <CourseDetailView
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onCourseApproved={handleCourseApproval}
        />
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Course Management</Typography>
              {/* Commenting out filter section
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={handleMenuClick}
                >
                  Filter: {filterStatus === 'all' ? 'All Courses' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleCourseFilterChange('all')}>All Courses</MenuItem>
                  <MenuItem onClick={() => handleCourseFilterChange('published')}>Published</MenuItem>
                  <MenuItem onClick={() => handleCourseFilterChange('draft')}>Draft</MenuItem>
                </Menu>
              </Box>
              */}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Dashboard Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Total Courses
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {dashboardData.systemStats.totalCourses}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Categories
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {courseDistributionData.length}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Courses Added This Month
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {dashboardData?.courseManagementStats?.coursesThisMonth ?? '0'}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Completion Rate
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {dashboardData?.courseManagementStats?.completionRate ?? 0}%
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>

            {/* Tabs Section */}
            <Box sx={{ width: '100%', mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Recently Added" />
              </Tabs>
            </Box>

            {/* Table Section */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Instructor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Level</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Added Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : dashboardData.courseManagementStats?.recentlyAddedCourses?.length > 0 ? (
                    dashboardData.courseManagementStats.recentlyAddedCourses
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((course) => (
                        <TableRow key={course.id} hover>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>{course.instructorName}</TableCell>
                          <TableCell>{course.category}</TableCell>
                          <TableCell>{course.level}</TableCell>
                          <TableCell>${course.pricing}</TableCell>
                          <TableCell>
                            <Chip
                              label={course.status}
                              color={
                                course.status === 'published' ? 'success' :
                                course.status === 'draft' ? 'default' : 'warning'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {course.date ? course.date : 'Not available'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setSelectedCourse(course)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No courses found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {dashboardData.courseManagementStats?.recentlyAddedCourses?.length > 0 && (
              <TablePagination
                component="div"
                count={dashboardData.courseManagementStats.recentlyAddedCourses.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  };


  const renderPaymentContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Payment Management</Typography>
            <Box>
              <FormControl size="small" sx={{ minWidth: 150, mr: 1 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    handlePaymentFilterChange();
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="Success">Success</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="Start Date"
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mr: 1 }}
              />
              <TextField
                size="small"
                label="End Date"
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mr: 1 }}
              />
              {/* <Button
                variant="contained"
                onClick={handlePaymentFilterChange}
              >
                Apply Filters
              </Button> */}
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {dashboardData?.systemStats?.totalRevenue
                      ? `$${dashboardData.systemStats.totalRevenue.toLocaleString()}`
                      : '$0'}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total No. of Payments
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {dashboardData.paymentStats.totalPayments || 0}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Revenue Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={dashboardData.paymentStats.monthlyRevenue || revenueData}>
                      <Line type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>

          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : dashboardData.paymentStats.recentTransactions.length > 0 ? (
                    dashboardData.paymentStats.recentTransactions
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((transaction) => (
                        <TableRow key={transaction.id} hover>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>{transaction.userName}</TableCell>
                          <TableCell>{transaction.courseName}</TableCell>
                          <TableCell>${transaction.amount?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <StyledChip
                              label={transaction.status}
                              status={transaction.status}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No Transactions
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {dashboardData.paymentStats.recentTransactions?.length > 0 && (
              <TablePagination
                component="div"
                count={dashboardData.paymentStats.recentTransactions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderSupportContent = () => {
    if (selectedSupportTicket) {
      return (
        <SupportDetailView
          ticket={selectedSupportTicket}
          onBack={() => setSelectedSupportTicket(null)}
          onResolve={handleResolveSupportTicket}
        />
      );
    }



    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Support Requests</Typography>
              <Box>
                {/* <TextField
                  size="small"
                  placeholder="Search tickets..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mr: 1, width: 200 }}
                /> */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      handleSupportFilterChange(e.target.value);
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ticket ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    {/* <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell> */}
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : dashboardData.supportRequests.length > 0 ? (
                    dashboardData.supportRequests
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((ticket) => (
                        <TableRow key={ticket._id} hover>
                          <TableCell>{ticket._id}</TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>{ticket.userName}</TableCell>
                          <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                          {/* <TableCell>
                            <Chip
                              label={ticket.priority}
                              color={
                                ticket.priority === 'high' ? 'error' :
                                  ticket.priority === 'medium' ? 'warning' : 'success'
                              }
                              size="small"
                            />
                          </TableCell> */}
                          <TableCell>
                            <StyledChip
                              label={ticket.status}
                              status={ticket.status}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => setSelectedSupportTicket(ticket)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No Support Requests
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {dashboardData.supportRequests?.length > 0 && (
              <TablePagination
                component="div"
                count={dashboardData.supportRequests.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Typography>Loading dashboard data...</Typography>
        </Box>
      );
    }

    switch (activeSection) {
      case 'overview':
        return renderOverviewContent();
      case 'userManagement':
        return renderUserManagementContent();
      case 'courseManagement':
        return renderCourseManagementContent();
      case 'payments':
        return renderPaymentContent();
      case 'support':
        return renderSupportContent();
      default:
        return renderOverviewContent();
    }
  };

  // Update the setActiveSection calls to also save to localStorage
  const handleSectionChange = (section) => {
    setActiveSection(section);
    localStorage.setItem('adminActiveSection', section);
  };

  const fetchSupportRequests = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status && filters.status !== 'all') {
        // Map frontend status values to backend status values
        const statusMap = {
          'pending': 'Pending',
          'in-progress': 'In Progress',
          'resolved': 'Closed'
        };
        queryParams.append('status', statusMap[filters.status] || filters.status);
      }

      const response = await fetch(`http://localhost:5000/api/admin/support?${queryParams.toString()}`);
      const supportData = await response.json();

      if (response.ok) {
        setDashboardData(prevData => ({
          ...prevData,
          supportRequests: supportData || []
        }));
      } else {
        console.error('Error fetching support requests:', supportData);
      }
    } catch (error) {
      console.error('Error fetching support requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseApproval = async (courseId) => {
    try {
      await axios.put(`/api/admin/courses/${courseId}/approve`);

      // Update the local state to reflect the change
      setDashboardData(prev => ({
        ...prev,
        courseManagementStats: {
          ...prev.courseManagementStats,
          recentlyAddedCourses: prev.courseManagementStats.recentlyAddedCourses.map(course =>
            course._id === courseId || course.id === courseId ? { ...course, status: 'published' } : course
          )
        }
      }));

      // Also update selectedCourse status so it's reflected immediately
      setSelectedCourse(prev =>
        prev && (prev._id === courseId || prev.id === courseId) ? { ...prev, status: 'published' } : prev
      );
    } catch (error) {
      console.error('Error approving course:', error);
    }
  };

  const handleResolveSupportTicket = async (ticketId) => {
    try {
      await axios.put(`/api/admin/support/${ticketId}/resolve`);

      // Update the local state to reflect the change
      setDashboardData(prev => ({
        ...prev,
        supportRequests: prev.supportRequests.map(ticket =>
          ticket._id === ticketId ? { ...ticket, status: 'closed' } : ticket
        )
      }));

      // Update selected ticket if it's currently being viewed
      setSelectedSupportTicket(prev =>
        prev && prev._id === ticketId ? { ...prev, status: 'closed' } : prev
      );
    } catch (error) {
      console.error('Error resolving support ticket:', error);
    }
  };

  // Auto-refresh logic for all sections
  useEffect(() => {
    let intervalId;

    const fetchSectionData = () => {
      switch (activeSection) {
        case 'overview':
          // The overview section uses fetchDashboardData
          fetchDashboardData();
          break;
        case 'userManagement':
          fetchUserData();
          break;
        case 'courseManagement':
          fetchCourseData();
          break;
        case 'payments':
          fetchPaymentData({
            status: filterStatus,
            startDate: filterStartDate,
            endDate: filterEndDate
          });
          break;
        case 'support':
          fetchSupportRequests({ status: filterStatus });
          break;
        default:
          break;
      }
    };

    // Fetch immediately
    fetchSectionData();
    // Set up interval
    intervalId = setInterval(fetchSectionData, 10000); // 10 seconds

    // Clean up on section change or unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [activeSection, filterStatus, filterStartDate, filterEndDate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Learnity Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Button color="inherit" startIcon={<SupportIcon />}>Help</Button> */}
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>Logout</Button>
            <Avatar
              sx={{ ml: 2, bgcolor: theme.palette.secondary.main }}
              alt="Admin User"
            >
              A
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            <ListItem
              button
              selected={activeSection === 'overview'}
              onClick={() => handleSectionChange('overview')}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon>
                <DashboardIcon color={activeSection === 'overview' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Dashboard Overview" />
            </ListItem>
            <ListItem
              button
              selected={activeSection === 'userManagement'}
              onClick={() => {
                handleSectionChange('userManagement');
                setShowInstructorApprovals(false);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon>
                <PeopleIcon color={activeSection === 'userManagement' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItem>
            <ListItem
              button
              selected={activeSection === 'courseManagement'}
              onClick={() => {
                handleSectionChange('courseManagement');
                setSelectedCourse(null);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon>
                <BookIcon color={activeSection === 'courseManagement' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Course Management" />
            </ListItem>
            <ListItem
              button
              selected={activeSection === 'payments'}
              onClick={() => handleSectionChange('payments')}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon>
                <PaymentIcon color={activeSection === 'payments' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Payments" />
            </ListItem>
            <ListItem
              button
              selected={activeSection === 'support'}
              onClick={() => {
                handleSectionChange('support');
                setSelectedSupportTicket(null);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon>
                <SupportIcon color={activeSection === 'support' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItem>
          </List>
          <Divider />
        </Box>

      </Drawer>
      <Main open={drawerOpen}>
        <Toolbar /> {/* This creates space below the AppBar */}
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {renderContent()}
        </Container>
      </Main>
    </Box>
  );
};

export default AdminDashboard;