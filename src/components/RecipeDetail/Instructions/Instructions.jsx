// Instructions.jsx
import React from "react";
import styles from "./Instructions.module.css";

export default function Instructions({ groups }) {
  return (
    <section className={styles.root}>
      <h2>Instructions</h2>
      {groups.map((g) => (
        <ol key={g.name} className={styles.steps}>
          {g.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      ))}
    </section>
  );
}
