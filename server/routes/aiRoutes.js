// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_MODEL = 'gemini-2.0-flash';
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// router.post("/motivate", async (req, res) => {
//   const { regret } = req.body;

//   if (!regret) return res.status(400).json({ error: "Regret is required." });

//   try {
//     const geminiRes = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
//       contents: [{ parts: [{ text: `Turn this regret into motivation: ${regret}` }] }],
//     });

//     const message = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text;
//     res.json({ message });
//   } catch (err) {
//     console.error("❌ Gemini API Error:", err.response?.data || err.message);
//     res.status(500).json({ error: "AI Motivation failed." });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const { generateMotivation } = require("../controllers/aiController");

router.post("/motivate", generateMotivation);

module.exports = router;
