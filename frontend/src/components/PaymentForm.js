import React, { useState, useEffect } from "react";
import {
  Container, Typography, Radio, RadioGroup, FormControlLabel,
  Card, CardContent, TextField, Button, Grid, CircularProgress,
  Alert, Snackbar
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentForm = ({ learnerId, onSuccess }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingStatus, setProcessingStatus] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetching the actual logged-in user ID from localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        const data = await response.json();
        if (response.ok) {
          setSelectedCourse(data);
        } else {
          console.error("Failed to fetch course");
          setError("Failed to fetch course details");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Error connecting to the server");
      }
    };

    fetchCourse();
  }, [courseId]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setFormData({});
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handlePayment = async () => {
    if (!selectedCourse) {
      setError("Course not found!");
      setOpenSnackbar(true);
      return;
    }

    if (!userId) {
      setError("User not logged in! Please log in to proceed.");
      setOpenSnackbar(true);
      return;
    }

    if (paymentMethod === "UPI" && !formData.upi_id) {
      setError("Please enter your UPI ID.");
      setOpenSnackbar(true);
      return;
    }

    if ((paymentMethod === "Credit Card" || paymentMethod === "Debit Card") && (
      !formData.card_number || !formData.expiry_date || !formData.cvv
    )) {
      setError("Please fill in all card details.");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    setProcessingStatus("Processing payment...");
    setError(null);

    // Including the course title and instructorId in the payment data
    const paymentData = {
      userId: userId,
      courseId,
      paymentMethod,
      amount: selectedCourse.pricing,
      courseTitle: selectedCourse.title,
      instructorId: selectedCourse.instructorId
    };

    console.log("📤 Sending Payment Data:", paymentData);

    try {
      // Process payment
      const paymentResponse = await fetch("http://localhost:5000/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const paymentResult = await paymentResponse.json();
      console.log("📥 Payment API Response:", paymentResult);

      if (paymentResult.success) {
        setProcessingStatus("✅ Payment successful! Enrolling in course...");
        
        // Try to enroll the learner in the course
        try {
          const enrollResponse = await axios.post(`http://localhost:5000/api/courses/${courseId}/enroll`, {
            learnerId: userId,
            instructorId: selectedCourse.instructorId
            // <-- ensure this value is valid
          });
          
          console.log("Primary enrollment response:", enrollResponse.data);
          
          if (enrollResponse.data.success || 
              enrollResponse.data.message?.includes("successfully") ||
              enrollResponse.data.message?.includes("already enrolled")) {
            setProcessingStatus("Enrollment successful! Redirecting to course...");
            
            setTimeout(() => {
              setLoading(false);
              if (onSuccess) onSuccess();
              navigate(`/course/${courseId}`);
            }, 1000);
          } else {
            throw new Error(enrollResponse.data.message || "Enrollment failed");
          }
        } catch (enrollError) {
          console.error("Enrollment error:", enrollError);
          
          // Try fallback enrollment method
          try {
            setProcessingStatus("⚠️ First enrollment attempt failed. Trying alternative method...");
            
            // Make sure we're sending the correct data format expected by the backend
            const fallbackEnrollResponse = await axios.post("http://localhost:5000/api/learners/enroll", {
              learnerId: userId,
              courseId: courseId  // Using the raw courseId string as expected by the backend
            });
            
            console.log("Fallback enrollment response:", fallbackEnrollResponse.data);
            
            if (fallbackEnrollResponse.data.success || 
                fallbackEnrollResponse.data.message?.includes("successfully") || 
                fallbackEnrollResponse.data.message?.includes("already enrolled")) {
              
              setProcessingStatus("Enrollment successful! Redirecting to course...");
              
              setTimeout(() => {
                setLoading(false);
                if (onSuccess) onSuccess();
                navigate(`/course-display/${courseId}`);
              }, 1000);
            } else {
              throw new Error(fallbackEnrollResponse.data.message || "Fallback enrollment failed");
            }
          } catch (fallbackError) {
            console.error("Fallback enrollment error:", fallbackError);
            // Check if the error message indicates that the user is already enrolled
            const errorMessage = fallbackError.response?.data?.message || fallbackError.message;
            
            if (errorMessage.includes("already enrolled")) {
              // If user is already enrolled, consider this a success and redirect
              setProcessingStatus("Enrolled in Course! Redirecting...");
              setTimeout(() => {
                setLoading(false);
                if (onSuccess) onSuccess();
                navigate(`/course-display/${courseId}`);
              }, 1000);
            } else {
              setError("Payment was successful, but enrollment failed. Please contact support with your payment ID: " + paymentResult.paymentId);
              setProcessingStatus("❌ Enrollment failed. Please contact support.");
              setOpenSnackbar(true);
              setLoading(false);
            }
          }
        }
      } else {
        throw new Error(paymentResult.message || "Payment processing failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setProcessingStatus("❌ Payment or enrollment failed.");
      setError(error.message || "Payment processing failed. Please try again.");
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingY: 8 }}>
      {selectedCourse ? (
        <>
          <Typography variant="h4" gutterBottom align="center">Checkout</Typography>

          <Card variant="outlined" style={{ marginBottom: "20px" }}>
            <CardContent>
              <Typography variant="h6">Selected Course</Typography>
              <Typography>{selectedCourse.title}</Typography>
              <Typography variant="h5" color="primary">₹{selectedCourse.pricing}</Typography>
            </CardContent>
          </Card>

          <Typography variant="h6">Select Payment Method:</Typography>
          <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
            <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
            <FormControlLabel value="Credit Card" control={<Radio />} label="Credit Card" />
            <FormControlLabel value="Debit Card" control={<Radio />} label="Debit Card" />
          </RadioGroup>

          <Card variant="outlined" style={{ marginTop: "20px" }}>
            <CardContent>
              <Typography variant="h6">Payment Details</Typography>
              {paymentMethod === "UPI" && (
                <TextField
                  fullWidth label="UPI ID / Mobile Number" name="upi_id"
                  value={formData.upi_id || ""} onChange={handleChange}
                  style={{ marginBottom: "15px" }}
                />
              )}
              {(paymentMethod === "Credit Card" || paymentMethod === "Debit Card") && (
                <>
                  <TextField fullWidth label="Card Number" name="card_number"
                    value={formData.card_number || ""} onChange={handleChange}
                    style={{ marginBottom: "15px" }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField fullWidth label="MM/YY" name="expiry_date"
                        value={formData.expiry_date || ""} onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="CVV" name="cvv" type="password"
                        value={formData.cvv || ""} onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              
              {processingStatus && (
                <Alert 
                  severity={processingStatus.includes("❌") ? "error" : 
                          processingStatus.includes("⚠️") ? "warning" : "info"}
                  style={{ marginTop: "15px" }}
                >
                  {processingStatus}
                </Alert>
              )}
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                style={{ marginTop: "20px" }} 
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Pay ₹${selectedCourse.pricing}`
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Typography variant="h6" color="error" align="center">
          {error || "Loading course details..."}
        </Typography>
      )}
      
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentForm;