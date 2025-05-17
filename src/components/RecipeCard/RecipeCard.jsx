// src/components/RecipeCard/RecipeCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./RecipeCard.module.css";

export default function RecipeCard({ id, title, price, img }) {
  return (
    <Link to={`/recipes/${id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img src={img} alt={title} className={styles.image} />
        <div className={styles.info}>
          <div className={styles.title}>{title}</div>
          <div className={styles.price}>{price}</div>
        </div>
      </div>
    </Link>
  );
}
