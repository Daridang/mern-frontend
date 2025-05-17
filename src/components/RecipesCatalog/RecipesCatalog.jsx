// src/components/RecipesCatalog/RecipesCatalog.jsx
import React from "react";
import styles from "./RecipesCatalog.module.css";

import galacticSushi from "../../assets/galactic_sushi.webp";
import neonNoodles from "../../assets/neon_noodles.webp";
import astroBurger from "../../assets/astro_burger.webp";
import cryoDesert from "../../assets/cryo_desert.webp";
import cryoDesertPink from "../../assets/cryo_desert_pink.webp";
import printedLive3D from "../../assets/3d_printed_live.webp";

// Пример данных: замените на реальный fetch из API
const sampleRecipes = [
  {
    id: 1,
    title: "Galactic Sushi",
    price: "$14.99",
    img: galacticSushi,
  },
  {
    id: 2,
    title: "Neon Noodles",
    price: "$11.50",
    img: neonNoodles,
  },
  {
    id: 3,
    title: "Astro Burger",
    price: "$13.25",
    img: astroBurger,
  },
  {
    id: 4,
    title: "Cryo Desert",
    price: "$9.75",
    img: cryoDesert,
  },
  {
    id: 5,
    title: "Cryo Desert Pink",
    price: "$10.25",
    img: cryoDesertPink,
  },
  {
    id: 6,
    title: "3D Printed Live",
    price: "$16.00",
    img: printedLive3D,
  },
  {
    id: 5,
    title: "Cryo Desert Pink",
    price: "$10.25",
    img: cryoDesertPink,
  },
  {
    id: 6,
    title: "3D Printed Live",
    price: "$16.00",
    img: printedLive3D,
  },
];

export default function RecipesCatalog({ recipes = sampleRecipes }) {
  return (
    <section className={styles.catalog}>
      <div className="container">
        <h2 className={styles.heading}>Recipe Catalog</h2>
        <div className={styles.grid}>
          {recipes.map(({ id, title, price, img }) => (
            <div key={id} className={styles.card}>
              <img src={img} alt={title} className={styles.image} />
              <div className={styles.info}>
                <div className={styles.title}>{title}</div>
                <div className={styles.price}>{price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
