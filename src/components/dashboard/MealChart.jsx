import { useContext, useMemo } from "react";
import { HealthContext } from "../../context/HealthContext";
import { Coffee, Sun, Moon, Apple, UtensilsCrossed } from "lucide-react";

const MEAL_CONFIG = {
  Breakfast: {
    icon: Coffee,
    color: "#F5C842", // Golden
    glow: "rgba(245, 200, 66, 0.2)",
    label: "Breakfast",
  },
  Lunch: {
    icon: Sun,
    color: "#20D5C4", // Teal
    glow: "rgba(32, 213, 196, 0.2)",
    label: "Lunch",
  },
  Dinner: {
    icon: Moon,
    color: "#FF6B8A", // Coral
    glow: "rgba(255, 107, 138, 0.2)",
    label: "Dinner",
  },
  Snack: {
    icon: Apple,
    color: "#A78BFA", // Lavender
    glow: "rgba(167, 139, 250, 0.2)",
    label: "Snack",
  },
};

function MealChart() {
  const { healthRecords } = useContext(HealthContext);

  const mealStats = useMemo(() => {
    const stats = {
      Breakfast: { count: 0, calories: 0 },
      Lunch: { count: 0, calories: 0 },
      Dinner: { count: 0, calories: 0 },
      Snack: { count: 0, calories: 0 },
    };

    let totalMeals = 0;
    let totalCalories = 0;

    healthRecords.forEach((record) => {
      const type = record.mealType;
      if (stats[type]) {
        stats[type].count += 1;
        stats[type].calories += Number(record.calories) || 0;
        totalMeals += 1;
        totalCalories += Number(record.calories) || 0;
      }
    });

    return { stats, totalMeals, totalCalories };
  }, [healthRecords]);

  return (
    <div className="chart-card meal-overview-card">
      <div className="meal-card-top">
        <div className="meal-title-group">
          <div className="meal-header-icon">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <h3 className="chart-title" style={{ marginBottom: "2px" }}>
              Meal Distribution & Calories
            </h3>
            <p className="meal-subtitle">Breakdown by meal category</p>
          </div>
        </div>

        <div className="meal-stats-pill">
          <span className="pill-calories">
            {mealStats.totalCalories.toLocaleString()} kcal
          </span>
          <span className="pill-dot">•</span>
          <span className="pill-count">{mealStats.totalMeals} logs</span>
        </div>
      </div>

      {mealStats.totalMeals === 0 ? (
        <p className="chart-empty">No meal records logged yet. Add your first meal!</p>
      ) : (
        <>
          {/* Multi-Segment Stacked Progress Bar */}
          <div className="segmented-bar-track">
            {Object.keys(MEAL_CONFIG).map((type) => {
              const count = mealStats.stats[type].count;
              const pct = mealStats.totalMeals > 0 ? (count / mealStats.totalMeals) * 100 : 0;
              if (pct === 0) return null;

              return (
                <div
                  key={type}
                  className="bar-segment"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: MEAL_CONFIG[type].color,
                    boxShadow: `0 0 10px ${MEAL_CONFIG[type].color}80`,
                  }}
                  title={`${type}: ${Math.round(pct)}%`}
                />
              );
            })}
          </div>

          {/* 4 Interactive Neomorphic Meal Cards */}
          <div className="meal-category-grid">
            {Object.keys(MEAL_CONFIG).map((type) => {
              const config = MEAL_CONFIG[type];
              const IconComponent = config.icon;
              const data = mealStats.stats[type];
              const pct =
                mealStats.totalMeals > 0
                  ? Math.round((data.count / mealStats.totalMeals) * 100)
                  : 0;

              return (
                <div key={type} className="meal-cat-item">
                  <div className="cat-item-top">
                    <div
                      className="cat-icon-badge"
                      style={{
                        color: config.color,
                        background: config.glow,
                      }}
                    >
                      <IconComponent size={18} />
                    </div>
                    <span className="cat-pct-chip" style={{ color: config.color }}>
                      {pct}%
                    </span>
                  </div>

                  <div className="cat-item-body">
                    <h4 className="cat-name">{config.label}</h4>
                    <div className="cat-metrics">
                      <span className="cat-count">{data.count} meals</span>
                      <span className="cat-cals">{data.calories} kcal</span>
                    </div>
                  </div>

                  {/* Micro bottom progress line */}
                  <div className="cat-micro-bar">
                    <div
                      className="cat-micro-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default MealChart;