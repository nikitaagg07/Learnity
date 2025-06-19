import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  Typography,
  Paper,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SchoolIcon from "@mui/icons-material/School";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import HomeIcon from '@mui/icons-material/Home';

const generateCaptchaText = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const LearnerLogin = ({setUser}) => {
  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptchaText());
  const [captchaInput, setCaptchaInput] = useState("");

  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const drawCaptcha = useCallback(() => {
    setCaptcha(generateCaptchaText());
  }, []);

  useEffect(() => {
    drawCaptcha();
  }, [drawCaptcha]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (captchaInput !== captcha) {
      setError("Invalid CAPTCHA! Try again.");
      drawCaptcha();
      return;
    }
  
    setLoading(true);
    try {
      console.log("🔍 Sending Data:", formData); // Debugging log
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.Email, // Ensure field names match backend
        password: formData.Password
      });
  
      console.log("✅ Response:", response.data); // Debug log
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userId", response.data.learnerId);
      localStorage.setItem("role", "learner");
      setUser({ id: response.data.learnerId, role: "learner" });
  
      // Check for courseId in URL
      const urlParams = new URLSearchParams(window.location.search);
      const courseId = urlParams.get('courseId');
      if (courseId) {
        navigate(`/courses/${courseId}`); // Navigate to course display page
      } else {
        navigate("/land"); // Default redirect
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f6f8" }}>
      <Paper sx={{ padding: 4, maxWidth: 400, width: "100%" }}>
        <Button startIcon={<HomeIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
          Home
        </Button>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
          Learner Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email Address" name="Email" variant="outlined" value={formData.Email} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="Password"
            name="Password"
            type={passwordVisible ? "text" : "password"}
            variant="outlined"
            value={formData.Password}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>{passwordVisible ? <VisibilityOff /> : <Visibility />}</IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* CAPTCHA Section */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: "monospace", letterSpacing: "4px", textDecoration: "line-through", mb: 1, p: 1, display: "inline-block", backgroundColor: "#ddd", borderRadius: "8px" }}>
              {captcha}
            </Typography>
            <Button onClick={drawCaptcha} size="small" variant="outlined" sx={{ ml: 1 }}>Refresh</Button>
          </Box>
          <TextField fullWidth label="Enter CAPTCHA" variant="outlined" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} required sx={{ mb: 2 }} />

          <Button fullWidth variant="contained" color="primary" type="submit" disabled={loading} sx={{ py: 1.5 }}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>

        {/* Links Section */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2">Login as:</Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button component={Link} to="/AdminLogin" variant="contained" startIcon={<AdminPanelSettingsIcon />} 
              sx={{ textTransform: "none", backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#1565c0" } }}
              >
                Admin
              </Button>
            </Grid>
            <Grid item>
              <Button component={Link} to="/InstructorLogin" startIcon={<PersonIcon />} variant="contained"
               sx={{ textTransform: "none", backgroundColor: "#388e3c", "&:hover": { backgroundColor: "#2e7d32" } }}>
                Instructor
              </Button>
            </Grid>
          </Grid>

          <Typography variant="body2" sx={{ mt: 2 }}>New User?</Typography>


          <Grid container spacing={2} justifyContent="center">

            <Grid item>

              <Button component={Link} to="/register" variant="outlined" sx={{ textTransform: "none", borderRadius: "8px" }}>
                Register as Learner
              </Button>

            </Grid>

          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default LearnerLogin;
