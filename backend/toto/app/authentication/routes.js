
const express = require('express');
const AuthService = require('./service');

const login = express.Router();

login.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await AuthService.registerUser(username, password);
    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: error.message });
  }
});

login.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await AuthService.loginUser(username, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = login;
