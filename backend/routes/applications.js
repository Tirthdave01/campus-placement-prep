const express = require('express');
const Application = require('../models/Application');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/applications - student applies to a vacancy
router.post('/', protect, async (req, res) => {
  try {
    const { vacancyId } = req.body;
    const application = await Application.create({
      studentId: req.user.id,
      vacancyId,
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/applications/me - student's own applications
router.get('/me', protect, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id }).populate('vacancyId');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/applications/vacancy/:vacancyId - admin views applicants for a vacancy
router.get('/vacancy/:vacancyId', protect, adminOnly, async (req, res) => {
  try {
    const applications = await Application.find({ vacancyId: req.params.vacancyId }).populate('studentId', 'name email resumeUrl skills');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/applications/:id - admin updates status
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
