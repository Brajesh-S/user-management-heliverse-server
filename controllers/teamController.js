// controllers/teamController.js
const Team = require('../models/teamModel');
const User = require('../models/userModel');

// Create a new team with unique domains and availability
exports.createTeam = async (req, res) => {
  const { name, userIds } = req.body;

  try {
    // Find users by IDs and ensure they are available
    const users = await User.find({ _id: { $in: userIds }, available: true });

    // Check if all users have unique domains
    const uniqueDomains = new Set(users.map(user => user.domain));
    if (uniqueDomains.size !== users.length) {
      return res.status(400).json({ error: "Users must have unique domains" });
    }

    // Create and save the new team
    const newTeam = new Team({ name, users: userIds });
    await newTeam.save();

    // Return the created team
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get team details by ID
exports.getTeamById = async (req, res) => {
  const teamId = req.params.id;

  try {
    // Find the team by ID and populate the users
    const team = await Team.findById(teamId).populate('users');

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Return the team details
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
