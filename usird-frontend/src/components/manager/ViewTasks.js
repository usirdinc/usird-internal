import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tasks/all-tasks', {
          headers: {
            'x-auth-token': token
          }
        });
        setTasks(res.data);
        setPendingTasks(res.data.filter(task => task.status !== 'Completed'));
        setCompletedTasks(res.data.filter(task => task.status === 'Completed'));
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching tasks: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setTasks(tasks.filter(task => task._id !== id));
      setPendingTasks(pendingTasks.filter(task => task._id !== id));
      setCompletedTasks(completedTasks.filter(task => task._id !== id));
      alert('Task deleted successfully');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error deleting task: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Tasks List</Typography>
      <Typography variant="h5" style={{ margin: '20px 0' }}>Pending Tasks</Typography>
      {pendingTasks.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingTasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.assignedTo?.name || 'Unassigned'}</TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => deleteTask(task._id)}>
                      Delete Task
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" style={{ margin: '20px 0' }}>No pending tasks available</Typography>
      )}
      
      <Typography variant="h5" style={{ margin: '20px 0', marginTop: '40px' }}>Completed Tasks</Typography>
      {completedTasks.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {completedTasks.map((task) => (
                <TableRow key={task._id} style={{ backgroundColor: '#d4edda' }}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.assignedTo?.name || 'Unassigned'}</TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{task.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" style={{ margin: '20px 0' }}>No completed tasks available</Typography>
      )}
    </Container>
  );
};

export default ViewTasks;
