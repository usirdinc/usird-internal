import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography } from '@mui/material';

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            'x-auth-token': token
          }
        });
        setUserRole(res.data.role);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching user role: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    fetchUserRole();
  }, []);

  const { title, content, author } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/articles', formData, {
        headers: {
          'x-auth-token': token
        }
      });
      alert('Article created successfully');
      navigate('/articles');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error creating article: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  if (userRole !== 'employee' && userRole !== 'manager') {
    return <Typography variant="h6">You do not have permission to create articles.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4">Create Article</Typography>
      <form onSubmit={onSubmit}>
        <TextField
          label="Title"
          name="title"
          value={title}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Content"
          name="content"
          value={content}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          label="Author"
          name="author"
          value={author}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Create Article</Button>
      </form>
    </Container>
  );
};

export default CreateArticle;
