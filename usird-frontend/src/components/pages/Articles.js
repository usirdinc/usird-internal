import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/articles');
        setArticles(res.data);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching articles: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    fetchArticles();
  }, []);

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Articles</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/create-article')}>
        Create Article
      </Button>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {articles.map((article) => (
          <Grid item key={article._id} xs={12} sm={6} md={4}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h5">{article.title}</Typography>
              <Typography variant="subtitle1">by {article.author}</Typography>
              <Typography variant="body2" style={{ marginTop: '10px' }}>
                {article.content.substring(0, 100)}...
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: '10px' }}
                onClick={() => navigate(`/articles/${article._id}`)}
              >
                Read More
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Articles;
