import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });

  const { name, email, password, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Register</Typography>
      <form onSubmit={onSubmit}>
        <TextField label="Name" name="name" value={name} onChange={onChange} required fullWidth margin="normal" />
        <TextField label="Email" name="email" value={email} onChange={onChange} required fullWidth margin="normal" />
        <TextField label="Password" name="password" type="password" value={password} onChange={onChange} required fullWidth margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select name="role" value={role} onChange={onChange}>
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">Register</Button>
      </form>
    </Container>
  );
};

export default Register;
