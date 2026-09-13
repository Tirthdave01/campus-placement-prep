const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vacancyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy', required: true },
  status: { type: String, enum: ['Applied', 'Shortlisted', 'Rejected'], default: 'Applied' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
