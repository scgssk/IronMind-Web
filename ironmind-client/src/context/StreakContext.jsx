// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// const StreakContext = createContext();

// export const StreakProvider = ({ children }) => {
//   const userId = "sk";
//   const [streak, setStreak] = useState(null);
//   const [quote, setQuote] = useState("");

//   const quotes = [
//     "Discipline is choosing between what you want now and what you want most.",
//     "No one cares. Work harder.",
//     "You are what you do, not what you say you'll do.",
//     "Excuses don’t get results. Habits do.",
//     "The grind doesn’t care how you feel.",
//     "Success is earned. Every. Single. Day.",
//     "If it matters to you, you'll find a way. If not, you'll find an excuse.",
//     "Your comfort zone is a beautiful place—where nothing grows.",
//     "You’re not tired. You’re just uninspired.",
//     "Waiting for motivation is like waiting for lightning. Build anyway.",
//     "Nobody’s coming to save you. It’s on you.",
//     "Prove them wrong, or prove them right. Your choice.",
//     "You can’t Netflix your way to success.",
//     "The future you want won't happen by accident.",
//     "Stop scrolling. Start building.",
//     "Every minute you waste, someone else is working.",
//     "Don't mistake activity for achievement.",
//     "Success doesn’t reward effort. It rewards results.",
//     "Your dreams won’t chase you back.",
//     "You want better? Be better.",
//     "Being busy isn’t the same as being productive.",
//     "You either get results or make excuses—not both.",
//     "Hustle in silence. Results make the noise.",
//     "Greatness costs comfort. Pay up.",
//     "Your potential is worthless without execution.",
//     "Fear of failure is just fear of effort wasted.",
//     "One day or day one. You choose.",
//     "Hard truth: You don’t deserve it yet.",
//     "You can't skip the grind and expect the prize.",
//     "You aren’t behind because life’s unfair—you’re behind because you stopped.",
//     "You don't need more time. You need more focus.",
//     "The gap between where you are and where you want to be is called 'work.'",
//     "Winners bleed in practice. Losers bleed in battle.",
//     "Your goals don’t care how tired you are.",
//     "You said you wanted it. Now act like it.",
//     "Most people lose because they quit, not because they failed.",
//     "You don’t rise to the level of your dreams. You fall to the level of your habits.",
//     "Comfort kills ambition in its sleep.",
//     "You won’t out-dream someone who out-works you.",
//     "If you’re not embarrassed by your past work, you started too late.",
//     "Every excuse adds a brick to your failure.",
//     "Grind until your doubters ask if you're hiring.",
//     "It’s not talent. It’s reps.",
//     "That voice saying 'you can't' is scared you'll prove it wrong.",
//     "Nobody cares how hard it is. Just deliver.",
//     "Effort has no off switch.",
//     "Action beats intention. Every. Damn. Time.",
//     "Discipline isn’t punishment. It’s freedom in disguise.",
//     "Your laziness is someone else’s opportunity.",
//     "Hype fades. Work stays.",
//     "Start before you're ready. Finish after you're tired.",
//   ];

//   useEffect(() => {
//     const today = new Date().toISOString().slice(0, 10);
//     const stored = JSON.parse(localStorage.getItem("quoteOfTheDay"));

//     if (stored && stored.date === today) {
//       setQuote(stored.quote);
//     } else {
//       const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
//       setQuote(randomQuote);
//       localStorage.setItem(
//         "quoteOfTheDay",
//         JSON.stringify({ date: today, quote: randomQuote })
//       );
//     }

//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/commit/history/${userId}`
//       );
//       const history = res.data.sort((a, b) => b.date.localeCompare(a.date));
//       setStreak(calculateStreak(history));
//       console.log("Fetched history:", history);
//       console.log("Today:", new Date().toISOString().split("T")[0]);
//       console.log("Calculated streak:", calculateStreak(history));
//     } catch (err) {
//       console.error("⚠️ Failed to load streak:", err);
//       setStreak(0);
//     }
//   };

//   const calculateStreak = (days) => {
//     const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
//     let streak = 0;

//     for (let i = 0; i < days.length; i++) {
//       const day = days[i];
//       const isToday = day.date === today;
//       const isCompleted =
//         day.commits.length > 0 && day.commits.every((c) => c.completed);

//       if (i === 0) {
//         // Day 1 in list must be today and completed
//         if (isToday && isCompleted) {
//           streak = 1;
//         } else {
//           break;
//         }
//       } else {
//         if (isCompleted) {
//           streak++;
//         } else {
//           break;
//         }
//       }
//     }

//     return streak;
//   };

//   // 🔔 7PM Reminder (every minute check)
//   useEffect(() => {
//     if (Notification.permission !== "granted") {
//       Notification.requestPermission();
//     }

//     const interval = setInterval(async () => {
//       const now = new Date();
//       const hour = now.getHours();

//       if (hour >= 10 && hour <= 21) {
//         const last = localStorage.getItem("lastReminderTime");
//         const diff = Date.now() - new Date(last || 0).getTime();

//         if (diff > 2 * 60 * 60 * 1000) {
//           // Check for incomplete tasks
//           const res = await axios.get(
//             `http://localhost:5000/api/commit/today/sk`
//           );
//           const incomplete = res.data.filter((c) => !c.completed);

