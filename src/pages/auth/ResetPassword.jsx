import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Typography, TextField, Button, Card } from "@mui/material";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const resetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length === 0) {
      toast.error("Password must contain at least one character!");
      return;
    } else if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Additional validation for new password
      const response = await fetch("http://192.168.0.152:8000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,  // Ensure token is included
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json(); // Parse JSON response

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      toast.success("Password changed successfully!");
      setTimeout(() => navigate("/login"), 1500); // Redirect after success

    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={2}
      sx={{
        background: "linear-gradient(135deg, #4A154B, #3D63A2, #36B3A0)",
        backgroundSize: "cover",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "560px",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
        }}
      >
        <ToastContainer />
        <Box textAlign="center" marginBottom={3}>
          <Typography variant="h5" gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Enter your new password
          </Typography>
        </Box>

        <form onSubmit={resetPassword}>
          <TextField
            fullWidth
            id="newPassword"
            name="newPassword"
            label="New Password"
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            sx={{
              mt: 2,
              mb: 3,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 2,
              background: "linear-gradient(90deg, #4A154B 0%, #3D63A2 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #3D1240 0%, #335490 100%)",
              },
              textTransform: "none",
            }}
          >
            Change Password
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none" }}
          >
            Back to Login
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default ResetPassword;
