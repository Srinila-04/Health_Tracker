import { useContext, useEffect, useRef, useState } from "react";
import { HealthContext } from "../../context/HealthContext";
import { AlertCircle } from "lucide-react";
import NeoCalendar from "./NeoCalendar"; 
import NeoSelect from "./NeoSelect";

function HealthForm() {
  const mealInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (mealInputRef.current) {
      mealInputRef.current.focus();
    }
  }, []);

  const [formData, setFormData] = useState({
    date: "",
    meal: "",
    mealType: "",
    calories: "",
  });

  const { healthRecords, setHealthRecords } = useContext(HealthContext);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errorMessage) setErrorMessage(""); // Clear error when typing
  };

  const handleDateChange = (selectedDate) => {
    setFormData({
      ...formData,
      date: selectedDate,
    });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.date) {
      setErrorMessage("Please select a date from the calendar");
      return;
    }

    if (!formData.meal.trim()) {
      setErrorMessage("Please enter the name of your meal");
      return;
    }

    if (!formData.mealType) {
      setErrorMessage("Please choose a meal category (Breakfast, Lunch, etc.)");
      return;
    }

    if (!formData.calories || Number(formData.calories) <= 0) {
      setErrorMessage("Calories must be a number greater than 0");
      return;
    }

    setHealthRecords([...healthRecords, formData]);

    setFormData({
      date: "",
      meal: "",
      mealType: "",
      calories: "",
    });
    setErrorMessage("");
    mealInputRef.current.focus();
  };

  const MEAL_OPTIONS = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
    { value: "Snack", label: "Snack" },
  ];

  return (
    <form onSubmit={handleSubmit} className="neo-form">
      {/* In-form error message banner */}
      {errorMessage && (
        <div className="form-error-banner">
          <AlertCircle size={16} className="form-error-icon" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Date</label>
        <NeoCalendar
          value={formData.date}
          onChange={handleDateChange}
          placeholder="Pick a date"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Meal</label>
        <input
          className="neo-input"
          type="text"
          name="meal"
          placeholder="Example: Rice and Chicken"
          value={formData.meal}
          onChange={handleChange}
          ref={mealInputRef}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Meal Type</label>
        <NeoSelect
          value={formData.mealType}
          onChange={(val) => {
            setFormData({ ...formData, mealType: val });
            if (errorMessage) setErrorMessage("");
          }}
          options={MEAL_OPTIONS}
          placeholder="Select meal type"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Calories</label>
        <input
          className="neo-input"
          type="number"
          name="calories"
          placeholder="Enter calories"
          value={formData.calories}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="neo-btn-primary">
        Add Health Record
      </button>
    </form>
  );
}

export default HealthForm;