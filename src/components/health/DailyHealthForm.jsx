import { useContext, useState, useEffect } from "react";
import { HealthContext } from "../../context/HealthContext";
import { AlertCircle, Trash2 } from "lucide-react";
import NeoCalendar from "./NeoCalendar";

function DailyHealthForm() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [errorMessage, setErrorMessage] = useState("");
  const [dailyData, setDailyData] = useState({
    date: todayStr,
    water: "",
    sleep: "",
  });

  const { dailyHealth = [], setDailyHealth } = useContext(HealthContext);

  // Check if a record already exists for the selected date
  const existingRecord = dailyHealth.find((item) => item.date === dailyData.date);
  const isEditing = Boolean(existingRecord);

  // When date changes, auto-load existing values if logged previously
  useEffect(() => {
    if (existingRecord) {
      setDailyData({
        date: existingRecord.date,
        water: existingRecord.water,
        sleep: existingRecord.sleep,
      });
    } else {
      setDailyData((prev) => ({
        ...prev,
        water: "",
        sleep: "",
      }));
    }
  }, [dailyData.date, dailyHealth]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDailyData({
      ...dailyData,
      [name]: value,
    });
    if (errorMessage) setErrorMessage("");
  };

  const handleDateChange = (selectedDate) => {
    setDailyData({
      ...dailyData,
      date: selectedDate,
    });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!dailyData.date) {
      setErrorMessage("Please select a date from the calendar");
      return;
    }

    if (!dailyData.water || Number(dailyData.water) <= 0) {
      setErrorMessage("Please enter a valid water intake (e.g. 2.5)");
      return;
    }

    if (
      !dailyData.sleep ||
      Number(dailyData.sleep) <= 0 ||
      Number(dailyData.sleep) > 24
    ) {
      setErrorMessage("Sleep hours must be between 0 and 24");
      return;
    }

    if (isEditing) {
      // Update existing record for this date
      const updatedList = dailyHealth.map((item) =>
        item.date === dailyData.date ? dailyData : item
      );
      setDailyHealth(updatedList);
    } else {
      // Create new record for this date
      setDailyHealth([...dailyHealth, dailyData]);
    }

    setErrorMessage("");
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete water and sleep record for ${dailyData.date}?`
    );
    if (!confirmed) return;

    const filtered = dailyHealth.filter((item) => item.date !== dailyData.date);
    setDailyHealth(filtered);
    setDailyData({
      date: dailyData.date,
      water: "",
      sleep: "",
    });
    setErrorMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="neo-form">
      {errorMessage && (
        <div className="form-error-banner">
          <AlertCircle size={16} className="form-error-icon" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Date Picker */}
      <div className="form-group">
        <label className="form-label">Date</label>
        <NeoCalendar
          value={dailyData.date}
          onChange={handleDateChange}
          placeholder="Pick a date"
        />
      </div>

      {/* Water input */}
      <div className="form-group">
        <label className="form-label">Water (Litres)</label>
        <input
          className="neo-input"
          type="number"
          step="0.1"
          name="water"
          placeholder="Example: 2.5"
          value={dailyData.water}
          onChange={handleChange}
        />
      </div>

      {/* Sleep input */}
      <div className="form-group">
        <label className="form-label">Sleep (Hours)</label>
        <input
          className="neo-input"
          type="number"
          step="0.5"
          name="sleep"
          placeholder="Example: 7.5"
          value={dailyData.sleep}
          onChange={handleChange}
        />
      </div>

      {/* Action buttons: Save/Update + Delete button if record exists */}
      <div className="daily-form-actions">
        <button type="submit" className="neo-btn-primary">
          {isEditing ? "Update Daily Health" : "Save Daily Health"}
        </button>

        {isEditing && (
          <button
            type="button"
            className="daily-delete-btn"
            onClick={handleDelete}
            title="Delete this date's entry"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        )}
      </div>
    </form>
  );
}

export default DailyHealthForm;