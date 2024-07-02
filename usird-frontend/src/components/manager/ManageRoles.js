import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Grid, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const ManageRoles = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [role, setRole] = useState('');

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

  const handleChangeRole = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/users/role/${selectedEmployee}`, { role }, {
        headers: {
          'x-auth-token': token
        }
      });
      alert('Role updated successfully');
      // Optionally refresh the list of employees or the UI to reflect the changes
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error updating role: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Manage Employee Roles</Typography>
      <Paper style={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Employee</InputLabel>
              <Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleChangeRole}>
              Update Role
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ManageRoles;
