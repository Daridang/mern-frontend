// src/components/RecipeDetail/RecipeDetail.jsx
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./RecipeDetail.module.css";

import TitleSection from "../../components/RecipeDetail/TitleSection/TitleSection";
import MetaInfo from "../../components/RecipeDetail/MetaInfo/MetaInfo";
import Ingredients from "../../components/RecipeDetail/Ingredients/Ingredients";
import Equipment from "../../components/RecipeDetail/Equipment/Equipment";
import Instructions from "../../components/RecipeDetail/Instructions/Instructions";
import Extras from "../../components/RecipeDetail/Extras/Extras";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Рецепт не найден");
        return res.json();
      })
      .then((data) => setRecipe(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Загрузка…</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.wrap}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link> &gt; <span>{recipe.title}</span>
        </div>
        <TitleSection title={recipe.title} description={recipe.description} />
        <img
          src={recipe.image}
          alt={recipe.title}
          className={styles.mainImage}
        />
        <MetaInfo
          category={recipe.category}
          yieldInfo={recipe.yield}
          servingSize={recipe.serving_size}
          prepTime={recipe.prep_time}
          temperature={recipe.temperature}
        />
        <Ingredients groups={recipe.ingredients.groups} />
        <Equipment items={recipe.equipment} />
        <Instructions groups={recipe.instructions.groups} />
        <Extras items={recipe.extras} />
      </div>
    </div>
  );
}
