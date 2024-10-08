//userController.js
const User = require("../models/userModel");

const generateUserId = async () => {
  const lastUser = await User.findOne().sort({ id: -1 });
  return lastUser ? lastUser.id + 1 : 1;
};

exports.getUsers = async (req, res) => {
  const { domain, gender, available, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (domain) filter.domain = domain;
  if (gender) filter.gender = gender;
  if (available) filter.available = available === "true";
  if (search) filter.first_name = new RegExp(search, "i");

  try {
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const count = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.createUser = async (req, res) => {
  const { first_name, last_name, email, gender, avatar, domain, available } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" });

    const id = await generateUserId();

    const newUser = new User({
      id,
      first_name,
      last_name,
      email,
      gender,
      avatar,
      domain,
      available,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ id: req.params.id });
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
