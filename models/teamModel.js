// models/teamModel.js

const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    users: [{ type: Number, required: true }],
  },
  { collection: "Teams" }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
