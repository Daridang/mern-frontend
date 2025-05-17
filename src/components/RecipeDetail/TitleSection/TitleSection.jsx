// TitleSection.jsx
import React from "react";
import styles from "./TitleSection.module.css";

export default function TitleSection({ title, description }) {
  return (
    <section className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.desc}>{description}</p>
    </section>
  );
}
