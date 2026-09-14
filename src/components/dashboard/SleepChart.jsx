import { useContext, useMemo, useState } from "react";
import { HealthContext } from "../../context/HealthContext";
import { Moon, Star, ChevronLeft, ChevronRight } from "lucide-react";

function SleepChart() {
  const { dailyHealth = [] } = useContext(HealthContext);

  // Week offset: 0 = current week, -1 = last week, etc.
  const [weekOffset, setWeekOffset] = useState(0);

  // Helper to format Date object into "DD-MM-YYYY"
  const formatDDMMYYYY = (dateObj) => {
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // Generate exactly 7 consecutive days (Sunday to Saturday)
  const weekDays = useMemo(() => {
    const days = [];
    const now = new Date();
    // Shift by weekOffset (7 days each step)
    now.setDate(now.getDate() + weekOffset * 7);

    // Find Sunday of this week (0 = Sunday)
    const currentDay = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - currentDay);

    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);

      const dateStr = d.toISOString().slice(0, 10); // "YYYY-MM-DD" for lookup
      const displayDate = formatDDMMYYYY(d); // "DD-MM-YYYY"
      const shortDayName = d.toLocaleDateString("en-US", { weekday: "short" }); // Sun, Mon...

      // Find log in dailyHealth
      const record = dailyHealth.find((item) => item.date === dateStr);
      const hours = record ? Number(record.sleep) : null;

      days.push({
        dateStr,
        displayDate,
        shortDayName,
        dayNum: String(d.getDate()).padStart(2, "0"),
        hours,
      });
    }

    return days;
  }, [weekOffset, dailyHealth]);

  // Week range label formatted strictly as "DD-MM-YYYY to DD-MM-YYYY"
  const weekRangeLabel = useMemo(() => {
    if (weekDays.length < 7) return "";
    return `${weekDays[0].displayDate} to ${weekDays[6].displayDate}`;
  }, [weekDays]);

  // Statistics for this exact 7-day window
  const stats = useMemo(() => {
    const loggedNights = weekDays.filter((d) => d.hours !== null && d.hours > 0);
    if (loggedNights.length === 0) {
      return { avg: "0", best: "0", optimalPct: 0 };
    }

    const total = loggedNights.reduce((acc, curr) => acc + curr.hours, 0);
    const avg = (total / loggedNights.length).toFixed(1);
    const best = Math.max(...loggedNights.map((d) => d.hours)).toFixed(1);
    const optimalCount = loggedNights.filter((d) => d.hours >= 7 && d.hours <= 9).length;
    const optimalPct = Math.round((optimalCount / loggedNights.length) * 100);

    return { avg, best, optimalPct };
  }, [weekDays]);

  const getPillColor = (hours) => {
    if (hours === null) return "transparent";
    if (hours >= 7 && hours <= 9) return "#F5C842"; // Golden (Optimal)
    if (hours > 9) return "#20D5C4";                // Teal (Long Rest)
    if (hours >= 6) return "#A78BFA";               // Lavender (Fair)
    return "#FF6B8A";                               // Coral (Short Sleep)
  };

  return (
    <div className="chart-card sleep-capsule-card">
      {/* Top Header */}
      <div className="sleep-capsule-header">
        <div className="sleep-header-left">
          <div className="sleep-icon-box">
            <Moon size={18} />
          </div>
          <div>
            <h3 className="chart-title" style={{ marginBottom: "2px" }}>
              Sleep Consistency
            </h3>
            <p className="sleep-header-sub">7-Day Weekly Tracking</p>
          </div>
        </div>

        {/* Adjustable Week Switcher */}
        <div className="sleep-week-switcher">
          <button
            type="button"
            className="week-switch-btn"
            onClick={() => setWeekOffset((prev) => prev - 1)}
            title="Previous Week"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="week-range-text">{weekRangeLabel}</span>
          <button
            type="button"
            className="week-switch-btn"
            onClick={() => setWeekOffset((prev) => prev + 1)}
            disabled={weekOffset >= 0}
            title="Next Week"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* 3 Summary metric chips */}
        <div className="sleep-summary-chips">
          <div className="sleep-chip">
            <span className="chip-label">Avg Sleep</span>
            <span className="chip-val">{stats.avg} hrs</span>
          </div>
          <div className="sleep-chip">
            <span className="chip-label">Best Night</span>
            <span className="chip-val chip-gold">{stats.best} hrs</span>
          </div>
          <div className="sleep-chip">
            <span className="chip-label">Consistency</span>
            <span className="chip-val chip-teal">{stats.optimalPct}%</span>
          </div>
        </div>
      </div>

      <div className="capsule-track-container">
        {/* 8h Target Guideline */}
        <div className="target-guideline">
          <div className="target-guide-line"></div>
        </div>

        {/* Exactly 7 Vertical Pillar Columns */}
        <div className="capsule-columns-grid">
          {weekDays.map((item, idx) => {
            const hasData = item.hours !== null;
            const hours = hasData ? item.hours : 0;
            const heightPct = hasData ? Math.min((hours / 12) * 100, 100) : 0;
            const color = getPillColor(item.hours);
            const isOptimal = hasData && hours >= 7 && hours <= 9;

            return (
              <div key={idx} className="capsule-col">
                {/* Hours badge */}
                <span
                  className="capsule-hrs"
                  style={{ color: hasData ? (isOptimal ? color : "#E8F4F8") : "#4A7A7A" }}
                >
                  {hasData ? `${hours}h` : "--"}
                </span>

                {/* Sunken track groove */}
                <div
                  className="capsule-groove"
                  title={`${item.shortDayName} (${item.displayDate}): ${hasData ? `${hours} hrs` : "No log"}`}
                >
                  {hasData && (
                    <div
                      className="capsule-fill"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}80`,
                      }}
                    >
                      {isOptimal && (
                        <Star size={10} className="optimal-star-icon" />
                      )}
                    </div>
                  )}
                </div>

                {/* Day name & date number */}
                <div className="capsule-date-box">
                  <span className="capsule-day-name">{item.shortDayName}</span>
                  <span className="capsule-date">{item.dayNum}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Color Legend */}
        <div className="capsule-legend">
          <div className="legend-chip">
            <span className="chip-dot" style={{ background: "#F5C842" }}></span>
            <span>Optimal (7–9h)</span>
          </div>
          <div className="legend-chip">
            <span className="chip-dot" style={{ background: "#A78BFA" }}></span>
            <span>Fair (6–7h)</span>
          </div>
          <div className="legend-chip">
            <span className="chip-dot" style={{ background: "#FF6B8A" }}></span>
            <span>Short (&lt;6h)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SleepChart;