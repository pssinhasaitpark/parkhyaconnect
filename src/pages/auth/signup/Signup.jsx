import React from 'react';
import { Box, Typography, TextField, Button, Card, InputAdornment } from '@mui/material';
import { Email, Lock, Person, Phone } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import parkhyalogo from '../../../assets/images/parkhyalogo.png';

const Signup = () => {
  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    mobileNumber: Yup.string()
      .matches(/^(\\+\d{1,2}\s?)?(\d{10})$/, 'Enter a valid mobile number')
      .required('Mobile Number is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password should be at least 8 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      fullName: '',
      mobileNumber: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Sign-up successful', values);
      // Handle API submission here
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
        sx={{
          width: '100%',
          maxWidth: '560px',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
        }}
      >
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
          {['fullName', 'mobileNumber', 'email', 'password'].map((field, index) => (
            <TextField
              key={index}
              fullWidth
              id={field}
              name={field}
              label={field === 'fullName' ? 'Full Name' : field === 'mobileNumber' ? 'Mobile Number' : field === 'email' ? 'Email Address' : 'Password'}
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
    </Box>
  );
};

export default Signup;
