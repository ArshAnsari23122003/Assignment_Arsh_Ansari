const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isNew = user.isNew;

  // Mark user as not new anymore
  if (isNew) {
    user.isNew = false;
    await user.save();
  }

  const token = jwt.sign(
    { userId: user._id, isNew },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};


exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
