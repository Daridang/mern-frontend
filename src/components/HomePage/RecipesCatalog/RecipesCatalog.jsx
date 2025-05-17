// src/components/RecipesCatalog/RecipesCatalog.jsx
import React from "react";
import styles from "./RecipesCatalog.module.css";

import galacticSushi from "../../../assets/galactic_sushi.webp";
import neonNoodles from "../../../assets/neon_noodles.webp";
import astroBurger from "../../../assets/astro_burger.webp";
import cryoDesert from "../../../assets/cryo_desert.webp";
import cryoDesertPink from "../../../assets/cryo_desert_pink.webp";
import printedLive3D from "../../../assets/3d_printed_live.webp";

import RecipeCard from "../RecipeCard/RecipeCard";

const sampleRecipes = [
  { id: 1, title: "Galactic Sushi", price: "$14.99", img: galacticSushi },
  { id: 2, title: "Neon Noodles", price: "$11.50", img: neonNoodles },
  { id: 3, title: "Astro Burger", price: "$13.25", img: astroBurger },
  { id: 4, title: "Cryo Desert", price: "$9.75", img: cryoDesert },
  { id: 5, title: "Cryo Desert Pink", price: "$10.25", img: cryoDesertPink },
  { id: 6, title: "3D Printed Live", price: "$16.00", img: printedLive3D },
  { id: 7, title: "Cryo Desert Pink", price: "$10.25", img: cryoDesertPink },
  { id: 8, title: "3D Printed Live", price: "$16.00", img: printedLive3D },
];

export default function RecipesCatalog({ recipes = sampleRecipes }) {
  return (
    <section className={styles.catalog}>
      <div className="container">
        <h2 className={styles.heading}>Recipe Catalog</h2>
        <div className={styles.grid}>
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              id={r.id}
              title={r.title}
              price={r.price}
              img={r.img}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
