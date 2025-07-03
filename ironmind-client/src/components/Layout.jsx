import { NavLink } from "react-router-dom";
import { useStreak } from "../context/StreakContext";

const Layout = ({ children }) => {
  const { streak } = useStreak();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:px-16 xl:px-32">
      <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-400">🧠 IronMind</h1>

        <nav className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white ${isActive
                ? "underline underline-offset-4 text-blue-300"
                : "hover:underline hover:underline-offset-4"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-white ${isActive
                ? "underline underline-offset-4 text-blue-300"
                : "hover:underline hover:underline-offset-4"}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/focus"
            className={({ isActive }) =>
              `text-white ${isActive
                ? "underline underline-offset-4 text-blue-300"
                : "hover:underline hover:underline-offset-4"}`
            }
          >
            Focus
          </NavLink>

          {streak !== null && (
            <span className="text-xs sm:text-sm bg-green-600 px-3 py-1 rounded-full font-mono whitespace-nowrap">
              🔥 {streak}d Streak
            </span>
          )}
        </nav>
      </header>

      <main className="flex flex-col w-full max-w-screen-2xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
