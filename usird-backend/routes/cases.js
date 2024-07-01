const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Case = require('../models/Case');
const Contact = require('../models/Contact');

// Get all cases
router.get('/', auth, async (req, res) => {
  try {
    const cases = await Case.find().populate('_id');
    res.json(cases);
  } catch (err) {
    console.error('Error fetching cases:', err.message);
    res.status(500).send('Server error');
  }
});

// Get all contacts
router.get('/contacts', auth, async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).send('Server error');
  }
});

// Create a new case
router.post('/', auth, async (req, res) => {
  const { clientId, status, stage } = req.body;
  try {
    const newCase = new Case({ clientId, status, stage });
    await newCase.save();

    res.json(newCase);
  } catch (err) {
    console.error('Error creating case:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch a single case by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const caseDetails = await Case.findById(req.params.id).populate('clientId assignedEmployees', 'name email phone address');
    if (!caseDetails) {
      return res.status(404).json({ msg: 'Case not found' });
    }
    res.json(caseDetails);
  } catch (err) {
    console.error('Error fetching case details:', err.message);
    res.status(500).send('Server error');
  }
});

// Update case status and stage
router.put('/:id', auth, async (req, res) => {
  const { status, stage } = req.body;
  try {
    let caseToUpdate = await Case.findById(req.params.id);
    if (!caseToUpdate) return res.status(404).json({ msg: 'Case not found' });

    caseToUpdate.status = status;
    caseToUpdate.stage = stage;
    await caseToUpdate.save();

    res.json(caseToUpdate);
  } catch (err) {
    console.error('Error updating case:', err.message);
    res.status(500).send('Server error');
  }
});

// Get case status by receipt number
router.get('/status/:receiptNumber', auth, async (req, res) => {
  try {
    const caseToCheck = await Case.findOne({ receiptNumber: req.params.receiptNumber }).populate('clientId');
    if (!caseToCheck) return res.status(404).json({ msg: 'Case not found' });

    res.json({ status: caseToCheck.status });
  } catch (err) {
    console.error('Error fetching case status:', err.message);
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
    console.error('Error assigning employees to case:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete a case
router.delete('/:id', auth, async (req, res) => {
  try {
    const caseToDelete = await Case.findById(req.params.id);

    if (!caseToDelete) {
      return res.status(404).json({ msg: 'Case not found' });
    }

    await Case.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Case deleted successfully' });
  } catch (err) {
    console.error('Error deleting case:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
