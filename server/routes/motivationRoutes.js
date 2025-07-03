const express = require("express");
const router = express.Router();
const Motivation = require("../models/Motivation");
const { generateRegretMotivations } = require("../controllers/motivationController");
// POST a new motivation
router.post("/", async (req, res) => {
  try {
    const { userId, regret, quote } = req.body;
    const newMotivation = new Motivation({ userId, regret, quote });
    await newMotivation.save();
    res.status(201).json(newMotivation);
  } catch (err) {
    res.status(500).json({ error: "Failed to save motivation" });
  }
});

// GET all motivations for a user
router.get("/:userId", async (req, res) => {
  try {
    const motivations = await Motivation.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(motivations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch motivations" });
  }
});

router.post("/generate/:userId", generateRegretMotivations);

module.exports = router;
