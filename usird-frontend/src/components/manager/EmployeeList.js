import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ManageRoles from './ManageRoles';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

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

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setEmployees(employees.filter(employee => employee._id !== id));
      alert('User deleted successfully');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error deleting user: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Manage Employees</Typography>
      <ManageRoles />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.username}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => navigate(`/manager/employees/${employee._id}`)}>
                    View Details
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => deleteUser(employee._id)}>
                    Delete User
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManageEmployees;
