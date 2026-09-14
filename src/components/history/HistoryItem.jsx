import { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import NeoSelect from "../health/NeoSelect";

const MEAL_OPTIONS = [
  { value: "Breakfast", label: "Breakfast" },
  { value: "Lunch", label: "Lunch" },
  { value: "Dinner", label: "Dinner" },
  { value: "Snack", label: "Snack" },
];

function HistoryItem({ record, index, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState({ ...record });

  const handleSave = () => {
    if (!editedRecord.meal.trim() || Number(editedRecord.calories) <= 0) {
      alert("Please enter valid meal details and calories greater than 0");
      return;
    }
    onUpdate(index, editedRecord);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRecord({ ...record });
    setIsEditing(false);
  };

  return (
    <div className={`history-item ${isEditing ? "editing" : ""}`}>
      {isEditing ? (
        /* Inline Edit Mode */
        <div className="history-edit-form">
          <div className="history-edit-row">
            <input
              type="text"
              className="neo-input"
              value={editedRecord.meal}
              onChange={(e) =>
                setEditedRecord({ ...editedRecord, meal: e.target.value })
              }
              placeholder="Meal Name"
            />
            <div style={{ flex: 1, minWidth: "140px" }}>
              <NeoSelect
                value={editedRecord.mealType}
                onChange={(val) =>
                  setEditedRecord({ ...editedRecord, mealType: val })
                }
                options={MEAL_OPTIONS}
                placeholder="Select meal type"
              />
            </div>
          </div>

          <div className="history-edit-row">
            <input
              type="number"
              className="neo-input"
              value={editedRecord.calories}
              onChange={(e) =>
                setEditedRecord({ ...editedRecord, calories: e.target.value })
              }
              placeholder="Calories"
            />
            <div className="history-edit-actions">
              <button
                type="button"
                className="history-action-btn btn-save"
                onClick={handleSave}
                title="Save"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                className="history-action-btn btn-cancel"
                onClick={handleCancel}
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Normal View Mode */
        <div className="history-item-content">
          <div className="history-item-info">
            <div className="history-item-header">
              <h3 className="history-item-title">{record.meal}</h3>
              <span className="history-type-chip">{record.mealType}</span>
            </div>
            <p className="history-item-detail">Date: {record.date}</p>
            <p className="history-item-cals">{record.calories} kcal</p>
          </div>

          {/* Edit & Delete Action Buttons */}
          <div className="history-item-buttons">
            <button
              type="button"
              className="history-action-btn btn-edit"
              onClick={() => setIsEditing(true)}
              title="Edit Record"
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              className="history-action-btn btn-delete"
              onClick={() => onDelete(index)}
              title="Delete Record"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryItem;