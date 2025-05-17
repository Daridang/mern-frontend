// src/components/Hero/Hero.jsx
import React from "react";
import styles from "./Hero.module.css";
import heroImage from "../../../assets/space-hero.webp";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroContentWrapper}>
          <div className={styles.imageWrapper}>
            <img src={heroImage} alt="Космическое блюдо" />
          </div>
          <div className={styles.textWrapper}>
            <h1>Welcome to the Space Cafe! </h1>
            <p>Discover recipes from all corners of the galaxy.</p>
            <a href="#recipes" className={styles.ctaButton}>
              Read Recipes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
