const Commit = require("../models/Commit");

// 1. Create new task
exports.createCommit = async (req, res) => {
  try {
    const { userId, focus, reason } = req.body;

    const newCommit = await Commit.create({
      userId,
      focus,
      reason,
      date: new Date(),
    });

    res.status(201).json(newCommit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get today's commits for a user
exports.getTodayCommits = async (req, res) => {
  const { userId } = req.params;

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  try {
    const commits = await Commit.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    res.json(commits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Mark a commit as completed
exports.markCommitComplete = async (req, res) => {
  const { id } = req.params;

  try {
    const commit = await Commit.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );

    if (!commit) {
      return res.status(404).json({ error: "Commit not found" });
    }

    res.json(commit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteCommit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Commit.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCommit = async (req, res) => {
  const { id } = req.params;
  const { focus, reason } = req.body;

  try {
    const updated = await Commit.findByIdAndUpdate(
      id,
      { focus, reason },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Commit not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getCommitHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const allCommits = await Commit.find({ userId }).sort({ date: -1 });

    // Group commits by date (ignoring time)
    const grouped = {};
    for (const commit of allCommits) {
      const day = new Date(commit.date).toISOString().split("T")[0]; // "2025-07-03"
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(commit);
    }

    const result = Object.entries(grouped).map(([date, commits]) => ({
      date,
      commits,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRegret = async (req, res) => {
  const { id } = req.params;
  const { regret } = req.body;

  try {
    const updated = await Commit.findByIdAndUpdate(
      id,
      { regret },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Commit not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getYesterdaysCommits = async (req, res) => {
  const { userId } = req.params;

  const start = new Date();
  start.setDate(start.getDate() - 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setDate(end.getDate() - 1);
  end.setHours(23, 59, 59, 999);

  try {
    const commits = await Commit.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    res.json(commits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getYesterdaysRegret = async (req, res) => {
  const { userId } = req.params;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const end = new Date(yesterday);
  end.setHours(23, 59, 59, 999);

  try {
    const commits = await Commit.find({
      userId,
      date: { $gte: yesterday, $lte: end },
    });

    const regret = commits
      .filter((c) => !c.completed)
      .map((c) => `• ${c.focus}`)
      .join("\n");

    res.json({ regret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStreak = async (req, res) => {
  const { userId } = req.params;

  try {
    const commits = await Commit.find({ userId }).sort({ date: -1 });

    // Group by day
    const grouped = {};
    for (const commit of commits) {
      const key = new Date(commit.date).toISOString().split("T")[0];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(commit);
    }

    const today = new Date();
    let streak = 0;

    for (let i = 0; ; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      const dayCommits = grouped[dateKey];

      if (!dayCommits || dayCommits.length === 0) break;

      const allCompleted = dayCommits.every((c) => c.completed);
      if (!allCompleted) break;

      streak++;
    }

    res.json({ streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
