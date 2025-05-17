// RecipeDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./RecipeDetail.module.css";

import TitleSection from "../../components/RecipeDetail/TitleSection/TitleSection";
import MetaInfo from "../../components/RecipeDetail/MetaInfo/MetaInfo";
import Ingredients from "../../components/RecipeDetail/Ingredients/Ingredients";
import Equipment from "../../components/RecipeDetail/Equipment/Equipment";
import Instructions from "../../components/RecipeDetail/Instructions/Instructions";
import Extras from "../../components/RecipeDetail/Extras/Extras";

import sampleData from "../../assets/data/recipes.json";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const found = sampleData.find((r) => String(r.id) === id);
    if (found) {
      setRecipe(found);
      setError("");
    } else {
      setError("Рецепт не найден");
    }
  }, [id]);

  if (error)
    return (
      <div className={styles.wrap}>
        <p>{error}</p>
      </div>
    );
  if (!recipe)
    return (
      <div className={styles.wrap}>
        <p>Загрузка...</p>
      </div>
    );

  return (
    <div className={styles.wrap}>
      <div className="container">
        <TitleSection title={recipe.title} description={recipe.description} />
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
