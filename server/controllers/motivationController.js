const Commit = require("../models/Commit");
const Motivation = require("../models/Motivation");
const axios = require("axios");

exports.generateRegretMotivations = async (req, res) => {
    const { userId } = req.params;

    try {
        function getYesterdayRangeIST() {
            const now = new Date();

            // Move to yesterday in IST
            const istOffset = 5.5 * 60 * 60 * 1000;
            const nowIST = new Date(now.getTime() + istOffset);

            const yesterdayIST = new Date(nowIST);
            yesterdayIST.setDate(nowIST.getDate() - 1);
            yesterdayIST.setHours(0, 0, 0, 0);

            const startUTC = new Date(yesterdayIST.getTime() - istOffset);
            const endUTC = new Date(startUTC);
            endUTC.setHours(23, 59, 59, 999);

            return { start: startUTC, end: endUTC };
        }


        const { start, end } = getYesterdayRangeIST();


        const regrets = await Commit.find({
            userId,
            date: { $gte: start, $lte: end },
            completed: false,
        });

        if (regrets.length === 0) {
            return res.json({ message: "No regrets for yesterday" });
        }

        let count = 0;
        for (const regret of regrets) {
            const prompt = `Convert this into a short, powerful motivational quote: "${regret.focus}" because "${regret.reason}". Keep it short, bold, and punchy.`;

            const aiRes = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                {
                    contents: [{ parts: [{ text: prompt }] }],
                },
                {
                    params: { key: process.env.GEMINI_API_KEY },
                    headers: { "Content-Type": "application/json" },
                }
            );

            const quote = aiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (quote) {
                await Motivation.create({
                    userId,
                    regret: regret.focus,
                    quote,
                });
                count++;
            }
        }

        res.json({ status: "Done", regrets: count });
    } catch (err) {
        console.error("Failed to generate motivation:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
