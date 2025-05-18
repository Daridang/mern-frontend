// src/components/RecipesCatalog/RecipesCatalog.jsx
import React from "react";
import styles from "./RecipesCatalog.module.css";
import RecipeCard from "../RecipeCard/RecipeCard";
import sampleData from "../../../assets/data/recipes.json";

function transformRecipesToCatalog(data) {
  return data.map((recipe, index) => ({
    id: recipe.id ?? index + 1,
    title: recipe.title,
    price: `$${(Math.random() * 10 + 8).toFixed(2)}`,
    img: recipe.image,
  }));
}
const sampleRecipes = transformRecipesToCatalog(sampleData);

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
