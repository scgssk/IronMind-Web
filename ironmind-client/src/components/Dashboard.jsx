// import { useEffect, useState } from "react";
// import axios from "axios";
// import Layout from "./Layout";
// import { useStreak } from "../context/StreakContext";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register Chart.js modules
// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// const Dashboard = () => {
//   const userId = "sk";
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { streak, quote } = useStreak();
//   const [regret, setRegret] = useState("");
//   const [regretMotivation, setRegretMotivation] = useState("");

//   const failedDays = history.filter(
//     (day) => day.commits.length > 0 && !day.commits.every((c) => c.completed)
//   ).length;

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const getTodayKey = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0]; // "2025-07-03"
//   };

//   const fetchHistory = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/commit/history/${userId}`
//       );
//       const data = res.data.sort((a, b) => b.date.localeCompare(a.date));

//       setHistory(data);
//     } catch (err) {
//       console.error("Failed to fetch history:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const todayKey = getTodayKey();
//     Object.keys(localStorage).forEach((key) => {
//       if (
//         (key.startsWith("motivation_") ||
//           key.startsWith("motivation_shown_")) &&
//         !key.endsWith(todayKey)
//       ) {
//         localStorage.removeItem(key);
//       }
//     });
//   }, []);

//   useEffect(() => {
//     const fetchRegret = async () => {
//       const todayKey = getTodayKey();
//       const storageKey = `motivation_${todayKey}`;
//       const shownKey = `motivation_shown_${todayKey}`;

//       const stored = localStorage.getItem(storageKey);
//       const alreadyShown = localStorage.getItem(shownKey) === "true";

//       if (stored) {
//         const parsed = JSON.parse(stored);
//         setRegret(parsed.regret);
//         setRegretMotivation(parsed.motivation);

//         if (!alreadyShown) {
//           setShowModal(true);
//           localStorage.setItem(shownKey, "true");
//         }
//         return;
//       }

//       try {
//         const { data } = await axios.get(
//           `http://localhost:5000/api/commit/regret/yesterday/${userId}`
//         );

//         if (data.regret) {
//           setRegret(data.regret);

//           const aiRes = await axios.post(
//             "http://localhost:5000/api/ai/motivate",
//             { text: data.regret },
//             {
//               headers: {
//                 "x-user-id": userId,
//               },
//             }
//           );

//           const motivation = aiRes.data.message;

//           localStorage.setItem(
//             storageKey,
//             JSON.stringify({ regret: data.regret, motivation })
//           );
//           localStorage.setItem(shownKey, "true");

//           setRegretMotivation(motivation);
//           setShowModal(true);
//         }
//       } catch (err) {
//         console.error("⚠️ Failed to fetch regret/motivation:", err);
//       }
//     };

//     fetchRegret();
//   }, []);

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

//   // Slice last 7 days and reverse for left-to-right order
//   const streakData = history.slice(0, 7).reverse();
//   const [showModal, setShowModal] = useState(false);

