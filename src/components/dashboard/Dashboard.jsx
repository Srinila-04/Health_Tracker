import { useContext, useMemo, useState, useRef, useEffect } from "react";
import {
  Flame,
  Droplets,
  Moon,
  BarChart3,
  Search,
  Calendar,
  Bell,
  CheckCircle2,
  AlertCircle,
  X,
  Utensils,
} from "lucide-react";
import { HealthContext } from "../../context/HealthContext";
import HealthStatus from "./HealthStatus";
import MealChart from "./MealChart";
import SleepChart from "./SleepChart";

function Dashboard() {
  const { healthRecords, dailyHealth, monthlyGoal } = useContext(HealthContext);

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Formatted date for top bar
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time matching records based on search input
  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return { meals: [], daily: [] };

    const matchingMeals = healthRecords.filter((rec) => {
      return (
        rec.meal.toLowerCase().includes(term) ||
        rec.mealType.toLowerCase().includes(term) ||
        rec.date.includes(term) ||
        rec.calories.toString().includes(term)
      );
    });

    const matchingDaily = dailyHealth.filter((d) => {
      return (
        d.date.includes(term) ||
        d.water.toString().includes(term) ||
        d.sleep.toString().includes(term)
      );
    });

    return { meals: matchingMeals, daily: matchingDaily };
  }, [searchTerm, healthRecords, dailyHealth]);

  const totalResultsCount =
    searchResults.meals.length + searchResults.daily.length;

  const totalCalories = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);

    return healthRecords
      .filter((record) => record.date.startsWith(currentMonth))
      .reduce((total, record) => total + Number(record.calories), 0);
  }, [healthRecords]);

  const averageCalories = useMemo(() => {
    if (healthRecords.length === 0) {
      return 0;
    }

    const dailyCalories = {};
    healthRecords.forEach((record) => {
      if (!dailyCalories[record.date]) {
        dailyCalories[record.date] = 0;
      }

      dailyCalories[record.date] += Number(record.calories);
    });

    const totalDays = Object.keys(dailyCalories).length;

    return Math.round(totalCalories / totalDays);
  }, [healthRecords, totalCalories]);

  const goalProgress = useMemo(() => {
    if (monthlyGoal === 0) {
      return 0;
    }

    return Math.min(
      Math.round((totalCalories / monthlyGoal) * 100),
      100
    );
  }, [totalCalories, monthlyGoal]);

  const remainingCalories = useMemo(() => {
    return Math.max(monthlyGoal - totalCalories, 0);
  }, [monthlyGoal, totalCalories]);

  const totalWater = useMemo(() => {
    return dailyHealth.reduce(
      (total, record) => total + Number(record.water),
      0
    );
  }, [dailyHealth]);

  const averageSleep = useMemo(() => {
    if (dailyHealth.length === 0) {
      return 0;
    }

    const totalSleep = dailyHealth.reduce(
      (total, record) => total + Number(record.sleep),
      0
    );

    return (totalSleep / dailyHealth.length).toFixed(1);
  }, [dailyHealth]);

  // Dynamic notifications based on tracked metrics
  const notifications = useMemo(() => {
    const list = [];

    if (totalWater < 2) {
      list.push({
        id: 1,
        type: "alert",
        title: "Hydration Alert",
        message: `Only ${totalWater.toFixed(1)}L logged so far. Aim for at least 2.5L!`,
        time: "Just now",
      });
    } else {
      list.push({
        id: 1,
        type: "success",
        title: "Great Hydration!",
        message: `You've logged ${totalWater.toFixed(1)}L of water. Keep it up!`,
        time: "Today",
      });
    }

    if (monthlyGoal > 0) {
      if (goalProgress >= 80) {
        list.push({
          id: 2,
          type: "alert",
          title: "Calorie Goal Approaching",
          message: `You are at ${goalProgress}% of your monthly target.`,
          time: "Today",
        });
      } else {
        list.push({
          id: 2,
          type: "success",
          title: "Goal On Track",
          message: `${remainingCalories} kcal remaining for this month's target.`,
          time: "Today",
        });
      }
    }

    list.push({
      id: 3,
      type: "tip",
      title: "Daily Wellness Tip",
      message: "A 10-minute walk after meals helps improve digestion and mood.",
      time: "Today",
    });

    return list;
  }, [totalWater, monthlyGoal, goalProgress, remainingCalories]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        {/* Top bar with Interactive Search, Date Pill, and Notifications */}
        <div className="dashboard-topbar">
          <div className="topbar-search-wrapper" ref={searchContainerRef}>
            <div className="topbar-search">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search meals, calories, dates..."
                className="topbar-search-input"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setIsSearchOpen(false);
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Floating Live Search Dropdown */}
            {isSearchOpen && searchTerm.trim() && (
              <div className="search-dropdown-menu">
                <div className="search-results-header">
                  <span>
                    Found {totalResultsCount} result
                    {totalResultsCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="search-results-list">
                  {totalResultsCount === 0 ? (
                    <div className="search-no-results">
                      No health logs match "{searchTerm}"
                    </div>
                  ) : (
                    <>
                      {/* Meals Matches */}
                      {searchResults.meals.map((item, idx) => (
                        <div key={`meal-${idx}`} className="search-result-row">
                          <div className="search-res-icon meal-res-icon">
                            <Utensils size={14} />
                          </div>
                          <div className="search-res-info">
                            <span className="res-title">{item.meal}</span>
                            <span className="res-sub">
                              {item.mealType} • {item.date}
                            </span>
                          </div>
                          <span className="search-res-badge">
                            {item.calories} kcal
                          </span>
                        </div>
                      ))}

                      {/* Daily Health Matches */}
                      {searchResults.daily.map((d, idx) => (
                        <div key={`daily-${idx}`} className="search-result-row">
                          <div className="search-res-icon daily-res-icon">
                            <Droplets size={14} />
                          </div>
                          <div className="search-res-info">
                            <span className="res-title">{d.date} Logs</span>
                            <span className="res-sub">
                              Water: {d.water}L • Sleep: {d.sleep}h
                            </span>
                          </div>
                          <span className="search-res-badge daily-badge">
                            Daily
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="topbar-actions">
            <div className="topbar-date-pill">
              <Calendar size={16} className="date-icon" />
              <span>{todayFormatted}</span>
            </div>

            <div className="notification-wrapper">
              <button
                type="button"
                className={`topbar-bell-btn ${showNotifications ? "active" : ""}`}
                title="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="bell-badge-dot"></span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Notifications ({notifications.length})</h4>
                    <button
                      type="button"
                      className="close-notif-btn"
                      onClick={() => setShowNotifications(false)}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="notification-list">
                    {notifications.map((item) => (
                      <div key={item.id} className="notification-item">
                        <div className={`notif-icon notif-${item.type}`}>
                          {item.type === "alert" ? (
                            <AlertCircle size={16} />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                        </div>
                        <div className="notif-content">
                          <div className="notif-top">
                            <span className="notif-title">{item.title}</span>
                            <span className="notif-time">{item.time}</span>
                          </div>
                          <p className="notif-message">{item.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="dashboard-label">Your Wellness Dashboard</p>

          <h1>
            Hey, Srinila!
          </h1>

          <p className="dashboard-slogan">
            Your body called. It wants better habits, not another excuse.
          </p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* 4 Top KPI Cards (Only ONE instance) */}
        <div className="summary-cards">
          <div className="summary-card calories-card">
            <div className="card-icon">
              <Flame size={24} />
            </div>

            <div>
              <p>Total Calories</p>
              <h3>{totalCalories} kcal</h3>
            </div>
          </div>

          <div className="summary-card water-card">
            <div className="card-icon">
              <Droplets size={24} />
            </div>

            <div>
              <p>Total Water</p>
              <h3>{totalWater.toFixed(1)} L</h3>
            </div>
          </div>

          <div className="summary-card sleep-card">
            <div className="card-icon">
              <Moon size={24} />
            </div>

            <div>
              <p>Average Sleep</p>
              <h3>{averageSleep} hrs</h3>
            </div>
          </div>

          <div className="summary-card tracking-card">
            <div className="card-icon">
              <BarChart3 size={24} />
            </div>

            <div>
              <p>Average Calories</p>
              <h3>{averageCalories} kcal</h3>
            </div>
          </div>
        </div>

        {/* 2-COLUMN DASHBOARD GRID */}
        <div className="dashboard-main-grid">
          {/* Left Column (Primary charts) */}
          <div className="dashboard-grid-left">
            <MealChart />
            <SleepChart />
          </div>

          {/* Right Column (Goals, Health Status & Quick Insights) */}
          <div className="dashboard-grid-right">
            <HealthStatus />
            
            {/* Goal Progress Neomorphic Card */}
            <div className="chart-card goal-progress-card">
              <div className="goal-card-header">
                <span className="goal-card-badge">Monthly Target</span>
                <span className="goal-pct-text">{goalProgress}%</span>
              </div>

              <div className="goal-radial-wrap">
                <div className="goal-circle-outer">
                  <div 
                    className="goal-circle-fill" 
                    style={{ 
                      background: `conic-gradient(#F5C842 ${goalProgress * 3.6}deg, #0A3030 0deg)` 
                    }}
                  >
                    <div className="goal-circle-inner">
                      <span className="goal-cals-num">{totalCalories}</span>
                      <span className="goal-cals-sub">/ {monthlyGoal || "Set Goal"} kcal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="goal-card-footer">
                <div className="goal-footer-item">
                  <span className="goal-foot-label">Remaining</span>
                  <span className="goal-foot-val">{remainingCalories} kcal</span>
                </div>
                <div className="goal-footer-item">
                  <span className="goal-foot-label">Target</span>
                  <span className="goal-foot-val">{monthlyGoal} kcal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;