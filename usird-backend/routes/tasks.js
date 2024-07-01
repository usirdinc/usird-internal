const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

// Assign a task
router.post('/assign', auth, async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;

  try {
    const manager = await User.findById(req.user.id);
    if (manager.role !== 'manager') {
      return res.status(403).json({ msg: 'Authorization denied' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      dueDate
    });

    await task.save();
    res.json({ msg: 'Task assigned successfully', task });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch tasks for an employee
router.get('/employee-tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all tasks (for managers)
router.get('/all-tasks', auth, async (req, res) => {
  try {
    const manager = await User.findById(req.user.id);
    if (manager.role !== 'manager') {
      return res.status(403).json({ msg: 'Authorization denied' });
    }

    const tasks = await Task.find().populate('assignedTo', ['name', 'username']);
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update task status
router.put('/update-status/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Only the assigned employee or a manager can update the task status
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Authorization denied' });
    }

    task.status = req.body.status;
    await task.save();
    res.json({ msg: 'Task status updated', task });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
