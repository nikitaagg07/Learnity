import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, Grid, MenuItem, FormControl, Select, InputLabel } from "@mui/material";

const TrackLearnersForInstructor = () => {
  const [courses, setCourses] = useState([]); // Store courses for dropdown
  const [selectedCourse, setSelectedCourse] = useState(""); // Selected course ID
  const [learners, setLearners] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch instructor's courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Unauthorized. No token found.");

        const response = await fetch("http://localhost:5000/api/courses/instructor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCourses();
  }, []);

  // 🔹 Fetch learners when a course is selected
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchLearners = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Unauthorized. No token found.");

        const response = await fetch(`http://localhost:5000/api/courses/${selectedCourse}/learners`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch learners");

        const data = await response.json();
        setCourseTitle(data.courseTitle);
        setLearners(data.learners);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearners();
  }, [selectedCourse]);

  return (
    <Box p={4} sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center" sx={{ color: "#1976d2" }}>
        Track Learners by Course
      </Typography>

      {/* 🔹 Course Selection Dropdown */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select a Course</InputLabel>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          {courses.map((course) => (
            <MenuItem key={course._id} value={course._id}>
              {course.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && <CircularProgress sx={{ display: "block", mx: "auto" }} />}
      {error && <Typography color="error" textAlign="center">{error}</Typography>}

      {/* 🔹 Learners List */}
      {selectedCourse && learners.length === 0 ? (
        <Typography variant="h6" textAlign="center">No learners enrolled in {courseTitle} yet.</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom align="center">{courseTitle}</Typography>
              <List>
                {learners.map((learner, index) => (
                  <ListItem key={index} divider>
                    <ListItemText primary={learner.name} secondary={`Email: ${learner.email}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TrackLearnersForInstructor;
