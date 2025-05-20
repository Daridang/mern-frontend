// src/components/RecipeForm/ExtrasSection.jsx
import React from "react";
import styles from "./RecipeForm.module.css";

export default function ExtrasSection({
  extras,
  handleAddExtra,
  handleRemoveExtra,
  handleExtraChange,
}) {
  return (
    <section className={styles.section}>
      <h3>Extras</h3>
      {extras.map((ex, i) => (
        <div key={i} className={styles.listRow}>
          <input
            value={ex}
            onChange={(e) => handleExtraChange(i, e.target.value)}
          />
          <button type="button" onClick={() => handleRemoveExtra(i)}>
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddExtra}>
        + Add Extra
      </button>
    </section>
  );
}
