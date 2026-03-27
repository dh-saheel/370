require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./src/config/db');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Loaded from .env file



// Signup handler
router.post('/signup', async (req, res) => {
  console.log('Signup request received with data:', req.body);
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login handler
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const users = result.rows;

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    // Send token, username, and expiration time to the client
    res.status(200).json({ token, username: user.username, expiresAt: Date.now() + 3600000 }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify token handler
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log(req.headers);
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ valid: true, username: decoded.username });
  } catch (error) {
    console.error(error);
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});


// Get user info handler
router.get('/user', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;
    const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;