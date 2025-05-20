// src/components/RecipeForm/BasicInfo.jsx
import React from "react";
import styles from "./RecipeForm.module.css";

export default function BasicInfo({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  yieldInfo,
  setYieldInfo,
  servingSize,
  setServingSize,
  prepTime,
  setPrepTime,
  temperature,
  setTemperature,
}) {
  return (
    <section className={`${styles.section} ${styles.basicInfo}`}>
      <h3>Basic Info</h3>
      <div className={styles.row}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Category
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
      </div>
      <label className={styles.description}>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className={styles.row}>
        <label>
          Yield
          <input
            value={yieldInfo}
            onChange={(e) => setYieldInfo(e.target.value)}
          />
        </label>
        <label>
          Serving Size
          <input
            value={servingSize}
            onChange={(e) => setServingSize(e.target.value)}
          />
        </label>
      </div>
      <div className={styles.row}>
        <label>
          Prep Time
          <input
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />
        </label>
        <label>
          Temperature
          <input
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
