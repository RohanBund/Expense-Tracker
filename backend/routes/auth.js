// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = new User({ username, email, password });
  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  });
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await user.matchPassword(password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id);

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  });
});

module.exports = router;
