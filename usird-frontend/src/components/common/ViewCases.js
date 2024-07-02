import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ViewCases = () => {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/cases', {
          headers: {
            'x-auth-token': token
          }
        });
        setCases(res.data);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching cases: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    fetchCases();
  }, []);

  const deleteCase = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cases/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setCases(cases.filter(caseItem => caseItem._id !== id));
      alert('Case deleted successfully');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error deleting case: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Case List</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/create-case')}>Create Case</Button>
      {cases.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem._id}>
                  <TableCell>{caseItem.clientId.name}</TableCell>
                  <TableCell>{caseItem.clientId.email}</TableCell>
                  <TableCell>{caseItem.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => navigate(`/view-case/${caseItem._id}`)}>View Case</Button>
                    <Button variant="contained" color="secondary" onClick={() => deleteCase(caseItem._id)}>Delete Case</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" style={{ margin: '20px 0' }}>No cases available</Typography>
      )}
    </Container>
  );
};

export default ViewCases;
