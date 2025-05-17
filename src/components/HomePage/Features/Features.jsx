// src/components/Features/Features.jsx
import React from "react";
import styles from "./Features.module.css";

import imgIngredients from "../../../assets/ingredients.png";
import imgTechniques from "../../../assets/techniques.png";
import imgFlavors from "../../../assets/flavors.png";

export default function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.title}>The Future of Cooking</h2>
        <div className={styles.items}>
          <div className={styles.item}>
            <img
              src={imgIngredients}
              alt="Innovative Ingredients"
              className={styles.image}
            />
            <h3>Innovative Ingredients</h3>
            <p>Discover new, high-tech components.</p>
          </div>
          <div className={styles.item}>
            <img
              src={imgTechniques}
              alt="Advanced Techniques"
              className={styles.image}
            />
            <h3>Advanced Techniques</h3>
            <p>Modern methods of food preparation.</p>
          </div>
          <div className={styles.item}>
            <img src={imgFlavors} alt="Bold Flavors" className={styles.image} />
            <h3>Bold Flavors</h3>
            <p>Taste profiles yet to be experienced.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
