// src/components/RecipeForm/InstructionsSection.jsx
import React from "react";
import styles from "./RecipeForm.module.css";

export default function InstructionsSection({
  groups,
  handleAddInstrGroup,
  handleRemoveInstrGroup,
  handleInstrGroupName,
  handleAddStep,
  handleRemoveStep,
  handleStepChange,
}) {
  return (
    <section className={styles.section}>
      <h3>Instructions</h3>
      {groups.map((g, gi) => (
        <div key={gi} className={styles.group}>
          <div className={styles.groupHeader}>
            <input
              placeholder="step group"
              value={g.name}
              onChange={(e) => handleInstrGroupName(gi, e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveInstrGroup(gi)}>
              ×
            </button>
          </div>
          {g.steps.map((s, si) => (
            <div key={si} className={styles.itemRow}>
              <input
                placeholder="step description"
                value={s}
                onChange={(e) => handleStepChange(gi, si, e.target.value)}
              />
              <button type="button" onClick={() => handleRemoveStep(gi, si)}>
                –
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddStep(gi)}>
            + Add Step
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddInstrGroup}>
        + Add Instruction Group
      </button>
    </section>
  );
}
