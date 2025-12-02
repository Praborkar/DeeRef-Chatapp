const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('JWT_SECRET not set in environment variables');
}

/*
|--------------------------------------------------------------------------
| POST /auth/signup
|--------------------------------------------------------------------------
*/
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password required' });

    let existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });
    await user.save();

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: payload });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


/*
|--------------------------------------------------------------------------
| POST /auth/login
|--------------------------------------------------------------------------
*/
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: payload });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


/*
|--------------------------------------------------------------------------
| GET /auth/me
| Verifies token → returns authenticated user
|--------------------------------------------------------------------------
*/
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user was added by auth middleware
    const user = await User.findById(req.user.userId).select('name email');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("AUTH /me ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
