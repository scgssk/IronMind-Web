const mongoose = require("mongoose");

const MotivationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  regret: { type: String, required: true },
  quote: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Motivation", MotivationSchema);
