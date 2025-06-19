import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import InstructorApprovalRequests from './InstructorApprovalRequests';
import CourseDetailView from './CourseDetailView';
import SupportDetailView from './SupportDetailView';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showInstructorApprovals, setShowInstructorApprovals] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [selectedSupportTicket, setSelectedSupportTicket] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    systemStats: {
      totalUsers: 0,
      totalCourses: 0,
      activeCourses: 0,
      pendingApprovals: 0,
      recentEnrollments: 0,
    },
    userManagementStats: {
      admins: 0,
      instructors: 0,
      learners: 0,
      newUserRequests: 0
    },
    courseManagementStats: {
      totalCourses: 0,
      pendingCourses: 0,
      activeCategories: 0,
      recentlyAddedCourses: []
    },
    paymentStats: {
      totalRevenue: 0,
      pendingPayments: 0,
      recentTransactions: []
    },
    supportRequests: []
  });

  useEffect(() => {
    // Fetch data from API/database
    const fetchDashboardData = async () => {
      setLoading(true);
    
      try {
        const baseUrl = 'http://localhost:5000';
    
        const systemResponse = await fetch(`${baseUrl}/api/admin/system-stats`);
        const userResponse = await fetch(`${baseUrl}/api/admin/user-stats`);
        const courseResponse = await fetch(`${baseUrl}/api/admin/course-stats`);
        const recentCoursesResponse = await fetch(`${baseUrl}/api/admin/recent-courses`);
    
        const systemData = await systemResponse.json();
        const userData = await userResponse.json();
        const courseData = await courseResponse.json();
        const recentCoursesData = await recentCoursesResponse.json();
    
        console.log('Fetched user data:', userData); // Debugging: Check the fetched data
    
        setDashboardData({
          systemStats: systemData,
          userManagementStats: userData,
          courseManagementStats: {
            ...courseData,
            recentlyAddedCourses: recentCoursesData,
          },
          paymentStats: {
            totalRevenue: 0,
            pendingPayments: 0,
            recentTransactions: [],
          },
          supportRequests: [],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchDashboardData();
  }, []);

  // Fetch support requests when support section is activated
  useEffect(() => {
    if (activeSection === 'support') {
      fetchSupportRequests();
    }
  }, [activeSection]);

  // Fetch payment data when payment section is activated
  useEffect(() => {
    if (activeSection === 'payments') {
      fetchPaymentData({
        status: filterStatus,
        startDate: filterStartDate,
        endDate: filterEndDate
      });
    }
  }, [activeSection, filterStatus, filterStartDate, filterEndDate]);

  const fetchSupportRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/support');
      const supportData = await response.json();

      setDashboardData(prevData => ({
        ...prevData,
        supportRequests: supportData
      }));
    } catch (error) {
      console.error('Error fetching support requests:', error);
      // You could set some error state here
    } finally {
      setLoading(false);
    }
  };


  const fetchPaymentData = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/admin/payment-transactions?${params}`);
      const paymentData = await response.json();

      setDashboardData(prevData => ({
        ...prevData,
        paymentStats: {
          recentTransactions: paymentData.recentTransactions || [],
          totalRevenue: paymentData.totalRevenue || 0,
          pendingPayments: paymentData.pendingPayments || 0
        }
      }));
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    // Clear any authentication tokens/data from localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');

    // Redirect to login page
    navigate('/adminlogin');
  };

  const renderOverview = () => (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h3 className="card-title">System Overview</h3>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <p className="stat-item">Total Users: {dashboardData.systemStats.totalUsers}</p>
            <p className="stat-item">Total Courses: {dashboardData.systemStats.totalCourses}</p>
            <p className="stat-item">Active Courses: {dashboardData.systemStats.activeCourses}</p>
          </>
        )}
      </div>

      <div className="dashboard-card">
  <h3 className="card-title">User Management</h3>
  {loading ? (
    <div className="loading-spinner">Loading...</div>
  ) : (
    <>
      <p className="stat-item">Admins: {dashboardData.userManagementStats.totalAdmins}</p>
      <p className="stat-item">Instructors: {dashboardData.userManagementStats.totalInstructors}</p>
      <p className="stat-item">Learners: {dashboardData.userManagementStats.totalLearners}</p>
      <p className="stat-item">New User Requests: {dashboardData.userManagementStats.newInstructorRequests}</p>
    </>
  )}
</div>


      <div className="dashboard-card">
        <h3 className="card-title">Course Management</h3>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <p className="stat-item">Total Courses: {dashboardData.courseManagementStats.totalCourses}</p>
            <p className="stat-item">Pending Courses: {dashboardData.courseManagementStats.pendingCourses}</p>
            <p className="stat-item">Active Courses: {dashboardData.courseManagementStats.activeCategories}</p>
          </>
        )}
      </div>
    </div>
  );

  const renderUserManagement = () => {
    if (showInstructorApprovals) {
      return <InstructorApprovalRequests onBack={() => setShowInstructorApprovals(false)} />;
    }

    return (
      <div className="dashboard-card full-width">
        <h2 className="section-title">User Management</h2>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="two-column-grid">
            <div className="user-types-section">
              <h3 className="subsection-title">User Types</h3>
              <ul className="stat-list">
                <li className="stat-list-item">Admins: {dashboardData.userManagementStats.admins}</li>
                <li className="stat-list-item">Instructors: {dashboardData.userManagementStats.instructors}</li>
                <li className="stat-list-item">Learners: {dashboardData.userManagementStats.learners}</li>
              </ul>
            </div>
            <div className="approvals-section">
              <h3 className="subsection-title">Pending Approvals</h3>
              <p className="stat-item">New Instructor Requests: {dashboardData.userManagementStats.newUserRequests}</p>
              <button
                className="primary-button"
                onClick={() => setShowInstructorApprovals(true)}
              >
                Review Requests
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCourseManagement = () => {
    if (selectedCourse) {
      return (
        <CourseDetailView
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onCourseApproved={(courseId) => {
            // ✅ Update the specific course's status to "published"
            setDashboardData(prev => ({
              ...prev,
              courseManagementStats: {
                ...prev.courseManagementStats,
                recentlyAddedCourses: prev.courseManagementStats.recentlyAddedCourses.map(course =>
                  course.id === courseId ? { ...course, status: 'published' } : course
                )
              }
            }));

            // Also update selectedCourse status so it's reflected immediately
            setSelectedCourse(prev =>
              prev && prev.id === courseId ? { ...prev, status: 'published' } : prev
            );
          }}
        />
      );
    }

    return (
      <div className="dashboard-card full-width">
        <h2 className="section-title">Course Management</h2>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div>
            <h3 className="subsection-title">Recently Added Courses</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Instructor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(dashboardData.courseManagementStats.recentlyAddedCourses || []).map(course => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td>{course.instructorName}</td>
                    <td className="actions-cell">
                      <button
                        className="view-button"
                        onClick={() => setSelectedCourse(course)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dashboardData.courseManagementStats.recentlyAddedCourses.length === 0 && (
              <p className="no-data-message">No recently added courses found.</p>
            )}
          </div>
        )}
        <div className="pagination">
          <button className="pagination-button">&laquo; Previous</button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-button">Next &raquo;</button>
        </div>
      </div>
    );
  };

  const renderPayments = () => (
    <div className="dashboard-card full-width">
      <h2 className="section-title">Payment Transactions</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div>
          <div className="payments-header">
            <h3 className="subsection-title">Transaction History</h3>
            <div className="payment-filters">
              <select className="filter-dropdown">
                <option value="all">All Transactions</option>
                <option value="completed">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <div className="date-filter">
                <input type="date" className="date-input" placeholder="From" />
                <span>to</span>
                <input type="date" className="date-input" placeholder="To" />
              </div>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>User</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Date</th>

              </tr>
            </thead>
            <tbody>
              {dashboardData.paymentStats.recentTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>#{transaction.id}</td>
                  <td>{transaction.userName}</td>
                  <td>{transaction.courseName}</td>

                  <td className="amount-cell">${transaction.amount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${transaction.status?.toLowerCase?.() || 'unknown'}`}>
                      {transaction.status || 'Unknown'}
                    </span>
                  </td>
                  <td>{transaction.paymentMethod || 'N/A'}</td>
                  <td>{transaction.date}</td>

                </tr>
              ))}

              {dashboardData.paymentStats.recentTransactions.length === 0 && (
                <p className="no-data-message">No transactions found.</p>
              )}
              <div className="pagination">
                <button className="pagination-button">&laquo; Previous</button>
                <span className="pagination-info">Page 1 of 1</span>
                <button className="pagination-button">Next &raquo;</button>
              </div>
            </tbody>
          </table>

          <div className="payment-summary">
            <div className="summary-card">
              <h4>Total Revenue</h4>
              <p className="summary-value">${dashboardData.paymentStats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="summary-card">
              <h4>Pending Payments</h4>
              <p className="summary-value">${dashboardData.paymentStats.pendingPayments.toFixed(2)}</p>
            </div>
          </div>


        </div>
      )}
    </div>
  );

  const renderSupportRequests = () => {
    if (selectedSupportTicket) {
      return (
        <SupportDetailView
          ticket={selectedSupportTicket}
          onBack={() => setSelectedSupportTicket(null)}
        />
      );
    }

    return (
      <div className="dashboard-card full-width">
        <h2 className="section-title">Support Requests</h2>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div>
            <div className="support-header">
              <h3 className="subsection-title">All Support Tickets</h3>
              <div className="support-filters">
                <select className="filter-dropdown">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.supportRequests.map(request => (
                  <tr key={request._id}>
                    <td>#{request._id}</td>
                    <td>{request.userName}</td>
                    <td>{request.userType}</td>
                    <td className="subject-cell">{request.subject}</td>
                    <td>
                      <span className={`status-badge ${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="view-button"
                        onClick={() => setSelectedSupportTicket(request)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {dashboardData.supportRequests.length === 0 && (
              <p className="no-data-message">No support requests found.</p>
            )}

            <div className="pagination">
              <button className="pagination-button">&laquo; Previous</button>
              <span className="pagination-info">Page 1 of 1</span>
              <button className="pagination-button">Next &raquo;</button>
            </div>
          </div>
        )}
      </div>
    );
  };


  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'userManagement':
        return renderUserManagement();
      case 'courseManagement':
        return renderCourseManagement();
      case 'payments':
        return renderPayments();
      case 'support':
        return renderSupportRequests();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li
              className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <span className="nav-icon">📊</span> Dashboard
            </li>
            <li
              className={`nav-item ${activeSection === 'userManagement' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('userManagement');
                setShowInstructorApprovals(false);
              }}
            >
              <span className="nav-icon">👥</span> User Management
            </li>
            <li
              className={`nav-item ${activeSection === 'courseManagement' ? 'active' : ''}`}
              onClick={() => setActiveSection('courseManagement')}
            >
              <span className="nav-icon">📚</span> Course Management
            </li>
            <li
              className={`nav-item ${activeSection === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveSection('payments')}
            >
              <span className="nav-icon">💳</span> Payments
            </li>
            <li
              className={`nav-item ${activeSection === 'support' ? 'active' : ''}`}
              onClick={() => setActiveSection('support')}
            >
              <span className="nav-icon">❓</span> Support
            </li>
            <li
              className="nav-item logout"
              onClick={handleLogout}
            >
              <span className="nav-icon">🚪</span> Logout
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h2 className="section-header">
            {activeSection === 'overview' ? 'Dashboard Overview' :
              activeSection === 'userManagement' ? (showInstructorApprovals ? 'Instructor Approval Requests' : 'User Management') :
                activeSection === 'courseManagement' ? 'Course Management' :
                  activeSection === 'payments' ? 'Payment Transactions' :
                    activeSection === 'support' ? 'Support Requests' : ''}
          </h2>
        </div>
        <div className="content-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;