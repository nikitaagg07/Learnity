import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import HomeIcon from '@mui/icons-material/Home';

const InstructorRegister = () => {
  const [formData, setFormData] = useState({
    Salutation: "",
    FName: "",
    LName: "",
    DOB: "",
    Email: "",
    Mobile: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    State: "",
    Country: "",
    Qualification: "",
    Experience: "",
    Password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // Clear previous errors

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    for (const key in formData) {
      if (!formData[key] && key !== "AddressLine2") {
        setError(`${key.replace(/([A-Z])/g, " $1")} is required`);
        return;
      }
    }

    if (!emailRegex.test(formData.Email)) {
      setError("Invalid email format!");
      return;
    }

    if (!phoneRegex.test(formData.Mobile)) {
      setError("Invalid mobile number! Must be exactly 10 digits.");
      return;
    }

    if (!passwordRegex.test(formData.Password)) {
      setError(
        "Password must be at least 8 characters long, including an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    if (formData.Password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/instructors/register", formData);
      console.log("✅ Registration Successful:", response.data);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Show success message
      alert("Registration successful!");
      
      // Navigate to login page
      navigate("/InstructorLogin");
      
      // Clear the form
      setFormData({
        Salutation: "",
        FName: "",
        LName: "",
        DOB: "",
        Email: "",
        Mobile: "",
        AddressLine1: "",
        AddressLine2: "",
        City: "",
        State: "",
        Country: "",
        Qualification: "",
        Experience: "",
        Password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("🚨 Registration Failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Something went wrong while registering.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Card sx={{ p: 4, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Button startIcon={<HomeIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
            Home
          </Button>
          <Typography variant="h4" align="center" fontWeight="bold" color="primary" gutterBottom>
            Instructor Registration
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Salutation, First Name, Last Name */}
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Salutation</InputLabel>
                  <Select name="Salutation" value={formData.Salutation} onChange={handleChange}>
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                    <MenuItem value="Ms.">Ms.</MenuItem>
                    <MenuItem value="Dr.">Dr.</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField label="First Name" name="FName" fullWidth value={formData.FName} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField label="Last Name" name="LName" fullWidth value={formData.LName} onChange={handleChange} required />
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12} sm={4}>
                <TextField label="Date of Birth" type="date" name="DOB" fullWidth value={formData.DOB} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
              </Grid>

              {/* Qualification, Experience */}
              <Grid item xs={12} sm={6}>
                <TextField label="Educational Qualification" name="Qualification" fullWidth value={formData.Qualification} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Experience</InputLabel>
                  <Select name="Experience" value={formData.Experience} onChange={handleChange} required>
                    <MenuItem value="0-1 years">0-1 years</MenuItem>
                    <MenuItem value="1-3 years">1-3 years</MenuItem>
                    <MenuItem value="3-5 years">3-5 years</MenuItem>
                    <MenuItem value="5+ years">5+ years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Email, Mobile */}
              <Grid item xs={12} sm={6}>
                <TextField label="Email" type="email" name="Email" fullWidth value={formData.Email} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Mobile Number" type="tel" name="Mobile" fullWidth value={formData.Mobile} onChange={handleChange} required />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField label="Address Line 1" name="AddressLine1" fullWidth value={formData.AddressLine1} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Address Line 2 (Optional)" name="AddressLine2" fullWidth value={formData.AddressLine2} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField label="City" name="City" fullWidth value={formData.City} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField label="State" name="State" fullWidth value={formData.State} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField label="Country" name="Country" fullWidth value={formData.Country} onChange={handleChange} required />
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type={passwordVisible ? "text" : "password"}
                  name="Password"
                  fullWidth
                  value={formData.Password}
                  onChange={handleChange}
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
                <TextField label="Confirm Password" type={passwordVisible ? "text" : "password"} name="confirmPassword" fullWidth value={formData.confirmPassword} onChange={handleChange} InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setPasswordVisible(!passwordVisible)}>
                          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }} required />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Register"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default InstructorRegister;
