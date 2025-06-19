// AdminLogin.js
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
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

const AdminLogin = ({ setUser }) => {
  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (captchaInput !== captcha) {
      setError("Invalid CAPTCHA! Try again.");
      drawCaptcha();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email: formData.Email,
        password: formData.Password,
      });

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userId", response.data.admin.id);
      localStorage.setItem("role", "admin");
      setUser({ id: response.data.admin.id, role: "admin" });

      navigate("/AdminDashboard");
    } catch (err) {
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
        <Typography variant="h4" align="center" fontWeight="bold" color="primary" gutterBottom>
          Admin Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            name="Email"
            fullWidth
            value={formData.Email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            type="password"
            name="Password"
            fullWidth
            value={formData.Password}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontFamily: "monospace", letterSpacing: "4px", textDecoration: "line-through", mb: 1, p: 1, display: "inline-block", backgroundColor: "#ddd", borderRadius: "8px" }}
            >
              {captcha}
            </Typography>
            <Button onClick={drawCaptcha} size="small" variant="outlined" sx={{ ml: 1 }}>Refresh</Button>
          </Box>

          <TextField
            fullWidth
            label="Enter CAPTCHA"
            variant="outlined"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <Button fullWidth variant="contained" color="primary" type="submit" disabled={loading} sx={{ py: 1.5 }}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2">Login as:</Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                startIcon={<AdminPanelSettingsIcon />}
                sx={{ textTransform: "none", backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#1565c0" } }}
              >
                Learner
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to="/InstructorLogin"
                startIcon={<PersonIcon />}
                variant="contained"
                sx={{ textTransform: "none", backgroundColor: "#388e3c", "&:hover": { backgroundColor: "#2e7d32" } }}
              >
                Instructor
              </Button>
            </Grid>
          </Grid>

          <Typography variant="body2" sx={{ mt: 2 }}>New User?</Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button component={Link} to="/AdminRegister" variant="outlined" sx={{ textTransform: "none", borderRadius: "8px" }}>
                Register as Admin
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
