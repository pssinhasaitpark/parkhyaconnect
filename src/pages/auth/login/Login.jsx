import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../redux/authSlice';
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
  const [showPassword, setShowPassword] = React.useState(false);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    password: Yup.string().min(8, 'Password should be at least 8 characters').required('Password is required'),
  });

  // Formik setup for handling form data and submission
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
        console.log("Login attempt with values:", values); // Debugging log

  try {
    const resultAction = await dispatch(loginUser({ email: values.email, password: values.password }));

    if (loginUser.fulfilled.match(resultAction)) {
      console.log("Login successful, response:", resultAction); // Debugging log
      toast.success('Login successful!');
      navigate('/dashboard'); // Navigate only on success
    } else {
      toast.error(resultAction.payload || 'Invalid email or password');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Login failed. Please try again.');
  }
},

  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Redirect to dashboard if authenticated
    }
  }, [isAuthenticated, navigate]);

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
        <ToastContainer /> {/* Toast notifications */}

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
            onSuccess={async (response) => {
              const token = response.credential;
              localStorage.setItem('token', token); // Save token
              toast.success('Login successful!');
              navigate('/dashboard');
            }}
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
