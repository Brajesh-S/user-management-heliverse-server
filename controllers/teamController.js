const Team = require('../models/teamModel');
const User = require('../models/userModel');

// Helper function to generate a new team ID
const generateTeamId = async () => {
    const lastTeam = await Team.findOne().sort({ id: -1 }); // Get the team with the highest ID
    return lastTeam ? lastTeam.id + 1 : 1; // Increment ID by 1 or start from 1 if no teams exist
  };
  
  // Create a new team with unique domains and availability
  exports.createTeam = async (req, res) => {
    const { name, userIds } = req.body;
  
    try {
      // Check if the team name already exists
      const existingTeam = await Team.findOne({ name });
      if (existingTeam) {
        return res.status(400).json({ error: "Team name already exists" });
      }
  
      // Find users by IDs and ensure they are available
      const users = await User.find({ id: { $in: userIds } });
  
      // Check for unavailable users
      const unavailableUsers = users.filter(user => !user.available);
  
      if (unavailableUsers.length > 0) {
        const unavailableUserIds = unavailableUsers.map(user => user.id);
        return res.status(400).json({ error: `The following users are not available: ${unavailableUserIds.join(', ')}` });
      }
  
      // Check if all users have unique domains
      const uniqueDomains = new Set(users.map(user => user.domain));
      if (uniqueDomains.size !== users.length) {
        return res.status(400).json({ error: "Users must have unique domains" });
      }
  
      // Generate a new team ID
      const newTeamId = await generateTeamId();
  
      // Create and save the new team with the custom ID
      const newTeam = new Team({ id: newTeamId, name, users: userIds });
      await newTeam.save();
  
      // Return the created team
      res.status(201).json(newTeam);
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        res.status(400).json({ error: "Team name or ID already exists" });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

// Get team details by ID
exports.getTeamById = async (req, res) => {
    const teamId = req.params.id;
  
    try {
      // Find the team by custom ID instead of MongoDB _id
      const team = await Team.findOne({ id: teamId }).populate('users');
  
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
  
      // Return the team details
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  