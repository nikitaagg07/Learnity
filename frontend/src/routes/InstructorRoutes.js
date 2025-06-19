import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import InstructorChangeCourse from "../components/InstructorChangeCourse";
import CourseForm from "../components/CourseForm";
import AIExamForm from "../components/AIExamForm";
import InstructorNavBar from "../components/InstructorNavBar";
import TrackLearnersForInstructor from "../components/TrackLearnersForInstructors";
import InstructorSupport from "../components/InstructorSupport";
import InstructorCourseManagement from "../components/InstructorCourseManagement";
import CreateQuiz from "../components/CreateQuiz";
import Creators from "../components/Creators";
import EditQuiz from "../components/EditQuiz";
import ScheduleLecture from "../components/ScheduleLecture";
import ViewLecture from "../components/Viewlecture";
import QuizPage from "../components/QuizPage";
import Scorecard from "../components/Scorecard";
import AssignmentForm from "../components/AssignmentForm";
import InstructorChat from "../components/InstructorChat";
const InstructorRoutes = ({ user, handleLogout }) => {
  const [open, setOpen] = useState(true);

  return (
    <InstructorNavBar user={user} onLogout={handleLogout} open={open} setOpen={setOpen}>
      <Routes>
        <Route path="/updateCourse" element={<PrivateRoute element={<InstructorChangeCourse sidebarOpen={open} />} />} />
        <Route path="/createCourse" element={<PrivateRoute element={<CourseForm sidebarOpen={open} />} />} />
        <Route path="/createAIExam" element={<PrivateRoute element={<AIExamForm sidebarOpen={open} />} />} />
        <Route path="*" element={<Navigate to="/updateCourse" />} />
        <Route path="/trackLearners" element={<PrivateRoute element={<TrackLearnersForInstructor sidebarOpen={open}/>} />} />
        <Route path="/instructor/course/:courseId" element={<PrivateRoute element={<InstructorCourseManagement sidebarOpen={open}/>} />} />

        <Route path="/support" element={<PrivateRoute element={<InstructorSupport />} />} />

          {/* Learner and Instructor Common Routes */}
          <Route path="/createquiz" element={<CreateQuiz />} />
          <Route path="/creates" element={<Creators />} />
          <Route path="/edit-quiz/:quizId" element={<EditQuiz />} />
          <Route path="/lecture" element={<ScheduleLecture />} />
          <Route path="/view" element={<ViewLecture />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/scorecard/:attemptId" element={<Scorecard />} />
          <Route path="/createassignment" element={<AssignmentForm />} />
          <Route path="/instchat" element={<InstructorChat />} />

          {/* Conditional Routes Based on Role
          {user?.role === "learner" && <Route path="/*" element={<LearnerRoutes user={user} handleLogout={handleLogout} />} />} */}
          {user?.role === "instructor" && <Route path="/*" element={<InstructorRoutes user={user} handleLogout={handleLogout} />} />}

          {/* Default Route */}
          <Route path="*" element={<Navigate to={user ? "/dash" : "/login"} />} />

      </Routes>
    </InstructorNavBar>
  );
};

export default InstructorRoutes;
