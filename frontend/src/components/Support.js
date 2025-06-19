import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Grid, Card, CardContent, Typography, TextField,
  Button, MenuItem, CircularProgress, Alert, Box
} from "@mui/material";


const Support = () => {
  const [category, setCategory] = useState("Technical Issue");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [relatedCourse, setRelatedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [file, setFile] = useState(null);
  const [supportRequests, setSupportRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const learnerId = localStorage.getItem("userId");

  // ✅ Fetch existing support requests
  useEffect(() => {
    fetchSupportRequests();
  }, [learnerId]);


  // ✅ Fetch Enrolled Courses
  const fetchEnrolledCourses = async () => {
    try {
      if (!learnerId) throw new Error("User ID missing. Please log in.");
      const response = await axios.get(`http://localhost:5000/api/learners/enrolled/${learnerId}`);
      setCourses(response.data); // ✅ Full Course Data
    } catch (error) {
      setErrorMessage("Failed to fetch enrolled courses.");
    }
  };

  const fetchSupportRequests = async () => {
    try {
      if (!learnerId) throw new Error("Learner ID missing. Please log in.");

      const response = await axios.get(`http://localhost:5000/api/support?userId=${learnerId}&userType=Learner`);
      setSupportRequests(response.data);
    } catch (error) {
      setErrorMessage("Failed to fetch support requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle support request submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subject.length > 100 || message.length > 500) {
      setErrorMessage("Subject should be max 100 characters & message max 500.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", learnerId);
      formData.append("userType", "Learner");
      formData.append("category", category);
      formData.append("subject", subject);
      formData.append("message", message);
      formData.append("relatedCourse", relatedCourse ? relatedCourse : "");
      if (file) formData.append("file", file);

      const response = await axios.post("http://localhost:5000/api/support/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setSubject("");
        setMessage("");
        setRelatedCourse(""); // ✅ Reset the state
        setFile(null);
        alert("Support request submitted successfully!");
        fetchSupportRequests(); // ✅ Refresh the list after submission
      }
    } catch (error) {
      setErrorMessage("Failed to submit request. Please try again.");
    }
  };


  return (
    <Container maxWidth="md" sx={{ py: 4 ,paddingY:12,
      
    }}>
      <Typography variant="h4" align="center" fontWeight="bold" color="primary" gutterBottom>
        Support & Help Center
      </Typography>

      {/* Form Section */}
      <Card sx={{ p: 3, mb: 4, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Submit a Support Request
        </Typography>

        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Issue Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                required
              >
                {["Technical Issue", "Payment Issue", "Course Content Issue", "Account Related", "Other"].map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Related Course Dropdown */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Related Course"
                value={relatedCourse}
                onChange={(e) => setRelatedCourse(e.target.value)}
                fullWidth
                required
              >
                <MenuItem value="">Select a Course</MenuItem>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.title}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No courses available</MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Subject (Max 100 characters)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                required
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Message (Max 500 characters)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                rows={4}
                fullWidth
                required
                inputProps={{ maxLength: 500 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Attach Screenshot (Optional)
                <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
              </Button>
              {file && <Typography sx={{ mt: 1 }}>{file.name}</Typography>}
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" fullWidth sx={{ py: 1.5 }}>
                Submit Request
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>

      {/* Loading Indicator */}
      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {/* Support Requests Section */}
      {!loading && (
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Your Support Requests
          </Typography>

          {supportRequests.length === 0 ? (
            <Typography>No support requests found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {supportRequests.map((request) => (
                <Grid item xs={12} key={request._id}>
                  <Card sx={{ boxShadow: 2, borderLeft: "5px solid #1976d2" }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">{request.subject}</Typography>
                      <Typography variant="body2" color="textSecondary"><strong>Category:</strong> {request.category}</Typography>
                      <Typography variant="body2" sx={{ my: 1 }}>{request.message}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Course:</strong> {request.relatedCourse?.title || "N/A"}
                      </Typography>

                      <Typography variant="body2" color="textSecondary">
                        <strong>Status:</strong> {request.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Support;

