const express = require("express");
const router = express.Router();
const {
    createCommit,
    getTodayCommits,
    markCommitComplete,
    deleteCommit,
    updateCommit,
    getCommitHistory,
    updateRegret,
    getYesterdaysCommits,
    getYesterdaysRegret
} = require("../controllers/commitController");

router.post("/", createCommit);
router.get("/today/:userId", getTodayCommits);
router.get("/history/:userId", getCommitHistory);
router.patch("/:id/complete", markCommitComplete);
router.delete("/:id", deleteCommit);
router.patch("/:id", updateCommit);
router.patch("/regret/:id", updateRegret);
router.get("/yesterday/:userId", getYesterdaysCommits);
router.get("/regret/yesterday/:userId", getYesterdaysRegret);


module.exports = router;