//           if (incomplete.length > 0) {
//             new Notification("⚠️ Focus Check", {
//               body: "You still have unfinished goals. Stay sharp, not sorry.",
//             });
//             localStorage.setItem("lastReminderTime", new Date().toISOString());
//           }
//         }
//       }
//     }, 30 * 60 * 1000); // every 15 mins

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <StreakContext.Provider value={{ streak, quote }}>
//       {children}
//     </StreakContext.Provider>
//   );
// };

// export const useStreak = () => useContext(StreakContext);
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const StreakContext = createContext();

export const StreakProvider = ({ children }) => {
  const userId = "sk";
  const [streak, setStreak] = useState(0);
  const [quote, setQuote] = useState("");

  const quotes = [
    "Discipline is choosing between what you want now and what you want most.",
    "No one cares. Work harder.",
    "You are what you do, not what you say you'll do.",
    "Excuses don’t get results. Habits do.",
    "The grind doesn’t care how you feel.",
    "Success is earned. Every. Single. Day.",
    "If it matters to you, you'll find a way. If not, you'll find an excuse.",
    "Your comfort zone is a beautiful place—where nothing grows.",
    "You’re not tired. You’re just uninspired.",
    "Waiting for motivation is like waiting for lightning. Build anyway.",
    "Nobody’s coming to save you. It’s on you.",
    "Prove them wrong, or prove them right. Your choice.",
    "You can’t Netflix your way to success.",
    "The future you want won't happen by accident.",
    "Stop scrolling. Start building.",
    "Every minute you waste, someone else is working.",
    "Don't mistake activity for achievement.",
    "Success doesn’t reward effort. It rewards results.",
    "Your dreams won’t chase you back.",
    "You want better? Be better.",
    "Being busy isn’t the same as being productive.",
    "You either get results or make excuses—not both.",
    "Hustle in silence. Results make the noise.",
    "Greatness costs comfort. Pay up.",
    "Your potential is worthless without execution.",
    "Fear of failure is just fear of effort wasted.",
    "One day or day one. You choose.",
    "Hard truth: You don’t deserve it yet.",
    "You can't skip the grind and expect the prize.",
    "You aren’t behind because life’s unfair—you’re behind because you stopped.",
    "You don't need more time. You need more focus.",
    "The gap between where you are and where you want to be is called 'work.'",
    "Winners bleed in practice. Losers bleed in battle.",
    "Your goals don’t care how tired you are.",
    "You said you wanted it. Now act like it.",
    "Most people lose because they quit, not because they failed.",
    "You don’t rise to the level of your dreams. You fall to the level of your habits.",
    "Comfort kills ambition in its sleep.",
    "You won’t out-dream someone who out-works you.",
    "If you’re not embarrassed by your past work, you started too late.",
    "Every excuse adds a brick to your failure.",
    "Grind until your doubters ask if you're hiring.",
    "It’s not talent. It’s reps.",
    "That voice saying 'you can't' is scared you'll prove it wrong.",
    "Nobody cares how hard it is. Just deliver.",
    "Effort has no off switch.",
    "Action beats intention. Every. Damn. Time.",
    "Discipline isn’t punishment. It’s freedom in disguise.",
    "Your laziness is someone else’s opportunity.",
    "Hype fades. Work stays.",
    "Start before you're ready. Finish after you're tired."
  ];

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = JSON.parse(localStorage.getItem("quoteOfTheDay"));

    if (stored?.date === today) {
      setQuote(stored.quote);
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      localStorage.setItem(
        "quoteOfTheDay",
        JSON.stringify({ date: today, quote: randomQuote })
      );
    }

    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/commit/history/${userId}`
      );
      const history = res.data
        .map((day) => ({
          ...day,
          date: new Date(day.date).toISOString().split("T")[0],
        }))
        .sort((a, b) => b.date.localeCompare(a.date));

      setStreak(calculateStreak(history));
    } catch (err) {
      console.error("⚠️ Failed to load streak:", err);
      setStreak(0);
    }
  };

  const calculateStreak = (days) => {
    const today = new Date().toISOString().split("T")[0];
    let count = 0;

    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const isToday = day.date === today;
      const isCompleted =
        day.commits.length > 0 && day.commits.every((c) => c.completed);

      if (i === 0 && isToday && isCompleted) {
        count = 1;
      } else if (i !== 0 && isCompleted) {
        count++;
      } else {
        break;
      }
    }

    return count;
  };

  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();

    const interval = setInterval(async () => {
      const now = new Date();
      const hour = now.getHours();

      if (hour >= 10 && hour <= 21) {
        const last = localStorage.getItem("lastReminderTime");
        const diff = Date.now() - new Date(last || 0).getTime();

        if (diff > 2 * 60 * 60 * 1000) {
          const res = await axios.get(
            `http://localhost:5000/api/commit/today/${userId}`
          );
          const incomplete = res.data.filter((c) => !c.completed);

          if (incomplete.length > 0) {
            new Notification("⚠️ Focus Check", {
              body: "You still have unfinished goals. Stay sharp, not sorry.",
            });
            localStorage.setItem("lastReminderTime", new Date().toISOString());
          }
        }
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <StreakContext.Provider value={{ streak, quote }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => useContext(StreakContext);
