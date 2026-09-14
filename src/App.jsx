import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  HeartPulse,
  History as HistoryIcon,
  ChevronDown,
} from "lucide-react";

import HealthForm from "./components/health/HealthForm";
import DailyHealthForm from "./components/health/DailyHealthForm";
import GoalForm from "./components/health/GoalForm";
import Dashboard from "./components/dashboard/Dashboard";
import History from "./components/history/History";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Updated to scroll to the specific section instead of the top of the page
  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close dropdown on mobile after clicking
    
    const section = document.getElementById(tab);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="app">
      {/* DESKTOP SIDEBAR (Hidden on mobile) */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <HeartPulse size={28} />
          <span>HealthTrack</span>
        </div>

        <nav className="sidebar-nav">
          <a
            href="#dashboard"
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={(e) => { e.preventDefault(); handleNavClick("dashboard"); }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>

          <a
            href="#log-health"
            className={`nav-item ${activeTab === "log-health" ? "active" : ""}`}
            onClick={(e) => { e.preventDefault(); handleNavClick("log-health"); }}
          >
            <HeartPulse size={20} />
            <span>Log Health</span>
          </a>

          <a
            href="#history"
            className={`nav-item ${activeTab === "history" ? "active" : ""}`}
            onClick={(e) => { e.preventDefault(); handleNavClick("history"); }}
          >
            <HistoryIcon size={20} />
            <span>History</span>
          </a>
        </nav>
      </aside>

      <main className="main-content">
        {/* MOBILE NAVIGATION DROPDOWN (Visible ONLY on mobile) */}
        <div className="mobile-nav-wrapper">
          <div 
            className="mobile-nav-logo" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <HeartPulse size={20} className="heart-icon" />
            <span>HealthTrack</span>
            <ChevronDown 
              size={16} 
              style={{ 
                transition: 'transform 0.3s ease', 
                transform: isMobileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
              }} 
            />
          </div>

          {isMobileMenuOpen && (
            <div className="mobile-dropdown">
              <a
                href="#dashboard"
                className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); handleNavClick("dashboard"); }}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </a>
              <a
                href="#log-health"
                className={`nav-item ${activeTab === "log-health" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); handleNavClick("log-health"); }}
              >
                <HeartPulse size={18} />
                <span>Log Health</span>
              </a>
              <a
                href="#history"
                className={`nav-item ${activeTab === "history" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); handleNavClick("history"); }}
              >
                <HistoryIcon size={18} />
                <span>History</span>
              </a>
            </div>
          )}
        </div>

        {/* PAGE SECTIONS - All sections are now rendered permanently so you can scroll to them */}
        <section id="dashboard" className="dashboard-section">
          <Dashboard />
        </section>

        <section id="log-health" className="log-health-section">
          <div className="section-header-wrap">
            <h2 className="section-heading">Log Health Data</h2>
            <p className="section-subtext">Record your daily meals, water intake, and wellness targets</p>
          </div>

          <div className="log-health-compound-grid">
            <div className="log-card-column">
              <div className="form-card-header">
                <span className="form-card-badge">Nutrition Log</span>
                <span className="form-card-title">Add Meal Record</span>
              </div>
              <HealthForm />
            </div>

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