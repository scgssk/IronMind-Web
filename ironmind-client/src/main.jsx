import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StreakProvider } from "./context/StreakContext.jsx";
import FocusMode from './components/FocusMode';
import VaultPage from './components/VaultPage';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StreakProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/focus" element={<FocusMode />} />
        <Route path="/vault" element={<VaultPage />} />
      </Routes>
    </BrowserRouter>
  </StreakProvider>
);
