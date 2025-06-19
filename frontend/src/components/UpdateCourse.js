
// UpdateCourse.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";

const UpdateCourse = ({ sidebarOpen }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [pricing, setPricing] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const instructorId = req.user.id;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Course not found");
        }

        setCourse(data);
        setTitle(data.title);
        setPricing(data.pricing);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, pricing }),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      alert("Course updated successfully");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          mt: 2,
          borderRadius: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        ) : (
          <>
            <Typography variant="h4" gutterBottom align="center">
              Update Course
            </Typography>
            <TextField
              label="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              type="number"
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              fullWidth
              sx={{ mt: 3 }}
            >
              Update Course
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateCourse;