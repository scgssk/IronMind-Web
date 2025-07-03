import { useEffect, useState } from "react";
import axios from "axios";
import { useStreak } from "../context/StreakContext";
import Layout from "./Layout";

const FocusMode = () => {
  const userId = "sk";

  const [tasks, setTasks] = useState([]);
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [alarmMuted, setAlarmMuted] = useState(false);
  const { quote, refreshStreak } = useStreak();

  const alarmSound = new Audio("/alarm.mp3");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/commit/today/${userId}`
      );
      const incomplete = res.data.filter((c) => !c.completed);
      setTasks(incomplete);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          if (!alarmMuted) alarmSound.play();

          if (onBreak) {
            setRunning(false);
            setOnBreak(false);
            setTimeLeft(initialMinutes * 60);
            exitFullscreen();
          } else {
            setOnBreak(true);
            setTimeLeft(5 * 60);
            setRunning(true);
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, onBreak, initialMinutes, alarmMuted]);

  const format = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleStart = () => {
    setRunning(true);
    enterFullscreen();
  };

  const handleReset = () => {
    setRunning(false);
    setOnBreak(false);
    setTimeLeft(initialMinutes * 60);
    exitFullscreen();
  };


  const handleComplete = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/commit/${id}/complete`);
      fetchTasks();
      refreshStreak(); // ✅ Update streak immediately
    } catch (err) {
      console.error("Error marking task complete:", err.message);
    }
  };

  useEffect(() => {
    const warnOnExit = (e) => {
      if (running) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warnOnExit);
    return () => window.removeEventListener("beforeunload", warnOnExit);
  }, [running]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-bold text-blue-400">🧠 Focus Mode</h1>
        <p className="text-lg italic text-yellow-300">“{quote}”</p>

        <div className="flex gap-4 items-center text-white">
          <label htmlFor="duration" className="font-semibold">
            ⏱ Duration:
          </label>
          <select
            id="duration"
            value={initialMinutes}
            disabled={running}
            onChange={(e) => {
              const newTime = parseInt(e.target.value);
              setInitialMinutes(newTime);
              setTimeLeft(newTime * 60);
            }}
            className="bg-gray-700 text-white px-2 py-1 h-8 rounded"
          >
            {[1, 25, 30, 45, 60].map((min) => (
              <option key={min} value={min}>
                {min} min
              </option>
            ))}
          </select>

          <button
            onClick={() => setAlarmMuted(!alarmMuted)}
            className={`ml-6 px-3 py-1 h-8 rounded text-sm font-medium transition-colors ${
              alarmMuted
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {alarmMuted ? "🔇 Alarm Muted" : "🔊 Alarm On"}
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">📌 Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-green-400">✅ All Done!</p>
          ) : (
            <ul className="text-lg space-y-2">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center justify-between"
                >
                  <span>{task.focus}</span>
                  <button
                    onClick={() => handleComplete(task._id)}
                    className="text-sm bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                  >
                    ✓ Done
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            {onBreak ? "🌙 Break Time" : "🎯 Focus Time"}
          </h2>
          <h2 className="text-5xl font-mono mb-4">{format(timeLeft)}</h2>
          <div className="flex gap-4 justify-center">
            {!running ? (
              <button
                onClick={handleStart}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              >
                ▶ Start
              </button>
            ) : (
              <button
                onClick={() => setRunning(false)}
                className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
              >
                ⏸ Pause
              </button>
            )}
            <button
              onClick={handleReset}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              🔁 Reset
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FocusMode;
