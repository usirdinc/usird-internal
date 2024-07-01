const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, role: user.role });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Register Employee by Manager
router.post('/create-employee', auth, async (req, res) => {
  const { name, address, phone, email, dateOfBirth } = req.body;
  const role = 'employee';
  const password = 'AsylumGranted2023$';

  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Authorization denied' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Generate username
    const initials = name.split(' ').map(n => n[0]).join('');
    const yearOfBirth = dateOfBirth.split('-')[0].slice(-2);
    const userCount = await User.countDocuments({ dateOfBirth });
    const indexNumber = (userCount + 1).toString().padStart(3, '0');
    const username = `${initials}${yearOfBirth}${indexNumber}`;

    console.log(`Creating user: ${username}`);

    // Create the new employee
    user = new User({ name, address, phone, email, dateOfBirth, username, role, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ msg: 'Employee created successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all employees
router.get('/employees', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Authorization denied' });
    }

    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch individual employee details
router.get('/employees/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Authorization denied' });
    }

    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
