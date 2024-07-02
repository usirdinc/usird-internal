import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography } from '@mui/material';

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    dateOfBirth: ''
  });

  const { name, address, phone, email, dateOfBirth } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found, please login');
        return;
      }

      const res = await axios.post('http://localhost:5000/api/auth/create-employee', formData, {
        headers: {
          'x-auth-token': token
        }
      });
      console.log(res.data);
      alert('Employee created successfully');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error creating employee: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4">Create Employee</Typography>
      <form onSubmit={onSubmit}>
        <TextField label="Name" name="name" value={name} onChange={onChange} required fullWidth margin="normal" />
        <TextField label="Address" name="address" value={address} onChange={onChange} required fullWidth margin="normal" />
        <TextField label="Phone" name="phone" value={phone} onChange={onChange} required fullWidth margin="normal" />
        <TextField label="Email" name="email" value={email} onChange={onChange} required fullWidth margin="normal" />
        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" variant="contained" color="primary">Create</Button>
      </form>
    </Container>
  );
};

export default CreateEmployee;
