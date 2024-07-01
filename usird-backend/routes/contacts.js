const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Contact = require('../models/Contact');
const Case = require('../models/Case');
const User = require('../models/User');

// Create a contact and associated case
router.post('/', auth, async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const contact = new Contact({
      name,
      email,
      phone,
      address
    });

    await contact.save();

    const newCase = new Case({
      contact: contact._id,
      assignedEmployees: [],
      status: 'Pending'
    });

    await newCase.save();

    res.json({ msg: 'Contact and case created successfully', contact, case: newCase });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all contacts
router.get('/', auth, async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// Fetch all cases
router.get('/cases', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let cases;
    if (user.role === 'manager') {
      cases = await Case.find().populate('contact assignedEmployees', 'name email phone');
    } else {
      cases = await Case.find({ assignedEmployees: req.user.id }).populate('contact assignedEmployees', 'name email phone');
    }

    res.json(cases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Assign employees to a case
router.put('/assign-case/:id', auth, async (req, res) => {
  try {
    const { employeeIds } = req.body;
    const caseToUpdate = await Case.findById(req.params.id);

    if (!caseToUpdate) {
      return res.status(404).json({ msg: 'Case not found' });
    }

    caseToUpdate.assignedEmployees = employeeIds;
    await caseToUpdate.save();

    res.json({ msg: 'Case updated successfully', case: caseToUpdate });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a case
router.delete('/cases/:id', auth, async (req, res) => {
  try {
    const caseToDelete = await Case.findById(req.params.id);

    if (!caseToDelete) {
      return res.status(404).json({ msg: 'Case not found' });
    }

    await caseToDelete.remove();

    res.json({ msg: 'Case deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
