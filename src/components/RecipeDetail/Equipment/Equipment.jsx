// Equipment.jsx
import React from "react";
import styles from "./Equipment.module.css";

export default function Equipment({ items }) {
  return (
    <section className={styles.root}>
      <h2>Equipment</h2>
      <ul className={styles.list}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </section>
  );
}
