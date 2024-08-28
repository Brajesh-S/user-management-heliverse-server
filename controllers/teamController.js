//teamController.js
const Team = require("../models/teamModel");
const User = require("../models/userModel");

const generateTeamId = async () => {
  const lastTeam = await Team.findOne().sort({ id: -1 });
  return lastTeam ? lastTeam.id + 1 : 1;
};

exports.createTeam = async (req, res) => {
  const { name, userIds } = req.body;

  try {
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ error: "Team name already exists" });
    }

    const users = await User.find({ id: { $in: userIds } });

    const unavailableUsers = users.filter((user) => !user.available);

    if (unavailableUsers.length > 0) {
      const unavailableUserIds = unavailableUsers.map((user) => user.id);
      return res.status(400).json({
        error: `The following users are not available: ${unavailableUserIds.join(
          ", "
        )}`,
      });
    }

    const uniqueDomains = new Set(users.map((user) => user.domain));
    if (uniqueDomains.size !== users.length) {
      return res.status(400).json({ error: "Users must have unique domains" });
    }

    const newTeamId = await generateTeamId();

    const newTeam = new Team({ id: newTeamId, name, users: userIds });
    await newTeam.save();

    res.status(201).json(newTeam);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Team name or ID already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate({
      path: "users",
      select: "-_id -__v",
      match: {},
      model: User,
      localField: "users",
      foreignField: "id",
      as: "users",
    });

    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTeamById = async (req, res) => {
  const teamId = req.params.id;

  try {
    const team = await Team.findOne({ id: teamId }).populate({
      path: "users",
      select: "-_id -__v",
      match: {},
      model: User,
      localField: "users",
      foreignField: "id",
      as: "users",
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
