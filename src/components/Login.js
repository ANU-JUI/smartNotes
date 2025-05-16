import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login credentials to the backend
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password,
      });

      // If login is successful, store user data in localStorage
      const { username, id } = response.data;
      alert('Login successful!');
      localStorage.setItem('isAuthenticated', 'true'); // Set the authentication flag
      localStorage.setItem('username', username); // Store the username in localStorage
      localStorage.setItem('userId', id); // Store the userId in localStorage
      navigate('/home'); // Redirect to the home page
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid email or password!');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
            <Button
              variant="text"
              color="secondary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate('/signup')}
            >
              Don't have an account? Sign up
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;