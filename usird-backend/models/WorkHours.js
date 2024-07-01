const mongoose = require('mongoose');

const WorkHoursSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkHours', WorkHoursSchema);
