// src/components/Features/Features.jsx
import React from "react";
import styles from "./Features.module.css";

export default function Features() {
  return (
    <section className={styles.features}>
      <div className={`${styles.featuresContent} container`}>
        <h2 className={styles.title}>The Future of Cooking</h2>
        <div className={styles.items}>
          <div className={styles.item}>
            <img
              src="../../../icons/feat-icon-1.png"
              alt="Innovative Ingredients"
              className={styles.image}
            />
            <h3>Innovative Ingredients</h3>
            <p>Discover new, high-tech components.</p>
          </div>
          <div className={styles.item}>
            <img
              src="../../../icons/feat-icon-2.png"
              alt="Advanced Techniques"
              className={styles.image}
            />
            <h3>Advanced Techniques</h3>
            <p>Modern methods of food preparation.</p>
          </div>
          <div className={styles.item}>
            <img
              src="../../../icons/feat-icon-3.png"
              alt="Bold Flavors"
              className={styles.image}
            />
            <h3>Bold Flavors</h3>
            <p>Taste profiles yet to be experienced.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
