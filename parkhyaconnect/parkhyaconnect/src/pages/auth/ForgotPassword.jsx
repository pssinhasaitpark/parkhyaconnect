import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { Box, Typography } from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Password reset link has been sent to your email.');
    // Handle password reset logic here
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
              Forgot Your Password?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Enter your email to receive a password reset link.
            </Typography>
          </Box>

          {/* Forgot Password Form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" style={{ width: '100%' }}>
              Send Password Reset Link
            </Button>
          </Form>

          {message && (
            <Box display="flex" justifyContent="center" marginTop={3}>
              <Typography variant="body2" color="textSecondary">
                {message}
              </Typography>
            </Box>
          )}
        </Card.Body>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
