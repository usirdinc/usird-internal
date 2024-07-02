import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography } from '@mui/material';

const CreateContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const { name, email, phone, address } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/contacts', formData, {
        headers: {
          'x-auth-token': token
        }
      });
      console.log(res.data);
      alert('Contact created successfully');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error creating contact: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4">Create Contact</Typography>
      <form onSubmit={onSubmit}>
        <TextField label="Name" name="name" value={name} onChange={onChange} required fullWidth margin="normal" />
        <TextField label="Email" name="email" value={email} onChange={onChange} required fullWidth margin="normal" />
        <TextField label="Phone" name="phone" value={phone} onChange={onChange} required fullWidth margin="normal" />
        <TextField label="Address" name="address" value={address} onChange={onChange} required fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Create Contact</Button>
      </form>
    </Container>
  );
};

export default CreateContact;
