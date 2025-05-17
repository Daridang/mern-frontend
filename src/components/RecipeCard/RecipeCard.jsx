import React from "react";
import styles from "./RecipeCard.module.css";

export default function RecipeCard({ title, price, img, alt }) {
  return (
    <div className={styles.card}>
      <img src={img} alt={alt || title} className={styles.image} />
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.price}>{price}</div>
      </div>
    </div>
  );
}
