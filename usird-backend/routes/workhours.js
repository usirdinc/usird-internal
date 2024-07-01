const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const WorkHours = require('../models/WorkHours');

// Check-In
router.post('/check-in', auth, async (req, res) => {
  try {
    const existingRecord = await WorkHours.findOne({ employee: req.user.id, checkOut: null });
    if (existingRecord) {
      return res.status(400).json({ msg: 'Already checked in' });
    }

    const workHours = new WorkHours({
      employee: req.user.id,
      checkIn: new Date()
    });

    await workHours.save();
    res.json({ msg: 'Checked in', workHours });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Check-Out
router.post('/check-out', auth, async (req, res) => {
  try {
    const workHours = await WorkHours.findOne({ employee: req.user.id, checkOut: null });
    if (!workHours) {
      return res.status(400).json({ msg: 'Not checked in' });
    }

    workHours.checkOut = new Date();
    await workHours.save();
    res.json({ msg: 'Checked out', workHours });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Automatically check out employees who forget to check out
router.post('/auto-check-out', auth, async (req, res) => {
  try {
    const workHours = await WorkHours.find({ checkOut: null });
    const now = new Date();
    const updatedRecords = [];

    for (const record of workHours) {
      if ((now - record.checkIn) / 1000 > 86400) { // 24 hours
        record.checkOut = new Date(record.checkIn.getTime() + 8 * 60 * 60 * 1000); // 8-hour workday
        await record.save();
        updatedRecords.push(record);
      }
    }

    res.json({ msg: 'Auto check-out complete', updatedRecords });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch total work hours for an employee
router.get('/total-hours/:employeeId', auth, async (req, res) => {
    try {
      const workHours = await WorkHours.find({ employee: req.params.employeeId });
      let totalHours = 0;
  
      workHours.forEach(record => {
        if (record.checkOut) {
          const hours = (new Date(record.checkOut) - new Date(record.checkIn)) / (1000 * 60 * 60);
          totalHours += hours;
        }
      });
  
      res.json({ totalHours });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
