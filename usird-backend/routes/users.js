const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

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

// Update employee role
router.put('/role/:id', auth, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['employee', 'manager'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.role = role;
    await user.save();
    res.json({ msg: 'Role updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a user
router.delete('/:id', auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      await User.findByIdAndDelete(req.params.id);
      res.json({ msg: 'User deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
