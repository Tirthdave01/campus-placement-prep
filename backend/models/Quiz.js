const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g. Aptitude, DSA, HR
  timeLimit: { type: Number, required: true }, // in minutes
  questions: [questionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
