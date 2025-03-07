import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signupUser, loginUser } from '../../../redux/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Typography, TextField, Button, Card, InputAdornment } from '@mui/material';
import { Email, Lock, Person, Phone } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import parkhyalogo from '../../../assets/parkhyalogo.png';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    mobileNumber: Yup.string()
      .matches(/^(?:\+?\d{1,3}[- ]?)?\d{10}$/, 'Enter a valid mobile number')
      .required('Mobile Number is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    password: Yup.string().min(8, 'Password should be at least 8 characters').required('Password is required'),
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      fullName: '',
      mobileNumber: '',
      email: '',
      password: '',
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        // First, sign up the user
        const signupResult = await dispatch(signupUser(values));

        if (signupResult.error) {
          throw new Error(signupResult.error.message || 'Registration failed. Please try again.');
        }

        // If signup is successful, log the user in with the same credentials
        const loginResult = await dispatch(loginUser(values)); // Use the same credentials for login

        if (loginResult.error) {
          throw new Error(loginResult.error.message || 'Login failed. Please try again.');
        }

        // Save token and redirect to the dashboard
        const token = loginResult.payload?.data?.token; // Safe access to token
        if (token) {
          localStorage.setItem('token', token);
          toast.success('Registration and login successful! Redirecting to dashboard...');
          navigate('/dashboard');
        } else {
          throw new Error('Token not received from server.');
        }
      } catch (error) {
        toast.error(error.message || 'An unexpected error occurred. Please try again.');
      }
    },
  });

  // Dynamic label helper function
  const getLabel = (field) => {
    switch (field) {
      case 'fullName':
        return 'Full Name';
      case 'mobileNumber':
        return 'Mobile Number';
      case 'email':
        return 'Email Address';
      case 'password':
        return 'Password';
      default:
        return '';
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
          <Typography variant="h5" gutterBottom>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Sign up to get started
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          {['fullName', 'mobileNumber', 'email', 'password'].map((field) => (
            <TextField
              key={field}
              fullWidth
              id={field}
              name={field}
              label={getLabel(field)}
              variant="outlined"
              type={field === 'password' ? 'password' : 'text'}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched[field] && Boolean(formik.errors[field])}
              helperText={formik.touched[field] && formik.errors[field]}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {field === 'fullName' && <Person color="primary" />}
                    {field === 'mobileNumber' && <Phone color="primary" />}
                    {field === 'email' && <Email color="primary" />}
                    {field === 'password' && <Lock color="primary" />}
                  </InputAdornment>
                ),
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
            Sign Up
          </Button>
        </form>

        <Box display="flex" justifyContent="center" marginTop={2}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <a href="/login" style={{ textDecoration: 'underline' }}>
              Log in
            </a>
          </Typography>
        </Box>
      </Card>
      <ToastContainer />
    </Box>
  );
};

export default Signup;
