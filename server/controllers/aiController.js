const axios = require("axios");

exports.generateMotivation = async (req, res) => {
    const { text } = req.body;
    const allowedUserId = "sk"; // ✅ Hardcoded user ID (use auth later)

    if (req.headers["x-user-id"] !== allowedUserId) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const geminiRes = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Take this regret: "${text}". 
Give me:
1. Three short, sharp, action-based motivational quotes
2. Three inspirational quotes that reframe the regret positively.

Format each line as: * "Quote here"`

                            },
                        ],
                    },
                ],
            }
        );

        let message =
            geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!message) message = "Keep pushing — you’ve got this.";

        // Clean formatting
        message = message
            .replace(/\*\*/g, "")       // Remove bold markers
            .replace(/^\* /gm, "• ")     // Convert * to bullet point
            .replace(/\n{2,}/g, "\n");   // Remove excess spacing

        res.json({ message });

    } catch (err) {
        console.error("⚠️ Gemini API Error:", err.message);
        res.status(500).json({ error: "Failed to generate motivation." });
    }
};
