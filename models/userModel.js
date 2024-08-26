// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, 
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  avatar: { type: String }, 
  domain: { type: String, required: true },
  available: { type: Boolean, required: true }, 
}, { collection: 'Users' }); 


module.exports = mongoose.model('User', userSchema);
