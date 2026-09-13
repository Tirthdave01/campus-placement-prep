const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  ctc: { type: String },
  eligibility: { type: String },
  deadline: { type: Date },
  description: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Vacancy', vacancySchema);
