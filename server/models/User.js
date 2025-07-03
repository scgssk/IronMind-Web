const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  streak: { type: Number, default: 0 },
  lastCommitDate: Date,
});

module.exports = mongoose.model('User', userSchema);
