import { useContext, useMemo } from "react";
import { HealthContext } from "../../context/HealthContext";
import { Activity, ShieldCheck, Heart } from "lucide-react";

function HealthStatus() {
  const { healthRecords, dailyHealth } = useContext(HealthContext);

  const healthStatus = useMemo(() => {
    const dates = [
      ...new Set([
        ...healthRecords.map((record) => record.date),
        ...dailyHealth.map((record) => record.date),
      ]),
    ];

    const healthyDays = dates.filter((date) => {
      const hasCalories = healthRecords.some(
        (record) => record.date === date && Number(record.calories) > 0
      );
      const hasWater = dailyHealth.some(
        (record) => record.date === date && Number(record.water) > 0
      );
      const hasSleep = dailyHealth.some(
        (record) => record.date === date && Number(record.sleep) > 0
      );

      return hasCalories && hasWater && hasSleep;
    });

    const isHealthy = healthyDays.length === dates.length && dates.length > 0;
    const status = isHealthy ? "Optimal Habits" : "Keep Tracking";
    const healthScore = dates.length > 0 ? Math.round((healthyDays.length / dates.length) * 100) : 0;

    return {
      status,
      healthyDays: healthyDays.length,
      totalDays: dates.length,
      healthScore,
    };
  }, [healthRecords, dailyHealth]);

  return (
    <div className="chart-card health-score-widget">
      <div className="score-widget-top">
        <div className="score-icon-wrap">
          <Activity size={20} />
        </div>
        <div>
          <h3 className="chart-title" style={{ marginBottom: "2px" }}>Wellness Score</h3>
          <p className="score-subtitle">Habit consistency tracking</p>
        </div>
      </div>

      <div className="score-main-display">
        <div className="score-number-box">
          <span className="score-big">{healthStatus.healthScore}</span>
          <span className="score-denom">/ 100</span>
        </div>
        <div className="score-status-tag">
          <ShieldCheck size={14} className="tag-shield" />
          <span>{healthStatus.status}</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${healthStatus.healthScore}%` }}
        />
      </div>

      <div className="score-stats-grid">
        <div className="score-stat-chip">
          <span className="stat-chip-label">Perfect Days</span>
          <span className="stat-chip-val">{healthStatus.healthyDays} / {healthStatus.totalDays || 0}</span>
        </div>
        <div className="score-stat-chip">
          <span className="stat-chip-label">Daily Goal</span>
          <span className="stat-chip-val gold-text">3 of 3 habits</span>
        </div>
      </div>
    </div>
  );
}

export default HealthStatus;