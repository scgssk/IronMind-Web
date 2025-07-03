import { NavLink } from "react-router-dom";
import { useStreak } from "../context/StreakContext";

const Layout = ({ children }) => {
  const { streak } = useStreak();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-400">🧠 IronMind</h1>
        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white ${isActive ? "underline underline-offset-4 text-blue-300" : "hover:underline hover:underline-offset-4"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-white ${isActive ? "underline underline-offset-4 text-blue-300" : "hover:underline hover:underline-offset-4"}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/focus"
            className={({ isActive }) =>
              `text-white ${isActive ? "underline underline-offset-4 text-blue-300" : "hover:underline hover:underline-offset-4"}`
            }
          >
            Focus
          </NavLink>
          {streak !== null && (
            <span className="text-sm bg-green-600 px-3 py-1 rounded-full font-mono">
              🔥 {streak}d Streak
            </span>
          )}
        </nav>
      </header>
      <main className="flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;
