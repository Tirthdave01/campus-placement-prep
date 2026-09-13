const express = require('express');
const Vacancy = require('../models/Vacancy');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/vacancies - all students can view, with optional filters
router.get('/', protect, async (req, res) => {
  try {
    const { role, minCtc } = req.query;
    const filter = {};
    if (role) filter.role = { $regex: role, $options: 'i' };

    const vacancies = await Vacancy.find(filter).sort({ createdAt: -1 });
    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/vacancies/:id - single vacancy detail
router.get('/:id', protect, async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' });
    res.json(vacancy);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/vacancies - admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const vacancy = await Vacancy.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json(vacancy);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/vacancies/:id - admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vacancy);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/vacancies/:id - admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Vacancy.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vacancy deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
