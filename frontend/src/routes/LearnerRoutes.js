import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import LearnerViewCourse from "../components/LearnerViewCourse";
import EnrolledCourses from "../components/EnrolledCourses";
import CourseDisplay from "../components/CourseDisplay";
import PaymentForm from "../components/PaymentForm";
import Support from "../components/Support";
import NavBar from "../components/NavBar"; 
import CourseDisplayLocked from "../components/CourseDisplayLocked";
import VideoPlayer from "../components/VideoPlayer";
import Dashboard from "../components/Dashboard";
import Lecturedash from "../components/Lecturedash";
import QuizPage from "../components/QuizPage";
import ViewAssignments from "../components/ViewAssignments";
import SubmitAssignment from "../components/SubmitAssignment";
import RecommendationsPage from "../components/RecommendationsPage";
import LearnerDashboard from "../components/LearnerDashboard";
import LandingPage from "../components/LandingPage";
import ScrollToTop from '../components/ScrollToTop';
import LearnerProfile from "../components/LearnerProfile";
import ChatPage from "../components/ChatPageNT";
import CodeEditor from "../components/CodeEditor";
import FAQ from "../components/FAQ";
import DatabaseDesigner from "../components/DatabaseDesignTool";
import ApiTester from "../components/APITester";
import GitHubIntegration from "../components/ProjectTimeline";


const LearnerRoutes = ({ user, handleLogout }) => {
  return (
    <>
      <NavBar user={user} onLogout={handleLogout} /> 
      <ScrollToTop />
      <Routes>
      <Route path="/land" element={<PrivateRoute element={<LandingPage learnerId={user.id} />} />} />
        <Route path="/displayCourse" element={<PrivateRoute element={<LearnerViewCourse learnerId={user.id} />} />} />

        <Route path="/" element={<PrivateRoute element={<LandingPage learnerId={user.id} />} />} />
        <Route path="/tools/DatabaseDesigner" element={<DatabaseDesigner/>}/>
        <Route path="/tools/ApiTester" element={<ApiTester/>}/>
        <Route path="/tools/GithubIntegration" element={<GitHubIntegration/>}/>
        <Route path="/tools/CodeEditor" element={<CodeEditor/>}/>
        <Route path= "/FAQ" element={<FAQ/>}/>
        <Route path="/profile" element={<PrivateRoute element={<LearnerProfile learnerId={user.id} />} />} />
        <Route path="/dashboard" element={<Dashboard  />} />
        <Route path="/quiz/:quizId" element={<QuizPage/>} />
        <Route path="/course/:courseId" element={<CourseDisplayLocked />} />
        <Route path="/video/:courseId/:lessonIndex" element={<VideoPlayer />} />
        <Route path="/enrolled/:learnerId" element={<PrivateRoute element={<EnrolledCourses learnerId={user.id} />} />} />
        <Route path="/course-display/:courseId" element={<PrivateRoute element={<CourseDisplay />} />} />
        <Route path="/payment/:courseId" element={<PrivateRoute element={<PaymentForm learnerId={user.id} />} />} />
        {/* <Route path="/dash" element={<PrivateRoute><Dashboard learnerId={user.id} /></PrivateRoute>} /> */}

        <Route path="/fetchlecture" element={<PrivateRoute element={<Lecturedash learnerId={user.id} />} />} />
        <Route path="/recommendations" element={<RecommendationsPage learnerId={user.id} />} />
        <Route path="/LearnerDashboard" element={<LearnerDashboard learnerId={user.id}/>} />
        <Route path="/viewassignment" element={<ViewAssignments  />} />
        <Route path="/chat" element={<ChatPage  />} />
        <Route path="/submitAssignment" element={<SubmitAssignment  />} />
        <Route path="/support" element={<PrivateRoute element={<Support />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default LearnerRoutes;
