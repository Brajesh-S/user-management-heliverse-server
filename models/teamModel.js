// models/teamModel.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  createdAt: { type: Date, default: Date.now },
}, { collection: 'Teams' }); 

// Export the Team model
module.exports = mongoose.model('Team', teamSchema);
