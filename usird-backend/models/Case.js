const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  status: {
    type: String,
    required: true
  },
  stage: {
    type: String
  },
  assignedEmployees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Case', CaseSchema);
