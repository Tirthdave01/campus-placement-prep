const express = require('express');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/quizzes - list all quizzes (students see title/category/timeLimit only)
router.get('/', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title category timeLimit createdAt');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/quizzes/:id - full quiz with questions (to attempt)
router.get('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/quizzes - admin only, create a new quiz
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/quizzes/:id - admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/quizzes/:id/submit - student submits answers, gets auto-scored
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionText, selectedAnswer }]
    const quiz = await Quiz.findById(req.params.id);

    let score = 0;
    const gradedAnswers = quiz.questions.map((q) => {
      const studentAnswer = answers.find((a) => a.questionText === q.questionText);
      const selected = studentAnswer ? studentAnswer.selectedAnswer : '';
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score++;
      return {
        questionText: q.questionText,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const attempt = await QuizAttempt.create({
      studentId: req.user.id,
      quizId: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
      answers: gradedAnswers,
    });

    res.status(201).json(attempt);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/quizzes/history/me - student's own past attempts
router.get('/history/me', protect, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ studentId: req.user.id }).populate('quizId', 'title category');
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