//   const chartData = {
//     labels: streakData.map((e) => e.date.slice(5)), // "MM-DD"
//     datasets: [
//       {
//         label: "Completed",
//         data: streakData.map(
//           (e) => e.commits.filter((c) => c.completed).length
//         ),
//         backgroundColor: "#34d399",
//       },
//       {
//         label: "Total",
//         data: streakData.map((e) => e.commits.length),
//         backgroundColor: "#6366f1",
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         labels: {
//           color: "#fff",
//         },
//       },
//       tooltip: {
//         backgroundColor: "#1f2937",
//         titleColor: "#fff",
//         bodyColor: "#d1d5db",
//       },
//     },
//     scales: {
//       x: {
//         ticks: {
//           color: "#cbd5e1",
//         },
//         grid: {
//           color: "#334155",
//         },
//       },
//       y: {
//         ticks: {
//           color: "#cbd5e1",
//           stepSize: 1,
//         },
//         grid: {
//           color: "#334155",
//         },
//       },
//     },
//   };

//   const MotivationModal = ({ regret, motivation, onClose }) => {
//     // Format motivation string into bullet points
//     const formatted = motivation
//       .split("\n")
//       .map((line) => line.trim())
//       .filter(
//         (line) =>
//           line.length > 0 &&
//           !line.startsWith("1.") &&
//           !line.startsWith("2.") &&
//           !line.toLowerCase().includes("motivational quotes") &&
//           !line.toLowerCase().includes("inspirational quotes")
//       )
//       .map((line) => line.replace(/^•\s*"?•?\s*/, "").replace(/"$/, ""));

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
//         <div className="bg-gray-900 border border-red-500 rounded-lg p-6 w-full max-w-lg shadow-2xl text-white">
//           <h2 className="text-2xl font-bold text-red-400 mb-4">
//             💥 Yesterday’s Regret
//           </h2>
//           <p className="text-yellow-200 whitespace-pre-wrap mb-4">{regret}</p>

//           <h3 className="text-xl font-semibold text-green-400 mb-2">
//             🚀 Fuel for Today:
//           </h3>
//           <ul className="list-disc list-inside text-green-300 space-y-1">
//             {formatted.map((line, idx) => (
//               <li key={idx}>{line}</li>
//             ))}
//           </ul>

//           <button
//             onClick={onClose}
//             className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Layout streak={streak}>
//       {showModal && regretMotivation && (
//         <MotivationModal
//           regret={regret}
//           motivation={regretMotivation}
//           onClose={() => setShowModal(false)}
//         />
//       )}
//       <h2 className="text-4xl font-bold mb-4">📊 Dashboard</h2>
//       <p className="text-xl italic text-yellow-300 my-6">
//         🧠 Mind Punch: “{quote}”
//       </p>
//       {/* <p className="mt-4 text-red-400 text-lg font-semibold">
//         💣 Missed Days This Week: {failedDays}
//       </p> */}
//       {regret && (
//         <div className="mb-6 bg-red-950 p-4 rounded text-yellow-100 border-l-4 border-red-400">
//           <h3 className="text-xl font-bold text-red-300 mb-2">
//             💥 Yesterday’s Regret
//           </h3>
//           <pre className="whitespace-pre-wrap text-red-200">{regret}</pre>

//           <h4 className="mt-4 text-green-400 font-semibold">
//             🚀 Fuel for Today:
//           </h4>
//           <p className="italic text-green-300">{regretMotivation}</p>
//         </div>
//       )}

//       {/* Chart.js Bar Chart */}
//       <div className="flex justify-center h-72 my-5">
//         <Bar data={chartData} options={chartOptions} />
//       </div>

//       {/* Daily history list */}
//       {loading ? (
//         <p>Loading history...</p>
//       ) : (
//         history.map((entry, idx) => (
//           <div key={idx} className="mb-6 border p-4 rounded bg-gray-800">
//             <h3 className="text-xl font-bold mb-2">📅 {entry.date}</h3>
//             {entry.commits.length === 0 ? (
//               <p className="text-red-400">❌ No goals committed.</p>
//             ) : (
//               <ul className="list-disc list-inside">
//                 {entry.commits.map((c) => (
//                   <li
//                     key={c._id}
//                     className={
//                       c.completed ? "text-green-400" : "text-yellow-400"
//                     }
//                   >
//                     {c.completed ? "✅" : "🔄"} {c.focus}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         ))
//       )}
//     </Layout>
//   );
// };

// export default Dashboard;


import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import { useStreak } from "../context/StreakContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const userId = "sk";
  const { streak, quote } = useStreak();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regret, setRegret] = useState("");
  const [regretMotivation, setRegretMotivation] = useState("");
  const [showModal, setShowModal] = useState(false);

  const getTodayKey = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/commit/history/${userId}`);
      const data = res.data
        .map((day) => ({
          ...day,
          date: new Date(day.date).toISOString().split("T")[0],
        }))
        .sort((a, b) => b.date.localeCompare(a.date));

      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const todayKey = getTodayKey();
    Object.keys(localStorage).forEach((key) => {
      if (
        (key.startsWith("motivation_") ||
          key.startsWith("motivation_shown_")) &&
        !key.endsWith(todayKey)
      ) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  useEffect(() => {
    const fetchRegret = async () => {
      const todayKey = getTodayKey();
      const storageKey = `motivation_${todayKey}`;
      const shownKey = `motivation_shown_${todayKey}`;

      const stored = localStorage.getItem(storageKey);
      const alreadyShown = localStorage.getItem(shownKey) === "true";

      if (stored) {
        const parsed = JSON.parse(stored);
        setRegret(parsed.regret);
        setRegretMotivation(parsed.motivation);

        if (!alreadyShown) {
          setShowModal(true);
          localStorage.setItem(shownKey, "true");
        }
        return;
      }

      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/commit/regret/yesterday/${userId}`
        );

        if (data.regret) {
          setRegret(data.regret);

          const aiRes = await axios.post(
            "http://localhost:5000/api/ai/motivate",
            { text: data.regret },
            { headers: { "x-user-id": userId } }
          );

          const motivation = aiRes.data.message;
          localStorage.setItem(
            storageKey,
            JSON.stringify({ regret: data.regret, motivation })
          );
          localStorage.setItem(shownKey, "true");

          setRegretMotivation(motivation);
          setShowModal(true);
        }
      } catch (err) {
        console.error("⚠️ Failed to fetch regret/motivation:", err);
      }
    };

    fetchRegret();
  }, []);

  const chartData = {
    labels: history.slice(0, 7).reverse().map((e) => e.date.slice(5)),
    datasets: [
      {
        label: "Completed",
        data: history.slice(0, 7).reverse().map(
          (e) => e.commits.filter((c) => c.completed).length
        ),
        backgroundColor: "#34d399",
      },
      {
        label: "Total",
        data: history.slice(0, 7).reverse().map((e) => e.commits.length),
        backgroundColor: "#6366f1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#fff" },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#d1d5db",
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "#334155" },
      },
      y: {
        ticks: { color: "#cbd5e1", stepSize: 1 },
        grid: { color: "#334155" },
      },
    },
  };

  const MotivationModal = ({ regret, motivation, onClose }) => {
    const formatted = motivation
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !/^(1\.|2\.|motivational|inspirational)/i.test(line))
      .map((line) => line.replace(/^•\s*"?•?\s*/, "").replace(/"$/, ""));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="bg-gray-900 border border-red-500 rounded-lg p-6 w-full max-w-lg shadow-2xl text-white">
          <h2 className="text-2xl font-bold text-red-400 mb-4">💥 Yesterday’s Regret</h2>
          <p className="text-yellow-200 whitespace-pre-wrap mb-4">{regret}</p>

          <h3 className="text-xl font-semibold text-green-400 mb-2">🚀 Fuel for Today:</h3>
          <ul className="list-disc list-inside text-green-300 space-y-1">
            {formatted.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>

          <button
            onClick={onClose}
            className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout streak={streak}>
      {showModal && regretMotivation && (
        <MotivationModal
          regret={regret}
          motivation={regretMotivation}
          onClose={() => setShowModal(false)}
        />
      )}
      <h2 className="text-4xl font-bold mb-4">📊 Dashboard</h2>
      <p className="text-xl italic text-yellow-300 my-6">🧠 Mind Punch: “{quote}”</p>

      {regret && (
        <div className="mb-6 bg-red-950 p-4 rounded text-yellow-100 border-l-4 border-red-400">
          <h3 className="text-xl font-bold text-red-300 mb-2">💥 Yesterday’s Regret</h3>
          <pre className="whitespace-pre-wrap text-red-200">{regret}</pre>

          <h4 className="mt-4 text-green-400 font-semibold">🚀 Fuel for Today:</h4>
          <p className="italic text-green-300">{regretMotivation}</p>
        </div>
      )}

      <div className="flex justify-center h-72 my-5">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {loading ? (
        <p>Loading history...</p>
      ) : (
        history.map((entry, idx) => (
          <div key={idx} className="mb-6 border p-4 rounded bg-gray-800">
            <h3 className="text-xl font-bold mb-2">📅 {entry.date}</h3>
            {entry.commits.length === 0 ? (
              <p className="text-red-400">❌ No goals committed.</p>
            ) : (
              <ul className="list-disc list-inside">
                {entry.commits.map((c) => (
                  <li
                    key={c._id}
                    className={c.completed ? "text-green-400" : "text-yellow-400"}
                  >
                    {c.completed ? "✅" : "🔄"} {c.focus}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </Layout>
  );
};

export default Dashboard;
