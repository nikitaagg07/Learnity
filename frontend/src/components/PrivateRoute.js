// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ element }) => {
//   const authToken = localStorage.getItem('authToken');
//   const learnerId = localStorage.getItem('userId');
  
//   if (!authToken || !learnerId) {
//     return <Navigate to="/login" />;
//   }

//   return element;
// };

// export default PrivateRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, userType }) => {
  const authToken = localStorage.getItem('authToken');
  const role = localStorage.getItem('role');

  // If no token, redirect to appropriate login page
  if (!authToken) {
    return <Navigate to={userType === 'admin' ? '/AdminLogin' : '/login'} />;
  }

  // If userType is specified, check if the role matches
  if (userType && role !== userType) {
    // If user is admin but trying to access non-admin route
    if (role === 'admin' && userType !== 'admin') {
      return <Navigate to="/AdminDashboard" />;
    }
    // If user is not admin but trying to access admin route
    if (userType === 'admin' && role !== 'admin') {
      return <Navigate to="/AdminLogin" />;
    }
    // For other cases, redirect to login
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
