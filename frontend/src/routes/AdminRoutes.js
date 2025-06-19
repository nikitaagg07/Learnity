import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
// import AdminRegister from "../components/AdminRegister";
// import AdminLogin from "../components/AdminLogin";
import NavBar from "../components/NavBar";
import AdminDashboard from "../components/AdminDashNT";
import ScrollToTop from '../components/ScrollToTop';
import AdminList from "../components/AdminList";
import InstructorList from "../components/InstructorList";
import LearnerList from "../components/LearnerList";


const AdminRoutes = ({ user, handleLogout }) => {
  return (
    <>
      <NavBar user={user} onLogout={handleLogout} />
      <ScrollToTop />
      <Routes>
        {/* <Route path="/AdminLogin" element={<AdminLogin setUser={user?.setUser} />} />
        <Route path="/AdminRegister" element={<AdminRegister setUser={user?.setUser} />} /> */}
        <Route 
          path="/AdminDashboard" 
          element={
            <PrivateRoute 
              element={<AdminDashboard />} 
              userType="admin"
            />
          } 
        />
        <Route 
          path="/InstructorList" 
          element={
            <PrivateRoute 
              element={<InstructorList />} 
              userType="admin"
            />
          } 
        />
        <Route 
          path="/LearnerList" 
          element={
            <PrivateRoute 
              element={<LearnerList />} 
              userType="admin"
            />
          } 
        />
        <Route 
          path="/AdminList" 
          element={
            <PrivateRoute 
              element={<AdminList />} 
              userType="admin"
            />
          } 
        />
        <Route path="*" element={<Navigate to="/AdminDashboard" />} />
      </Routes>
    </>
  );
};

export default AdminRoutes;
