const User = require('../models/userModel');

// Function to generate a new user ID
const generateUserId = async () => {
  const lastUser = await User.findOne().sort({ id: -1 }); // Get the user with the highest ID
  return lastUser ? lastUser.id + 1 : 1; // Increment ID by 1 or start from 1 if no users exist
};

// Get all users with optional filtering and pagination
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
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { first_name, last_name, email, gender, avatar, domain, available } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    // Generate a new user ID
    const id = await generateUserId();

    // Create and save the new user
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
    const updatedUser = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ id: req.params.id });
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
