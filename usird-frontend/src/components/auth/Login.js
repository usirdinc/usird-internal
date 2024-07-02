import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography } from '@mui/material';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, role } = res.data;

      // Login and set token and role
      login(token, role);

      // Perform auto check-in
      await axios.post(
        'http://localhost:5000/api/workhours/check-in',
        {},
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      // Redirect based on role
      if (role === 'manager') {
        navigate('/manager/dashboard');
      } else if (role === 'employee') {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Login failed: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={onSubmit}>
        <TextField label="Email" name="email" value={email} onChange={onChange} required fullWidth margin="normal" />
        <TextField label="Password" name="password" type="password" value={password} onChange={onChange} required fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Login</Button>
      </form>
    </Container>
  );
};

export default Login;
