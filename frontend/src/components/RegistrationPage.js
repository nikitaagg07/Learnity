import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  Container,
  Box,
  Grid,
  Alert,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import HomeIcon from '@mui/icons-material/Home';

const RegistrationPage = ({ setLearnerId }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    // ✅ Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // ✅ Password validation (requires at least one letter, one number, and one special character)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 6 characters long, include at least one letter, one number, and one special character (@$!%*?&)."
      );
      return;
    }

    // ✅ Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      console.log("📤 Sending registration request...");
      
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      console.log("✅ Registration Successful:", response.data);

      if (setLearnerId) {
        setLearnerId(response.data.learner._id);
      }

      navigate("/login");
    } catch (err) {
      console.error("🚨 Registration Failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
        <Button startIcon={<HomeIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
          Home
        </Button>
        <Typography variant="h4" gutterBottom>
          Register as a Learner
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {emailError && <Alert severity="error">{emailError}</Alert>}
        {passwordError && <Alert severity="error">{passwordError}</Alert>}
        {confirmPasswordError && <Alert severity="error">{confirmPasswordError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name *"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email *"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password *"
                type={passwordVisible ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError || "Must be at least 6 characters, include one letter, one number, and one special character."}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setPasswordVisible(!passwordVisible)}>
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Password *"
                type={confirmPasswordVisible ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                        {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Register
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <a href="/login">Login here</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegistrationPage;
