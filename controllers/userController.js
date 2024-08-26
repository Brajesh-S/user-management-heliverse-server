// controllers/userController.js
const User = require('../models/userModel');

exports.getUsers = async (req, res) => {
  const { domain, gender, available, search, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (domain) filter.domain = domain;
  if (gender) filter.gender = gender;
  if (available) filter.available = available === 'true';
  if (search) filter.first_name = new RegExp(search, 'i');

  try {
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const count = await User.countDocuments(filter);

    res.json({ users, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { id, first_name, last_name, email, gender, avatar, domain, available } = req.body;
  try {
    const newUser = new User({ id, first_name, last_name, email, gender, avatar, domain, available });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
