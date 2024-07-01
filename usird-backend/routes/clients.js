const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Client = require('../models/Client');

// Get all clients
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Add a new client
router.post('/', auth, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    let client = await Client.findOne({ email });
    if (client) return res.status(400).json({ msg: 'Client already exists' });

    client = new Client({ name, email, phone });
    await client.save();

    res.json(client);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
