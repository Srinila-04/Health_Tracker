import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  HeartPulse,
  History as HistoryIcon,
} from "lucide-react";

import HealthForm from "./components/health/HealthForm";
import DailyHealthForm from "./components/health/DailyHealthForm";
import GoalForm from "./components/health/GoalForm";
import Dashboard from "./components/dashboard/Dashboard";
import History from "./components/history/History";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDashboardClick = (e) => {
    e.preventDefault();
    setActiveTab("dashboard");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <HeartPulse size={28} />
          <span>HealthTrack</span>
        </div>

        <nav className="sidebar-nav">
          {/* 1. Dashboard Nav Item */}
          <a
            href="#dashboard"
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={handleDashboardClick}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>

          {/* 2. Log Health Nav Item */}
          <a
            href="#log-health"
            className={`nav-item ${activeTab === "log-health" ? "active" : ""}`}
            onClick={() => setActiveTab("log-health")}
          >
            <HeartPulse size={20} />
            <span>Log Health</span>
          </a>

          {/* 3. History Nav Item */}
          <a
            href="#history"
            className={`nav-item ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <HistoryIcon size={20} />
            <span>History</span>
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <section id="dashboard" className="dashboard-section">
          <Dashboard />
        </section>

        <section id="log-health" className="log-health-section">
          <div className="section-header-wrap">
            <h2 className="section-heading">Log Health Data</h2>
            <p className="section-subtext">Record your daily meals, water intake, and wellness targets</p>
          </div>

          <div className="log-health-compound-grid">
            {/* Left Column: Meal Logger Card */}
            <div className="log-card-column">
              <div className="form-card-header">
                <span className="form-card-badge">Nutrition Log</span>
                <span className="form-card-title">Add Meal Record</span>
              </div>
              <HealthForm />
            </div>

            {/* Right Column: Daily Habits & Goals Combined */}
            <div className="log-card-column">
              <div className="log-subcard-item">
                <div className="form-card-header">
                  <span className="form-card-badge teal-badge">Hydration & Sleep</span>
                  <span className="form-card-title">Daily Habits</span>
                </div>
                <DailyHealthForm />
              </div>

              <div className="log-subcard-item">
                <div className="form-card-header">
                  <span className="form-card-badge purple-badge">Calorie Target</span>
                  <span className="form-card-title">Monthly Goal</span>
                </div>
                <GoalForm />
              </div>
            </div>
          </div>
        </section>

        <section id="history" className="history-section">
          <h2 className="section-heading">History</h2>

          <History />
        </section>
      </main>
    </div>
  );
}

export default App;