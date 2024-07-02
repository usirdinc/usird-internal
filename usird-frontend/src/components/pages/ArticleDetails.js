import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper } from '@mui/material';

const ArticleDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert('Error fetching article: ' + (err.response ? err.response.data.msg : err.message));
      }
    };

    fetchArticle();
  }, [id]);

  if (!article) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Paper style={{ padding: '20px' }}>
        <Typography variant="h4">{article.title}</Typography>
        <Typography variant="subtitle1">by {article.author}</Typography>
        <Typography variant="body1" style={{ marginTop: '20px' }}>{article.content}</Typography>
      </Paper>
    </Container>
  );
};

export default ArticleDetails;
