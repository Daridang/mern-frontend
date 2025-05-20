// src/components/RecipeForm/EquipmentSection.jsx
import React from "react";
import styles from "./RecipeForm.module.css";

export default function EquipmentSection({
  equipment,
  handleAddEquipment,
  handleRemoveEquipment,
  handleEquipmentChange,
}) {
  return (
    <section className={styles.section}>
      <h3>Equipment</h3>
      {equipment.map((eq, i) => (
        <div key={i} className={styles.listRow}>
          <input
            value={eq}
            onChange={(e) => handleEquipmentChange(i, e.target.value)}
          />
          <button type="button" onClick={() => handleRemoveEquipment(i)}>
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddEquipment}>
        + Add Equipment
      </button>
    </section>
  );
}
