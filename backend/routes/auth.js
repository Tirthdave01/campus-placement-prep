const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body);

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('Signup failed: Email already registered');
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'student',
    });

    console.log('User created successfully:', user.email);

    res.status(201).json({
      message: 'User created successfully',
      userId: user._id,
    });
  } catch (err) {
    console.error('SIGNUP ERROR:', err);

    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log('Login failed: User not found');
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Login failed: Wrong password');
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    console.log('Login successful:', user.email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);

    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
});

module.exports = router;