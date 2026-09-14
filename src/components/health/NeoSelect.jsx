import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

function NeoSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="neo-custom-select" ref={containerRef}>
      {/* Trigger pill */}
      <button
        type="button"
        className={`neo-select-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "trigger-text" : "trigger-placeholder"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`select-chevron ${isOpen ? "rotate" : ""}`}
        />
      </button>

      {/* Neomorphic Dropdown Menu */}
      {isOpen && (
        <div className="neo-select-menu">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                className={`neo-select-option ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {isSelected && <span className="option-check">✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NeoSelect;