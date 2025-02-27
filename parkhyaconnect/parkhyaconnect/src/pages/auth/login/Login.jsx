import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Card, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  InputAdornment, 
  IconButton,
  Link,
  Container,
  Paper
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password should be at least 8 characters')
      .required('Password is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Login successful', values);
      // Handle login logic here
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4A154B, #3D63A2, #36B3A0)',
        backgroundSize: 'cover',
        padding: 2,
        margin: 0, // Ensure no margin to avoid scroll
        overflow: 'hidden', // Prevent scroll
      }}
    >
      <Container maxWidth="sm"> {/* Set maxWidth for proper content width */}
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,    
            padding: 2,   
            backgroundColor: 'transparent',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Card
            sx={{
              width: '100%',
              maxWidth: '400px', // Reduce inside width of content area
              padding: 4,
              backgroundColor: 'white',
              transition: 'transform 0.3s, box-shadow 0.3s',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            {/* Logo Section */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <img
                src="/path/to/logo.png"
                alt="ParkhyaConnect Logo"
                style={{ width: '150px', objectFit: 'contain' }}
              />
            </Box>

            {/* Title */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Welcome Back
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Please sign in to continue to ParkhyaConnect
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  variant="outlined"
                  placeholder="Enter your email"
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
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  placeholder="Enter your password"
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
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

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

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Link href="/forgot-password" underline="hover" color="primary">
                  Forgot your password?
                </Link>
              </Box>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              {/* Google Login */}
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <GoogleLogin
                  onSuccess={(response) => {
                    console.log(response);
                    // Handle successful Google login
                  }}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                  useOneTap
                />
              </Box>

              {/* Sign Up Link */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link href="/signup" underline="hover" color="primary" fontWeight="bold">
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </form>
          </Card>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
