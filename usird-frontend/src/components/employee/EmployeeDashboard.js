import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tasks/employee-tasks', {
          headers: {
            'x-auth-token': token
          }
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching tasks: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    fetchTasks();
  }, []);

  const markAsDone = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/tasks/update-status/${id}`, { status: 'Completed' }, {
        headers: {
          'x-auth-token': token
        }
      });
      setTasks(tasks.map(task => task._id === id ? { ...task, status: 'Completed' } : task));
      alert('Task marked as completed');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error marking task as completed: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" style={{ margin: '20px 0' }}>My Tasks</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task._id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                {task.status === 'Pending' && (
                  <Button variant="contained" color="primary" onClick={() => markAsDone(task._id)}>
                    Mark as Done
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeDashboard;
