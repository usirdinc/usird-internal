const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const Article = require('../models/Article');

// Get all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err.message);
    res.status(500).send('Server error');
  }
});

// Create a new article
router.post('/', [auth, roleAuth], async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const newArticle = new Article({ title, content, author });
    await newArticle.save();

    res.json(newArticle);
  } catch (err) {
    console.error('Error creating article:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch a single article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error('Error fetching article:', err.message);
    res.status(500).send('Server error');
  }
});

// Update an article
router.put('/:id', [auth, roleAuth], async (req, res) => {
  const { title, content, author } = req.body;
  try {
    let articleToUpdate = await Article.findById(req.params.id);
    if (!articleToUpdate) return res.status(404).json({ msg: 'Article not found' });

    articleToUpdate.title = title;
    articleToUpdate.content = content;
    articleToUpdate.author = author;
    await articleToUpdate.save();

    res.json(articleToUpdate);
  } catch (err) {
    console.error('Error updating article:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete an article
router.delete('/:id', [auth, roleAuth], async (req, res) => {
  try {
    const articleToDelete = await Article.findById(req.params.id);

    if (!articleToDelete) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Article deleted successfully' });
  } catch (err) {
    console.error('Error deleting article:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
