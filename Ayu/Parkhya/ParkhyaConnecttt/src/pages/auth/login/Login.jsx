import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Box, Typography, TextField, Button, Card, InputAdornment, IconButton } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GoogleLogin } from '@react-oauth/google';
import parkhyalogo from '../../../assets/parkhyalogo.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    password: Yup.string().min(8, 'Password should be at least 8 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      axios.post('http://192.168.0.152:8000/api/auth/login', values)
        .then(response => {
          login(response.data.token); // Set the user as authenticated and save the token
          toast.success('Login successful!');
          navigate('/dashboard');
        })
        .catch(error => {
          if (!error.response) {
            toast.error('Network error. Please check your connection.');
          } else if (error.response.status === 401) {
            toast.error('Login failed. Please check your credentials.');
          } else {
            toast.error('Login failed. Please try again.');
          }
        });
    },
  });

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
        <ToastContainer /> {/* Add ToastContainer for notifications */}
        <Box display="flex" justifyContent="center" marginBottom={3}>
          <img
            src={parkhyalogo}
            alt="ParkhyaConnect Logo"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #4A154B',
            }}
          />
        </Box>

        <Box textAlign="center" marginBottom={3}>
          <Typography variant="h5" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Sign in to continue
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          {['email', 'password'].map((field, index) => (
            <TextField
              key={index}
              fullWidth
              id={field}
              name={field}
              label={field === 'email' ? 'Email Address' : 'Password'}
              variant="outlined"
              type={field === 'password' && !showPassword ? 'password' : 'text'}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched[field] && Boolean(formik.errors[field])}
              helperText={formik.touched[field] && formik.errors[field]}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {field === 'email' && <Email color="primary" />}
                    {field === 'password' && <Lock color="primary" />}
                  </InputAdornment>
                ),
                endAdornment:
                  field === 'password' ? (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ) : null,
              }}
              sx={{ mb: 2 }}
            />
          ))}

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
            Sign In
          </Button>
        </form>

        <Button
          fullWidth
          variant="outlined"
          color="primary" // Change color to primary for better visibility
          onClick={() => navigate('/forgot-password')}
          sx={{
            mt: 2,
            mb: 3,
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: 2,
            borderColor: '#4A154B', // Optional: Add a border color for distinction
          }}
        >
          Forgot Password?
        </Button>

        <Box display="flex" justifyContent="center" my={2}>
          <GoogleLogin
            onSuccess={(response) => {
              console.log('Google Login Success:', response);
              login(); // Set the user as authenticated
              toast.success('Login successful!'); // Show success toast
              navigate('/dashboard');
            }}
            onError={() => {
              console.log('Google Login Failed');
              toast.error('Google Login failed. Please try again.');
            }}
            useOneTap
          />
        </Box>

        <Box display="flex" justifyContent="center" marginTop={2}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <a href="/signup" style={{ textDecoration: 'underline' }}>
              Sign up
            </a>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
