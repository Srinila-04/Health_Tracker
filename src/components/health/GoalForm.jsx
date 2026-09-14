import { useContext, useState } from "react";
import { HealthContext } from "../../context/HealthContext";
import { AlertCircle } from "lucide-react";

function GoalForm() {
  const [goal, setGoal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setMonthlyGoal } = useContext(HealthContext);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!goal || Number(goal) <= 0) {
      setErrorMessage("Please enter a valid monthly calorie goal (e.g. 50000)");
      return;
    }

    setMonthlyGoal(Number(goal));
    setGoal("");
    setErrorMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="neo-form">
      <h3 className="form-heading">Monthly Calorie Goal</h3>

      {errorMessage && (
        <div className="form-error-banner">
          <AlertCircle size={16} className="form-error-icon" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Calorie Target</label>
        <input
          className="neo-input"
          type="number"
          placeholder="Example: 50000"
          value={goal}
          onChange={(event) => {
            setGoal(event.target.value);
            if (errorMessage) setErrorMessage("");
          }}
        />
      </div>

      <button type="submit" className="neo-btn-primary">
        Set Monthly Goal
      </button>
    </form>
  );
}

export default GoalForm;