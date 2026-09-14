import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

function NeoCalendar({ value, onChange, placeholder = "Select a date" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);

  // Close calendar if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = (e) => {
    e.preventDefault();
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    setViewDate(new Date(year, month + 1, 1));
  };

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const handleSelectDay = (day) => {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="neo-calendar-container" ref={containerRef}>
      <button
        type="button"
        className={`neo-calendar-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "trigger-date-text" : "trigger-placeholder"}>
          {value || placeholder}
        </span>
        <CalendarIcon size={18} className="trigger-calendar-icon" />
      </button>

      {isOpen && (
        <div className="neo-calendar-popover">
          <div className="calendar-nav-header">
            <button type="button" className="cal-nav-btn" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
            <span className="cal-month-title">
              {monthNames[month]} {year}
            </span>
            <button type="button" className="cal-nav-btn" onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="calendar-weekdays">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
              <span key={i} className="cal-weekday">{day}</span>
            ))}
          </div>

          <div className="calendar-days-grid">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="cal-day-cell empty" />
            ))}

            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedMonth = String(month + 1).padStart(2, "0");
              const formattedDay = String(dayNum).padStart(2, "0");
              const cellDateStr = `${year}-${formattedMonth}-${formattedDay}`;

              const isSelected = value === cellDateStr;
              const isToday = todayStr === cellDateStr;

              return (
                <button
                  key={dayNum}
                  type="button"
                  className={`cal-day-cell ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                  onClick={() => handleSelectDay(dayNum)}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default NeoCalendar;