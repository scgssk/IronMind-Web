const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema({
  userId: String,
  date: { type: Date, required: true },
  focus: { type: String, required: true },
  reason: { type: String, required: true },
  completed: { type: Boolean, default: false },
  regret: { type: String, default: "" }
});

module.exports = mongoose.model("Commit", commitSchema);
