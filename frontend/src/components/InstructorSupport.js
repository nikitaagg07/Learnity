import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Grid, Card, CardContent, Typography, TextField,
  Button, MenuItem, CircularProgress, Alert, Box, Paper
} from "@mui/material";

const InstructorSupport = () => {
  const [category, setCategory] = useState("Technical Issue");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [supportRequests, setSupportRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const instructorId = localStorage.getItem("userId"); // ✅ Get Instructor ID from localStorage

  // ✅ Fetch existing support requests
  useEffect(() => {
    fetchSupportRequests();
  }, [instructorId]);

  const fetchSupportRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/support?userId=${instructorId}&userType=Instructor`);
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
      formData.append("userId", instructorId);
      formData.append("userType", "Instructor");
      formData.append("category", category);
      formData.append("subject", subject);
      formData.append("message", message);
      if (file) formData.append("file", file);

      const response = await axios.post("http://localhost:5000/api/support/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setSubject("");
        setMessage("");
        setFile(null);
        alert("Support request submitted successfully!");
        fetchSupportRequests(); // ✅ Refresh the list after submission
      }
    } catch (error) {
      setErrorMessage("Failed to submit request. Please try again.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" fontWeight="bold" color="primary" gutterBottom>
        Instructor Support Center
      </Typography>

      {/* Form Section */}
      <Card sx={{ p: 3, mb: 4, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Submit a Support Request
        </Typography>

        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField select label="Issue Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth required>
                {["Technical Issue", "Payment Issue", "Course Management", "Account Related", "Other"].map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth required inputProps={{ maxLength: 100 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Message" value={message} onChange={(e) => setMessage(e.target.value)} multiline rows={4} fullWidth required inputProps={{ maxLength: 500 }} />
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
                  <Paper elevation={3} sx={{ padding: 2, borderLeft: "5px solid #1976d2" }}>
                    <Typography variant="h6" fontWeight="bold">{request.subject}</Typography>
                    <Typography variant="body2" color="textSecondary"><strong>Category:</strong> {request.category}</Typography>
                    <Typography variant="body2" sx={{ my: 1 }}>{request.message}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Status:</strong> {request.status}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Container>
  );
};

export default InstructorSupport;
