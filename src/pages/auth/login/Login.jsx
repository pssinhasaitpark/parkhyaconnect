import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, setToken, initializeAuth } from '../../../redux/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Box, Typography, TextField, Button, Card, InputAdornment, IconButton } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GoogleLogin } from '@react-oauth/google';
import parkhyalogo from '../../../assets/parkhyalogo.png';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const [showPassword, setShowPassword] = useState(false);
  const [initDone, setInitDone] = useState(false);

  useEffect(() => {
    dispatch(initializeAuth());
    setInitDone(true);
  }, [dispatch]);

  useEffect(() => {
    console.log("Auth state:", { isAuthenticated, token, initDone });
    console.log("Stored token:", localStorage.getItem("token"));
  }, [isAuthenticated, token, initDone]);

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
    onSubmit: async (values) => {
      console.log("Login attempt with values:", values);

      try {
        const resultAction = await dispatch(loginUser({
          email: values.email,
          password: values.password
        }));

        if (loginUser.fulfilled.match(resultAction)) {
          console.log("Login response:", resultAction.payload);
          
          if (resultAction.payload && resultAction.payload.token) {
            console.log("Token received:", resultAction.payload.token);
            
            const storedToken = localStorage.getItem("token");
            console.log("Verification - token in localStorage:", storedToken);
            
            if (storedToken !== resultAction.payload.token) {
              console.log("Token mismatch detected, setting manually");
              localStorage.setItem("token", resultAction.payload.token);
              
              dispatch(setToken(resultAction.payload.token));
            }
            
         
            toast.success('Login successful!');
            setTimeout(() => {
              navigate('/dashboard');
            }, 100);
          } else {
            toast.error('No token received from server');
          }
        } else {
          console.error("Login failed:", resultAction.payload);
          toast.error(resultAction.payload || 'Invalid email or password');
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    },
  });

  useEffect(() => {
    if (initDone && isAuthenticated && token) {
      console.log("Redirecting to dashboard. Token:", token);
      navigate('/dashboard');
    }
  }, [isAuthenticated, token, navigate, initDone]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleGoogleLogin = async (response) => {
    try {
      const token = response.credential;
      console.log("Google token received:", token);
      
      localStorage.setItem('token', token);
      
      setTimeout(() => {
        dispatch(setToken(token));
        
        const storedToken = localStorage.getItem("token");
        console.log("Google login token verification:", {
          original: token,
          stored: storedToken
        });
        
        toast.success('Google login successful!');
        navigate('/dashboard');
      }, 100);
    } catch (error) {
      console.error("Google login error:", error);
      toast.error('Google Login failed. Please try again.');
    }
  };

  return ( 
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="transparent"
      sx={{
        background: 'linear-gradient(135deg, #4A154B, #3D63A2, #36B3A0)',
        backgroundSize: 'cover',
        height: '100vh',
        padding: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: '560px', padding: 3, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
      

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
          <Typography variant="h5" gutterBottom>Welcome Back</Typography>
          <Typography variant="body2" color="textSecondary">Sign in to continue</Typography>
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
            disabled={loading}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => navigate('/forgot-password')}
          sx={{
            mt: 2,
            mb: 3,
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: 2,
            borderColor: '#4A154B',
          }}
        >
          Forgot Password?
        </Button>

        <Box display="flex" justifyContent="center" my={2}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error('Google Login failed. Please try again.')}
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