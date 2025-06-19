// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import LearnerRoutes from "./routes/LearnerRoutes";
// import InstructorRoutes from "./routes/InstructorRoutes";
// import LearnerLogin from "./components/LearnerLogin";
// import InstructorLogin from "./components/InstructorLogin";
// import RegistrationPage from "./components/RegistrationPage";
// import InstructorRegister from "./components/InstructorRegister";
// import CreateQuiz from "./components/CreateQuiz";
// import Creators from "./components/Creators";
// import EditQuiz from './components/EditQuiz';
// import ScheduleLecture from "./components/ScheduleLecture";
// import Viewlecture from "./components/Viewlecture";
// import Dashboard from "./components/Dashboard";
// import QuizPage from "./components/QuizPage";
// import Lecturedash from "./components/Lecturedash";
// import Scorecard from "./components/Scorecard";
// import AdminLogin from "./components/AdminLogin";
// import AdminRegister from "./components/AdminRegister";
// //import LandingPage from "./components/LandingPage";

// const theme = createTheme({
//   palette: {
//     primary: { main: "#1976d2" },
//     secondary: { main: "#d62613" },
//     error: { main: "#f44336" },
//     background: { default: "#fafafa" },
//   },
//   typography: { fontFamily: "Roboto, sans-serif", h6: { fontWeight: 600 } },
// });

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     const storedRole = localStorage.getItem("role");
//     const storedAuthToken = localStorage.getItem("authToken");

//     const checkTokenExpiry = () => {
//       const token = localStorage.getItem("authToken");
//       if (!token) return;
  
//       const decoded = JSON.parse(atob(token.split(".")[1]));
//       if (decoded.exp * 1000 < Date.now()) {
//         alert("Session expired. Please log in again.");
//         localStorage.clear();
//         window.location.href = "/InstructorLogin";
//       }
//     };
  
//     checkTokenExpiry();

//     if (storedUserId && storedAuthToken && storedRole) {
//       setUser({ id: storedUserId, role: storedRole });
//     }
//     setIsLoading(false);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("role");
//     setUser(null);
//   };

//   if (isLoading) return null;

//   return (
//     <ThemeProvider theme={theme}>
//       <Router>
//         <Routes>
//           {/* Public Routes */}
//           {/* <Route path="/" element={<LandingPage />} /> */}
//           <Route path="/login" element={<LearnerLogin setUser={setUser} />} />
//           <Route path="/register" element={<RegistrationPage setUser={setUser} />} />
//           <Route path="/InstructorLogin" element={<InstructorLogin setUser={setUser} />} />

//           <Route path="/InstructorRegister" element={<InstructorRegister  />} />
//           <Route path="/AdminLogin" element={<AdminLogin setUser={setUser} />} />
          
//           <Route path="/AdminRegister" element={<AdminRegister setUser={setUser}  />} />
      
//           <Route path="/createquiz" element={<CreateQuiz  />} />
//           <Route path="/creates" element={<Creators  />} />
//           <Route path="/edit-quiz/:quizId" element={<EditQuiz />} />
//           <Route path="/lecture" element={<ScheduleLecture  />} />
//           <Route path="/view" element={<Viewlecture  />} />
//           <Route path="/dash" element={<Dashboard  />} />
//           <Route path="/quiz/:quizId" element={<QuizPage />} />
//           <Route path="/fetchlecture" element={<Lecturedash  />} />
         
//           <Route path="/scorecard/:attemptId" element={<Scorecard />} />


//           {/* Conditional Routes Based on Role */}
//           {user?.role === "learner" && <Route path="/*" element={<LearnerRoutes user={user} handleLogout={handleLogout} />} />}
//           {user?.role === "instructor" && <Route path="/*" element={<InstructorRoutes user={user} handleLogout={handleLogout} />} />}

//           {/* Default Route */}
//           <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// };

// export default App;

// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ScrollToTop from './components/ScrollToTop';

// Route files
import LearnerRoutes from "./routes/LearnerRoutes";
import InstructorRoutes from "./routes/InstructorRoutes";
import AdminRoutes from "./routes/AdminRoutes"; 

// Common pages
import LearnerLogin from "./components/LearnerLogin";
import InstructorLogin from "./components/InstructorLogin";
import AdminLogin from "./components/AdminLogin";
import RegistrationPage from "./components/RegistrationPage";
import InstructorRegister from "./components/InstructorRegister";
import AdminRegister from "./components/AdminRegister";
import HomePage from "./components/HomePage";
import QuizPage from "./components/QuizPage";
import Scorecard from "./components/Scorecard";
//import RecommendationsPage from "./components/RecommendationsPage";
//import LearnerDashboard from "./components/LearnerDashboard";

import SupportDetailView from './components/SupportDetailView';
import AdminDashboard from "./components/AdminDashNT";
// import AdminDashboard1 from "./components/Admindashboard";

import CourseDisplayLocked from "./components/CourseDisplayLocked";

// Optional LandingPage import
// import LandingPage from "./components/LandingPage";
//import FAQ from './components/FAQ'; // Adjust path as needed


const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#d62613" },
    error: { main: "#f44336" },
    background: { default: "#fafafa" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h6: { fontWeight: 600 },
  },
});

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    const storedAuthToken = localStorage.getItem("authToken");

    const checkTokenExpiry = () => {
      if (!storedAuthToken) return;

      try {
        const decoded = JSON.parse(atob(storedAuthToken.split(".")[1]));
        if (decoded.exp * 1000 < Date.now()) {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
      }
    };

    checkTokenExpiry();

    if (storedUserId && storedRole && storedAuthToken) {
      setUser({ id: storedUserId, role: storedRole });
    }

    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (isLoading) return null;

  return (
    <ThemeProvider theme={theme}>
      <Router>
      <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />  
          <Route path="/login" element={<LearnerLogin setUser={setUser} />} />
          <Route path="/register" element={<RegistrationPage setUser={setUser} />} />
          <Route path="/InstructorLogin" element={<InstructorLogin setUser={setUser} />} />
          <Route path="/InstructorRegister" element={<InstructorRegister />} />
          <Route path="/AdminLogin" element={<AdminLogin setUser={setUser} />} />
          
          <Route path="/AdminRegister" element={<AdminRegister setUser={setUser} />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/scorecard/:attemptId" element={<Scorecard />} />

          <Route path="/AdminDashboard" element={<AdminDashboard setUser={setUser}/>} />
          {/* Protected Role-Based Routes */}
          {user?.role === "learner" && (
            <Route path="/*" element={<LearnerRoutes user={user} handleLogout={handleLogout} />} />
          )}
          {user?.role === "instructor" && (
            <Route path="/*" element={<InstructorRoutes user={user} handleLogout={handleLogout} />} />
          )}
          {user?.role === "admin" && (
            <Route path="/*" element={<AdminRoutes user={{ ...user, setUser }} handleLogout={handleLogout} />} />
          )}

          {/* Catch-all route for admin paths */}
          {/* <Route path="/AdminDashboard" element={<Navigate to="/AdminLogin" />} /> */}
          {/* <Route path="/AdminDashboard1" element={<Navigate to="/AdminLogin" />} /> */}
          <Route path="/admin/*" element={<Navigate to="/AdminLogin" />} />

          <Route path="/courses/:courseId" element={<CourseDisplayLocked />} />

          {/* Fallback Route */}
          {/* {!user && <Route path="*" element={<Navigate to="/login" />} />} */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;