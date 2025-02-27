import React from 'react';
import { Box, Typography, TextField, Button, Card, InputAdornment } from '@mui/material';
import { Email, Lock, Person, Phone } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Signup = () => {
  // Validation schema using Yup
  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    mobileNumber: Yup.string()
      .matches(/^(\+\d{1,2}\s?)?(\d{10})$/, 'Enter a valid mobile number')
      .required('Mobile Number is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password should be at least 8 characters')
      .required('Password is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      fullName: '',
      mobileNumber: '',
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Sign-up successful', values);
      // Handle sign-up logic here
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
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
        }}
      >
        <Card.Body>
          {/* Logo Section */}
          <Box display="flex" justifyContent="center" marginBottom={3}>
            <img
              src="/path/to/logo.png"
              alt="ParkhyaConnect Logo"
              style={{ width: '150px', objectFit: 'contain' }}
            />
          </Box>

          {/* Title */}
          <Box textAlign="center" marginBottom={3}>
            <Typography variant="h5" gutterBottom>
              Create Your Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sign up to get started
            </Typography>
          </Box>

          {/* Sign-Up Form */}
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="fullName"
              name="fullName"
              label="Full Name"
              variant="outlined"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              id="mobileNumber"
              name="mobileNumber"
              label="Mobile Number"
              variant="outlined"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
              helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
              }}
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
              Sign Up
            </Button>
          </form>

          {/* Already have an account? */}
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <a href="/login" style={{ textDecoration: 'underline' }}>
                Log in
              </a>
            </Typography>
          </Box>
        </Card.Body>
      </Card>
    </Box>
  );
};

export default Signup;
