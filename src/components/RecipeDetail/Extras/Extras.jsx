// Extras.jsx
import React from "react";
import styles from "./Extras.module.css";

export default function Extras({ items }) {
  return (
    <section className={styles.root}>
      <h2>Extras</h2>
      <ul className={styles.list}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </section>
  );
}
