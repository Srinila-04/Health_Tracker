import { useContext, useState } from "react";
import { HealthContext } from "../../context/HealthContext";
import HistoryItem from "./HistoryItem";
import NeoCalendar from "../health/NeoCalendar"; 
import NeoSelect from "../health/NeoSelect";
import { FileSpreadsheet } from "lucide-react";

function History() {
  const { healthRecords, setHealthRecords, dailyHealth = [] } = useContext(HealthContext);

  const todayStr = new Date().toISOString().slice(0, 10);
  const [mealType, setMealType] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const FILTER_OPTIONS = [
    { value: "", label: "All Meal Types" },
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
    { value: "Snack", label: "Snack" },
  ];

  // Delete a record by index in healthRecords
  const handleDeleteRecord = (indexToDelete) => {
    const confirmed = window.confirm("Are you sure you want to delete this meal record?");
    if (!confirmed) return;

    const updated = healthRecords.filter((_, idx) => idx !== indexToDelete);
    setHealthRecords(updated);
  };

  // Update a record by index
  const handleUpdateRecord = (indexToUpdate, newRecordData) => {
    const updated = healthRecords.map((item, idx) =>
      idx === indexToUpdate ? newRecordData : item
    );
    setHealthRecords(updated);
  };

  // Filter records while keeping track of their original index in healthRecords
  const filteredRecords = healthRecords
    .map((record, originalIndex) => ({ ...record, originalIndex }))
    .filter((record) => {
      if (mealType && record.mealType !== mealType) {
        return false;
      }
      if (selectedDate && record.date !== selectedDate) {
        return false;
      }
      return true;
    });

  // Calculate total calories for currently filtered records
  const filteredCaloriesTotal = filteredRecords.reduce(
    (acc, curr) => acc + Number(curr.calories || 0),
    0
  );

  // Pure Frontend Excel/CSV Report Generator
  const handleDownloadExcelReport = () => {
    if (healthRecords.length === 0 && dailyHealth.length === 0) {
      alert("No health records found to export.");
      return;
    }

    // 1. Calculate overall summary statistics
    const totalCals = healthRecords.reduce((acc, r) => acc + Number(r.calories || 0), 0);
    const totalWater = dailyHealth.reduce((acc, d) => acc + Number(d.water || 0), 0);
    const avgSleep = dailyHealth.length > 0 
      ? (dailyHealth.reduce((acc, d) => acc + Number(d.sleep || 0), 0) / dailyHealth.length).toFixed(1) 
      : "0";

    // 2. Build Structured Spreadsheet Content
    let csvRows = [];

    // Title & Metadata
    csvRows.push(["HEALTH & WELLNESS WEEKLY REPORT"]);
    csvRows.push([`Generated On: ${todayStr}`, `User: Srinila`]);
    csvRows.push([]); // Empty row separator

    // High-Level Summary Block
    csvRows.push(["=== SUMMARY OVERVIEW ==="]);
    csvRows.push(["Total Meals Logged", healthRecords.length]);
    csvRows.push(["Total Calories Consumed", `${totalCals} kcal`]);
    csvRows.push(["Total Water Consumed", `${totalWater.toFixed(1)} Litres`]);
    csvRows.push(["Average Sleep Duration", `${avgSleep} Hours / Night`]);
    csvRows.push([]); // Empty row separator

    // Detailed Meals Table
    csvRows.push(["=== MEAL LOGS BREAKDOWN ==="]);
    csvRows.push(["Date", "Meal Name", "Meal Category", "Calories (kcal)"]);
    healthRecords.forEach((r) => {
      csvRows.push([r.date, `"${r.meal.replace(/"/g, '""')}"`, r.mealType, r.calories]);
    });
    csvRows.push([]); // Empty row separator

    // Daily Hydration & Sleep Table
    csvRows.push(["=== DAILY HYDRATION & SLEEP LOGS ==="]);
    csvRows.push(["Date", "Water Intake (L)", "Sleep (Hours)"]);
    dailyHealth.forEach((d) => {
      csvRows.push([d.date, d.water, d.sleep]);
    });

    // 3. Convert array to CSV string with UTF-8 BOM so Excel displays symbols properly
    const csvString = "\uFEFF" + csvRows.map((row) => row.join(",")).join("\r\n");

    // 4. Trigger Instant Browser Download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `HealthTrack_Report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chart-card history-compound-card">
      {/* Header with Stats Strip */}
      <div className="history-card-top">
        <div>
          <h3 className="chart-title" style={{ marginBottom: "4px" }}>
            Meal History & Logs
          </h3>
          <p className="history-card-sub">Review, edit, or export your daily records</p>
        </div>

        <div className="history-summary-strip">
          <span className="strip-item gold-text">
            <strong>{filteredCaloriesTotal}</strong> kcal
          </span>
          <span className="strip-dot">•</span>
          <span className="strip-item">
            <strong>{filteredRecords.length}</strong> {filteredRecords.length === 1 ? "meal" : "meals"}
          </span>
        </div>
      </div>

      {/* Filter Row Controls */}
      <div className="history-filter-row">
        {/* 1. Meal Type Dropdown Filter */}
        <div className="history-filter-item select-filter">
          <NeoSelect
            value={mealType}
            onChange={(val) => setMealType(val)}
            options={FILTER_OPTIONS}
            placeholder="All Meal Types"
          />
        </div>

        {/* 2. Custom Calendar Filter */}
        <div className="history-filter-item date-filter">
          <NeoCalendar
            value={selectedDate}
            onChange={(d) => setSelectedDate(d)}
            placeholder="Filter by date"
          />
        </div>

        {/* 3. Reset Button */}
        <button
          className="neo-btn-secondary filter-clear-btn"
          type="button"
          onClick={() => {
            setSelectedDate(todayStr);
            setMealType("");
          }}
        >
          Reset Today
        </button>

        {/* 4. Download Excel Report */}
        <button
          className="neo-btn-secondary download-excel-btn"
          type="button"
          onClick={handleDownloadExcelReport}
          title="Download formatted spreadsheet report"
        >
          <FileSpreadsheet size={16} />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Records List or Clean Empty State */}
      <div className="history-records-list">
        {filteredRecords.length === 0 ? (
          <div className="history-empty-state">
            <p className="empty-state-title">
              No meals recorded for {selectedDate || "selected filters"}
            </p>
            <p className="empty-state-sub">
              Log your breakfast, lunch, or dinner to track daily progress!
            </p>
            <a href="#log-health" className="neo-btn-primary empty-action-btn">
              + Log a Meal Now
            </a>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <HistoryItem
              key={record.originalIndex}
              index={record.originalIndex}
              record={record}
              onDelete={handleDeleteRecord}
              onUpdate={handleUpdateRecord}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default History;