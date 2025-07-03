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

import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  zoomPlugin
);

const Dashboard = () => {
  const userId = "sk";
  const { streak, quote } = useStreak();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regret, setRegret] = useState("");
  const [regretMotivation, setRegretMotivation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("weekly"); // 'weekly' | 'monthly'

  const getTodayKey = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/commit/history/${userId}`
      );
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

  const filteredHistory =
    viewMode === "weekly"
      ? history.slice(0, 7).reverse()
      : history
          .filter((e) =>
            e.date.startsWith(new Date().toISOString().slice(0, 7))
          ) // current month
          .reverse();

  const chartData = {
    labels: filteredHistory.map((e) => e.date.slice(5)), // MM-DD
    datasets: [
      {
        label: "Completed",
        data: filteredHistory.map(
          (e) => e.commits.filter((c) => c.completed).length
        ),
        backgroundColor: "#34d399",
      },
      {
        label: "Total",
        data: filteredHistory.map((e) => e.commits.length),
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
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
        pan: {
          enabled: true,
          mode: "x",
        },
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
      .filter(
        (line) => line && !/^(1\.|2\.|motivational|inspirational)/i.test(line)
      )
      .map((line) => line.replace(/^•\s*"?•?\s*/, "").replace(/"$/, ""));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="bg-gray-900 border border-red-500 rounded-lg p-6 w-full max-w-lg shadow-2xl text-white">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            💥 Yesterday’s Regret
          </h2>
          <p className="text-yellow-200 whitespace-pre-wrap mb-4">{regret}</p>

          <h3 className="text-xl font-semibold text-green-400 mb-2">
            🚀 Fuel for Today:
          </h3>
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

      <section className="max-w-screen-2xl mx-auto w-full px-4 sm:px-8">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4">📊 Dashboard</h2>
        <p className="text-base sm:text-xl italic text-yellow-300 my-4 sm:my-6">
          🧠 Mind Punch: “{quote}”
        </p>

        {regret && (
          <div className="mb-6 bg-red-950 p-4 sm:p-6 rounded text-yellow-100 border-l-4 border-red-400">
            <h3 className="text-lg sm:text-xl font-bold text-red-300 mb-2">
              💥 Yesterday’s Regret
            </h3>
            <pre className="whitespace-pre-wrap text-red-200">{regret}</pre>

            <h4 className="mt-4 text-green-400 font-semibold">
              🚀 Fuel for Today:
            </h4>
            <p className="italic text-green-300">{regretMotivation}</p>
          </div>
        )}

        <div className="w-full my-6">
          
          <div className="flex justify-end mb-4">
                      <button
            onClick={() => ChartJS.instances[0]?.resetZoom()}
            className=" mr-10 px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 rounded"
          >
            Reset Zoom
          </button>
            <button
              className={`px-3 py-1 mr-2 rounded ${
                viewMode === "weekly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => setViewMode("weekly")}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 rounded ${
                viewMode === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => setViewMode("monthly")}
            >
              Monthly
            </button>
            
          </div>

          <div className="bg-gray-800 p-4 rounded shadow-inner min-h-[200px] sm:min-h-[300px] lg:min-h-[400px]">
            <Bar data={chartData} options={chartOptions} />
          </div>

        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading history...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((entry, idx) => (
              <div key={idx} className="border p-4 rounded bg-gray-800">
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  📅 {entry.date}
                </h3>
                {entry.commits.length === 0 ? (
                  <p className="text-red-400">❌ No goals committed.</p>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {entry.commits.map((c) => (
                      <li
                        key={c._id}
                        className={
                          c.completed ? "text-green-400" : "text-yellow-400"
                        }
                      >
                        {c.completed ? "✅" : "🔄"} {c.focus}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Dashboard;
