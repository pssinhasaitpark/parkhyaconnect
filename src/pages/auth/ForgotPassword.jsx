import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../redux/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Card } from '@mui/material';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Create a navigate instance

  const [email, setEmail] = useState(''); // Declare email state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(forgotPassword(email)); // Dispatch forgot password action
      if (forgotPassword.fulfilled.match(resultAction)) {
        toast.success('Password reset link sent to your email!');
      }
    } catch (error) {
      if (!error.response) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Failed to send reset link. Please try again.');
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="transparent"
      padding={2}
      style={{
        background: 'linear-gradient(135deg, #4A154B, #3D63A2, #36B3A0)',
        backgroundSize: 'cover',
        overflow: 'hidden',
        height: '100vh',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: '560px',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
        }}
      >
        <ToastContainer />
        <Box textAlign="center" marginBottom={3}>
          <Typography variant="h5" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Enter your email to receive a reset link
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              fontWeight: 'bold',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #4A154B 0%, #3D63A2 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #3D1240 0%, #335490 100%)',
              },
              textTransform: 'none',
            }}
          >
            Send Reset Link
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            sx={{ textTransform: 'none' }}
          >
            Back to Login
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
