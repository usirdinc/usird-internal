import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const commonLinks = [
    { text: 'Dashboard', to: '/dashboard' },
  ];

  const employeeLinks = [
    { text: 'Manage Clients', to: '/employee/clients' },
    { text: 'Manage Blogs', to: '/employee/blogs' },
    { text: 'Update Payments', to: '/employee/payments' },
  ];

  const managerLinks = [
    { text: 'Employee Creation', to: '/manager/employees' },
    { text: 'Assign Cases', to: '/manager/assign-cases' },
    { text: 'Schedule Tasks', to: '/manager/schedule-tasks' },
    { text: 'Manage Payments', to: '/manager/payments' },
    { text: 'View Reports', to: '/manager/reports' },
  ];

  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {commonLinks.map((link, index) => (
          <ListItem button component={Link} to={link.to} key={index}>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
        {role === 'employee' && employeeLinks.map((link, index) => (
          <ListItem button component={Link} to={link.to} key={index}>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
        {role === 'manager' && managerLinks.map((link, index) => (
          <ListItem button component={Link} to={link.to} key={index}>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
