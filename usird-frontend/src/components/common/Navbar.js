import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Assuming you store user role in localStorage

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          USIRD INC
        </Typography>
        {isAuthenticated ? (
          <>
            {role === 'manager' && (
              <>
                <Button color="inherit" component={Link} to="/manager/dashboard">Dashboard</Button>
                <Button color="inherit" component={Link} to="/manager/create-employee">Create Employee</Button>
                <Button color="inherit" component={Link} to="/manager/employees">Manage Employees</Button>
                <Button color="inherit" component={Link} to="/manager/assign-task">Assign Task</Button>
                <Button color="inherit" component={Link} to="/manager/view-tasks">View Tasks</Button>
              </>
            )}
            <Button color="inherit" component={Link} to="/create-contact">Create Contact</Button>
            <Button color="inherit" component={Link} to="/view-contacts">View Contacts</Button>
            <Button color="inherit" component={Link} to="/view-cases">View Cases</Button>
            {role === 'employee' && (
              <Button color="inherit" component={Link} to="/employee/dashboard">My Tasks</Button>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
