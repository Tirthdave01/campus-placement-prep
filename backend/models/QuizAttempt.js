const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{
    questionText: String,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
  }],
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
