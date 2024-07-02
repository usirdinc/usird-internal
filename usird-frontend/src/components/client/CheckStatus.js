import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography } from '@mui/material';

const CheckStatus = () => {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [status, setStatus] = useState(null);

  const onChange = (e) => setReceiptNumber(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/api/cases/status/${receiptNumber}`);
      setStatus(res.data.status);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Check Case Status</Typography>
      <form onSubmit={onSubmit}>
        <TextField label="Receipt Number" value={receiptNumber} onChange={onChange} required fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Check Status</Button>
      </form>
      {status && (
        <Typography variant="h6" style={{ marginTop: '20px' }}>Status: {status}</Typography>
      )}
    </Container>
  );
};

export default CheckStatus;
