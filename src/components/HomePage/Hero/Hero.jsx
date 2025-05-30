// src/components/Hero/Hero.jsx
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import styles from "./Hero.module.css";
import heroImage from "../../../assets/space-hero.webp";
import { AuthContext } from "../../../context/AuthContext";

export default function Hero() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreateRecipe = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/create");
    }
  };

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroContentWrapper}>
          <div className={styles.imageWrapper}>
            <img src={heroImage} alt="Space dish" />
          </div>
          <div className={styles.textWrapper}>
            <h1>Welcome to the Space Cafe! </h1>
            <p>Discover recipes from all corners of the galaxy.</p>
            <button className={styles.ctaButton} onClick={handleCreateRecipe}>
              Create Your Recipe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
