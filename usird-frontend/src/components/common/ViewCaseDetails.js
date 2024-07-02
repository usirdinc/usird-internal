import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Button, MenuItem, TextField } from '@mui/material';

const ViewCaseDetails = () => {
  const { id } = useParams();
  const [caseDetails, setCaseDetails] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/cases/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        setCaseDetails(res.data);
        setAssignedEmployees(res.data.assignedEmployees.map(emp => emp._id));
        setStatus(res.data.status);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching case details: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/employees', {
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

    fetchCaseDetails();
    fetchEmployees();
  }, [id]);

  const handleAssignEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/cases/assign-case/${id}`, { employeeIds: assignedEmployees }, {
        headers: {
          'x-auth-token': token
        }
      });
      alert('Employees assigned successfully');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error assigning employees: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/cases/${id}`, { status }, {
        headers: {
          'x-auth-token': token
        }
      });
      alert('Status updated successfully');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error updating status: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  if (!caseDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Case Details</Typography>
      <Paper style={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Client Name: {caseDetails.contact.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Email: {caseDetails.contact.email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Phone: {caseDetails.contact.phone}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Address: {caseDetails.contact.address}</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Assign Employees"
              value={assignedEmployees}
              onChange={(e) => setAssignedEmployees(e.target.value)}
              SelectProps={{
                multiple: true
              }}
              fullWidth
              margin="normal"
            >
              {employees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.name}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" color="primary" onClick={handleAssignEmployees}>Assign Employees</Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Contract Sent">Contract Sent</MenuItem>
              <MenuItem value="I-589 Collected">I-589 Collected</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
            <Button variant="contained" color="primary" onClick={handleUpdateStatus}>Update Status</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewCaseDetails;
