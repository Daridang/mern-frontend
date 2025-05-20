// src/components/RecipeForm/IngredientsSection.jsx
import React from "react";
import styles from "./RecipeForm.module.css";

export default function IngredientsSection({
  groups,
  handleAddGroup,
  handleRemoveGroup,
  handleGroupNameChange,
  handleAddItem,
  handleRemoveItem,
  handleItemChange,
}) {
  return (
    <section className={styles.section}>
      <h3>Ingredients</h3>
      {groups.map((g, gi) => (
        <div key={gi} className={styles.group}>
          <div className={styles.groupHeader}>
            <input
              placeholder="group name"
              value={g.name}
              onChange={(e) => handleGroupNameChange(gi, e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveGroup(gi)}>
              ×
            </button>
          </div>
          {g.items.map((it, ii) => (
            <div key={ii} className={styles.itemRow}>
              <input
                placeholder="item"
                value={it.item}
                onChange={(e) =>
                  handleItemChange(gi, ii, "item", e.target.value)
                }
              />
              <input
                placeholder="amount"
                value={it.amount}
                onChange={(e) =>
                  handleItemChange(gi, ii, "amount", e.target.value)
                }
              />
              <button type="button" onClick={() => handleRemoveItem(gi, ii)}>
                –
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddItem(gi)}>
            + Add Item
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddGroup}>
        + Add Group
      </button>
    </section>
  );
}
