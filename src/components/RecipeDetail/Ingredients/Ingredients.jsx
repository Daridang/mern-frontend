// Ingredients.jsx
import React from "react";
import styles from "./Ingredients.module.css";

export default function Ingredients({ groups }) {
  return (
    <section className={styles.root}>
      <h2>Ingredients</h2>
      {groups.map((g) => (
        <div key={g.name} className={styles.group}>
          <h3 className={styles.groupTitle}>{g.name.replace("_", " ")}</h3>
          <ul>
            {g.items.map((it, i) => (
              <li key={i}>
                {it.amount} — {it.item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
