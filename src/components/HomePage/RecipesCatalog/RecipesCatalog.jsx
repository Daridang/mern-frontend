// src/components/RecipesCatalog/RecipesCatalog.jsx
import React, { useState, useEffect } from "react";
import styles from "./RecipesCatalog.module.css";
import RecipeCard from "../RecipeCard/RecipeCard";

export default function RecipesCatalog() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/recipes`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки каталога");
        return res.json();
      })
      .then((data) => setRecipes(data.recipes))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка рецептов…</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <section className={styles.catalog}>
      <div className="container">
        <h2 className={styles.heading}>Recipe Catalog</h2>
        <div className={styles.grid}>
          {recipes.map((r) => (
            <RecipeCard
              key={r._id}
              id={r._id}
              title={r.title}
              price={r.price || "$–"}
              img={r.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
