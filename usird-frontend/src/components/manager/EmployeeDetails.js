import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Grid } from '@mui/material';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/auth/employees/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        setEmployee(res.data);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching employee details: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    const fetchTotalHours = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/workhours/total-hours/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        setTotalHours(res.data.totalHours);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching total work hours: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    fetchEmployee();
    fetchTotalHours();
  }, [id]);

  if (!employee) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Employee Details</Typography>
      <Paper style={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Name: {employee.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Role: {employee.role}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Username: {employee.username}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Email: {employee.email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Phone: {employee.phone}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Address: {employee.address}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Date of Birth: {employee.dateOfBirth}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Total Work Hours: {totalHours.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EmployeeDetails;
