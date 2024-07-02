import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, MenuItem } from '@mui/material';

const CreateCase = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    status: 'Pending'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [contactsRes, casesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/cases/contacts', {
            headers: {
              'x-auth-token': token
            }
          }),
          axios.get('http://localhost:5000/api/cases', {
            headers: {
              'x-auth-token': token
            }
          })
        ]);

        const caseContactIds = new Set(casesRes.data.map(c => c.clientId._id.toString()));
        const availableContacts = contactsRes.data.filter(contact => !caseContactIds.has(contact._id.toString()));
        setContacts(availableContacts);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching data: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    fetchData();
  }, []);

  const { clientId, status } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/cases', formData, {
        headers: {
          'x-auth-token': token
        }
      });
      alert('Case created successfully');
      navigate('/view-cases');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error creating case: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4">Create Case</Typography>
      <form onSubmit={onSubmit}>
        <TextField
          select
          label="Client"
          name="clientId"
          value={clientId}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
        >
          {contacts.map((contact) => (
            <MenuItem key={contact._id} value={contact._id}>
              {contact.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          name="status"
          value={status}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Contract Sent">Contract Sent</MenuItem>
          <MenuItem value="I-589 Collected">I-589 Collected</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary">Create Case</Button>
      </form>
    </Container>
  );
};

export default CreateCase;
