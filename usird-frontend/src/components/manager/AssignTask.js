import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, MenuItem } from '@mui/material';

const AssignTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/employees', {
          headers: {
            'x-auth-token': token
          }
        });
        setEmployees(res.data);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching employees: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    fetchEmployees();
  }, []);

  const { title, description, assignedTo, dueDate } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/tasks/assign', formData, {
        headers: {
          'x-auth-token': token
        }
      });
      console.log(res.data);
      alert('Task assigned successfully');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error assigning task: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4">Assign Task</Typography>
      <form onSubmit={onSubmit}>
        <TextField label="Title" name="title" value={title} onChange={onChange} required fullWidth margin="normal" />
        <TextField label="Description" name="description" value={description} onChange={onChange} required fullWidth margin="normal" multiline rows={4} />
        <TextField select label="Assign To" name="assignedTo" value={assignedTo} onChange={onChange} required fullWidth margin="normal">
          {employees.map((employee) => (
            <MenuItem key={employee._id} value={employee._id}>{employee.name}</MenuItem>
          ))}
        </TextField>
        <TextField label="Due Date" name="dueDate" type="date" value={dueDate} onChange={onChange} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <Button type="submit" variant="contained" color="primary">Assign Task</Button>
      </form>
    </Container>
  );
};

export default AssignTask;
