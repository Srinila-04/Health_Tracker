import { createContext, useEffect, useState } from "react";

export const HealthContext = createContext();

function HealthProvider({ children }) {
  const [healthRecords, setHealthRecords] = useState([]);
  const [dailyHealth, setDailyHealth] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedRecords = localStorage.getItem("healthRecords");
    const savedDailyHealth = localStorage.getItem("dailyHealth");
    const savedGoal = localStorage.getItem("monthlyGoal");

    if (savedRecords) {
      setHealthRecords(JSON.parse(savedRecords));
    }

    if (savedDailyHealth) {
      setDailyHealth(JSON.parse(savedDailyHealth));
    }

    if (savedGoal) {
      setMonthlyGoal(Number(savedGoal));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(
      "healthRecords",
      JSON.stringify(healthRecords)
    );

    localStorage.setItem(
      "dailyHealth",
      JSON.stringify(dailyHealth)
    );

    localStorage.setItem(
      "monthlyGoal",
      monthlyGoal
    );
  }, [healthRecords, dailyHealth, monthlyGoal, isLoaded]);

  return (
    <HealthContext.Provider
      value={{
        healthRecords,
        setHealthRecords,
        dailyHealth,
        setDailyHealth,
        monthlyGoal,
        setMonthlyGoal,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export default HealthProvider;