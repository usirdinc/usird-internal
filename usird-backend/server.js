const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection string
const dbURI = 'mongodb+srv://usirdinc1:WeUsedToBeProjectRISE2021$@usirdapp.ypb9o5x.mongodb.net/usird-inc?retryWrites=true&w=majority';

// Database Connection
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const caseRoutes = require('./routes/cases');
const taskRoutes = require('./routes/tasks');
const workhoursRoutes = require('./routes/workhours');
const contactRoutes = require('./routes/contacts');
const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workhours', workhoursRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
