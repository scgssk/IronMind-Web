import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStreak } from "../context/StreakContext";
import { useState, useEffect } from "react";

const Layout = ({ children }) => {
  const { streak } = useStreak();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRoute, setSelectedRoute] = useState("");

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/focus", label: "Focus" },
    { path: "/vault", label: "Vault" },
  ];

  useEffect(() => {
    setSelectedRoute(location.pathname);
  }, [location.pathname]);

  const handleSelect = (e) => {
    const route = e.target.value;
    setSelectedRoute(route);
    if (route !== location.pathname) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:px-16 xl:px-32">
      <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto text-center">
          <img
            src="/ironmindd.png"
            alt="IronMind Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-400">
            IronMind
          </h1>
        </div>

        {/* Mobile: Dropdown + Streak */}
        <div className="sm:hidden flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center w-full">
            <select
              value={selectedRoute}
              onChange={handleSelect}
              className="bg-gray-800 border border-white text-white p-2 rounded w-full"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>

            {streak !== null && (
              <span className="ml-4 text-xs bg-green-600 px-3 py-1 rounded-full font-mono whitespace-nowrap">
                🔥 {streak}d
              </span>
            )}
          </div>
        </div>

        {/* Desktop: Horizontal Nav + Streak */}
        <nav className="hidden sm:flex flex-wrap items-center gap-6 text-sm sm:text-base">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-white ${
                  isActive
                    ? "underline underline-offset-4 text-blue-300"
                    : "hover:underline hover:underline-offset-4"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {streak !== null && (
            <span className="text-xs bg-green-600 px-3 py-1 rounded-full font-mono whitespace-nowrap">
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
